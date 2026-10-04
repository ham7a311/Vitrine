"use client";

import { ThenNowStats } from "./ThenNowStats";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-8">
      <ThenNowStats
        stats={[
          { label: "Weekly active teams", then: 1840, now: 2612, period: "vs. the same week last quarter" },
          { label: "p95 build time", then: 94, now: 41, unit: "s", period: "after the cache rewrite", better: "down" },
          { label: "Error rate", then: 0.42, now: 0.61, unit: "%", period: "since Tuesday's release", better: "down", decimals: 2 },
          { label: "NPS", then: 38, now: 57, period: "Q2 → Q3 survey" },
        ]}
      />
    </div>
  );
}
