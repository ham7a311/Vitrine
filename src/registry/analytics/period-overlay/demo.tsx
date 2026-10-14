"use client";
import { PeriodOverlay, type PeriodRange } from "./PeriodOverlay";

// Fictional daily sign-ups for a recipe app: a weekly rhythm, a gentle climb, and a push in the last fortnight.
const rand = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const DAY = 86400000, END = Date.UTC(2026, 9, 12);
const fmt = (t: number) => new Date(t).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
function day(t: number, r: () => number, boost: number) {
  const dow = new Date(t).getUTCDay(), weekend = dow === 0 || dow === 6;
  return Math.round((weekend ? 1480 : 1150) * (1 + boost) * (0.92 + r() * 0.16));
}
function range(id: string, label: string, n: number): PeriodRange {
  const r = rand(n * 7 + 3);
  const current: number[] = [], previous: number[] = [], labels: string[] = [], previousLabels: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const t = END - i * DAY, p = t - n * DAY;
    current.push(day(t, r, 0.12 + (i < 14 ? 0.1 : 0)));
    previous.push(day(p, r, 0));
    labels.push(fmt(t)); previousLabels.push(fmt(p));
  }
  return { id, label, versus: `previous ${n} days`, current, previous, labels, previousLabels };
}
const RANGES = [range("7", "7D", 7), range("30", "30D", 30), range("90", "90D", 90)];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "32px 16px", background: paper ? "#f4f4f1" : "#0a0b0e" }}>
      <PeriodOverlay title="New sign-ups · Pantry Club" ranges={RANGES} theme={paper ? "paper" : "night"} />
    </div>
  );
}
