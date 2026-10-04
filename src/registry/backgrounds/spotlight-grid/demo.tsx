"use client";

import { SpotlightGrid } from "./SpotlightGrid";

const ACCENTS: Record<string, string> = { phosphor: "#86efac", frost: "#b9cce4", lilac: "#c8b9ea", ember: "#f3b45f" };

export default function Demo({ variant = "phosphor" }: { variant?: string }) {
  const accent = ACCENTS[variant] ?? ACCENTS.phosphor;
  return (
    <SpotlightGrid accent={accent} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: accent }}>
          Plan · Shape · Ship · Learn
        </p>
        <p className="max-w-md text-2xl font-medium tracking-tight text-white/85">Move your cursor across the grid.</p>
      </div>
    </SpotlightGrid>
  );
}
