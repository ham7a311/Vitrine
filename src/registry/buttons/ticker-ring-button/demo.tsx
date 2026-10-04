"use client";

import { TickerRingButton } from "./TickerRingButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${paper ? "bg-[#f1ece0]" : "bg-[#0d0b0a]"}`}>
      <div className="flex flex-col items-center gap-6 text-center">
        <div>
          <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${paper ? "text-[#6f6a62]" : "text-[#9c938a]"}`}>Bait Al Luban · Mutrah Corniche</p>
          <p className={`mt-2 font-[family-name:Instrument_Serif] text-[2.25rem] leading-none ${paper ? "text-[#1d3b2f]" : "text-[#efe8dc]"}`}>Omani kitchen, harbour view</p>
        </div>
        <TickerRingButton theme={paper ? "paper" : "night"} label="Book a table" ticker="Winter menu from 14 Nov" />
      </div>
    </div>
  );
}
