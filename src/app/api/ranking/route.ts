import { NextResponse } from "next/server";
import { ranking } from '@/lib/ranking';

export async function GET() {
  try {
    const enrichedUsers = await ranking();
    return NextResponse.json(enrichedUsers);
  } catch (error) {
    return NextResponse.json({ error: "Error al calcular ranking" }, { status: 500 });
  }
}
