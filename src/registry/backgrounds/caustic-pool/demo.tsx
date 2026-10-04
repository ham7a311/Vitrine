"use client";

import { CausticPool } from "./CausticPool";

const THEMES: Record<string, [string, string]> = {
  night: ["#b9d4f0", "#050a12"],
  lagoon: ["#9ff0de", "#03100f"],
  lilac: ["#d8c8ff", "#0a0612"],
};

export default function Demo({ variant = "night" }: { variant?: string }) {
  const [tint, depth] = THEMES[variant] ?? THEMES.night;
  return (
    <CausticPool tint={tint} depth={depth} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full items-end p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">Depth 2.4 m · 14°C</p>
      </div>
    </CausticPool>
  );
}
