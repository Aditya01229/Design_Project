import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Find all applications for the given userId
    const userId = params.id;
    const applications = await prisma.jobApplication.findMany({
      where: { userId },
      select: { jobId: true }, // Only select jobId
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json({ message: "Error fetching applied jobs", error }, { status: 500 });
  }
}
