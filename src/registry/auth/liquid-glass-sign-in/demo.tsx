"use client";

import { LiquidGlassSignIn } from "./LiquidGlassSignIn";

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  return <LiquidGlassSignIn variant={variant === "lagoon" ? "lagoon" : "dusk"} product="Vitrine" className="min-h-full" />;
}
