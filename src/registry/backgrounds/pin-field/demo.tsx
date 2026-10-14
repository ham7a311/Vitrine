"use client";
import { PinField, type PinPalette } from "./PinField";

const P: Record<string, PinPalette> = {
  graphite: { ground: "#0b0b0d", low: "#2b2b30", high: "#f4f4f2" },
  brass: { ground: "#0d0a06", low: "#3b2d19", high: "#ffd890" },
  ice: { ground: "#060a11", low: "#1a2a3e", high: "#d6ebff" },
};

export default function Demo({ variant = "graphite" }: { variant?: string }) {
  return (
    <PinField palette={P[variant] ?? P.graphite} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.55),transparent_60%)] p-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">Vitrine · Relief</p>
        <h2 className="mt-3 max-w-[18ch] text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">Soft light on a moving surface.</h2>
      </div>
    </PinField>
  );
}
