"use client";

import { EmberGlobe, type EmberGlobePalette } from "./EmberGlobe";

const PALETTES: Record<string, EmberGlobePalette> = {
  ember: ["#ffae8a", "#ff7428", "#f0bd3a", "#e6e9ee"],
  glacier: ["#e9fbff", "#57c7ff", "#8fa8ff", "#c7a6ff"],
  mono: ["#ffffff", "#c9ccd3", "#8d929c", "#eceef2"],
};

export default function Demo({ variant = "ember" }: { variant?: string }) {
  return <EmberGlobe palette={PALETTES[variant] ?? PALETTES.ember} className="h-full min-h-full w-full" />;
}
