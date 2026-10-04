"use client";

import { IsotypeStats } from "./IsotypeStats";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0b0c0e] text-[#efe8dc]" : "bg-[#f1eee6] text-[#1b1a17]"}`}>
      <div className="w-full max-w-3xl">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-[#7fa9ec]" : "text-[#1f4e8c]"}`}>Mwasalat · Muscat city buses</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Who rides, route by route</h2>
        <p className={`mt-2 max-w-md text-sm leading-relaxed ${night ? "text-[#9a98a0]" : "text-[#6f6a62]"}`}>Average weekly boardings in September. Every figure is a thousand people.</p>
        <IsotypeStats
          className="mt-8"
          theme={night ? "night" : "paper"}
          title="Weekly riders by route"
          periods={["2024", "2025"]}
          unit={1000}
          noun="weekly riders"
          rows={[
            { label: "Route 1", note: "Ruwi ⇄ Airport", values: { "2024": 18400, "2025": 23700 } },
            { label: "Route 4", note: "Ruwi ⇄ Muttrah", values: { "2024": 12200, "2025": 14600 } },
            { label: "Route 9", note: "Seeb ⇄ Mabelah", values: { "2024": 7500, "2025": 10300 } },
            { label: "Route 13", note: "Qurum ⇄ Al Khoud", values: { "2024": 6800, "2025": 6200 } },
          ]}
        />
      </div>
    </div>
  );
}
