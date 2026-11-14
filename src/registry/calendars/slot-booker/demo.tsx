"use client";

import { SlotBooker } from "./SlotBooker";

// A fixed "today", so the server and the browser agree on every date.
const TODAY = "2026-11-12T09:00:00Z";

// Dr. Lindqvist sees people in Berlin, 09:00 to 17:00, on weekdays. Some days are nearly full.
const SLOTS: string[] = [];
for (let d = 13; d <= 43; d++) {
  const day = new Date(Date.UTC(2026, 10, d));
  if (day.getUTCDay() % 6 === 0) continue;
  for (let half = 0; half < 16; half++) {
    // A steady pattern rather than chance: busier early in the week, a clear Thursday now and then.
    const taken = (d * 7 + half * 13) % (day.getUTCDay() === 4 ? 3 : 11) > 1 + (d % 4);
    if (taken === (d % 5 !== 0)) continue;
    SLOTS.push(new Date(Date.UTC(2026, 10, d, 8 + Math.floor(half / 2), (half % 2) * 30)).toISOString());
  }
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-4 sm:p-8 ${theme === "dark" ? "bg-[#09090a]" : "bg-[#f1efea]"}`}>
      <SlotBooker theme={theme} slots={SLOTS} today={TODAY} zone="Europe/London" hostZone="Europe/Berlin" host="Dr. Ingrid Lindqvist" title="First consultation" minutes={30} />
    </div>
  );
}
