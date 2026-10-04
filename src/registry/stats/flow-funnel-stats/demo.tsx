"use client";

import { FlowFunnelStats } from "./FlowFunnelStats";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#111110] text-[#ffffff]" : "bg-[#f1eee7] text-[#1b1a17]"}`}>
      <div className="w-full max-w-3xl">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-[#8fb8ff]" : "text-[#2a78d6]"}`}>Wahiba Sands Camps · bookings</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Where a night in the dunes is won and lost</h2>
        <p className={`mt-2 max-w-md text-sm leading-relaxed ${night ? "text-[#c3c2b7]" : "text-[#6f6a62]"}`}>Last week’s visits, followed from where they came in to a confirmed booking.</p>
        <FlowFunnelStats
          className="mt-8"
          theme={night ? "night" : "paper"}
          title="Booking funnel by source"
          stages={["Visits", "Started booking", "Chose dates", "Booked"]}
          sources={[
            { name: "Instagram", values: [4200, 620, 330, 180] },
            { name: "Search", values: [3100, 740, 520, 330] },
            { name: "Referral", values: [1300, 310, 230, 160] },
            { name: "Direct", values: [900, 260, 190, 140] },
          ]}
        />
      </div>
    </div>
  );
}
