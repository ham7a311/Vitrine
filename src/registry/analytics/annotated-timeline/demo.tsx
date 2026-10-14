"use client";
import { AnnotatedTimeline, type TimelineEvent } from "./AnnotatedTimeline";

// Fictional: checkout conversion for an online plant shop over 60 days, with what the team shipped and broke.
const N = 60;
let seed = 9;
const r = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const VALUES = Array.from({ length: N }, (_, i) => {
  let v = 3.32 + Math.sin(i / 3.5) * 0.04 + (r() - 0.5) * 0.08;
  if (i >= 18) v += 0.22; // one-page checkout flag
  if (i >= 31 && i <= 33) v -= [0.62, 0.48, 0.2][i - 31]; // payment outage
  if (i >= 44) v += 0.12; // faster images
  return +v.toFixed(2);
});
const LABELS = Array.from({ length: N }, (_, i) => new Date(Date.UTC(2026, 7, 14 + i)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }));
const EVENTS: TimelineEvent[] = [
  { id: "d1", at: 6, kind: "deploy", title: "Address autocomplete", body: "Postcode lookup on the delivery step.", by: "Ines M." },
  { id: "f1", at: 18, kind: "flag", title: "One-page checkout on for everyone", body: "Delivery, payment and review on a single screen.", by: "Noor A.", window: 7 },
  { id: "d2", at: 22, kind: "deploy", title: "Gift-note field", body: "Optional note printed on the packing slip.", by: "Theo R." },
  { id: "i1", at: 31, kind: "incident", title: "Card payments failing for some banks", body: "A provider certificate expired; retries were routed to a backup after 2h 10m.", by: "On-call · Pip K.", window: 3 },
  { id: "d3", at: 34, kind: "deploy", title: "Payment fallback by default", body: "Second provider takes over automatically after one failure.", by: "Pip K." },
  { id: "d4", at: 44, kind: "deploy", title: "Smaller product images", body: "AVIF thumbnails; product pages 38% lighter.", by: "Saba L.", window: 7 },
  { id: "f2", at: 52, kind: "flag", title: "Pay later at 5% of traffic", body: "Instalments offered on baskets over £60.", by: "Noor A." },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "32px 16px", background: paper ? "#f4f4f1" : "#0a0b0e" }}>
      <AnnotatedTimeline title="Checkout conversion · Fernhouse" values={VALUES} labels={LABELS} events={EVENTS} format={(n) => `${n.toFixed(2)}%`} theme={paper ? "paper" : "night"} />
    </div>
  );
}
