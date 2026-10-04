"use client";

import { RippleRimButton } from "./RippleRimButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <div className={`flex w-full max-w-sm items-center gap-3 rounded-2xl p-4 ${paper ? "bg-white shadow-[0_0_0_1px_rgb(27_26_23/0.08)]" : "bg-[#121015] shadow-[inset_0_0_0_1px_rgb(239_232_220/0.08)]"}`}>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#2a2233] font-[family-name:Instrument_Serif] text-xl text-[#efe8dc]">A</span>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-[0.9375rem] font-semibold ${paper ? "text-[#1b1a17]" : "text-[#efe8dc]"}`}>Hamza Al-Bulushi</p>
          <p className={`truncate text-[0.8125rem] ${paper ? "text-[#6f6a62]" : "text-[#a7a1ab]"}`}>Review requested · 2 days ago</p>
        </div>
        <RippleRimButton theme={paper ? "paper" : "night"} label="Nudge" aria-label="Nudge Hamza" />
      </div>
    </div>
  );
}
