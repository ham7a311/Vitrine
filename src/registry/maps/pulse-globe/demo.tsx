"use client";

import { PulseGlobe, type PulsePalette } from "./PulseGlobe";

const P: Record<string, PulsePalette> = {
  light: { ground: "#fafaf8", land: "#5b6577", glow: "rgb(42 120 214 / 0.08)", text: "#16181d", muted: "#6b7280", line: "rgb(22 24 29 / 0.1)", series: ["#2a78d6", "#eb6834", "#1baf7a"] },
  dark: { ground: "#0c0e12", land: "#8d9ab0", glow: "rgb(57 135 229 / 0.14)", text: "#eef1f6", muted: "#8b93a3", line: "rgb(238 241 246 / 0.1)", series: ["#3987e5", "#d95926", "#199e70"] },
};

export default function Demo({ variant = "dark" }: { variant?: string }) {
  return <PulseGlobe palette={P[variant] ?? P.dark} className="h-full min-h-full" />;
}
