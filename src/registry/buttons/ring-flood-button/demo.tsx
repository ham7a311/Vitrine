"use client";

import { RingFloodButton } from "./RingFloodButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <div className="flex flex-col items-center gap-5 text-center">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Team · $24 a month</p>
        <RingFloodButton theme={paper ? "paper" : "night"}>Start a 14-day trial</RingFloodButton>
        <p className={`text-[0.8125rem] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>No card needed. Cancel from settings.</p>
      </div>
    </div>
  );
}
