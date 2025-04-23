export const dynamic = "force-dynamic";

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
    const { title, description, date, location, image, price, capacity, category } = body;

    // Date validation
    if (isNaN(Date.parse(date))) {
      return new NextResponse("Invalid date format", { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        image,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        category,
        creatorId: session.user.id,
        status: "pending",
      },
    });

    // Email notification
    await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: process.env.ADMIN_EMAIL,
        subject: "New Event Pending Approval",
        text: `A new event "${title}" has been created and is pending approval.`,
      }),
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENTS_POST ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        category && category !== "all" ? { category } : {},
        { status: "approved" },
      ],
    };

    const events = await prisma.event.findMany({
      where,
      include: {
        creator: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[EVENTS_GET ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
