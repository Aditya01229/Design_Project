import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, jobId } = await req.json();
    if (!userId || !jobId) {
      return NextResponse.json(
        { message: "User ID and Job ID are required" },
        { status: 400 }
      );
    }

    // Check if the student has already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: { userId, jobId },
    });
    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied for this job" },
        { status: 400 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: { userId, jobId },
    });
    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error applying for job:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
