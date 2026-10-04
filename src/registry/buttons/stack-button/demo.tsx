"use client";

import { StackButton } from "./StackButton";

export default function Demo({ variant = "ember" }: { variant?: string }) {
  if (variant === "paper")
    return (
      <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 bg-[#e9e4da] p-8">
        <StackButton tone="paper" value={2} />
        <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.14em] text-[#8a8478]">Linen overshirt · €128</p>
      </div>
    );
  if (variant === "frost")
    return (
      <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 bg-[#0b0e13] p-8">
        <StackButton tone="frost" label="Save to collection" unit="saved" value={3} />
        <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.14em] text-[#6f7c8c]">Reference board · Type</p>
      </div>
    );
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 bg-[#0c0b0a] p-8">
      <StackButton value={1} />
      <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.14em] text-[#7a756c]">Stoneware cup · €24 each</p>
    </div>
  );
}
