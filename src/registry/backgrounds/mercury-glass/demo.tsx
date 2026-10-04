"use client";

import { MercuryGlass } from "./MercuryGlass";

const THEMES: Record<string, [string, string, string, string, string]> = {
  clear: ["#f3efe6", "#1b1a17", "#7c5cc4", "#d9733a", "#dfe9f2"],
  smoke: ["#121114", "#efe8dc", "#46628a", "#8a5a3a", "#9aa4b2"],
  rose: ["#f7ece8", "#3a1f24", "#d96a7f", "#e8a35a", "#f6d6dc"],
};

export default function Demo({ variant = "clear" }: { variant?: string }) {
  const dark = variant === "smoke";
  return (
    <MercuryGlass colors={THEMES[variant] ?? THEMES.clear} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col justify-end p-6 sm:p-10">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${dark ? "text-white/55" : "text-black/50"}`}>Bait Al Zujaj · glassworks, Nizwa</p>
        <p className={`mt-2 max-w-md text-2xl font-semibold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-[#1b1a17]"}`}>Blown by hand since 1987.</p>
      </div>
    </MercuryGlass>
  );
}
