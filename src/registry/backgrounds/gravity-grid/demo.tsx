"use client";

import { GravityGrid } from "./GravityGrid";

export default function Demo({ variant = "frost" }: { variant?: string }) {
  const v =
    variant === "amber" ? { color: "#e8a24a", bg: "#0d0b09", ink: "#efe8dc", muted: "#a8a59c" }
    : variant === "lilac" ? { color: "#c9b8ef", bg: "#0b080d", ink: "#efe8dc", muted: "#a7a1ab" }
    : { color: "#b9cce4", bg: "#0a0c10", ink: "#eef2f7", muted: "#8b95a3" };
  return (
    <GravityGrid color={v.color} background={v.bg}>
      <div className="grid h-full min-h-[30rem] items-center gap-10 px-[8%] py-14 md:grid-cols-[1.2fr_1fr]">
        <div data-mass="1.15" className="max-w-[30rem]">
          <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em]" style={{ color: v.color }}>Release 4.0</p>
          <h1 className="mt-4 font-[family-name:Instrument_Serif] text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]" style={{ color: v.ink }}>
            Infrastructure with a sense of weight.
          </h1>
          <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed" style={{ color: v.muted }}>
            Deploy once, run everywhere. Every region, every edge, one calm dashboard.
          </p>
        </div>
        <div data-mass="0.7" className="justify-self-start rounded-[14px] border p-5 md:justify-self-end" style={{ borderColor: "rgb(255 255 255 / 0.08)", background: "rgb(255 255 255 / 0.02)" }}>
          <p className="font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em]" style={{ color: v.muted }}>p95 latency</p>
          <p className="mt-2 text-[2.2rem] font-medium tabular-nums tracking-[-0.03em]" style={{ color: v.ink }}>41 ms</p>
          <p className="mt-1 text-[0.8125rem]" style={{ color: v.muted }}>−18% since last week</p>
        </div>
      </div>
    </GravityGrid>
  );
}
