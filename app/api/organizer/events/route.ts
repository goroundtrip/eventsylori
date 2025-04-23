import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // Ensure this path is correct
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch the session from NextAuth
    const session = await getServerSession(authOptions);

    // Log session for debugging purposes
    console.log("Session fetched:", session);

    // Check if session exists and user role is 'organizer'
    if (!session || session.user.role !== "organizer") {
      console.error("Unauthorized access - Invalid session or role");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch events associated with the current organizer
    const events = await prisma.event.findMany({
      where: {
        creatorId: session.user.id, // Check if creatorId matches the session user id
      },
      include: {
        tickets: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Check if no events are found
    if (!events || events.length === 0) {
      console.log("No events found for organizer", session.user.id);
      return new NextResponse("No events found", { status: 404 });
    }

    // Return the events as a JSON response
    return NextResponse.json(events);
  } catch (error) {
    // Log the full error to identify the issue
    console.error("[ORGANIZER_EVENTS_GET]", error);

    // Return a more informative error message
    return new NextResponse("Internal Error", { status: 500 });
  }
}
