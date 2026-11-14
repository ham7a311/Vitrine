"use client";

import { PrismGlassPane } from "./PrismGlassPane";

const LOOKS = {
  "spectrum-still": ["spectrum", "still", "full"],
  spectrum: ["spectrum", "full", "full"],
  "aurora-still": ["aurora", "still", "full"],
  aurora: ["aurora", "full", "full"],
  "solar-still": ["solar", "still", "full"],
  solar: ["solar", "full", "full"],
  "flush-still": ["spectrum", "still", "full"],
  flush: ["spectrum", "full", "full"],
  "bare-still": ["spectrum", "still", "outer"],
  "bare": ["spectrum", "full", "outer"],
  "flush-bare-still": ["spectrum", "still", "none"],
  "flush-bare": ["spectrum", "full", "none"],
} as const;

export default function Demo({ variant = "spectrum-still" }: { variant?: string }) {
  const [palette, motion, lines] = LOOKS[variant as keyof typeof LOOKS] ?? LOOKS["spectrum-still"];
  return <PrismGlassPane palette={palette} motion={motion} edge={variant.startsWith("flush") ? "flush" : "inset"} lines={lines} />;
}
