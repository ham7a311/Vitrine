"use client";

import { CooldownButton } from "./CooldownButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const box = paper ? "bg-white text-[#1b1a17] shadow-[0_0_0_1px_rgb(27_26_23/0.12)]" : "bg-[#141317] text-[#efe8dc] shadow-[inset_0_0_0_1px_rgb(239_232_220/0.12)]";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-6 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <div>
          <p className={`font-[family-name:Instrument_Serif] text-[1.75rem] leading-tight ${paper ? "text-[#1b1a17]" : "text-[#efe8dc]"}`}>Check your phone</p>
          <p className={`mt-1 text-[0.875rem] ${paper ? "text-[#6f6a62]" : "text-[#a7a1ab]"}`}>We sent a 6-digit code to +968 9••• 4412.</p>
        </div>
        <div className="flex gap-2" aria-hidden="true">
          {["4", "8", "1", "", "", ""].map((d, i) => (
            <span key={i} className={`grid h-12 w-10 place-items-center rounded-lg font-mono text-lg ${box}`}>{d}</span>
          ))}
        </div>
        <CooldownButton theme={paper ? "paper" : "night"} seconds={12} sentMessage="New code sent to +968 9••• 4412" />
      </div>
    </div>
  );
}
