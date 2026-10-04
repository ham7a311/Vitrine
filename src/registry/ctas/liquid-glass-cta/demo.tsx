"use client";

import { LiquidGlassCta } from "./LiquidGlassCta";

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <LiquidGlassCta
        palette={variant === "lagoon" ? "lagoon" : "dusk"}
        eyebrow="The Sunday Letter · from Vitrine"
        headline="One careful email, every Sunday."
        sub="How good product teams in the Gulf plan, ship and write about it. Four minutes, no tracking pixels."
        action="Subscribe"
      />
    </div>
  );
}
