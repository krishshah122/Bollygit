"use client";

import { Heart, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StoredDrama } from "@/lib/types";

export function HallOfFame() {
  const [dramas, setDramas] = useState<StoredDrama[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/hall-of-fame", { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error || "Hall of Fame mein silence chha gaya.");
      return;
    }

    setDramas(payload.dramas);
    setError("");
  }

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 3600000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen px-4 pb-20 pt-28">
      <section className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/70">Audience award</p>
        <h1 className="mt-4 font-display text-5xl font-black leading-tight text-gold md:text-7xl">
          BOLLYWOOD KA BEST - Hall of Fame
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-cream/70">
          Top voted commit dramas, refreshed every hour.
        </p>

        {error ? (
          <p className="mt-8 rounded-md border border-red/40 bg-red/10 p-4 font-bold text-red">
            Kuch toh gadbad hai Daya... {error}
          </p>
        ) : null}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dramas.map((drama, index) => {
            const scenes = Array.isArray(drama.drama_json)
              ? drama.drama_json
              : (drama.drama_json as unknown as { scenes?: unknown[] })?.scenes || [];

            return (
              <Link
                href={`/drama/${drama.id}`}
                key={drama.id}
                className="poster-card group relative rounded-lg p-5 transition hover:-translate-y-1 hover:border-gold/70 hover:shadow-glow"
              >
                {index === 0 ? (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-gold">
                    <Trophy size={14} /> This Week&apos;s Hit
                  </div>
                ) : null}
                <h2 className="font-display text-3xl font-black leading-tight text-cream group-hover:text-gold-light">
                  {drama.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-cream/68">{drama.tagline}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-xs text-cream/62">
                  <span className="inline-flex items-center gap-1 font-bold text-gold">
                    <Heart size={14} /> {drama.upvotes}
                  </span>
                  <span>{scenes.length} scenes</span>
                  <span>Director: {drama.director}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {!error && dramas.length === 0 ? (
          <div className="poster-card mt-10 rounded-lg p-8 text-center">
            <p className="font-display text-3xl font-black text-gold">Abhi tak koi blockbuster nahi.</p>
            <p className="mt-3 text-cream/70">First drama banao, phir fame ka gate khulega.</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
