"use client";
import { PigmentShore, type PigmentShorePalette } from "./PigmentShore";

const P: Record<string, PigmentShorePalette> = {
  tide: { top: "#03060f", left: "#2aa4e4", mid: "#3c2f8a", right: "#f2333a" },
  lagoon: { top: "#020a0c", left: "#1fc2ae", mid: "#2f5c78", right: "#f0b13a" },
  dusk: { top: "#07040d", left: "#7a4cf0", mid: "#b0399a", right: "#ff7a86" },
};

export default function Demo({ variant = "tide" }: { variant?: string }) {
  return <PigmentShore palette={P[variant] ?? P.tide} className="h-full min-h-full w-full" />;
}
