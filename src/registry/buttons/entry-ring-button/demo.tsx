"use client";

import { EntryRingButton } from "./EntryRingButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <div className="flex flex-col items-center gap-5 text-center">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Come in from any side</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <EntryRingButton theme={paper ? "paper" : "night"}>Request a demo</EntryRingButton>
          <EntryRingButton theme={paper ? "paper" : "night"}>Book a call with Salim</EntryRingButton>
        </div>
      </div>
    </div>
  );
}
