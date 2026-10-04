"use client";

import { PromptComposer } from "./PromptComposer";

const FILES = [
  { id: "a", name: "Q3-board-deck.pdf", kind: "pdf" as const },
  { id: "b", name: "churn-by-cohort.csv", kind: "sheet" as const },
  { id: "c", name: "pricing.tsx", kind: "code" as const },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-7 p-8 ${night ? "bg-[#0f0e10]" : "bg-[#f5f1e8]"}`}>
      <h2 className={`font-[family-name:Instrument_Serif] text-[clamp(2rem,4vw,2.8rem)] leading-none tracking-[-0.02em] ${night ? "text-[#efe8dc]" : "text-[#1f1b16]"}`}>
        What are we working on, Hamza?
      </h2>
      <PromptComposer theme={night ? "night" : "paper"} initialFiles={FILES} placeholder="Summarise what changed in the deck and flag anything that doesn't match the churn data…" />
    </div>
  );
}
