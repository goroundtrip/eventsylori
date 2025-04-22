import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const events = await prisma.event.findMany({
      include: {
        creator: {
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

    return NextResponse.json(events);
  } catch (error) {
    console.error("[ADMIN_EVENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { eventId, status, reason } = body;

    const event = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        status,
        ...(reason && { reason }),
      },
      include: {
        creator: {
          select: {
            email: true,
          },
        },
      },
    });

    if (status === "approved" || status === "rejected") {
      await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: event.creator.email,
          subject: `Your event "${event.title}" has been ${status}`,
          text: `Your event "${event.title}" has been ${status}${reason ? `\n\nReason: ${reason}` : ""}`,
        }),
      });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("[
