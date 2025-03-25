import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
        location: true,
        postedById: true, // Ensure this is included
        createdAt: true,  // Optional: Keep track of posting time
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching jobs", error }, { status: 500 });
  }
}
