"use client";
import { LightSash, type LightSashPalette } from "./LightSash";

const P: Record<string, LightSashPalette> = {
  lagoon: { bg: "#031a17", body: "#2a877e", edge: "#9ee6d6", haze: "#eefcf7" },
  lilac: { bg: "#0d0a1c", body: "#6a5ab8", edge: "#cfc3ff", haze: "#f7f3ff" },
  sand: { bg: "#19110a", body: "#977146", edge: "#ebd1a5", haze: "#fff8eb" },
};

export default function Demo({ variant = "lagoon" }: { variant?: string }) {
  return <LightSash palette={P[variant] ?? P.lagoon} className="h-full min-h-full w-full" />;
}
