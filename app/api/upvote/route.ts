import { NextResponse } from "next/server";
import { upvoteDrama } from "@/lib/db";
import { getSupabase, hasSupabaseConfig } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { dramaId, fingerprint } = (await request.json()) as {
      dramaId?: string;
      fingerprint?: string;
    };

    if (!dramaId || !fingerprint) {
      return NextResponse.json({ error: "Vote ko pehchaan nahi mili." }, { status: 400 });
    }

    try {
      const nextVotes = await upvoteDrama(dramaId, fingerprint);
      return NextResponse.json({ upvotes: nextVotes });
    } catch (err) {
      const error = err as Error;
      if (error.message === "Dil ek hi baar vote karta hai.") {
        let currentVotes = 0;
        if (hasSupabaseConfig()) {
          const supabase = getSupabase();
          const { data } = await supabase
            .from("dramas")
            .select("upvotes")
            .eq("id", dramaId)
            .single();
          currentVotes = data?.upvotes ?? 0;
        } else {
          const { memoryDramas } = require("@/lib/db");
          currentVotes = memoryDramas.get(dramaId)?.upvotes ?? 0;
        }
        return NextResponse.json(
          { error: error.message, upvotes: currentVotes },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Vote mein twist aa gaya: ${message}` }, { status: 500 });
  }
}
