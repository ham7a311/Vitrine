"use client";

import { DitherFill } from "./DitherFill";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-16 sm:px-14 ${paper ? "bg-[#eeece6] text-[#111214]" : "bg-[#070908] text-[#e8f0e9]"}`}>
      <div className="mx-auto w-full max-w-4xl">
        <p className={`mb-6 font-mono text-[11px] uppercase tracking-[0.18em] ${paper ? "text-black/45" : "text-[#7cff8a]/60"}`}>Vitrine · Studio 1987</p>
        <h2 className="m-0 font-[family-name:Geist] text-[clamp(2.5rem,7.6vw,5.8rem)] font-bold leading-[1.06] tracking-[-0.045em]">
          Software that feels <DitherFill theme={paper ? "paper" : "night"} delay={350}>handmade.</DitherFill>
        </h2>
        <p className={`mt-9 max-w-[44ch] font-[family-name:Geist_Mono] text-[clamp(0.9rem,1.4vw,1rem)] leading-relaxed ${paper ? "text-black/60" : "text-white/55"}`}>
          Small tools, drawn pixel by pixel, that load before you finish blinking and work without an account.
        </p>
      </div>
    </div>
  );
}
