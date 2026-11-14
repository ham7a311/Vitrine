"use client";

import { AquaOrbButton } from "./AquaOrbButton";

const TONES = ["sky", "mint", "rose"] as const;
const PLUS = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
const MIC = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="3.5" width="6" height="10.5" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" /></svg>;

export default function Demo({ variant = "sky" }: { variant?: string }) {
  const tone = TONES.find((t) => t === variant) ?? "sky";
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-10 bg-[#f3f3f3] p-6">
      {/* At real size: a message composer, with the orb as its send button in the corner. */}
      <div className="w-full max-w-[460px] overflow-hidden rounded-[22px] border border-[#e3eefb] bg-white shadow-[0_12px_28px_-18px_rgb(0_0_0/0.22)]">
        <p className="m-0 min-h-[76px] border-b border-[#eaf2fc] px-5 pb-4 pt-4 text-[15px] leading-relaxed text-[#9aa3ad]">Ask about the Lisbon itinerary…</p>
        <div className="flex items-center justify-between px-3.5 py-3">
          <div className="flex items-center gap-2">
            <AquaOrbButton tone={tone} size={32} aria-label="Attach a file">{PLUS}</AquaOrbButton>
            <AquaOrbButton tone={tone} size={32} aria-label="Dictate">{MIC}</AquaOrbButton>
          </div>
          <AquaOrbButton tone={tone} size={40} aria-label="Send message" />
        </div>
      </div>
      {/* The sizes side by side. */}
      <div className="flex items-end gap-5">
        <AquaOrbButton tone={tone} size={28} aria-label="Send, small" />
        <AquaOrbButton tone={tone} size={40} aria-label="Send, default" />
        <AquaOrbButton tone={tone} size={56} aria-label="Send, large" />
      </div>
    </div>
  );
}
