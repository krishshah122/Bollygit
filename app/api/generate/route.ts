import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { generateDrama } from "@/lib/groq";
import { insertDrama } from "@/lib/db";
import { inferDirector } from "@/lib/git";
import { ParsedCommit } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      gitLog?: string;
      commits?: ParsedCommit[];
    };

    if (!body.gitLog?.trim() || !body.commits?.length) {
      return NextResponse.json({ error: "Bhai, kuch toh commit karo pehle" }, { status: 400 });
    }

    const commits = body.commits.slice(0, 20);
    const drama = await generateDrama(commits);
    const id = nanoid(10);
    const director = inferDirector(commits);

    await insertDrama({
      id,
      git_log: body.gitLog,
      drama_json: drama,
      title: drama.title,
      tagline: drama.tagline,
      director,
      upvotes: 0
    });

    return NextResponse.json({
      id,
      title: drama.title,
      tagline: drama.tagline,
      cast: drama.cast,
      scenes: drama.scenes,
      director,
      upvotes: 0
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Kuch toh gadbad hai Daya... ${message}` },
      { status: 500 }
    );
  }
}
