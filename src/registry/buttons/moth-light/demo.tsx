"use client";
import { MothLight, type Night } from "./MothLight";

const LOOKS: Record<Night, { ground: string; text: string }> = {
  moths: { ground: "radial-gradient(70% 70% at 50% 50%, #1b160f, #0b0906)", text: "Leave a light on" },
  fireflies: { ground: "radial-gradient(70% 70% at 50% 60%, #0f2216, #050b07)", text: "Wander the meadow" },
};

export default function Demo({ variant = "moths" }: { variant?: string }) {
  const n = (variant in LOOKS ? variant : "moths") as Night;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 80, background: LOOKS[n].ground }}>
      <MothLight night={n}>{LOOKS[n].text}</MothLight>
    </div>
  );
}
