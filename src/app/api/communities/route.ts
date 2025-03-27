/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const communities = await prisma.community.findMany({
      include: {
        members: { include: { user: true } },
        posts: { include: { author: true } },
      },
    });

    return NextResponse.json(communities, { status: 200 });
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json({ message: "Error fetching communities", error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    // Extract token from request headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Decode the token to get userId
    const token = authHeader.split(" ")[1];
    let userId: string;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      userId = decodedToken.userId;
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Create the new community
    const newCommunity = await prisma.community.create({
      data: {
        name,
        description,
        createdById: userId,
      },
    });

    return NextResponse.json(newCommunity, { status: 201 });
  } catch (error) {
    console.error("Error creating community:", error);
    return NextResponse.json({ message: "Error creating community", error }, { status: 500 });
  }
}
