"use client";

import { FiberOptics, type FiberOpticsPalette } from "./FiberOptics";

const P: Record<string, FiberOpticsPalette> = {
  ice: { glow: "#7fd8ff", deep: "#2a3f9a", ground: "#03050c" },
  violet: { glow: "#e07bff", deep: "#5b2bd6", ground: "#05030c" },
  ember: { glow: "#ffc061", deep: "#c2410c", ground: "#080402" },
};

export default function Demo({ variant = "ice" }: { variant?: string }) {
  return (
    <FiberOptics palette={P[variant] ?? P.ice} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-start justify-end bg-[linear-gradient(to_top,rgb(0_0_0/0.7),transparent_50%)] p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Vitrine · Network</p>
        <h2 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">Every request, carried in light.</h2>
      </div>
    </FiberOptics>
  );
}
