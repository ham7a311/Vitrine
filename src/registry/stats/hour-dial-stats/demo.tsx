"use client";

import { HourDialStats } from "./HourDialStats";

const DAYS = {
  Weekdays: [6, 0, 0, 0, 0, 0, 0, 18, 34, 41, 30, 26, 38, 44, 31, 24, 28, 40, 62, 78, 84, 70, 46, 22],
  Weekend: [24, 8, 0, 0, 0, 0, 0, 6, 14, 30, 46, 58, 52, 40, 36, 44, 60, 82, 96, 104, 98, 86, 64, 40],
};

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0c0b0a] text-[#efe8dc]" : "bg-[#f2ede4] text-[#1b1a17]"}`}>
      <div className="grid w-full max-w-4xl items-center gap-8 md:grid-cols-[1fr_1.15fr]">
        <div>
          <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-[#f0a36a]" : "text-[#b5541f]"}`}>Qahwa House · Muttrah corniche</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">When the café fills up</h2>
          <p className={`mt-3 max-w-sm text-sm leading-relaxed ${night ? "text-[#9c968c]" : "text-[#706a60]"}`}>
            Guests through the door each hour, averaged over September. The evening rush starts when the heat breaks after sunset.
          </p>
        </div>
        <HourDialStats theme={night ? "night" : "paper"} days={DAYS} hour={19} sunrise={5.9} sunset={17.75} title="Guests by hour" />
      </div>
    </div>
  );
}
