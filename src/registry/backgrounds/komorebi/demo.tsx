"use client";

import { Komorebi } from "./Komorebi";

const COPY = {
  plaster: ["Slow mornings", "A reading room for the long weekend", "Open from eight"],
  clay: ["Casa Alba", "Rooms above the old tile works", "Lisbon · from €168 a night"],
  moon: ["After hours", "The garden stays open until the lamps go out", "Thursdays in summer"],
} as const;

export default function Demo({ variant = "plaster" }: { variant?: string }) {
  const palette = (variant in COPY ? variant : "plaster") as keyof typeof COPY;
  const [eyebrow, title, note] = COPY[palette];
  return (
    <Komorebi palette={palette}>
      <div className="flex h-full min-h-[inherit] flex-col justify-center gap-4 px-7 py-12 sm:px-16">
        <p className="m-0 text-[12px] font-medium uppercase tracking-[0.14em] opacity-70">{eyebrow}</p>
        <h2 className="m-0 max-w-[14ch] text-[clamp(2rem,6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em]" style={{ fontFamily: '"Newsreader", Georgia, serif', fontWeight: 500 }}>{title}</h2>
        <p className="m-0 text-[15px] opacity-75">{note}</p>
      </div>
    </Komorebi>
  );
}
