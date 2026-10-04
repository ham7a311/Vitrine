"use client";

import { PrismLight } from "./PrismLight";

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <PrismLight theme={variant === "studio" ? "studio" : "night"} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col justify-between p-6 text-white">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Vitrine Studio · Brand light</p>
          <h2 className="mt-3 max-w-[16ch] text-[clamp(1.7rem,4.2vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Every colour was in the light all along.</h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">Move the light</p>
      </div>
    </PrismLight>
  );
}
