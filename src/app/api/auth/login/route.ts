import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Admin login check
    if (ADMIN_EMAIL && ADMIN_PASSWORD && email === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { message: "Invalid admin credentials" },
          { status: 401 }
        );
      }
      // Generate JWT token for admin
      const token = jwt.sign(
        { userId: 'admin', email, userType: 'ADMIN' },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      const adminUser = {
        id: 'admin',
        email,
        userType: 'ADMIN',
      };
      return NextResponse.json(
        { message: "Admin login successful", token, user: adminUser },
        { status: 200 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token for regular user
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from returned user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Login successful", token, user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error logging in", error: (error as Error).message },
      { status: 500 }
    );
  }
}
