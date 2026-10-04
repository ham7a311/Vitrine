"use client";

import { GlassBlinds, type GlassBlindsPalette } from "./GlassBlinds";

const P: Record<string, GlassBlindsPalette> = {
  indigo: { glow: "#8f9bff", deep: "#3a3fd6", ground: "#020208" },
  rose: { glow: "#ff8fbf", deep: "#c2185b", ground: "#080206" },
  sea: { glow: "#7ff0dc", deep: "#0f7a8a", ground: "#010607" },
};

export default function Demo({ variant = "indigo" }: { variant?: string }) {
  return (
    <GlassBlinds palette={P[variant] ?? P.indigo} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-start justify-end bg-[linear-gradient(to_top,rgb(0_0_0/0.7),transparent_50%)] p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Vitrine · Night shift</p>
        <h2 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">Light, read through the slats.</h2>
      </div>
    </GlassBlinds>
  );
}
