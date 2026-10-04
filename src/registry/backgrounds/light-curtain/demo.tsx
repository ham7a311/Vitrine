"use client";

import { LightCurtain, type LightCurtainPalette } from "./LightCurtain";

const P: Record<string, LightCurtainPalette> = {
  magenta: { glow: "#ff5fc8", deep: "#7a2bff", ground: "#06030a" },
  aurora: { glow: "#5cffb0", deep: "#1f6bff", ground: "#02060a" },
  ember: { glow: "#ffb547", deep: "#e0312b", ground: "#080302" },
};

export default function Demo({ variant = "magenta" }: { variant?: string }) {
  return (
    <LightCurtain palette={P[variant] ?? P.magenta} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-start justify-end bg-[linear-gradient(to_top,rgb(0_0_0/0.7),transparent_50%)] p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Vitrine · After hours</p>
        <h2 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">The room, tuned to you.</h2>
      </div>
    </LightCurtain>
  );
}
