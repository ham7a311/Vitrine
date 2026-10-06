"use client";

import { LightPour, type LightPourPalette } from "./LightPour";

const PALETTES: Record<string, LightPourPalette> = {
  blue: ["#05060c", "#3f63ff", "#9a62ff", "#f3f6ff"],
  ember: ["#0a0604", "#ff5a1f", "#ff2d78", "#fff4ea"],
  mint: ["#030a09", "#14c79c", "#2f8bff", "#effffa"],
  magenta: ["#0a040c", "#c934ff", "#ff5c9a", "#fff0fb"],
};

export default function Demo({ variant = "blue" }: { variant?: string }) {
  return <LightPour palette={PALETTES[variant] ?? PALETTES.blue} className="h-full min-h-full w-full" />;
}
