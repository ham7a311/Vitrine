"use client";

import { useState } from "react";
import { PullCord } from "./PullCord";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const [dark, setDark] = useState(variant === "night");
  return (
    <div className={`relative flex min-h-full w-full justify-center overflow-hidden transition-colors duration-700 ${dark ? "bg-[#0e0d10] text-[#efe8dc]" : "bg-[#f3efe6] text-[#1b1a17]"}`}>
      {/* The lamp's pool of light, only when it's on. */}
      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[70%] transition-opacity duration-700 ${dark ? "opacity-0" : "opacity-100"}`} style={{ background: "radial-gradient(50% 60% at 50% 0%, rgb(255 214 150 / 0.35), transparent 70%)" }} />
      <div className="relative grid w-full max-w-xl grid-cols-[minmax(0,1fr)_auto] gap-6 px-6 sm:px-10">
        <div className="pb-16 pt-24">
          <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${dark ? "text-[#9c96a1]" : "text-[#6f6a62]"}`}>Vitrine Handbook · Reading room</p>
          <p className="mt-3 font-[family-name:Instrument_Serif] text-[clamp(1.9rem,5vw,2.75rem)] leading-[1.02]">On-call is a rota, not a personality.</p>
          <p className={`mt-4 max-w-[38ch] text-[0.9375rem] leading-relaxed ${dark ? "text-[#a7a1ab]" : "text-[#5f5a52]"}`}>Each engineer takes one week in six. The handover is a twenty-minute call on Sunday at 9:00, Muscat time, and the pager moves only after it.</p>
        </div>
        <PullCord theme={dark ? "night" : "paper"} checked={dark} onChange={setDark} label="Lights off" length={120} />
      </div>
    </div>
  );
}
