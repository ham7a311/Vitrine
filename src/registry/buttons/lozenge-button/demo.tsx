"use client";

import { LozengeButton } from "./LozengeButton";

const TONES = ["azure", "violet", "jade"] as const;

export default function Demo({ variant = "azure" }: { variant?: string }) {
  const tone = TONES.find((t) => t === variant) ?? "azure";
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-10 p-6" style={{ background: "radial-gradient(90% 80% at 100% 100%, #0b1b33, #020409 60%)" }}>
      {/* At real size: a new-project dialog, with the button in its corner, round end facing in. */}
      <div className="w-full max-w-[400px] rounded-[20px] border border-[#1f2329] bg-[#131518] p-2.5 shadow-[0_24px_48px_-24px_#000]">
        <div className="px-3.5 pb-6 pt-3.5">
          <p className="m-0 text-[11px] uppercase tracking-[0.12em] text-[#7b828c]">New project</p>
          <p className="m-0 mt-1.5 text-[18px] font-medium tracking-[-0.015em] text-[#f1f3f5]">Harbour survey, autumn</p>
          <p className="m-0 mt-1 text-[13px] leading-relaxed text-[#8b929c]">Three collaborators, private until you share it.</p>
        </div>
        <div className="flex items-center justify-between gap-3 pl-3.5">
          <button type="button" className="border-0 bg-transparent p-0 text-[14px] text-[#8b929c] underline-offset-4 hover:underline">Cancel</button>
          <LozengeButton tone={tone}>Create</LozengeButton>
        </div>
      </div>
      {/* The sizes side by side. */}
      <div className="flex items-end gap-4">
        <LozengeButton tone={tone} size="sm">Create</LozengeButton>
        <LozengeButton tone={tone}>Create</LozengeButton>
        <LozengeButton tone={tone} size="lg">Create</LozengeButton>
      </div>
    </div>
  );
}
