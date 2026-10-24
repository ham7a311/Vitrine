"use client";

import { InverseSweep } from "./InverseSweep";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const theme = paper ? "paper" : "night";
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-16 sm:px-14 ${paper ? "bg-[#f3f0e9] text-[#151417]" : "bg-[#0f0f11] text-[#efece6]"}`}>
      <div className="mx-auto w-full max-w-4xl">
        <p className={`mb-6 font-mono text-[11px] uppercase tracking-[0.18em] ${paper ? "text-black/45" : "text-white/40"}`}>Vitrine · Manifesto</p>
        <h2 className="m-0 font-[family-name:Geist] text-[clamp(2.6rem,8vw,6rem)] font-bold leading-[1.08] tracking-[-0.05em]">
          Write <InverseSweep theme={theme} delay={250}>less.</InverseSweep>
          <br />
          Ship <InverseSweep theme={theme} delay={900}>more.</InverseSweep>
          <br />
          Sleep <InverseSweep theme={theme} delay={1550}>better.</InverseSweep>
        </h2>
        <p className={`mt-9 max-w-[42ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed ${paper ? "text-black/60" : "text-white/55"}`}>
          A planning tool that asks for one sentence a day and turns the rest into a plan you can keep.
        </p>
      </div>
    </div>
  );
}
