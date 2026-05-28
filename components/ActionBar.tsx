"use client";

import html2canvas from "html2canvas";
import { Download, Heart, Link as LinkIcon, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { getBrowserFingerprint } from "@/lib/fingerprint";
import { Toast } from "@/components/Toast";

type ActionBarProps = {
  dramaId?: string;
  upvotes?: number;
  onGenerateAgain?: () => void;
};

export function ActionBar({ dramaId, upvotes = 0, onGenerateAgain }: ActionBarProps) {
  const [count, setCount] = useState(upvotes);
  const [voted, setVoted] = useState(false);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!dramaId) {
      return;
    }

    setVoted(window.localStorage.getItem(`bollygit_upvoted_${dramaId}`) === "1");
  }, [dramaId]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(""), 2000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function shareDrama() {
    const url = dramaId ? `${window.location.origin}/drama/${dramaId}` : window.location.href;
    await navigator.clipboard.writeText(url);
    setToast("Link copy ho gaya!");
  }

  async function downloadPoster() {
    const element = document.getElementById("drama-scroll");
    if (!element) {
      return;
    }

    setBusy(true);
    
    // Temporarily force width to 1080px for Instagram/Canva poster size
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    
    element.style.width = "1080px";
    element.style.maxWidth = "1080px";
    
    // Add a tiny delay to let the browser apply the styles
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#080608",
        scale: 2, // High resolution
        windowWidth: 1080,
        width: 1080,
        height: element.scrollHeight,
        windowHeight: element.scrollHeight,
        useCORS: true,
        scrollY: -window.scrollY, // Fixes the "half image" bug when scrolled down
      });
      const link = document.createElement("a");
      link.download = `bollygit-${dramaId || "poster"}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } finally {
      // Restore original styles
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      setBusy(false);
    }
  }

  async function upvoteDrama() {
    if (!dramaId || voted) {
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dramaId, fingerprint: getBrowserFingerprint() })
      });
      const payload = await response.json();

      if (!response.ok) {
        setToast(payload.error || "Vote pe thoda drama ho gaya.");
        return;
      }

      setCount(payload.upvotes);
      setVoted(true);
      window.localStorage.setItem(`bollygit_upvoted_${dramaId}`, "1");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Toast message={toast} />
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/20 bg-bg/88 px-3 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-center">
          <button className="dark-button rounded-md px-4 py-3 text-sm font-bold" onClick={shareDrama}>
            <span className="inline-flex items-center justify-center gap-2">
              <LinkIcon size={17} /> Share
            </span>
          </button>
          <button className="dark-button rounded-md px-4 py-3 text-sm font-bold" disabled={busy} onClick={downloadPoster}>
            <span className="inline-flex items-center justify-center gap-2">
              <Download size={17} /> Download Poster
            </span>
          </button>
          <button
            className={`dark-button rounded-md px-4 py-3 text-sm font-bold ${voted ? "text-gold" : ""}`}
            disabled={busy || voted || !dramaId}
            onClick={upvoteDrama}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Heart className={voted ? "animate-pop fill-gold text-gold" : ""} size={17} /> {count}
            </span>
          </button>
          {onGenerateAgain ? (
            <button className="gold-button rounded-md px-4 py-3 text-sm font-black" onClick={onGenerateAgain}>
              <span className="inline-flex items-center justify-center gap-2">
                <RotateCcw size={17} /> Generate Again
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
