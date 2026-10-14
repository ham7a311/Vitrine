"use client";
import { JacobsLadder, type LadderPalette } from "./JacobsLadder";

const P: Record<string, LadderPalette> = {
  violet: { ground: "#0b0716", glow: "#9a6bff", core: "#f6efff", metal: "#8c8a99" },
  cobalt: { ground: "#040a16", glow: "#4f97ff", core: "#eef6ff", metal: "#86909e" },
  sodium: { ground: "#120804", glow: "#ff9a3d", core: "#fff3e2", metal: "#9a8f86" },
};

export default function Demo({ variant = "violet" }: { variant?: string }) {
  return (
    <JacobsLadder palette={P[variant] ?? P.violet} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-start justify-start p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">Vitrine · High voltage</p>
        <h2 className="mt-2 max-w-[14ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">Climbing light.</h2>
      </div>
    </JacobsLadder>
  );
}
