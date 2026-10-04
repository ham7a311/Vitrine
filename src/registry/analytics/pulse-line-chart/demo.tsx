"use client";

import { useMemo } from "react";
import { PulseLineChart, type Point } from "./PulseLineChart";

/** A year of daily bookings revenue: a seeded walk with weekly rhythm and a winter season. */
function makeData(): Point[] {
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const out: Point[] = [];
  const end = new Date(2026, 8, 30);
  for (let d = 364; d >= 0; d--) {
    const date = new Date(end.getFullYear(), end.getMonth(), end.getDate() - d);
    const doy = (date.getMonth() * 30.4 + date.getDate()) / 365;
    const season = 1 + 0.35 * Math.cos((doy - 0.05) * Math.PI * 2); // busier in the cool months
    const week = [1.25, 0.82, 0.86, 0.9, 1.05, 1.4, 1.35][date.getDay()]; // Thu–Fri weekend
    const trend = 1 + (364 - d) / 900;
    const value = 2100 * season * week * trend * (0.86 + r() * 0.28);
    const prev = 2100 * season * week * (trend - 0.11) * (0.86 + r() * 0.28); // last year: a little lower
    out.push({ date, value, prev });
  }
  return out;
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const data = useMemo(makeData, []);
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: dark ? "#0d0d0d" : "#f9f9f7" }}>
      <PulseLineChart daily={data} title="Bookings revenue" theme={dark ? "dark" : "light"} />
    </div>
  );
}
