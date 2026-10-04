"use client";

import { RibbonOtp } from "./RibbonOtp";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 bg-[#0b080d] p-8">
      <RibbonOtp verify={(c) => c === "482913"} label="Enter the 6-digit code we sent you" />
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">Demo code: 482913 · paste works</p>
    </div>
  );
}
