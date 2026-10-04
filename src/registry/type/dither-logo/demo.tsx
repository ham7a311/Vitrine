"use client";

import { DitherLogo } from "./DitherLogo";

const LOOK: Record<string, { bg: string; fg: string; muted: string }> = {
  ink: { bg: "#0b0b0c", fg: "#f2efe9", muted: "rgb(242 239 233 / 0.45)" },
  paper: { bg: "#f2efe9", fg: "#111111", muted: "rgb(17 17 17 / 0.45)" },
  signal: { bg: "#0b0b0c", fg: "#ff6a1a", muted: "rgb(255 106 26 / 0.55)" },
};

export default function Demo({ variant = "ink" }: { variant?: string }) {
  const l = LOOK[variant] ?? LOOK.ink;
  return (
    <div className="flex h-full min-h-full w-full flex-col items-center justify-center gap-4 p-6" style={{ background: l.bg, color: l.fg }}>
      <DitherLogo text="V" label="Vitrine" scale={0.62} gridSize={120} className="!h-[min(70vh,30rem)] !min-h-0 w-full" />
      <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: l.muted }}>
        Vitrine · move to disturb, click to ripple
      </p>
    </div>
  );
}
