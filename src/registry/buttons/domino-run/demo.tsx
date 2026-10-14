"use client";
import { DominoRun, type DominoSet } from "./DominoRun";

const LOOKS: Record<DominoSet, { ground: string; text: string }> = {
  ivory: { ground: "radial-gradient(70% 70% at 50% 50%, #2f6b4c, #1c4532)", text: "Start the game" },
  ebony: { ground: "#e9e5dc", text: "Set them up" },
  candy: { ground: "#fff3e6", text: "Chain reaction" },
};

export default function Demo({ variant = "ivory" }: { variant?: string }) {
  const s = (variant in LOOKS ? variant : "ivory") as DominoSet;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 56, background: LOOKS[s].ground }}>
      <DominoRun set={s}>{LOOKS[s].text}</DominoRun>
    </div>
  );
}
