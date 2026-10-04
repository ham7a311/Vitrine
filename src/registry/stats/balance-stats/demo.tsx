"use client";

import { BalanceStats } from "./BalanceStats";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0c0c0b] text-[#efe8dc]" : "bg-[#f0ece4] text-[#1b1a17]"}`}>
      <div className="w-full max-w-2xl">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-[#5fc996]" : "text-[#137a52]"}`}>Dar Al Halwa · Nizwa souq</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Did the month pay for itself?</h2>
        <p className={`mt-2 max-w-md text-sm leading-relaxed ${night ? "text-[#9c968c]" : "text-[#6f6a62]"}`}>Takings against rent, wages, sugar and saffron for a family halwa shop.</p>
        <BalanceStats
          className="mt-8"
          theme={night ? "night" : "paper"}
          title="Takings against costs"
          months={[
            { label: "Jul", left: 6840, right: 5600 },
            { label: "Aug", left: 5920, right: 6310 },
            { label: "Sep", left: 7480, right: 6240 },
          ]}
        />
      </div>
    </div>
  );
}
