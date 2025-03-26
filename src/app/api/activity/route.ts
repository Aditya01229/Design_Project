// File: src/app/api/activity/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all activity posts with related author, comments, and likes count.
export async function GET() {
  try {
    const posts = await prisma.activityPost.findMany({
      include: {
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching posts', error }, { status: 500 });
  }
}

// POST - Create a new activity post.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, imageUrl, authorId } = body;

    // (Optional) Validate that the user is an alumni before proceeding

    const newPost = await prisma.activityPost.create({
      data: {
        content,
        imageUrl,
        author: { connect: { id: authorId } },
      },
      include: {
        author: true,
        comments: true,
        likes: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating post', error }, { status: 500 });
  }
}
