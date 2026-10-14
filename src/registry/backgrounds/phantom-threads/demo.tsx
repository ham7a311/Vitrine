"use client";
import { PhantomThreads, type ThreadPalette } from "./PhantomThreads";

const P: Record<string, ThreadPalette> = {
  violet: { ground: "#06041a", haze: "#130b36", glow: "#7d5cff", core: "#efe8ff" },
  ice: { ground: "#03070d", haze: "#0a1a2c", glow: "#4aa8ff", core: "#e6f5ff" },
  ember: { ground: "#0a0402", haze: "#220c05", glow: "#ff6a2e", core: "#ffeedd" },
};

export default function Demo({ variant = "violet" }: { variant?: string }) {
  return (
    <PhantomThreads palette={P[variant] ?? P.violet} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.45),transparent_60%)] p-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">Vitrine · Long exposure</p>
        <h2 className="mt-3 max-w-[20ch] text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">Light woven from the quiet parts of the spectrum.</h2>
      </div>
    </PhantomThreads>
  );
}
