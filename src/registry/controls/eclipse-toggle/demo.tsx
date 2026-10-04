"use client";

import { useState } from "react";
import { EclipseToggle } from "./EclipseToggle";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const [night, setNight] = useState(variant === "night");
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-6 p-10 transition-colors duration-700 ${night ? "bg-[#0b1020] text-[#e7ebf6]" : "bg-[#f4f1ea] text-[#1b1a17]"}`}>
      <EclipseToggle size="lg" checked={night} onChange={setNight} label="Dark mode" />
      <div className="flex items-center gap-4">
        <EclipseToggle checked={night} onChange={setNight} label="Dark mode (small)" />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-60">{night ? "Night · 21:40 Muscat" : "Day · 09:15 Muscat"}</p>
      </div>
    </div>
  );
}
