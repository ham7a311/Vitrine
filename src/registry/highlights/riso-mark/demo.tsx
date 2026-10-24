"use client";

import { RisoMark } from "./RisoMark";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-16 sm:px-14 ${night ? "bg-[#121014] text-[#f3eee8]" : "bg-[#f4efe4] text-[#1b1a3a]"}`}>
      <div className="mx-auto w-full max-w-4xl">
        <p className={`mb-6 font-mono text-[11px] uppercase tracking-[0.18em] ${night ? "text-white/45" : "text-[#1b1a3a]/55"}`}>Small Press Fair · No. 7</p>
        <h2 className="m-0 font-[family-name:Archivo] text-[clamp(2.6rem,8vw,6.2rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.03em] [font-stretch:110%]">
          Print it <RisoMark theme={theme} delay={300}>yourself</RisoMark>,
          <br />
          two colours <RisoMark theme={theme} delay={900}>at a time</RisoMark>
        </h2>
        <p className={`mt-9 max-w-[44ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed ${night ? "text-white/60" : "text-[#1b1a3a]/65"}`}>
          Zines, posters and badly registered postcards from forty small presses. Saturday 11–6, bring a tote bag.
        </p>
      </div>
    </div>
  );
}
