import { NextResponse } from "next/server";
import { PrismaClient, UserType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, graduationYear, language, linkedin, skills, userType, company, location, password } = await req.json();

    // Required field validation
    if (!fullName || !email || !phone || !userType || !password) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
    }

    // Ensure `userType` is valid
    if (!["STUDENT", "ALUMNI"].includes(userType)) {
      return NextResponse.json({ message: "Invalid user type" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Ensure alumni provides `company` & `location`
    if (userType === "ALUMNI" && (!company || !location)) {
      return NextResponse.json({ message: "Alumni must provide company and location" }, { status: 400 });
    }

    // Ensure students don't send `company` & `location`
    if (userType === "STUDENT" && (company || location)) {
      return NextResponse.json({ message: "Students should not provide company or location" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        graduationYear,
        language,
        linkedin,
        skills,
        userType: userType as UserType,
        company: userType === "ALUMNI" ? company : null,
        location: userType === "ALUMNI" ? location : null,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user", error }, { status: 500 });
  }
}
