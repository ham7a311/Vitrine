"use client";
import { Nacre, type NacrePalette } from "./Nacre";

const P: Record<string, NacrePalette> = {
  pearl: { base: "#f1eef2", shade: "#cfcbdb", strength: 0.38, thickness: 360 },
  abalone: { base: "#7fa3b8", shade: "#1d3a4f", strength: 0.9, thickness: 430 },
  opal: { base: "#eef0f2", shade: "#c4ccd6", strength: 0.26, thickness: 300, flecks: 0.9 },
};

export default function Demo({ variant = "pearl" }: { variant?: string }) {
  const dark = variant === "abalone";
  return (
    <Nacre palette={P[variant] ?? P.pearl} className="h-full min-h-full w-full">
      <div className={`pointer-events-none flex h-full flex-col items-center justify-center p-6 text-center ${dark ? "bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.35),transparent_60%)]" : ""}`}>
        <p className={`font-mono text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/75" : "text-black/60"}`}>Vitrine · Inner shell</p>
        <h2 className={`mt-3 max-w-[16ch] text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${dark ? "text-white" : "text-[#15141a]"}`}>Colour that comes from thickness.</h2>
      </div>
    </Nacre>
  );
}
