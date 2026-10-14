"use client";
import { ContourPlasma, type PlasmaPalette } from "./ContourPlasma";

const P: Record<string, PlasmaPalette> = {
  dusk: { stops: ["#14112b", "#4b2a6b", "#c4577a", "#f6c39a"], line: "#0b0918" },
  mint: { stops: ["#082220", "#145a52", "#4fb59a", "#d9f2df"], line: "#041412" },
  mono: { stops: ["#0d0d0e", "#2e2e31", "#7b7b80", "#e7e7e4"], line: "#060607" },
};

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  return (
    <ContourPlasma palette={P[variant] ?? P.dusk} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.45),transparent_62%)] p-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">Vitrine · Survey</p>
        <h2 className="mt-3 max-w-[16ch] text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">Calm, in layers.</h2>
      </div>
    </ContourPlasma>
  );
}
