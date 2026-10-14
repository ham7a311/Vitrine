"use client";
import { MarginNotes } from "./MarginNotes";

const LOOKS = {
  pencil: { ground: "#f7f3ea", inks: ["#3d3a35"], tone: { face: "#fffdf7", label: "#22201c", edge: "#22201c" }, text: "Read the draft" },
  highlighter: { ground: "#fbfaf6", inks: ["#ffd23f", "#ff7eb6", "#5cc8ff", "#7ee081"], tone: { face: "#ffffff", label: "#1b1b1f", edge: "#1b1b1f" }, text: "Start reviewing" },
  chalk: { ground: "#22302a", inks: ["#f4f1e8", "#f7d774", "#9fd8ff"], tone: { face: "#22302a", label: "#f4f1e8", edge: "#f4f1e8" }, text: "Class is in" },
};

export default function Demo({ variant = "pencil" }: { variant?: string }) {
  const l = LOOKS[variant as keyof typeof LOOKS] ?? LOOKS.pencil;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 110, background: l.ground }}>
      <MarginNotes pen={variant as "pencil"} inks={l.inks} tone={l.tone}>{l.text}</MarginNotes>
    </div>
  );
}
