import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    console.log("Received request to join community");

    // Extract token from the Authorization header
    const token = req.headers.get("Authorization")?.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded: { userId: string } | null = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log("Decoded Token:", decoded);
    } catch (err) {
      console.error("JWT Verification Failed:", err);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 400 });
    }

    // Get communityId from the request body
    const { communityId } = await req.json();
    console.log("Community ID:", communityId);

    if (!communityId) {
      return NextResponse.json({ message: "Missing communityId" }, { status: 400 });
    }

    // Check if the user exists using decoded.userId
    const userExists = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!userExists) {
      return NextResponse.json({ message: "User does not exist" }, { status: 404 });
    }

    // Check if the community exists
    const communityExists = await prisma.community.findUnique({
      where: { id: communityId },
    });
    if (!communityExists) {
      return NextResponse.json({ message: "Community does not exist" }, { status: 404 });
    }

    // Check if the user is already a member
    const existingMembership = await prisma.communityMember.findFirst({
      where: { userId: decoded.userId, communityId },
    });
    console.log("Existing Membership:", existingMembership);
    if (existingMembership) {
      return NextResponse.json({ message: "User already a member" }, { status: 200 });
    }

    // Create community membership using the connect syntax
    const membership = await prisma.communityMember.create({
      data: {
        user: { connect: { id: decoded.userId } },
        community: { connect: { id: communityId } },
      },
    });
    console.log("Successfully joined community:", membership);

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error("Error in join API:", error);
    return NextResponse.json(
      { message: "Error joining community", error: (error as Error).message },
      { status: 500 }
    );
  }
}
