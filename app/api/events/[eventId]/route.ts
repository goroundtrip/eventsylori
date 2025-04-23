export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: params.eventId,
      },
      include: {
        creator: {
          select: {
            name: true,
            image: true,
          },
        },
        tickets: {
          select: {
            quantity: true,
          },
        },
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Calculate available tickets
    const totalTicketsSold = event.tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    );
    const availableTickets = event.capacity - totalTicketsSold;

    return NextResponse.json({
      ...event,
      availableTickets,
    });
  } catch (error) {
    console.error("[EVENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, date, location, image, price, capacity, category } = body;

    // Check if the event exists and if the user is the creator
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: params.eventId,
      },
    });

    if (!existingEvent) {
      return new NextResponse("Event not found", { status: 404 });
    }

    if (existingEvent.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the event
    const event = await prisma.event.update({
      where: {
        id: params.eventId,
      },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        image,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        category,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the event exists and if the user is the creator
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: params.eventId,
      },
    });

    if (!existingEvent) {
      return new NextResponse("Event not found", { status: 404 });
    }

    if (existingEvent.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the event
    await prisma.event.delete({
      where: {
        id: params.eventId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EVENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 