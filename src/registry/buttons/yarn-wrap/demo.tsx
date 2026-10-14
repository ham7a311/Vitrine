"use client";
import { YarnWrap, type Yarn } from "./YarnWrap";

const LOOKS: Record<Yarn, { ground: string; text: string }> = {
  wool: { ground: "#f2e8dc", text: "Join the knit club" },
  cotton: { ground: "#7d8fa8", text: "Shop the yarn" },
  neon: { ground: "#2a2440", text: "Start a project" },
};

export default function Demo({ variant = "wool" }: { variant?: string }) {
  const y = (variant in LOOKS ? variant : "wool") as Yarn;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 60, background: LOOKS[y].ground }}>
      <YarnWrap yarn={y}>{LOOKS[y].text}</YarnWrap>
    </div>
  );
}
