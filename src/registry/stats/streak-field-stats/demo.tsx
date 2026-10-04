"use client";

import { useMemo } from "react";
import { StreakFieldStats } from "./StreakFieldStats";

/** A repeatable year of runs: rest days, a summer slump, and a long run in spring. */
function year() {
  let s = 20260930;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 364 }, (_, i) => {
    const summer = i > 250 && i < 320; // July–August heat
    const spring = i >= 196 && i < 219; // a 23-day run
    const recent = i >= 355;
    if (spring || recent) return Math.round(4 + rnd() * 9);
    const rest = rnd() < (summer ? 0.62 : 0.34);
    return rest ? 0 : Math.round(3 + rnd() * (summer ? 5 : 11));
  });
}

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const values = useMemo(year, []);
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0b0a0d]" : "bg-[#f3f1ec]"}`}>
      <div className="w-full max-w-5xl">
        <StreakFieldStats theme={night ? "night" : "paper"} values={values} end={new Date(Date.UTC(2026, 8, 30))} unit="km" label="Vitrine Run Club · your year" />
      </div>
    </div>
  );
}
