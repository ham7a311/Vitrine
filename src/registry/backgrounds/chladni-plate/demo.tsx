"use client";

import { ChladniPlate } from "./ChladniPlate";

const LOOKS: Record<string, { grain: string; ground: string }> = {
  gold: { grain: "#efe4c4", ground: "#0c0b08" },
  copper: { grain: "#e9a877", ground: "#110a07" },
  ash: { grain: "#2b2723", ground: "#e9e4d8" },
};

export default function Demo({ variant = "gold" }: { variant?: string }) {
  const look = LOOKS[variant] ?? LOOKS.gold;
  return <ChladniPlate {...look} className="h-full min-h-full" />;
}
