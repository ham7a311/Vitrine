"use client";
import { LineChart } from "./LineChart";

// Deterministic fictional traffic, so the server and the browser draw the same lines.
function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }
const DAYS = 90, END = Date.UTC(2026, 9, 6);
const dates = Array.from({ length: DAYS }, (_, i) => new Date(END - (DAYS - 1 - i) * 86_400_000));
function walk(seed: number, base: number, trend: number, wobble: number, weekly: number, n = DAYS) {
  const r = rng(seed);
  let v = base;
  return Array.from({ length: n }, (_, i) => {
    v = Math.max(base * 0.4, v + trend + (r() - 0.48) * wobble);
    // A gentle weekly rhythm, quietest at the weekend.
    const week = 1 - weekly * 0.5 * (1 + Math.cos((2 * Math.PI * ((i + 1) % 7)) / 7));
    return Math.round(v * week);
  });
}
const SERIES = [
  { name: "Organic", values: walk(7, 1180, 6.5, 120, 0.22) },
  { name: "Paid", values: walk(19, 640, 2.2, 90, 0.12) },
  { name: "Referral", values: walk(41, 300, 1.4, 60, 0.3) },
];
const PREVIOUS = walk(3, 1520, 4.5, 110, 0.22);

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`lnch-demo lnch-demo--${theme}`}>
      <LineChart title="Sessions by source" dates={dates} series={SERIES} previous={PREVIOUS} theme={theme} />
    </div>
  );
}
