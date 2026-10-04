"use client";

import { Loom } from "./Loom";

const THEMES: Record<string, { colors: string[]; bg: string }> = {
  frost: { colors: ["rgba(239,232,220,0.12)", "rgba(185,204,228,0.2)", "rgba(239,232,220,0.08)", "rgba(185,204,228,0.14)", "rgba(200,185,234,0.3)"], bg: "#0a080c" },
  ember: { colors: ["rgba(243,180,95,0.16)", "rgba(239,232,220,0.1)", "rgba(224,122,61,0.22)", "rgba(239,232,220,0.07)"], bg: "#0c0907" },
  linen: { colors: ["rgba(42,24,48,0.18)", "rgba(42,24,48,0.1)", "rgba(126,147,174,0.3)", "rgba(42,24,48,0.14)"], bg: "#ece4d6" },
};

export default function Demo({ variant = "frost" }: { variant?: string }) {
  const t = THEMES[variant] ?? THEMES.frost;
  return (
    <Loom colors={t.colors} background={t.bg} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full items-center justify-center">
        <p className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] backdrop-blur-sm" style={{ color: variant === "linen" ? "#2a1830" : "rgba(255,255,255,0.7)", background: variant === "linen" ? "rgba(236,228,214,0.7)" : "rgba(10,8,12,0.55)" }}>
          Part the threads
        </p>
      </div>
    </Loom>
  );
}
