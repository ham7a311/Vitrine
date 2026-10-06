"use client";

import { HalftoneRise, type HalftoneRisePalette } from "./HalftoneRise";

const PALETTES: Record<string, HalftoneRisePalette> = {
  copper: ["#0a0a0b", "#8a4420", "#e8894c"],
  cobalt: ["#06080d", "#1d3a8a", "#6f9bff"],
  jade: ["#050a08", "#14583f", "#4fe0a5"],
  rose: ["#0b0709", "#7a2347", "#ff86b3"],
};

export default function Demo({ variant = "copper" }: { variant?: string }) {
  return <HalftoneRise palette={PALETTES[variant] ?? PALETTES.copper} className="h-full min-h-full w-full" />;
}
