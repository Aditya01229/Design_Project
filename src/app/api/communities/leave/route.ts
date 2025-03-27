import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key";
const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    let decoded: { userId: string } | null = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (err) {
      console.error("JWT Verification Failed:", err);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Ensure we have a valid userId from the token
    if (!decoded?.userId) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 400 });
    }

    // Extract communityId from the request body
    const { communityId } = await req.json();
    if (!communityId) {
      return NextResponse.json({ message: "Missing communityId" }, { status: 400 });
    }

    // Delete the membership using the composite unique key:
    // Assuming your Prisma schema defines a composite unique field like:
    // @@unique([userId, communityId])
    const membership = await prisma.communityMember.delete({
      where: {
        userId_communityId: { userId: decoded.userId, communityId },
      },
    });

    return NextResponse.json(
      { message: "Left community successfully", membership },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error leaving community:", error);
    return NextResponse.json(
      { message: "Error leaving community", error: (error as Error).message },
      { status: 500 }
    );
  }
}
    