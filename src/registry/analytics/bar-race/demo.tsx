"use client";

import { BarRace, type Racer } from "./BarRace";

const MONTHS = ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26", "Sep 26"];
/** Cumulative bookings: each destination has its own season. */
const R = (name: string, region: 0 | 1 | 2, base: number, peak: number, width = 2): Racer => {
  let sum = 0;
  return { name, region, values: MONTHS.map((_, m) => { sum += base * (0.4 + 1.6 * Math.exp(-Math.pow(((m - peak + 12) % 12) / width, 2)) + 0.25 * Math.exp(-Math.pow(((m - peak - 12) % 12) / width, 2))); return Math.round(sum); }) };
};
const RACERS: Racer[] = [
  R("Salalah", 0, 1180, 9.8, 1.2), // Khareef: quiet all year, then it takes the lead
  R("Jabal Akhdar", 0, 780, 3, 2.4),
  R("Wahiba Sands", 0, 640, 2, 2),
  R("Musandam", 0, 420, 4, 2),
  R("Dubai", 1, 820, 2.5, 3),
  R("AlUla", 1, 300, 3.5, 1.6),
  R("Doha", 1, 380, 2, 2.5),
  R("Istanbul", 2, 450, 7, 2.2),
  R("Georgia", 2, 360, 8, 1.6),
  R("Zanzibar", 2, 330, 5.5, 2),
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: dark ? "#0d0d0d" : "#f9f9f7" }}>
      <BarRace racers={RACERS} months={MONTHS} regions={["Oman", "Gulf", "Further afield"]} title="Bookings so far this year, by destination" theme={dark ? "dark" : "light"} />
    </div>
  );
}
