import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params is now a Promise
) {
  try {
    // Await the params to access its properties asynchronously.
    const { id } = await context.params;

    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        members: { include: { user: true } },
        posts: { include: { author: true } },
      },
    });

    if (!community) {
      return NextResponse.json({ message: "Community not found" }, { status: 404 });
    }

    return NextResponse.json(community);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching community", error: (error as Error).message },
      { status: 500 }
    );
  }
}
