import { Pool } from "pg";
import { NextResponse } from "next/server";

// Create a database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for NeonDB
});

export async function GET() {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1"); // Simple query to check connection
    client.release();

    return NextResponse.json({ message: "✅ Database connected successfully!" });
  } catch (error: any) {
    console.error("❌ Database connection error:", error);
    return NextResponse.json({ error: "Database connection failed", details: error.message }, { status: 500 });
  }
}
