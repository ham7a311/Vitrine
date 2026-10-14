"use client";
import { BubblePack } from "./BubblePack";

const ITEMS = [
  { label: "Search", value: 41200 },
  { label: "Direct", value: 23800 },
  { label: "Newsletter", value: 15300 },
  { label: "Social", value: 9800 },
  { label: "Partners", value: 6100 },
  { label: "Podcast", value: 3900 },
  { label: "Events", value: 2200 },
  { label: "Other", value: 1400 },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "28px 16px", background: night ? "#09090c" : "#ece9e2" }}>
      <BubblePack title="Where readers came from · September" unit="visits" items={ITEMS} theme={night ? "night" : "paper"} />
    </div>
  );
}
