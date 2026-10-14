"use client";
import { PawTrail } from "./PawTrail";
import type { Animal } from "./gait";

const LOOKS: Record<Animal, { ground: string; ink: string; face: string; label: string; text: string }> = {
  pup: { ground: "#f3ead9", ink: "#6b4a2f", face: "#2e2219", label: "#fbf3e6", text: "Adopt a buddy" },
  cat: { ground: "#ebe8f2", ink: "#5b5470", face: "#2a2638", label: "#f4f1fb", text: "Meet the cats" },
  bird: { ground: "#e3eef1", ink: "#3c6672", face: "#173d46", label: "#eef8fa", text: "Start birding" },
};

export default function Demo({ variant = "pup" }: { variant?: string }) {
  const a = (variant in LOOKS ? variant : "pup") as Animal;
  const l = LOOKS[a];
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 48, background: l.ground }}>
      <PawTrail animal={a} ink={l.ink} tone={{ face: l.face, label: l.label }}>{l.text}</PawTrail>
    </div>
  );
}
