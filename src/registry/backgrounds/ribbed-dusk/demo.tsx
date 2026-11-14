"use client";

import { RibbedDusk } from "./RibbedDusk";

const PALETTES = ["dusk", "ember", "moss"] as const;

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  const palette = PALETTES.find((p) => p === variant) ?? "dusk";
  return <RibbedDusk palette={palette} />;
}
