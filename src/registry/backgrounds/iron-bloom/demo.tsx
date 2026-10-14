"use client";
import { IronBloom, type BloomPalette } from "./IronBloom";

const P: Record<string, BloomPalette> = {
  ink: { base: "#050506", light: "#f2f2f4", tint: "#30303a" },
  oil: { base: "#040405", light: "#e8e8f0", tint: "#2a2440", iridescent: true },
  copper: { base: "#070403", light: "#ffc79a", tint: "#4a2412" },
};

export default function Demo({ variant = "ink" }: { variant?: string }) {
  return (
    <IronBloom palette={P[variant] ?? P.ink} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-start justify-end bg-[linear-gradient(to_top,rgb(0_0_0/0.75),transparent_55%)] p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">Vitrine · Field study</p>
        <h2 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">Bend the dark.</h2>
      </div>
    </IronBloom>
  );
}
