"use client";
import { StickerSlap, type Finish } from "./StickerSlap";

const LOOKS: Record<Finish, { ground: string; face: string; label: string; text: string }> = {
  glossy: { ground: "#e9e6f2", face: "#1b1a22", label: "#f7f7f9", text: "Grab the merch" },
  holo: { ground: "#15161d", face: "#2b2d3a", label: "#f3f4fa", text: "Join the drop" },
  kraft: { ground: "#efe6d6", face: "#2f2418", label: "#f8efe0", text: "Shop the stall" },
};

export default function Demo({ variant = "glossy" }: { variant?: string }) {
  const f = (variant in LOOKS ? variant : "glossy") as Finish;
  const l = LOOKS[f];
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 56, background: l.ground }}>
      <StickerSlap finish={f} tone={{ face: l.face, label: l.label }}>{l.text}</StickerSlap>
    </div>
  );
}
