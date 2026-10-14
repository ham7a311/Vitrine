"use client";
import { FieldButton } from "./FieldButton";
import type { Field } from "./fields";

const LABELS: Record<Field, { text: string; ground: string }> = {
  smoke: { text: "Enter the storm", ground: "#0b0d14" },
  veins: { text: "Wake the network", ground: "#08060f" },
  strands: { text: "Start streaming", ground: "#05050a" },
  velvet: { text: "Reserve a table", ground: "#0c0708" },
  sash: { text: "See the light", ground: "#061412" },
  plumes: { text: "Light it up", ground: "#0b0a06" },
};

export default function Demo({ variant = "smoke" }: { variant?: string }) {
  const f = (variant in LABELS ? variant : "smoke") as Field;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 48, background: LABELS[f].ground }}>
      <FieldButton field={f}>{LABELS[f].text}</FieldButton>
    </div>
  );
}
