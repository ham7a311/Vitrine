"use client";
import { RulerEdge, type Sheet } from "./RulerEdge";

const LOOKS: Record<Sheet, { ground: string; text: string }> = {
  blueprint: { ground: "#0f3a6e", text: "Open the spec" },
  drafting: { ground: "#f3eee2", text: "Request a quote" },
};

export default function Demo({ variant = "blueprint" }: { variant?: string }) {
  const s = (variant in LOOKS ? variant : "blueprint") as Sheet;
  const grid = s === "blueprint" ? "rgb(255 255 255 / 0.07)" : "rgb(30 40 60 / 0.07)";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 72, backgroundColor: LOOKS[s].ground, backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`, backgroundSize: "20px 20px" }}>
      <RulerEdge sheet={s}>{LOOKS[s].text}</RulerEdge>
    </div>
  );
}
