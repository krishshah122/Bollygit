"use client";

export function Toast({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-gold/40 bg-surface px-5 py-3 text-sm font-bold text-gold shadow-glow">
      {message}
    </div>
  );
}
