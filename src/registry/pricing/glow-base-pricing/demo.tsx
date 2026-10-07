"use client";

import { GlowBasePricing, SUNSET } from "./GlowBasePricing";

const GLOWS: Record<string, [string, string, string]> = {
  sunset: ["#ff6a1f", "#d62ee0", "#1f7bff"],
  aurora: ["#19c37d", "#14b8c9", "#7a4dff"],
  mono: ["#9a9aa3", "#c9c9d1", "#ececf1"],
};

export default function Demo({ variant = "sunset" }: { variant?: string }) {
  const g = GLOWS[variant] ?? GLOWS.sunset;
  return <GlowBasePricing plans={SUNSET.map((p, i) => ({ ...p, glow: g[i] }))} className="min-h-full" />;
}
