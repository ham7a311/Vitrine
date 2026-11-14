"use client";

import { PlanPillButton } from "./PlanPillButton";

const LOOKS = ["white", "ink", "glass", "glow"] as const;

export default function Demo({ variant = "white" }: { variant?: string }) {
  const look = LOOKS.find((l) => l === variant) ?? "white";
  const light = look === "ink";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-9 p-8 ${light ? "bg-[#f4f3ef]" : "bg-black"}`} style={look === "glass" ? { background: "radial-gradient(40% 60% at 50% 40%, #1f6bff, #0a2a6e 45%, #000 80%)" } : undefined}>
      {/* At home: the foot of a pricing card. */}
      <div className={`flex w-[260px] flex-col items-center gap-5 rounded-[36px] px-7 pb-7 pt-6 ${light ? "border border-[#dddad2] bg-white" : "border border-white/25 bg-[rgb(13_13_13/0.6)] backdrop-blur-md"}`} style={look === "glow" ? { borderColor: "#8fb4ba", boxShadow: "0 0 12px rgb(122 188 200 / 0.55), inset 0 0 14px rgb(132 196 208 / 0.5)" } : undefined}>
        <p className={`m-0 self-start text-[15px] ${light ? "text-[#57534e]" : "text-white/75"}`}>Plus</p>
        <p className={`-mt-4 m-0 self-start text-[34px] tracking-[-0.02em] ${light ? "text-[#111214]" : "text-white"}`}>$11,99/m</p>
        <PlanPillButton look={look}>Choose Plan</PlanPillButton>
      </div>
      {/* The sizes. */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <PlanPillButton look={look} size="sm">Choose Plan</PlanPillButton>
        <PlanPillButton look={look}>Choose Plan</PlanPillButton>
        <PlanPillButton look={look} size="lg">Start free trial</PlanPillButton>
        <PlanPillButton look={look} disabled>Current plan</PlanPillButton>
      </div>
    </div>
  );
}
