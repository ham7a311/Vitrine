"use client";

import { MeanderTimeline, type TimelineEntry } from "./MeanderTimeline";

const ENTRIES: TimelineEntry[] = [
  {
    id: "e1",
    day: "14",
    month: "Mar",
    year: "2026",
    title: "Designing for latency: an evening workshop",
    tag: "Workshop",
    description: "A hands-on session on optimistic UI, skeleton states and the psychology of waiting. Bring a laptop and a slow interface you'd like to fix.",
    meta: [
      { label: "Where", value: "Studio 4, Northstar House" },
      { label: "Seats", value: "40" },
    ],
  },
  {
    id: "e2",
    day: "02",
    month: "Feb",
    year: "2026",
    title: "Type on screens, revisited",
    tag: "Talk",
    description: "Hamza Al-Bulushi walks through variable fonts, optical sizing and the small typographic decisions that make product interfaces feel calm.",
    meta: [
      { label: "Speaker", value: "Hamza Al-Bulushi" },
      { label: "Length", value: "45 min" },
    ],
  },
  {
    id: "e3",
    day: "18",
    month: "Jan",
    year: "2026",
    title: "Open build night — ship something small",
    tag: "Build",
    description: "Three hours, one small feature, many rubber ducks. Pair up, pick a scope you can finish, and demo it before midnight.",
    meta: [{ label: "Format", value: "Pairs" }],
  },
  {
    id: "e4",
    day: "07",
    month: "Dec",
    year: "2025",
    title: "Year in review with the Halden & Co. research team",
    tag: "Panel",
    description: "A candid panel on what worked, what didn't, and which assumptions quietly fell apart during a year of user interviews.",
  },
];

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] px-5 py-10">
      <div className="w-full max-w-2xl">
        <MeanderTimeline entries={ENTRIES} expandFirst />
      </div>
    </div>
  );
}
