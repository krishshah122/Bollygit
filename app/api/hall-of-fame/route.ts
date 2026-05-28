import { NextResponse } from "next/server";
import { normalizeDrama } from "@/lib/drama";
import { getHallOfFameDramas } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dramas = await getHallOfFameDramas();
    return NextResponse.json({ dramas: dramas.map(normalizeDrama) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
