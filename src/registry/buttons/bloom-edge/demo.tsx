"use client";
import { BloomEdge } from "./BloomEdge";
import type { Flora } from "./growth";

const LOOKS: Record<Flora, { ground: string; colors: { stem: string; a: string; b: string; c: string }; face: string; label: string; text: string }> = {
  blossom: { ground: "#fbf3f1", colors: { stem: "#6f5a4a", a: "#f29bba", b: "#8db27a", c: "#f2c94c" }, face: "#3a2430", label: "#fff3f7", text: "Plant a garden" },
  fern: { ground: "#eef2e8", colors: { stem: "#3d6b43", a: "#3d6b43", b: "#6fa36a", c: "#c8dc8a" }, face: "#1f3a26", label: "#eff7ea", text: "Go outside" },
  frost: { ground: "#0f1823", colors: { stem: "#8fc6ec", a: "#cdeaff", b: "#8fc6ec", c: "#ffffff" }, face: "#e7f4ff", label: "#0f2234", text: "Winter sale" },
};

export default function Demo({ variant = "blossom" }: { variant?: string }) {
  const f = (variant in LOOKS ? variant : "blossom") as Flora;
  const l = LOOKS[f];
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 48, background: l.ground }}>
      <BloomEdge flora={f} colors={l.colors} tone={{ face: l.face, label: l.label }}>{l.text}</BloomEdge>
    </div>
  );
}
