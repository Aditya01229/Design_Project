import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, company, description, location, postedById } = await req.json();

    if (!title || !company || !description || !location || !postedById) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    // Verify if the user exists and is an ALUMNI
    const user = await prisma.user.findUnique({
      where: { id: postedById },
    });

    if (!user || user.userType !== "ALUMNI") {
      return NextResponse.json({ error: "Only Alumni can post jobs!" }, { status: 403 });
    }

    // Create new job
    const newJob = await prisma.job.create({
      data: {
        title,
        company,
        description,
        location,
        postedById,
      },
    });

    return NextResponse.json({ message: "Job posted successfully!", job: newJob }, { status: 201 });
  } catch (error) {
    console.error("Error posting job:", error);
    return NextResponse.json({ message: "Error posting job", error }, { status: 500 });
  }
}
