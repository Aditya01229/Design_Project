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
