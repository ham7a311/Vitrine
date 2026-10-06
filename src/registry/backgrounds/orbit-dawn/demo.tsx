"use client";

import { OrbitDawn, type OrbitDawnPalette } from "./OrbitDawn";

const PALETTES: Record<string, OrbitDawnPalette> = {
  violet: ["#05031a", "#7239ea", "#ee9cf6", "#fbf6ff"],
  cyan: ["#020a16", "#1677e8", "#7fe3f5", "#f3fdff"],
  amber: ["#120804", "#e2561c", "#ffc27a", "#fffaf0"],
  emerald: ["#020f0b", "#0f9a6e", "#8cf0c4", "#f2fff9"],
};

export default function Demo({ variant = "violet" }: { variant?: string }) {
  return <OrbitDawn palette={PALETTES[variant] ?? PALETTES.violet} className="h-full min-h-full w-full" />;
}
