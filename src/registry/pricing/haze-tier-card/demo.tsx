"use client";

import { HazeTierCard, type HazeTone } from "./HazeTierCard";

const TONES: Record<string, HazeTone> = {
  lavender: { glow: "#7a6fc4", hi: "#c3b8f5", from: "#957cf0", to: "#6b4fd6", ink: "#ece8fb" },
  ember: { glow: "#c46a3a", hi: "#ffc9a3", from: "#f08a4c", to: "#d4532a", ink: "#fff1e8" },
  teal: { glow: "#2f9b95", hi: "#a6efe6", from: "#35c2b0", to: "#1f8f8a", ink: "#eafffb" },
  rose: { glow: "#b85a86", hi: "#ffbfdc", from: "#ec6fa6", to: "#c3417f", ink: "#fff0f7" },
};

export default function Demo({ variant = "lavender" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#08080a] px-4 py-10">
      <HazeTierCard tone={TONES[variant] ?? TONES.lavender} />
    </div>
  );
}
