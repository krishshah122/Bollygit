import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionBar } from "@/components/ActionBar";
import { DramaScroll } from "@/components/DramaScroll";
import { normalizeDrama } from "@/lib/drama";
import { getDramaById } from "@/lib/db";
import { CastMember, DramaJson, DramaScene } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getDrama(id: string) {
  const data = await getDramaById(id);

  if (!data) {
    return null;
  }

  const row = normalizeDrama(data);
  const json = data.drama_json as unknown as DramaJson | DramaScene[];
  const cast = Array.isArray(json) ? [] : (json.cast as CastMember[]) || [];
  const scenes = Array.isArray(json) ? json : json.scenes;

  return {
    ...row,
    cast,
    drama_json: scenes
  };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const drama = await getDrama(params.id);

  if (!drama) {
    return {
      title: "Drama Not Found - BollyGit"
    };
  }

  return {
    title: `${drama.title} - BollyGit`,
    description: drama.tagline,
    openGraph: {
      title: drama.title,
      description: drama.tagline,
      type: "article",
      images: [`/drama/${params.id}/opengraph-image`]
    },
    twitter: {
      card: "summary_large_image",
      title: drama.title,
      description: drama.tagline,
      images: [`/drama/${params.id}/opengraph-image`]
    }
  };
}

export default async function DramaPage({ params }: { params: { id: string } }) {
  const drama = await getDrama(params.id);

  if (!drama) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 pb-32 pt-24">
      <DramaScroll
        title={drama.title}
        tagline={drama.tagline}
        cast={drama.cast}
        scenes={drama.drama_json}
        director={drama.director}
      />
      <div className="mx-auto mt-10 max-w-5xl text-center">
        <Link href="/" className="gold-button inline-flex rounded-md px-6 py-3 text-sm font-black">
          Generate your own
        </Link>
      </div>
      <ActionBar dramaId={drama.id} upvotes={drama.upvotes} />
    </main>
  );
}
