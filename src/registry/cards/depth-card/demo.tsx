"use client";

import { DepthCard, type DepthPalette } from "./DepthCard";

const P: Record<string, DepthPalette> = {
  dusk: { sky: ["#2b1b4a", "#f29b6b"], sun: "#ffd29a", far: "#a8607a", mid: "#6b3a62", near: "#3b2147", front: "#1a0f22", ink: "#fff4ea" },
  day: { sky: ["#7cb9ef", "#e9f3fa"], sun: "#fff6d6", far: "#c9a27a", mid: "#a8774f", near: "#7a5036", front: "#3d2618", ink: "#fffaf3" },
};

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  const p = P[variant] ?? P.dusk;
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-6 p-8" style={{ background: variant === "day" ? "#e9e2d4" : "#120b18" }}>
      <DepthCard palette={p} place="Jabal Shams" title="The Grand Canyon of Arabia" meta="3,009 m · two nights at the rim" />
    </div>
  );
}
