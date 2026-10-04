"use client";

import { useState, type ReactNode } from "react";
import { LiquidGlassButton } from "./LiquidGlassButton";

/** A slow, colourful scene so there is something for the glass to bend. */
function Scene({ children, dusk }: { children: ReactNode; dusk?: boolean }) {
  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden p-8" style={{ background: dusk ? "#120b1c" : "#0b1220" }}>
      <div
        aria-hidden="true"
        className="absolute inset-[-20%]"
        style={{
          background: dusk
            ? "radial-gradient(35% 45% at 30% 40%, #ff7a59, transparent 70%), radial-gradient(30% 40% at 70% 60%, #8b5cf6, transparent 70%), radial-gradient(25% 30% at 55% 25%, #f5c26b, transparent 70%)"
            : "radial-gradient(35% 45% at 30% 45%, #3b82f6, transparent 70%), radial-gradient(30% 40% at 72% 55%, #22c55e, transparent 70%), radial-gradient(25% 30% at 50% 22%, #e879f9, transparent 70%)",
          animation: "lgb-drift 14s ease-in-out infinite alternate",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgb(255 255 255 / 0.06) 1px, transparent 1px)", backgroundSize: "100% 22px" }} />
      <style>{`@keyframes lgb-drift { to { transform: translate(6%, -4%) rotate(8deg); } } @media (prefers-reduced-motion: reduce) { [style*="lgb-drift"] { animation: none !important; } }`}</style>
      <div className="relative flex flex-wrap items-center justify-center gap-4">{children}</div>
    </div>
  );
}

export default function Demo({ variant = "pill" }: { variant?: string }) {
  const [playing, setPlaying] = useState(false);
  if (variant === "controls")
    return (
      <Scene dusk>
        <LiquidGlassButton shape="round" aria-label="Previous">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 5v10M15 5l-7 5 7 5V5Z" /></svg>
        </LiquidGlassButton>
        <LiquidGlassButton shape="round" aria-label={playing ? "Pause" : "Play"} aria-pressed={playing} onClick={() => setPlaying((p) => !p)}>
          {playing ? (
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10M13 5v10" /></svg>
          ) : (
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4.5v11l9-5.5-9-5.5Z" /></svg>
          )}
        </LiquidGlassButton>
        <LiquidGlassButton shape="round" aria-label="Next">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M14 5v10M5 5l7 5-7 5V5Z" /></svg>
        </LiquidGlassButton>
      </Scene>
    );
  return (
    <Scene>
      <LiquidGlassButton>Get started</LiquidGlassButton>
      <LiquidGlassButton tint="185 204 228">Watch the film ↗</LiquidGlassButton>
    </Scene>
  );
}
