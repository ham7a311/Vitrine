"use client";

import { WindMap } from "./WindMap";

const THEMES: Record<string, [string, string, string, string]> = {
  night: ["#070a10", "#2b3d5c", "#7d9cc8", "#f0d9b5"],
  sand: ["#f1eadc", "#d2c3a6", "#a77b4f", "#5b3a22"],
};

export default function Demo({ variant = "night" }: { variant?: string }) {
  const sand = variant === "sand";
  return (
    <WindMap colors={THEMES[variant] ?? THEMES.night} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col justify-between p-6">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${sand ? "text-black/50" : "text-white/55"}`}>Gulf of Oman · 10 m wind · 06:00 GST</p>
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${sand ? "text-black/40" : "text-white/40"}`}>Khareef building over Dhofar</p>
      </div>
    </WindMap>
  );
}
