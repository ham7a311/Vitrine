"use client";

import { DitherFlow, type DitherFlowPalette } from "./DitherFlow";

const PALETTES: Record<string, DitherFlowPalette> = {
  violet: ["#09090b", "#4b2bff", "#a996ff", "#ffffff"],
  phosphor: ["#040805", "#1f7a3c", "#7ff29a", "#effff1"],
  mono: ["#0a0a0a", "#4a4a4a", "#a8a8a8", "#ffffff"],
};

export default function Demo({ variant = "violet" }: { variant?: string }) {
  return (
    <DitherFlow palette={PALETTES[variant] ?? PALETTES.violet} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col justify-end bg-[linear-gradient(to_top,rgb(0_0_0/0.72),transparent_45%)] p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">Vitrine · Signal 02</p>
        <h2 className="mt-2 max-w-[14ch] text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1] tracking-[-0.035em] text-white">Soft light, hard pixels.</h2>
      </div>
    </DitherFlow>
  );
}
