"use client";

import { GradientBloomButton } from "./GradientBloomButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <div className="flex flex-col items-center gap-5 text-center">
        <p className={`text-[1.125rem] font-semibold tracking-[-0.01em] ${paper ? "text-[#1b1a17]" : "text-[#efe8dc]"}`}>Your workspace is ready.</p>
        <GradientBloomButton theme={paper ? "paper" : "night"}>Open Vitrine</GradientBloomButton>
        <p className={`text-[0.8125rem] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>We&rsquo;ve imported 214 issues from Linear.</p>
      </div>
    </div>
  );
}
