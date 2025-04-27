// app/api/users/search/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Make sure you're using singleton Prisma

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q"); // expecting ?q=searchText

    if (!query) {
      return NextResponse.json({ message: "Query parameter 'q' is required" }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        fullName: {
          contains: query,    // partial matching
          mode: "insensitive" // case-insensitive
        }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        userType: true,
        // Add more fields if you want
      },
      orderBy: {
        fullName: "asc",
      },
      take: 10, // Optional: limit results
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ message: "Error searching users" }, { status: 500 });
  }
}
