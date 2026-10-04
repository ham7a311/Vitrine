"use client";

import { EyeTracker, type BallColours } from "./EyeTracker";

const LOOK: Record<string, { bg: string; ink: string; colours: BallColours }> = {
  tangerine: { bg: "#f6efe3", ink: "rgb(60 30 10 / 0.5)", colours: { ball: "#ff7a2f", shade: "#c2410c", eye: "#ffffff", pupil: "#1a1310" } },
  mint: { bg: "#0f2a22", ink: "rgb(220 255 240 / 0.5)", colours: { ball: "#6ee7b7", shade: "#0f9f6e", eye: "#ffffff", pupil: "#0b1f19" } },
  ink: { bg: "#eceae4", ink: "rgb(20 20 20 / 0.5)", colours: { ball: "#26262a", shade: "#050506", eye: "#f7f5ef", pupil: "#0a0a0b" } },
};

export default function Demo({ variant = "tangerine" }: { variant?: string }) {
  const l = LOOK[variant] ?? LOOK.tangerine;
  return (
    <div className="relative h-full min-h-full w-full" style={{ background: l.bg }}>
      <EyeTracker colours={l.colours} className="!absolute inset-0" />
      <p className="pointer-events-none absolute bottom-5 left-0 right-0 text-center font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: l.ink }}>
        Move around them · come close · circle one quickly
      </p>
    </div>
  );
}
