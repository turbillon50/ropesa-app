import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const data = await sql`SELECT * FROM clientes ORDER BY nombre LIMIT 50`;
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ data: [], error: String(e) });
  }
}
