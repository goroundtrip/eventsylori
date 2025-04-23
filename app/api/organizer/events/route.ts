export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // Ensure this path is correct
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log("Session fetched:", session);

    if (!session || session.user.role !== "organizer") {
      console.error("Unauthorized access - Invalid session or role");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const events = await prisma.event.findMany({
      where: {
        creatorId: session.user.id,
      },
      include: {
        tickets: {
          select: { id: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!events || events.length === 0) {
      console.log("No events found for organizer", session.user.id);
      return new NextResponse("No events found", { status: 404 });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error("[ORGANIZER_EVENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
