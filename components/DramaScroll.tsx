"use client";

import { CastMember, DramaScene } from "@/lib/types";

const emotionClass: Record<string, string> = {
  tragedy: "border-red/50 bg-red/15 text-red",
  love: "border-pink-400/50 bg-pink-400/15 text-pink-200",
  betrayal: "border-purple-400/50 bg-purple-400/15 text-purple-200",
  transformation: "border-emerald-400/50 bg-emerald-400/15 text-emerald-200",
  duty: "border-amber-300/50 bg-amber-300/15 text-amber-100",
  paranoia: "border-cyan-300/50 bg-cyan-300/15 text-cyan-100",
  wisdom: "border-blue-300/50 bg-blue-300/15 text-blue-100",
  mystery: "border-zinc-300/50 bg-zinc-300/15 text-zinc-100"
};

type DramaScrollProps = {
  title: string;
  tagline: string;
  cast?: CastMember[];
  scenes: DramaScene[];
  director?: string;
};

export function DramaScroll({ title, tagline, cast = [], scenes, director }: DramaScrollProps) {
  return (
    <article
      id="drama-scroll"
      className="poster-card mx-auto max-w-5xl overflow-hidden rounded-lg px-4 py-8 sm:px-8 md:px-12"
    >
      <div className="film-reel -mx-4 mb-10 sm:-mx-8 md:-mx-12" />
      <header className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/70">A BollyGit Picture</p>
        <h1 className="mt-4 text-balance font-display text-5xl font-black leading-none text-gold sm:text-7xl md:text-8xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl font-display text-xl italic text-cream/85 md:text-2xl">
          {tagline}
        </p>
      </header>

      {cast.length > 0 ? (
        <section className="my-10 border-y border-gold/25 py-5">
          <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.28em] text-muted">Cast List</p>
          <div className="grid gap-3 md:grid-cols-2">
            {cast.map((member) => (
              <div key={`${member.author}-${member.character}`} className="flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-cream">{member.author}</span>
                <span className="text-right text-cream/70">
                  {member.character} - {member.archetype}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="space-y-10">
        {scenes.map((scene, index) => (
          <section
            key={`${scene.commit_hash}-${scene.number}`}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="scene-divider mb-5 font-mono text-xs">
              SCENE {scene.number}
            </div>
            <div className="rounded-lg border border-border bg-bg/42 p-5 md:p-7">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold/70">
                    #{scene.number} / {scene.commit_hash}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-black leading-tight text-cream md:text-4xl">
                    {scene.scene_title}
                  </h2>
                </div>
                <p className="text-left font-display text-sm italic text-cream/60 md:min-w-48 md:text-right">
                  {scene.time_cinematic}
                </p>
              </div>

              <p className="mt-6 text-lg leading-8 text-cream/86">{scene.narration}</p>

              <blockquote className="mt-6 border-l-4 border-gold py-2 pl-5 font-display text-2xl italic leading-snug text-gold-light">
                {scene.dialogue}
              </blockquote>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                    emotionClass[scene.emotion] || emotionClass.mystery
                  }`}
                >
                  {scene.emotion}
                </span>
                <span className="rounded-full border border-gold/20 px-3 py-1 font-mono text-xs text-cream/58">
                  {scene.commit_type}
                </span>
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 border-t border-gold/25 pt-8 text-center text-sm leading-7 text-cream/65">
        <p className="font-display text-xl italic text-gold-light">Yeh drama Git ne likha, dil ne mehsoos kiya</p>
        <p>Directed by {director || "git blame"}</p>
        <p>All bugs are fictional. Resemblance to production incidents is purely intentional.</p>
      </footer>
      <div className="film-reel -mx-4 mt-10 sm:-mx-8 md:-mx-12" />
    </article>
  );
}
