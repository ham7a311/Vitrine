"use client";
import { LatencyHeatmap, type LatencyColumn } from "./LatencyHeatmap";
import { edges as makeEdges } from "./latency";

// A fictional day of checkout API traffic in half-hour slots: busy at lunch and in the evening,
// a slow cache tier always adding a small hump, and a database incident from 14:00 to 15:30.
const EDGES = makeEdges(4, 8000, 22);
const erf = (x: number) => { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
const cdf = (v: number, median: number, sigma: number) => 0.5 * (1 + erf((Math.log(v) - Math.log(median)) / (sigma * Math.SQRT2)));
const mass = (median: number, sigma: number) => EDGES.slice(1).map((e, i) => cdf(e, median, sigma) - cdf(EDGES[i], median, sigma));
let seed = 41;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

const COLUMNS: LatencyColumn[] = Array.from({ length: 48 }, (_, c) => {
  const hour = c / 2;
  const load = 900 + 1500 * Math.exp(-((hour - 12.5) ** 2) / 6) + 1900 * Math.exp(-((hour - 20) ** 2) / 5) + 400 * Math.sin(hour / 3.8);
  const incident = c >= 28 && c <= 31 ? [0.6, 1, 0.85, 0.45][c - 28] : 0;
  const main = mass(48 * (1 + incident * 5) * (1 + load / 9000), 0.42 + incident * 0.25);
  const cache = mass(320 * (1 + incident * 2), 0.35);
  const tail = mass(2400, 0.5);
  const share = { cache: 0.07, tail: 0.004 + incident * 0.05 };
  return {
    label: `${String(Math.floor(hour)).padStart(2, "0")}:${c % 2 ? "30" : "00"}`,
    counts: main.map((m, i) => Math.round(load * ((1 - share.cache - share.tail) * m + share.cache * cache[i] + share.tail * tail[i]) * (0.9 + rand() * 0.2))),
  };
});

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "32px 16px", background: paper ? "#f4f4f1" : "#0a0b0e" }}>
      <LatencyHeatmap title="checkout-api · response time, today" columns={COLUMNS} edges={EDGES} slo={400} theme={paper ? "paper" : "night"} />
    </div>
  );
}
