"use client";
import { FieldRim } from "./FieldRim";
import type { Field } from "./fields";

const LOOKS: Record<Field, { text: string; ground: string }> = {
  strands: { text: "Start streaming", ground: "#06060b" },
  plumes: { text: "Light the forge", ground: "#0b0907" },
  veins: { text: "Join the network", ground: "#07050d" },
  sash: { text: "Read the brief", ground: "#04100e" },
};

export default function Demo({ variant = "strands" }: { variant?: string }) {
  const f = (variant in LOOKS ? variant : "strands") as Field;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 48, background: LOOKS[f].ground }}>
      <FieldRim field={f}>{LOOKS[f].text}</FieldRim>
    </div>
  );
}
