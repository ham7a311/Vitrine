"use client";

import { useMemo } from "react";
import { BrushZoomChart, type Day, type Pin } from "./BrushZoomChart";

function makeData() {
  let s = 13;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const start = new Date(2024, 9, 1);
  const pins: Pin[] = [
    { date: new Date(2025, 1, 10), label: "App launch" },
    { date: new Date(2025, 4, 22), label: "TV spot" },
    { date: new Date(2025, 5, 21), label: "Khareef opens" },
    { date: new Date(2026, 2, 20), label: "Eid holiday" },
  ];
  const bumps = pins.map((p) => Math.round((+p.date - +start) / 86400000));
  const days: Day[] = [];
  for (let i = 0; i < 730; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const doy = (date.getMonth() * 30.4 + date.getDate()) / 365;
    const season = 1 + 0.32 * Math.cos((doy - 0.04) * Math.PI * 2) + 0.4 * Math.exp(-Math.pow((doy - 0.55) / 0.06, 2));
    const week = [1.2, 0.85, 0.88, 0.92, 1.12, 1.32, 1.26][date.getDay()];
    const growth = i < bumps[0] ? 1 : 1.35 + (i - bumps[0]) / 1100;
    let spike = 0;
    bumps.forEach((b, k) => { if (i >= b) spike += [0.6, 1.4, 0.5, 0.9][k] * Math.exp(-(i - b) / [9, 4, 18, 6][k]); });
    days.push({ date, value: 3200 * season * week * growth * (1 + spike) * (0.88 + r() * 0.24) });
  }
  return { days, pins };
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const { days, pins } = useMemo(makeData, []);
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: dark ? "#0d0d0d" : "#f9f9f7" }}>
      <BrushZoomChart days={days} pins={pins} title="Daily searches on Vitrine" theme={dark ? "dark" : "light"} />
    </div>
  );
}
