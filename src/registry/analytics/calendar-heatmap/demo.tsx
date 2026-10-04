"use client";

import { CalendarHeatmap } from "./CalendarHeatmap";

// A seeded, plausible year: busier in winter and at weekends, quiet on Fridays, a dip in Ramadan.
function year(seed: number, y: number, growth: number) {
  let a = seed;
  const r = () => ((a = (a * 1664525 + 1013904223) >>> 0) / 4294967296);
  const days = (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)) / 86400000;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.UTC(y, 0, 1 + i));
    const dow = (d.getUTCDay() + 6) % 7, m = d.getUTCMonth();
    const season = 0.65 + 0.55 * Math.cos(((m - 0.5) / 12) * Math.PI * 2);
    const week = dow === 4 ? 0.35 : dow >= 5 ? 1.25 : 1;
    const ramadan = (y === 2025 && m === 2) || (y === 2026 && i >= 47 && i < 77) ? 0.5 : 1;
    const v = 18 * season * week * ramadan * growth * (0.55 + r() * 0.9);
    return r() < 0.03 ? 0 : Math.round(v);
  });
}

const YEARS = { "2025": year(7, 2025, 1), "2026": year(11, 2026, 1.18) };

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-4 sm:p-8 ${dark ? "bg-[#0f0f0e]" : "bg-[#f2f1ed]"}`}>
      <CalendarHeatmap years={YEARS} theme={dark ? "dark" : "light"} />
    </div>
  );
}
