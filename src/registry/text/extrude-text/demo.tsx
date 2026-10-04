"use client";

import { ExtrudeText } from "./ExtrudeText";

const PAGE: Record<string, { bg: string; ink: string }> = {
  tomato: { bg: "#f3ead8", ink: "rgb(80 30 15 / 0.55)" },
  cobalt: { bg: "#c9e4ff", ink: "rgb(10 30 110 / 0.55)" },
  mint: { bg: "#0f1513", ink: "rgb(160 240 210 / 0.5)" },
};

export default function Demo({ variant = "tomato" }: { variant?: string }) {
  const palette = (["tomato", "cobalt", "mint"].includes(variant) ? variant : "tomato") as "tomato" | "cobalt" | "mint";
  const p = PAGE[palette];
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 overflow-hidden px-4 py-16" style={{ background: p.bg }}>
      <ExtrudeText text="Muscat" palette={palette} />
      <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: p.ink }}>Move to turn it · click to pop</p>
    </div>
  );
}
