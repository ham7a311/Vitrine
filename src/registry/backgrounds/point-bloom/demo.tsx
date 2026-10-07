"use client";

import { PointBloom, type PointBloomPalette } from "./PointBloom";

const PALETTES: Record<string, PointBloomPalette> = {
  mono: ["#ffffff", "#9a9a9a", "#ffffff"],
  aqua: ["#d9fffb", "#2fb8b0", "#9ff5ee"],
  rose: ["#ffe3ee", "#c2507d", "#ffb3cf"],
};

export default function Demo({ variant = "mono" }: { variant?: string }) {
  return <PointBloom palette={PALETTES[variant] ?? PALETTES.mono} className="h-full min-h-full w-full" />;
}
