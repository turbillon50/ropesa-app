import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const data = await sql`
      SELECT p.*, c.nombre as cliente_nombre
      FROM pedidos p
      LEFT JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.created_at DESC LIMIT 50
    `;
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ data: [], error: String(e) });
  }
}
