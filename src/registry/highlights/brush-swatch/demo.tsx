"use client";

import { BrushSwatch } from "./BrushSwatch";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-16 sm:px-14 ${paper ? "bg-[#f4efe4] text-[#1d1a16]" : "bg-[#1b1a18] text-[#f4f0e8]"}`}>
      <div className="mx-auto w-full max-w-4xl">
        <p className={`mb-5 font-mono text-[11px] uppercase tracking-[0.18em] ${paper ? "text-black/45" : "text-white/40"}`}>Vitrine · Branches</p>
        <h2 className="m-0 font-[family-name:Instrument_Serif] text-[clamp(2.8rem,8.6vw,6.4rem)] font-normal leading-[0.98] tracking-[-0.02em]">
          Version control
          <br />
          for your <BrushSwatch theme={paper ? "paper" : "night"} seed={paper ? 11 : 3}><em className="pr-[0.06em]">Agents</em></BrushSwatch>
        </h2>
        <p className={`mt-8 max-w-[46ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed ${paper ? "text-black/60" : "text-white/60"}`}>
          Every agent works on its own branch, and you merge what earns its place. Nothing lands without a diff you can read.
        </p>
      </div>
    </div>
  );
}
