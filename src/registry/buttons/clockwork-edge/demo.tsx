"use client";
import { ClockworkEdge, type Metal } from "./ClockworkEdge";

const LOOKS: Record<Metal, { ground: string; text: string }> = {
  brass: { ground: "radial-gradient(70% 70% at 50% 50%, #3d2a1c, #1d130c)", text: "Wind the clock" },
  steel: { ground: "#d9dde2", text: "Start the engine" },
};

export default function Demo({ variant = "brass" }: { variant?: string }) {
  const m = (variant in LOOKS ? variant : "brass") as Metal;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 60, background: LOOKS[m].ground }}>
      <ClockworkEdge metal={m}>{LOOKS[m].text}</ClockworkEdge>
    </div>
  );
}
