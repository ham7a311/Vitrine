"use client";

import { HoverReel } from "./HoverReel";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full flex-col justify-center py-12 ${night ? "bg-[#0a0a0a]" : "bg-[#f2f0ec]"}`}>
      <p className={`mx-auto mb-6 w-full max-w-[72rem] px-[clamp(1.25rem,5vw,4rem)] font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-white/45" : "text-black/45"}`}>Selected work · 2023–2026</p>
      <HoverReel theme={night ? "night" : "paper"} />
    </div>
  );
}
