"use client";
import { ZenRake, type Sand } from "./ZenRake";

// gravel: a warm or cool ground with a fine scatter of grains
const GROUND: Record<Sand, string> = {
  sand: "radial-gradient(rgb(120 96 50 / 0.18) 0.6px, transparent 0.8px) 0 0 / 5px 5px, radial-gradient(rgb(255 255 255 / 0.35) 0.6px, transparent 0.8px) 2px 3px / 7px 7px, #e7dbc1",
  ash: "radial-gradient(rgb(255 255 255 / 0.07) 0.6px, transparent 0.8px) 0 0 / 5px 5px, radial-gradient(rgb(0 0 0 / 0.35) 0.6px, transparent 0.8px) 2px 3px / 7px 7px, #2b2a28",
};
const TEXT: Record<Sand, string> = { sand: "Begin a session", ash: "Breathe out" };

export default function Demo({ variant = "sand" }: { variant?: string }) {
  const s = (variant in GROUND ? variant : "sand") as Sand;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 80, background: GROUND[s] }}>
      <ZenRake sand={s}>{TEXT[s]}</ZenRake>
    </div>
  );
}
