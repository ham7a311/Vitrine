"use client";

import { SloshButton } from "./SloshButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <div className="flex flex-col items-center gap-5 text-center">
        <div>
          <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Nizwa Souq · Rose water, 250 ml</p>
          <p className={`mt-2 text-[1.25rem] font-semibold tracking-[-0.02em] ${paper ? "text-[#1b1a17]" : "text-[#efe8dc]"}`}>Jebel Akhdar rose water</p>
          <p className={`mt-1 text-[0.875rem] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>OMR 4.500 · distilled in April</p>
        </div>
        <SloshButton theme={paper ? "paper" : "night"} label="Save for later" doneLabel="Saved" />
        <p className={`text-[0.75rem] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Move across it slowly, then quickly</p>
      </div>
    </div>
  );
}
