"use client";

import { HighlighterList, type HighlighterItem } from "./HighlighterRow";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ITEMS: HighlighterItem[] = [
  {
    title: "Field studios",
    description: "Small, hands-on sessions where a group builds one real thing from brief to demo in a single afternoon.",
    tags: ["Hands-on", "Weekly"],
    icon: icon("M4 20h16M6 16l4-10 4 10M8 12h4M17 6v10"),
  },
  {
    title: "Open critique",
    description: "Bring unfinished work and leave with three specific, kind, actionable notes from people who build for a living.",
    tags: ["Feedback", "Monthly"],
    icon: icon("M4 5h16v10H9l-5 4V5Z"),
  },
  {
    title: "Mentor hours",
    description: "Book twenty minutes with someone two steps ahead of you. No slides, no pitch — just the question you're stuck on.",
    tags: ["1:1", "On request"],
    icon: icon("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"),
  },
];

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] px-6 py-8">
      <div className="w-full max-w-3xl">
        <HighlighterList items={ITEMS} />
      </div>
    </div>
  );
}
