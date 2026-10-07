"use client";

import { ConduitCard, type ConduitTone } from "./ConduitCard";

const TONES: Record<string, ConduitTone> = {
  violet: { card: ["#3524ab", "#2a1d88"], halo: "#7c5cff", trace: "#3f33b8", ink: "#ece8ff", muted: "#a198e6", page: "#07071a" },
  cyan: { card: ["#0f5d8f", "#0b3f6b"], halo: "#2fc8ff", trace: "#1d6fb0", ink: "#e6f8ff", muted: "#8fc6e3", page: "#05111c" },
  rose: { card: ["#8c1f5e", "#5f1442"], halo: "#ff5fa8", trace: "#a8306f", ink: "#ffe8f3", muted: "#e39cbf", page: "#14050d" },
};

export default function Demo({ variant = "violet" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center" style={{ background: (TONES[variant] ?? TONES.violet).page }}>
      <ConduitCard tone={TONES[variant] ?? TONES.violet} />
    </div>
  );
}
