"use client";
import { Bunting, type BuntingStyle } from "./Bunting";

const LOOKS: Record<BuntingStyle, { ground: string; text: string }> = {
  fete: { ground: "#fff4e3", text: "Get festival tickets" },
  nautical: { ground: "#e6eef6", text: "Book a sailing" },
  mono: { ground: "#e9e7e1", text: "RSVP to the opening" },
};

export default function Demo({ variant = "fete" }: { variant?: string }) {
  const s = (variant in LOOKS ? variant : "fete") as BuntingStyle;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "100px 56px 56px", background: LOOKS[s].ground }}>
      <Bunting look={s}>{LOOKS[s].text}</Bunting>
    </div>
  );
}
