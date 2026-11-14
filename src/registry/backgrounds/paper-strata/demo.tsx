"use client";

import { PaperStrata } from "./PaperStrata";

const COPY = {
  clay: ["Field notes, issue 14", "Six days across the Atlas, on foot"],
  tide: ["Tidewater Trust", "The estuary, mapped one low tide at a time"],
  ink: ["Night edition", "What the valley sounds like after the last train"],
} as const;

export default function Demo({ variant = "clay" }: { variant?: string }) {
  const palette = (variant in COPY ? variant : "clay") as keyof typeof COPY;
  const [eyebrow, title] = COPY[palette];
  return (
    <PaperStrata palette={palette}>
      <div className="flex h-full min-h-[inherit] flex-col items-center px-6 pt-[9%] text-center">
        <p className="m-0 mb-3 text-[12px] font-medium uppercase tracking-[0.14em] opacity-70">{eyebrow}</p>
        <h2 className="m-0 max-w-[18ch] text-[clamp(1.75rem,5.4vw,3.2rem)] leading-[1.04] tracking-[-0.03em]" style={{ fontFamily: '"Newsreader", Georgia, serif', fontWeight: 500 }}>{title}</h2>
      </div>
    </PaperStrata>
  );
}
