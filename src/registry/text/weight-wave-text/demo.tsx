"use client";

import { WeightWaveText } from "./WeightWaveText";

const BG: Record<string, string> = { night: "#0b0b0d", paper: "#f3efe7", gradient: "radial-gradient(90% 80% at 50% 45%, #1a1635, #07060c 70%)" };

export default function Demo({ variant = "night" }: { variant?: string }) {
  const theme = (["night", "paper", "gradient"].includes(variant) ? variant : "night") as "night" | "paper" | "gradient";
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 px-4 py-16" style={{ background: BG[theme] }}>
      <WeightWaveText text="Feel every letter" theme={theme} className="w-full max-w-6xl" />
      <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${theme === "paper" ? "text-black/45" : "text-white/40"}`}>Move across the words</p>
    </div>
  );
}
