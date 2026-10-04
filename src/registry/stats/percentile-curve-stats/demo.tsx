"use client";

import { PercentileCurveStats, type Metric } from "./PercentileCurveStats";

const METRICS: Metric[] = [
  {
    id: "commute",
    label: "Commute time",
    unit: "min",
    min: 5,
    max: 75,
    step: 1,
    you: 21,
    lowerIsBetter: true,
    people: "Muscat commuters",
    // Log-normal: most trips cluster around half an hour, with a long tail of slow ones.
    density: (x) => Math.exp(-((Math.log(x) - Math.log(30)) ** 2) / (2 * 0.42 ** 2)) / x,
  },
  {
    id: "steps",
    label: "Daily steps",
    unit: "steps",
    min: 0,
    max: 16000,
    step: 100,
    you: 9400,
    people: "Vitrine users",
    density: (x) => Math.exp(-((x - 6400) ** 2) / (2 * 2500 ** 2)) + 0.18 * Math.exp(-((x - 11500) ** 2) / (2 * 1600 ** 2)),
  },
  {
    id: "co2",
    label: "CO₂ saved",
    unit: "kg",
    min: 0,
    max: 40,
    step: 0.5,
    you: 14,
    people: "riders this month",
    // Gamma-shaped: most people save a little, a few save a lot.
    density: (x) => x * Math.exp(-x / 5.2),
  },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0b0c0e] text-[#efe8dc]" : "bg-[#f1eee7] text-[#1b1a17]"}`}>
      <div className="w-full max-w-2xl">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-[#8fb8ff]" : "text-[#2a78d6]"}`}>Vitrine · your September</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">How you compare</h2>
        <p className={`mt-2 max-w-md text-sm leading-relaxed ${night ? "text-[#9a98a0]" : "text-[#6f6a62]"}`}>Your month against everyone else who rode, walked and logged it.</p>
        <PercentileCurveStats className="mt-8" theme={night ? "night" : "paper"} metrics={METRICS} title="Your September percentiles" />
      </div>
    </div>
  );
}
