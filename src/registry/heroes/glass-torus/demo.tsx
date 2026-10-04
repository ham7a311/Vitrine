"use client";

import { GlassTorus, type TorusLook } from "./GlassTorus";

const LOOKS: Record<string, TorusLook> = {
  smoke: { tint: [0.82, 0.83, 0.87], ior: 1.45, dispersion: 0.03, reflect: 1, ink: "#ffffff", ground: "#000000" },
  clear: { tint: [0.92, 0.95, 1], ior: 1.4, dispersion: 0.025, reflect: 0.7, ink: "#ffffff", ground: "#000000" },
  prism: { tint: [1, 1, 1], ior: 1.5, dispersion: 0.09, reflect: 0.55, ink: "#111111", ground: "#f2f0ec" },
};

export default function Demo({ variant = "smoke" }: { variant?: string }) {
  return <GlassTorus look={LOOKS[variant] ?? LOOKS.smoke} lines={["GLASS", "ICON"]} className="h-full min-h-full" />;
}
