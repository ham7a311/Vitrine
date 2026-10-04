"use client";

import { GlassOrbs, type GlassOrbsPalette } from "./GlassOrbs";

const P: Record<string, GlassOrbsPalette> = {
  violet: { glow: "#c25cff", deep: "#3a1a8a", ground: "#07040e" },
  ice: { glow: "#7fd8ff", deep: "#12406b", ground: "#03070d" },
  amber: { glow: "#ffb547", deep: "#6b3410", ground: "#0b0603" },
};

export default function Demo({ variant = "violet" }: { variant?: string }) {
  return (
    <GlassOrbs palette={P[variant] ?? P.violet} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-start justify-end bg-[linear-gradient(to_top,rgb(0_0_0/0.7),transparent_50%)] p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Vitrine · Marbles</p>
        <h2 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">Every bead a little lens.</h2>
      </div>
    </GlassOrbs>
  );
}
