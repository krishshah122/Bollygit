"use client";

import { Clapperboard, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ActionBar } from "@/components/ActionBar";
import { DramaScroll } from "@/components/DramaScroll";
import { LoadingTakeover } from "@/components/LoadingTakeover";
import { parseGitLog } from "@/lib/git";
import { CastMember, DramaScene } from "@/lib/types";

const placeholder = `Yahan apna git log paste karo...

Terminal mein yeh command chalao:
git log --pretty=format:'%h|%an|%ar|%s'

Ya seedha --oneline bhi chalega`;

const examples = [
  {
    type: "fix",
    title: "Tragedy se hotfix tak",
    body: "fix(auth): repair broken session refresh becomes a heartbreak scene at midnight."
  },
  {
    type: "feat",
    title: "Hero ki entry",
    body: "feat: add dashboard analytics enters with wind, violins, and a product manager crying."
  },
  {
    type: "merge",
    title: "Parivaar mil gaya",
    body: "Merge branch 'payment-flow' becomes two warring families sharing one deploy pipeline."
  }
];

type GeneratedDrama = {
  id: string;
  title: string;
  tagline: string;
  cast: CastMember[];
  scenes: DramaScene[];
  director: string;
  upvotes: number;
};

export function GitLogGenerator() {
  const [gitLog, setGitLog] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drama, setDrama] = useState<GeneratedDrama | null>(null);

  const commits = useMemo(() => parseGitLog(gitLog), [gitLog]);

  function checkRateLimit() {
    const now = Date.now();
    const raw = window.localStorage.getItem("bollygit_generation_times");
    const times = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = times.filter((time) => now - time < 60 * 60 * 1000);

    if (recent.length >= 5) {
      setError("Interval ke baad aana hero. Max 5 dramas per hour per browser.");
      return false;
    }

    window.localStorage.setItem("bollygit_generation_times", JSON.stringify([...recent, now]));
    return true;
  }

  async function generate() {
    setError("");

    if (!gitLog.trim()) {
      setError("Bhai, kuch toh commit karo pehle");
      return;
    }

    if (!commits.length) {
      setError("Git log samajh nahi aaya. Pretty format ya --oneline paste karo.");
      return;
    }

    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    if (!checkRateLimit()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gitLog, commits })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Groq ne jawab nahi diya");
      }

      setDrama(payload);
      window.history.pushState(null, "", `/drama/${payload.id}`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Groq ne jawab nahi diya";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setDrama(null);
    setConfirmed(false);
    setError("");
    window.history.pushState(null, "", "/");
  }

  if (drama) {
    return (
      <main className="min-h-screen px-4 pb-28 pt-24">
        <DramaScroll
          title={drama.title}
          tagline={drama.tagline}
          cast={drama.cast}
          scenes={drama.scenes}
          director={drama.director}
        />
        <ActionBar dramaId={drama.id} upvotes={drama.upvotes} onGenerateAgain={reset} />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {loading ? <LoadingTakeover /> : null}
      <section className="flex min-h-screen flex-col pt-16">
        <div className="film-reel mt-2" />
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="animate-fade-up">
              <p className="font-mono text-xs uppercase tracking-[0.34em] text-gold/70">Retro commit cinema</p>
              <h1 className="mt-5 font-display text-7xl font-black leading-none text-gold animate-flicker sm:text-8xl md:text-9xl">
                BOLLYGIT
              </h1>
              <p className="mt-5 font-hindi text-2xl text-cream/90 md:text-3xl">
                Aapka code. Humara drama.
              </p>
              <p className="mt-6 max-w-xl text-lg leading-8 text-cream/68">
                Paste your commits and watch the repo become a dramatic Hindi film poster, complete with cast,
                heartbreak, betrayal, and just enough production incident energy.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/hall-of-fame" className="dark-button rounded-md px-5 py-3 text-sm font-bold">
                  Bollywood ka Best
                </Link>
                <a href="#how-to-use" className="dark-button rounded-md px-5 py-3 text-sm font-bold">
                  How to use
                </a>
              </div>
            </div>

            <div className="poster-card animate-fade-up rounded-lg p-4 sm:p-6" style={{ animationDelay: "100ms" }}>
              <label htmlFor="git-log" className="mb-3 flex items-center gap-2 font-display text-2xl font-black text-gold">
                <Terminal size={22} /> Paste Git Log
              </label>
              <textarea
                id="git-log"
                value={gitLog}
                onChange={(event) => {
                  setGitLog(event.target.value);
                  setConfirmed(false);
                }}
                placeholder={placeholder}
                className="min-h-72 w-full resize-y rounded-lg border border-gold/35 bg-bg/80 p-4 font-mono text-sm leading-7 text-cream outline-none transition placeholder:text-muted focus:border-gold focus:shadow-glow"
              />

              {error ? (
                <p className="mt-4 rounded-md border border-red/40 bg-red/10 p-3 text-sm font-bold text-red">
                  {error}
                </p>
              ) : null}

              {commits.length > 0 ? (
                <div className="mt-5 rounded-lg border border-border bg-bg/44 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-display text-xl font-black text-cream">Parsed Preview</p>
                    <p className="font-mono text-xs text-gold">{commits.length}/20 commits</p>
                  </div>
                  <div className="max-h-56 space-y-2 overflow-auto pr-1">
                    {commits.map((commit) => (
                      <div key={`${commit.hash}-${commit.message}`} className="grid gap-2 rounded-md bg-surface/70 p-3 text-sm sm:grid-cols-[86px_70px_1fr]">
                        <span className="font-mono text-gold/80">{commit.hash}</span>
                        <span className="font-mono text-cream/55">{commit.type}</span>
                        <span className="text-cream/82">{commit.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <button
                className="gold-button mt-5 w-full rounded-md px-6 py-4 text-base font-black tracking-[0.12em]"
                onClick={generate}
                disabled={loading}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Clapperboard size={20} />
                  {confirmed ? "LIGHTS. CAMERA. COMMIT." : "PREVIEW COMMITS"}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {examples.map((example, index) => (
              <div
                key={example.title}
                className="poster-card animate-fade-up rounded-lg p-5"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 px-3 py-1 font-mono text-xs uppercase text-gold">
                  <Sparkles size={14} /> {example.type}
                </div>
                <h2 className="font-display text-2xl font-black text-cream">{example.title}</h2>
                <p className="mt-3 text-sm leading-6 text-cream/66">{example.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="film-reel mb-4" />
      </section>

      <section id="how-to-use" className="mx-auto max-w-4xl px-4 pb-20">
        <details className="poster-card rounded-lg p-5">
          <summary className="cursor-pointer font-display text-2xl font-black text-gold">How to use (Step-by-Step Guide)</summary>
          <div className="mt-5 space-y-4 text-sm leading-7 text-cream/80">
            <p>
              <strong className="text-gold">Step 1:</strong> Open your terminal or command prompt in your Git project folder.
            </p>
            <p>
              <strong className="text-gold">Step 2:</strong> Run a <code className="text-gold-light">git log</code> command to get your commit history. We support three formats:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Standard Format (Recommended):</strong> Just run <code className="rounded border border-border bg-bg/50 px-1.5 py-0.5 font-mono text-gold-light">git log -n 10</code>
              </li>
              <li>
                <strong>Short Format:</strong> Run <code className="rounded border border-border bg-bg/50 px-1.5 py-0.5 font-mono text-gold-light">git log --oneline -n 10</code>
              </li>
              <li>
                <strong>Pretty Format:</strong> Run <code className="rounded border border-border bg-bg/50 px-1.5 py-0.5 font-mono text-gold-light">git log --pretty=format:&quot;%h|%an|%ar|%s&quot;</code>
              </li>
            </ul>
            <p>
              <strong className="text-gold">Step 3:</strong> Highlight the output in your terminal, copy it, and paste it directly into the text box above!
            </p>
          </div>
        </details>
      </section>
    </main>
  );
}
