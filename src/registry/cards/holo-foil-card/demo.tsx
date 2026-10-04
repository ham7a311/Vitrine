"use client";

import { HoloFoilCard } from "./HoloFoilCard";

const BG: Record<string, string> = {
  rainbow: "radial-gradient(90% 70% at 50% 30%, #f3f1f7, #d9d6e2)",
  gold: "radial-gradient(90% 70% at 50% 30%, #2a2116, #0f0c08)",
  obsidian: "radial-gradient(90% 70% at 50% 30%, #23232b, #0a0a0d)",
};

export default function Demo({ variant = "rainbow" }: { variant?: string }) {
  const finish = (["rainbow", "gold", "obsidian"].includes(variant) ? variant : "rainbow") as "rainbow" | "gold" | "obsidian";
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center px-4 py-10" style={{ background: BG[finish] }}>
      <HoloFoilCard finish={finish} />
      <p className={`font-mono text-[11px] uppercase tracking-[0.18em] ${finish === "rainbow" ? "text-black/45" : "text-white/40"}`}>Tilt it · click to turn over</p>
    </div>
  );
}
