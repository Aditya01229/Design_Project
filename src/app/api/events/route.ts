import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching events", error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Get the event data from the request body
    const { title, description, date, location} = await request.json();

    // Create the event in the database
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),  // Ensure it's converted to Date type
        location,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating event", error }, { status: 500 });
  }
}
