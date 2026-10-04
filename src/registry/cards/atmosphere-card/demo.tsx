"use client";

import { AtmosphereGrid, type AtmosphereItem } from "./AtmosphereCard";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ITEMS: AtmosphereItem[] = [
  {
    label: "Learn",
    description: "Short, practical sessions that start where you are and end with something you made.",
    href: "#learn",
    atmosphere: "violet",
    icon: icon("M4 6.5 12 3l8 3.5-8 3.5-8-3.5ZM6 9v5c0 1.5 2.7 3 6 3s6-1.5 6-3V9"),
  },
  {
    label: "Build",
    description: "Small teams, real briefs, and a demo at the end of every cycle.",
    href: "#build",
    atmosphere: "cyan",
    icon: icon("m14 6 4 4-8 8H6v-4l8-8ZM12 8l4 4"),
  },
  {
    label: "Connect",
    description: "Meet the people a step ahead of you, and the ones a step behind.",
    href: "#connect",
    atmosphere: "teal",
    icon: icon("M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM10.5 10.5l3 3"),
  },
];

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] p-6 sm:p-10">
      <div className="w-full max-w-4xl">
        <AtmosphereGrid items={ITEMS} />
      </div>
    </div>
  );
}
