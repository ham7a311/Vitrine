"use client";

import { WordCarousel } from "./WordCarousel";

const NIGHT = [
  { text: "your family", from: "#ff8a5b", to: "#ffd36b" },
  { text: "the whole team", from: "#6cc3ff", to: "#a98bff" },
  { text: "just two", from: "#ff6fa8", to: "#ffb199" },
  { text: "a long weekend", from: "#4fe3c8", to: "#b5ec5b" },
];
const PAPER = [
  { text: "your family", from: "#d9480f", to: "#e8890c" },
  { text: "the whole team", from: "#1d64d8", to: "#6d3fd9" },
  { text: "just two", from: "#c2185b", to: "#e8590c" },
  { text: "a long weekend", from: "#0b8a73", to: "#5c940d" },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className="flex min-h-full w-full items-center px-6 py-16 sm:px-12" style={{ background: paper ? "#f6f3ee" : "#08080a" }}>
      <div className="mx-auto w-full max-w-5xl">
        <p className={`mb-5 font-mono text-[11px] uppercase tracking-[0.18em] ${paper ? "text-black/45" : "text-white/40"}`}>Vitrine · Trip planner</p>
        <WordCarousel prefix="Plan trips for" words={paper ? PAPER : NIGHT} theme={paper ? "paper" : "night"} />
        <p className={`mt-6 max-w-[48ch] text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed ${paper ? "text-black/60" : "text-white/55"}`}>
          One itinerary, everyone on it. Bookings, maps and who’s driving — all in one place.
        </p>
      </div>
    </div>
  );
}
