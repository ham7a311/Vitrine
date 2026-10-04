"use client";

import { DitherButton } from "./DitherButton";

const LOOK: Record<string, { color: string; ink: string; bg: string; fg: string }> = {
  violet: { color: "#7c5cff", ink: "#ffffff", bg: "#0d0b14", fg: "#e9e4ff" },
  mono: { color: "#f2efe9", ink: "#0b0b0c", bg: "#0b0b0c", fg: "#f2efe9" },
  signal: { color: "#ff6a1a", ink: "#0b0b0c", bg: "#0b0b0c", fg: "#ffd2b8" },
};

export default function Demo({ variant = "violet" }: { variant?: string }) {
  const l = LOOK[variant] ?? LOOK.violet;
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-5 p-10" style={{ background: l.bg, color: l.fg }}>
      <DitherButton color={l.color} inkOnFill={l.ink}>
        Start a project
      </DitherButton>
      <DitherButton color={l.color} inkOnFill={l.ink} cell={4}>
        Read the docs ↗
      </DitherButton>
    </div>
  );
}
