"use client";

import { GlassRibbons, type GlassRibbonsPalette } from "./GlassRibbons";

const P: Record<string, GlassRibbonsPalette> = {
  violet: { glow: "#c25cff", deep: "#3a1a8a", ground: "#07040e" },
  teal: { glow: "#4ff0c9", deep: "#0f4a52", ground: "#020a0b" },
  rose: { glow: "#ff7aa8", deep: "#5a1630", ground: "#0c0306" },
};

export default function Demo({ variant = "violet" }: { variant?: string }) {
  return (
    <GlassRibbons palette={P[variant] ?? P.violet} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-start justify-end bg-[linear-gradient(to_top,rgb(0_0_0/0.7),transparent_50%)] p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Vitrine · Atrium</p>
        <h2 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">Light, bent along the grain.</h2>
      </div>
    </GlassRibbons>
  );
}
