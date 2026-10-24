"use client";

import { InfiniteHighlightSweep, SweepText } from "./InfiniteHighlightSweep";

const COLORS: Record<string, string> = {
  teal: "#5fd4bf",
  violet: "#a78bfa",
  amber: "#fbbf24",
  rose: "#fb7185",
  sky: "#60a5fa",
  lime: "#a3e635",
};

export default function Demo({ variant = "teal" }: { variant?: string }) {
  const color = COLORS[variant] ?? COLORS.teal;
  return (
    <InfiniteHighlightSweep color={color} className="min-h-full w-full text-white" style={{ background: "#050505", fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center px-5 py-16 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">Weekend planner · Muscat</p>
        <h2 className="mt-5 text-[clamp(2rem,6.4vw,4.6rem)] font-medium leading-[1.12] tracking-[-0.035em]">
          <SweepText as="span" text="Plan the whole weekend —" className="block" />
          <SweepText as="span" order={1} text="you'll actually be there." className="block" />
        </h2>
        <SweepText
          order={2}
          text="[[The weekend planner that books everything in one go]] — dinner at Bait Al Luban, a dhow at sunset, the Wadi Shab hike — and tells everyone where to be, and when."
          className="mt-7 max-w-[46ch] text-[clamp(1.05rem,1.8vw,1.3rem)] leading-[1.55] text-white/80"
        />
      </div>
    </InfiniteHighlightSweep>
  );
}
