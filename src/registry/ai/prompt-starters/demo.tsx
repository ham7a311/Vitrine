"use client";

import { PromptStarters } from "./PromptStarters";

const S = [
  { icon: "✎", title: "Tighten this intro", hint: "Shorter, same meaning", prompt: "Rewrite the first paragraph of my README so it's half the length and says clearly what Vitrine is, who it's for, and why it's different — keep my voice." },
  { icon: "◎", title: "Explain a chart", hint: "Upload an image", prompt: "Here's a screenshot of our retention chart. Explain what's happening between week 3 and week 6 in plain language, and list two things I could test to improve it." },
  { icon: "⌘", title: "Review a component", hint: "Paste some code", prompt: "Review this React component for accessibility issues — keyboard support, focus states, ARIA — and suggest the smallest changes that fix them." },
  { icon: "☼", title: "Plan a weekend", hint: "Muscat, 2 days", prompt: "Plan a slow two-day weekend around Muscat in November: one morning hike, a good breakfast spot, a beach in the afternoon, and somewhere quiet for dinner." },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-6 p-8 ${night ? "bg-[#0f0e10]" : "bg-[#f5f1e8]"}`}>
      <h2 className={`font-[family-name:Instrument_Serif] text-[clamp(1.9rem,4vw,2.6rem)] leading-none tracking-[-0.02em] ${night ? "text-[#efe8dc]" : "text-[#1f1b16]"}`}>Good evening, Hamza.</h2>
      <PromptStarters starters={S} theme={night ? "night" : "paper"} />
    </div>
  );
}
