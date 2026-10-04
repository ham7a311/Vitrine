"use client";

import { RippleTank } from "./RippleTank";

const THEMES: Record<string, { c: [string, string, string, string]; light: boolean }> = {
  ink: { c: ["#05070b", "#0f1724", "#2a3a52", "#cfe0ff"], light: false },
  pool: { c: ["#06363d", "#0e6b72", "#7fd1c4", "#f2fffb"], light: false },
  paper: { c: ["#e8e2d6", "#f6f2ea", "#c9bfae", "#ffffff"], light: true },
};

export default function Demo({ variant = "ink" }: { variant?: string }) {
  const t = THEMES[variant] ?? THEMES.ink;
  return (
    <RippleTank colors={t.c} light={t.light} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full items-end p-6">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${t.light ? "text-black/45" : "text-white/50"}`}>Move to stir · click to drop a stone</p>
      </div>
    </RippleTank>
  );
}
