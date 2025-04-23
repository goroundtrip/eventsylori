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
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the event to check if the user is the creator
    const event = await prisma.event.findUnique({
      where: {
        id: params.eventId,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    if (event.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all tickets for the event
    const tickets = await prisma.ticket.findMany({
      where: {
        eventId: params.eventId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("[EVENT_TICKETS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 