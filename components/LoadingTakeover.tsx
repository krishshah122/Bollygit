"use client";

import { useEffect, useState } from "react";

const messages = [
  "Script likh rahe hain...",
  "Heroine ko bulaya ja raha hai...",
  "Background music select ho rahi hai...",
  "Director ki chai ban rahi hai...",
  "Interval scene ready ho raha hai..."
];

export function LoadingTakeover() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/95 px-6 text-center backdrop-blur-sm">
      <div className="clapper mb-10" aria-hidden="true" />
      <p className="animate-fade-up font-display text-3xl font-black text-gold md:text-5xl">
        LIGHTS. CAMERA. COMMIT.
      </p>
      <p key={messages[index]} className="mt-5 animate-fade-up text-lg text-cream/80">
        {messages[index]}
      </p>
    </div>
  );
}
