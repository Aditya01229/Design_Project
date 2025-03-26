import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET - Fetch user by ID
 */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const { id: userId } = await context.params; 

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove password from the returned user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching user", error }, { status: 500 });
  }
}

/**
 * PATCH - Update user details
 */
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const { id: userId } = await context.params; 
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Remove fields that should not be updated
    delete body.email;
    delete body.password;
    delete body.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: body,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating user", error }, { status: 500 });
  }
}

/**
 * DELETE - Remove user by ID
 */
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const { id: userId } = await context.params; 

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting user", error }, { status: 500 });
  }
}
