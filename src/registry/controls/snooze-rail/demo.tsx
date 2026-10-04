"use client";

import { SnoozeRail } from "./SnoozeRail";

// A fixed "now" keeps the suggestions stable: Wednesday 14 October 2026, 11:20 in Muscat.
const NOW = new Date("2026-10-14T11:20:00+04:00");

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-14 ${night ? "bg-[#0f1012]" : "bg-[#f3f1ec]"}`}>
      <SnoozeRail now={NOW} storageKey={`snooze-rail-demo-${variant}`} theme={night ? "night" : "paper"} />
    </div>
  );
}
