"use client";

import { useMemo } from "react";
import { StreamGraph, type Stream } from "./StreamGraph";

function makeData() {
  let s = 11;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const n = 52;
  const start = new Date(2025, 9, 6);
  const dates = Array.from({ length: n }, (_, j) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + j * 7));
  const shape = (base: number, f: (t: number) => number) => {
    let walk = 0;
    return Array.from({ length: n }, (_, j) => { walk = walk * 0.7 + (r() - 0.5) * 0.18; return Math.max(80, base * f(j / (n - 1)) * (1 + walk)); });
  };
  const winter = (t: number) => 1 + 0.35 * Math.cos(t * Math.PI * 2);
  const streams: Stream[] = [
    { key: "search", label: "Search", values: shape(4200, (t) => winter(t) * (1 - t * 0.12)) },
    { key: "social", label: "Social", values: shape(1700, (t) => winter(t) * (0.8 + t * 1.3)) },
    { key: "direct", label: "Direct", values: shape(2200, (t) => 0.9 + 0.2 * winter(t)) },
    { key: "referral", label: "Referral", values: shape(1100, (t) => winter(t) * (1 + 0.6 * Math.exp(-Math.pow((t - 0.45) / 0.08, 2)))) },
    { key: "email", label: "Email", values: shape(700, (t) => 0.8 + 0.4 * Math.sin(t * Math.PI * 4) ** 2) },
  ];
  return { dates, streams };
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const { dates, streams } = useMemo(makeData, []);
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: dark ? "#0d0d0d" : "#f9f9f7" }}>
      <StreamGraph streams={streams} dates={dates} theme={dark ? "dark" : "light"} />
    </div>
  );
}
