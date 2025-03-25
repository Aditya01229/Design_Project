import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Workbook } from "exceljs";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 1. Extract jobId from query string
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ message: "jobId is required" }, { status: 400 });
    }

    // 2. Fetch applicants from DB
    //    We'll get the user info from the `JobApplication` model 
    //    by including the `user` relation.
    const applications = await prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            graduationYear: true,
            language: true,
            linkedin: true,
            skills: true,
          },
        },
      },
    });

    // 3. Create a new workbook & worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Applicants");

    // 4. Define columns
    worksheet.columns = [
      { header: "User ID", key: "userId", width: 30 },
      { header: "Full Name", key: "fullName", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Graduation Year", key: "graduationYear", width: 20 },
      { header: "Language", key: "language", width: 20 },
      { header: "LinkedIn", key: "linkedin", width: 30 },
      { header: "Skills", key: "skills", width: 30 },
      { header: "Applied At", key: "appliedAt", width: 25 },
    ];

    // 5. Populate rows from the DB results
    //    Each `application` has `user` info and a `createdAt` field
    applications.forEach((app) => {
      worksheet.addRow({
        userId: app.user.id,
        fullName: app.user.fullName,
        email: app.user.email,
        phone: app.user.phone,
        graduationYear: app.user.graduationYear,
        language: app.user.language,
        linkedin: app.user.linkedin,
        skills: app.user.skills, // format as string
        appliedAt: app.createdAt.toLocaleString(), // format as string
      });
    });

    // 6. Convert workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 7. Return the buffer as a downloadable .xlsx file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="applications-${jobId}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
