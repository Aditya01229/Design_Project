// File: src/app/api/activity/[postId]/like/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    const body = await req.json();
    const { userId } = body;
    
    // Log received values for debugging
    console.log("POST /like called with postId:", postId, "and userId:", userId);
    
    // Validate that both postId and userId are provided and are non-empty strings.
    if (!postId || typeof postId !== "string" || !userId || typeof userId !== "string") {
      return NextResponse.json(
        { message: "Invalid data: postId and userId must be provided as strings." },
        { status: 400 }
      );
    }
    
    // Prevent duplicate likes: Check if the user already liked this post.
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });
    
    if (existingLike) {
      return NextResponse.json({ message: 'Already liked' }, { status: 400 });
    }
    
    // Create the like record
    const like = await prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });
    
    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    console.error("Error in POST /like:", error);
    return NextResponse.json({ message: 'Error liking post', error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    const { userId } = await req.json();
    
    // Log received values for debugging
    console.log("DELETE /like called with postId:", postId, "and userId:", userId);
    
    if (!postId || typeof postId !== "string" || !userId || typeof userId !== "string") {
      return NextResponse.json(
        { message: "Invalid data: postId and userId must be provided as strings." },
        { status: 400 }
      );
    }
    
    // Find the like entry
    const like = await prisma.like.findFirst({
      where: { postId, userId },
    });
    
    if (!like) {
      return NextResponse.json({ message: 'Like not found' }, { status: 404 });
    }
    
    await prisma.like.delete({ where: { id: like.id } });
    
    return NextResponse.json({ message: 'Unliked successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /like:", error);
    return NextResponse.json({ message: 'Error unliking post', error }, { status: 500 });
  }
}
