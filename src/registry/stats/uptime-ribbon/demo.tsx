"use client";

import { UptimeRibbon, type Day } from "./UptimeRibbon";

function days(seed: number, incidents: Record<number, [number, string]>): Day[] {
  const out: Day[] = [];
  const base = new Date(2026, 8, 29);
  for (let i = 89; i >= 0; i--) {
    const d = new Date(base); d.setDate(base.getDate() - i);
    const idx = 89 - i;
    const inc = incidents[idx];
    out.push({
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      uptime: inc ? inc[0] : 99.96 + ((Math.sin(idx * seed) + 1) / 2) * 0.04,
      incident: inc?.[1],
    });
  }
  return out;
}

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b0a0c] px-8 py-16">
      <UptimeRibbon
        services={[
          { name: "API", days: days(1.3, { 23: [99.41, "Elevated latency in eu-central for 38 minutes."], 71: [98.2, "Partial outage: 2% of requests returned 503."] }) },
          { name: "Dashboard", days: days(2.1, { 55: [99.7, "Slow page loads after a CDN change."] }) },
          { name: "Builds", days: days(0.7, {}) },
        ]}
      />
    </div>
  );
}
