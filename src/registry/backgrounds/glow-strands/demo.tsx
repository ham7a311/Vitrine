"use client";
import { GlowStrands, type GlowStrandsPalette } from "./GlowStrands";

const P: Record<string, GlowStrandsPalette> = {
  aurora: { bg: "#000000", c0: "#3a137a", c1: "#7a2ef5", c2: "#2b8df2", c3: "#a6e4ff", c4: "#f4e2b0", c5: "#4f35c8" },
  sunset: { bg: "#000000", c0: "#5a1040", c1: "#e0337a", c2: "#ff6a3a", c3: "#ffc46a", c4: "#ffe9c2", c5: "#a02a6a" },
  silver: { bg: "#000000", c0: "#2a2d38", c1: "#8a90a8", c2: "#c8cee0", c3: "#ffffff", c4: "#e6e2d8", c5: "#5a6070" },
};

export default function Demo({ variant = "aurora" }: { variant?: string }) {
  return <GlowStrands palette={P[variant] ?? P.aurora} className="h-full min-h-full w-full" />;
}
