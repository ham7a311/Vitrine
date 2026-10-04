"use client";

import { ApertureRings } from "./ApertureRings";

const THEMES: Record<string, [string, string]> = {
  frost: ["#b9cce4", "#08070c"],
  amber: ["#f0b45f", "#0b0806"],
  lilac: ["#c8b9ea", "#09070e"],
};

export default function Demo({ variant = "frost" }: { variant?: string }) {
  const [c, bg] = THEMES[variant] ?? THEMES.frost;
  return (
    <ApertureRings color={c} background={bg} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full items-end justify-between p-6 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: c, opacity: 0.55 }}>
        <span>f / 1.4</span>
        <span>1 / 250 s</span>
      </div>
    </ApertureRings>
  );
}
