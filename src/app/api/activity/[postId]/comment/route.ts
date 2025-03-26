// File: src/app/api/activity/[postId]/comment/route.ts

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
    const { content, authorId } = body;

    // (Optional) Validate input and check if the user exists

    const comment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: authorId } },
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating comment', error }, { status: 500 });
  }
}
