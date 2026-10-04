"use client";

import { SketchButton } from "./SketchButton";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div
      className="flex min-h-full w-full items-center justify-center p-8"
      style={night ? { background: "#1f2a24" } : { background: "repeating-linear-gradient(to bottom, transparent 0 27px, rgb(84 132 196 / 0.18) 27px 28px), #fbf8f0" }}
    >
      <div className="flex max-w-xs flex-col items-center gap-4 text-center">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${night ? "text-[#a9b5ad]" : "text-[#7a7366]"}`}>Margins · a notebook for sketches</p>
        <p className={`font-[family-name:Instrument_Serif] text-[1.75rem] leading-tight ${night ? "text-[#f1ede4]" : "text-[#24211c]"}`}>Draw on your notes. Sync to every device.</p>
        <SketchButton theme={night ? "night" : "paper"}>Try the beta</SketchButton>
      </div>
    </div>
  );
}
