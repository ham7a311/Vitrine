"use client";

import { FilterStepCard, type FilterTone } from "./FilterStepCard";

const TONES: Record<string, FilterTone> = {
  copper: { glow: "#e07a3f", badge: "#ff8a4c", page: "#070b14" },
  teal: { glow: "#22b8a6", badge: "#3fe0cb", page: "#04100f" },
  violet: { glow: "#8a5cff", badge: "#b49bff", page: "#0a0816" },
};

export default function Demo({ variant = "copper" }: { variant?: string }) {
  const tone = TONES[variant] ?? TONES.copper;
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: tone.page }}>
      <FilterStepCard tone={tone} />
    </div>
  );
}
