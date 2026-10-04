"use client";

import { MarqueeLightsButton } from "./MarqueeLightsButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${paper ? "bg-[#efe9dc]" : "bg-[#0c0909]"}`}>
      <div className="flex flex-col items-center gap-5 text-center">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${paper ? "text-[#6f6a62]" : "text-[#9c8f86]"}`}>Royal Opera House Muscat · 21 Nov · 19:30</p>
        <p className={`font-[family-name:Instrument_Serif] text-[2.25rem] leading-none ${paper ? "text-[#1d1b17]" : "text-[#efe8dc]"}`}>La Bohème</p>
        <MarqueeLightsButton theme={paper ? "paper" : "night"}>Get tickets</MarqueeLightsButton>
      </div>
    </div>
  );
}
