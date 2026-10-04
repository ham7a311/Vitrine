"use client";

import { ThinkingTrace } from "./ThinkingTrace";

const STEPS = [
  { label: "Reading Q3-board-deck.pdf", ms: 1400 },
  { label: "Matching slides to churn-by-cohort.csv", ms: 1900 },
  { label: "Checking the retention numbers on slide 12", ms: 1600 },
  { label: "Drafting a summary", ms: 1300 },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-start justify-center p-8 pt-[16%] ${night ? "bg-[#0f0e10]" : "bg-[#f5f1e8]"}`}>
      <div className="w-full max-w-[34rem]">
        <ThinkingTrace steps={STEPS} theme={night ? "night" : "paper"} />
        <p className={`mt-3 pl-1 text-[0.9375rem] leading-relaxed ${night ? "text-[#6f6a74]" : "text-[#a39b8f]"}`}>Tap the line to see each step.</p>
      </div>
    </div>
  );
}
