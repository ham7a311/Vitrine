"use client";
import { SnowCap, type Weather } from "./SnowCap";

const LOOKS: Record<Weather, { ground: string; face: string; label: string; text: string }> = {
  snow: { ground: "linear-gradient(to bottom, #b9cde6, #e6eef7)", face: "#1c2b4a", label: "#f4f8ff", text: "Book the cabin" },
  sugar: { ground: "#f3e6d4", face: "#5a3220", label: "#fff4e6", text: "Order pastries" },
};

export default function Demo({ variant = "snow" }: { variant?: string }) {
  const v = (variant in LOOKS ? variant : "snow") as Weather;
  const l = LOOKS[v];
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "96px 48px 64px", background: l.ground }}>
      <SnowCap weather={v} tone={{ face: l.face, label: l.label }}>{l.text}</SnowCap>
    </div>
  );
}
