import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to access its properties asynchronously.
    const { id } = await params;
    
    // Find all applications for the given userId
    const applications = await prisma.jobApplication.findMany({
      where: { userId: id },
      select: { jobId: true }, // Only select jobId
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json({ message: "Error fetching applied jobs", error }, { status: 500 });
  }
}
