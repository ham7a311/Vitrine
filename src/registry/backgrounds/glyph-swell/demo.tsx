"use client";

import { GlyphSwell } from "./GlyphSwell";

const THEMES: Record<string, { c: [string, string, string]; light: boolean }> = {
  terminal: { c: ["#07090a", "#9fe6b0", "#e9fff0"], light: false },
  paper: { c: ["#f3efe6", "#3d3a34", "#a8432f"], light: true },
  ember: { c: ["#0d0806", "#c9773f", "#ffd9a0"], light: false },
};

export default function Demo({ variant = "terminal" }: { variant?: string }) {
  const t = THEMES[variant] ?? THEMES.terminal;
  return (
    <GlyphSwell colors={t.c} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col justify-end p-6 sm:p-10">
        <p className={`max-w-md rounded-md px-0 font-mono text-[11px] uppercase tracking-[0.16em] ${t.light ? "text-black/55" : "text-white/55"}`}>vitrine-cli 4.2 · build passed in 38s</p>
        <p className={`mt-2 max-w-lg text-2xl font-semibold tracking-tight sm:text-4xl ${t.light ? "text-[#1b1a17]" : "text-white"}`}>Ship from the terminal.</p>
      </div>
    </GlyphSwell>
  );
}
