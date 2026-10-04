"use client";

import { BranchSwitcher, type Version } from "./BranchSwitcher";

const V: Version[] = [
  { prompt: "Plan a day in Muscat.", answer: "Morning at the Grand Mosque (it opens at 8:00), the Mutrah souq before the heat, lunch at Bait Al Luban, then the corniche at sunset." },
  { prompt: "Plan a day in Muscat with two kids under six.", answer: "Start at the Children's Museum, picnic in Qurum Natural Park, a short dhow ride at 16:00 when it's cooler, and dinner early on the corniche." },
  { prompt: "Plan a slow, cheap day in Muscat — no car.", answer: "Bus to Mutrah, walk the corniche to the fish market, karak and samosas at a street café, the souq in the evening, and the bus back from Ruwi." },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-6 ${night ? "bg-[#0b0a0e]" : "bg-[#efede8]"}`}>
      <BranchSwitcher theme={night ? "night" : "paper"} versions={V} reply={(p) => `Here's a plan for “${p}” — I've kept the corniche at sunset, because nothing beats it.`} />
    </div>
  );
}
