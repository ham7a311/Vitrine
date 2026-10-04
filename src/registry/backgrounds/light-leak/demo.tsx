"use client";

import { LightLeak } from "./LightLeak";

export default function Demo({ variant = "warm" }: { variant?: string }) {
  const theme = (["warm", "cool", "mono"].includes(variant) ? variant : "warm") as "warm" | "cool" | "mono";
  return (
    <LightLeak theme={theme} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col justify-between p-6 text-white sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">Roll 07 · Jabal Shams · 35mm</p>
        <div>
          <h2 className="max-w-[12ch] font-[family-name:var(--font-newsreader)] text-[clamp(2.2rem,6vw,4.6rem)] italic leading-[1] tracking-[-0.02em]">The summer we didn’t plan.</h2>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">A short film · 12 min</p>
        </div>
      </div>
    </LightLeak>
  );
}
