import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { eventId, quantity } = body;

    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
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

    if (availableTickets < quantity) {
      return new NextResponse("Not enough tickets available", { status: 400 });
    }

    // Create ticket purchase
    const ticket = await prisma.ticket.create({
      data: {
        eventId,
        userId: session.user.id,
        quantity,
        status: "confirmed",
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("[TICKETS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            location: true,
            image: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("[TICKETS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 