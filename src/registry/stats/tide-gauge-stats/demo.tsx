"use client";

import { TideGaugeStats } from "./TideGaugeStats";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0b0a0d] text-[#efe8dc]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className="w-full max-w-3xl">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-[#f0b37a]" : "text-[#a8432f]"}`}>Al Bustan Retreat · September</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">The season opened full</h2>
        <p className={`mt-2 max-w-md text-sm leading-relaxed ${night ? "text-[#9c96a1]" : "text-[#6f6a62]"}`}>Four numbers the front desk watches every morning, against the goals set in July.</p>
        <TideGaugeStats
          className="mt-10"
          theme={night ? "night" : "paper"}
          label="September figures"
          gauges={[
            { label: "Occupancy", value: 82, unit: "%", target: 75, note: "Rooms booked, 1–30 Sept" },
            { label: "Return guests", value: 41, unit: "%", target: 35, note: "Stayed with us before" },
            { label: "Guest score", value: 64, target: 60, note: "Net promoter score" },
            { label: "On-time transfers", value: 97, unit: "%", target: 95, note: "Airport pick-ups within 10 min" },
          ]}
        />
      </div>
    </div>
  );
}
