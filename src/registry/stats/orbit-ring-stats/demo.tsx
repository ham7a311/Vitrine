"use client";

import { OrbitRingStats } from "./OrbitRingStats";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${paper ? "bg-[#f3f1ec] text-[#1b1a17]" : "bg-[#0b0a0d] text-[#efe8dc]"}`}>
      <div className="w-full max-w-4xl">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Majlis Coworking · Q3 2026</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">A full house, most days</h2>
        <OrbitRingStats
          className="mt-10"
          theme={paper ? "paper" : "night"}
          label="Q3 figures"
          rings={[
            { label: "Desks in use", value: 78, unit: "%", note: "+6 pts on Q2", orbit: "Desk utilisation · goal 75%" },
            { label: "Renewals", value: 88, unit: "%", note: "212 of 241 members", orbit: "Members renewing · goal 85%" },
            { label: "Event seats", value: 64, unit: "%", note: "Thursday talks", orbit: "Event attendance · goal 70%" },
            { label: "Solved in 1 h", value: 93, unit: "%", note: "Median 18 min", orbit: "Support tickets · goal 90%" },
          ]}
        />
      </div>
    </div>
  );
}
