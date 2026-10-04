"use client";

import { useRef } from "react";
import { StepPath } from "./StepPath";

const STEPS = [
  { meta: "Minute 1", title: "Connect your repository", body: "Pick a GitHub, GitLab or Bitbucket repo. We detect the framework and set sensible build settings for you." },
  { meta: "Minute 2", title: "Preview every change", body: "Each pull request gets its own URL. Share it, comment on it, and see exactly what will ship." },
  { meta: "Minute 3", title: "Go live everywhere", body: "Merge to main and the same build rolls out to 32 regions, with instant rollback if anything looks off." },
  { meta: "Always", title: "Watch it breathe", body: "Latency, errors and traffic per route, live — and an alert only when something actually needs you." },
];

export default function Demo({ variant = "frost" }: { variant?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="h-full w-full overflow-y-auto bg-[#0b080d]" style={{ height: "100%" }}>
      <div className="px-8 pt-16">
        <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#6f6a74]">How it works · scroll</p>
        <h2 className="mt-3 max-w-[18ch] font-[family-name:Instrument_Serif] text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.02] tracking-[-0.02em] text-[#efe8dc]">From a push to production in three minutes.</h2>
      </div>
      <div className="flex justify-center px-8 pb-[60vh] pt-20">
        <StepPath steps={STEPS} scrollRef={scroller} accent={variant === "amber" ? "#e8a24a" : "#b9cce4"} />
      </div>
    </div>
  );
}
