"use client";

import { BubbleTimeline, type Dest } from "./BubbleTimeline";

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
/** trips per year, with 2020's collapse for travel abroad and a lasting lift for home. */
const D = (name: string, region: 0 | 1 | 2, c: number, s: number, base: number, homeLift: number): Dest => {
  const shock = region === 0 ? 0.8 : region === 1 ? 0.35 : 0.12;
  const trips = YEARS.map((_, k) => Math.round(base * (k === 0 ? 1 : k === 1 ? shock : k === 2 ? (region === 0 ? 1.3 : shock * 2.2) : 1 + homeLift * (k - 2) * 0.25 + (region === 0 ? 0.35 : 0))));
  const cost = YEARS.map((_, k) => c * (1 + k * 0.035) * (region === 0 && k >= 2 ? 1.06 : 1));
  const score = YEARS.map((_, k) => Math.min(4.95, s + (region === 0 ? k * 0.035 : Math.sin(k) * 0.05)));
  return { name, region, cost, score, trips };
};
const DESTS: Dest[] = [
  D("Jabal Akhdar", 0, 120, 4.4, 2600, 1.1),
  D("Salalah", 0, 210, 4.2, 3100, 0.9),
  D("Wahiba", 0, 140, 4.5, 1500, 1.2),
  D("Musandam", 0, 260, 4.6, 900, 1.3),
  D("Dubai", 1, 180, 4.0, 5200, 0.4),
  D("Doha", 1, 230, 3.9, 1700, 0.3),
  D("AlUla", 1, 420, 4.7, 400, 2.2),
  D("Bahrain", 1, 150, 3.7, 1100, 0.2),
  D("Zanzibar", 2, 640, 4.5, 1300, 0.5),
  D("Istanbul", 2, 520, 4.3, 2100, 0.6),
  D("Georgia", 2, 470, 4.6, 800, 1.4),
  D("Sri Lanka", 2, 560, 4.1, 1000, 0.3),
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: dark ? "#0d0d0d" : "#f9f9f7" }}>
      <BubbleTimeline dests={DESTS} years={YEARS} regions={["Oman", "Gulf", "Further afield"]} title="Where Vitrine guests travelled" theme={dark ? "dark" : "light"} />
    </div>
  );
}
