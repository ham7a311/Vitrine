"use client";

import { RouteGlobe, type GlobeTheme } from "./RouteGlobe";

const THEMES: Record<string, GlobeTheme> = {
  night: { ground: "#06080d", land: "#9fb4d6", arc: "#ffb547", glow: "rgb(90 140 255 / 0.18)", text: "#eef2fb", muted: "#7c8aa5" },
  paper: { ground: "#f3efe6", land: "#3b4a63", arc: "#d9480f", glow: "rgb(59 74 99 / 0.12)", text: "#1b1a17", muted: "#7a7366" },
};

export default function Demo({ variant = "night" }: { variant?: string }) {
  const t = THEMES[variant] ?? THEMES.night;
  return (
    <div className="relative h-full min-h-full w-full" style={{ background: t.ground, color: t.text }}>
      <RouteGlobe theme={t} className="!absolute inset-0" />
      <div className="pointer-events-none absolute left-6 top-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: t.muted }}>
          From Muscat · 10 routes
        </p>
        <p className="mt-2 text-[1.5rem] font-semibold tracking-[-0.02em]">Where we fly this winter</p>
      </div>
    </div>
  );
}
