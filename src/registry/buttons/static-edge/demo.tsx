"use client";
import { StaticEdge, type Charge } from "./StaticEdge";

const LOOKS: Record<Charge, { ground: string; text: string }> = {
  blue: { ground: "#05080f", text: "Power up" },
  violet: { ground: "#07040d", text: "Charge the coil" },
  amber: { ground: "#0b0804", text: "Flip the breaker" },
};

export default function Demo({ variant = "blue" }: { variant?: string }) {
  const c = (variant in LOOKS ? variant : "blue") as Charge;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 56, background: `radial-gradient(60% 60% at 50% 50%, #12161f, ${LOOKS[c].ground})` }}>
      <StaticEdge charge={c}>{LOOKS[c].text}</StaticEdge>
    </div>
  );
}
