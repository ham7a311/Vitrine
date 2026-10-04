"use client";

import { LiquidGlassCard } from "./LiquidGlassCard";

const SCENES = {
  dusk: {
    base: "#140c1d",
    paint: "radial-gradient(32% 42% at 24% 34%, #ff7a59, transparent 70%), radial-gradient(30% 40% at 76% 62%, #8b5cf6, transparent 70%), radial-gradient(26% 30% at 58% 20%, #f5c26b, transparent 70%), radial-gradient(30% 36% at 30% 82%, #e0457b, transparent 70%)",
    art: undefined,
  },
  lagoon: {
    base: "#06141c",
    paint: "radial-gradient(32% 42% at 26% 38%, #14b8a6, transparent 70%), radial-gradient(30% 40% at 74% 58%, #3b82f6, transparent 70%), radial-gradient(24% 30% at 52% 18%, #a3e635, transparent 70%), radial-gradient(30% 36% at 72% 88%, #22d3ee, transparent 70%)",
    art: "radial-gradient(circle at 30% 30%, #e9fff6 0 10%, transparent 11%), linear-gradient(160deg, #3ad1c0, #1f6fb2 60%, #13324f)",
  },
} as const;

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  const s = SCENES[variant === "lagoon" ? "lagoon" : "dusk"];
  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden px-4 py-12" style={{ background: s.base }}>
      <div aria-hidden="true" className="lgc-demo-paint absolute inset-[-20%]" style={{ background: s.paint }} />
      {/* Fine lines behind the glass, so you can see them bend at its edges. */}
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.11) 0 1px, transparent 1px 26px), repeating-linear-gradient(0deg, rgb(255 255 255 / 0.07) 0 1px, transparent 1px 26px)" }} />
      <style>{`.lgc-demo-paint { animation: lgc-demo-drift 16s ease-in-out infinite alternate; } @keyframes lgc-demo-drift { to { transform: translate(5%, -4%) rotate(7deg) scale(1.05); } } @media (prefers-reduced-motion: reduce) { .lgc-demo-paint { animation: none; } }`}</style>
      <LiquidGlassCard
        title={variant === "lagoon" ? "Bandar Khayran, early" : "Qurum at dusk"}
        artist={variant === "lagoon" ? "Salma Al Rawahi" : "Nour Al Harthy & The Corniche Trio"}
        duration={variant === "lagoon" ? 251 : 228}
        start={variant === "lagoon" ? 40 : 72}
        upNext={variant === "lagoon" ? "Daymaniyat — Salma Al Rawahi" : "Mutrah Lanterns — The Corniche Trio"}
        art={s.art}
      />
    </div>
  );
}
