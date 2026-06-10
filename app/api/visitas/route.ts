import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const data = await sql`
      SELECT v.*, c.nombre as cliente_nombre
      FROM visitas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.created_at DESC LIMIT 50
    `;
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ data: [], error: String(e) });
  }
}
