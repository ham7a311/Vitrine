"use client";

import { FocusLock } from "./FocusLock";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-16 sm:px-14 ${paper ? "bg-[#f2f0eb] text-[#141416]" : "bg-[#0b0c0e] text-[#eeeee9]"}`}>
      <div className="mx-auto w-full max-w-4xl">
        <p className={`mb-6 font-mono text-[11px] uppercase tracking-[0.18em] ${paper ? "text-black/45" : "text-white/40"}`}>Vitrine · Research</p>
        <h2 className="m-0 font-[family-name:Geist] text-[clamp(2.4rem,7.2vw,5.4rem)] font-semibold leading-[1.12] tracking-[-0.045em]">
          Out of every interview, find the <FocusLock theme={paper ? "paper" : "night"} delay={400}>one thing</FocusLock> that matters.
        </h2>
        <p className={`mt-9 max-w-[44ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed ${paper ? "text-black/60" : "text-white/55"}`}>
          Recordings, notes and tickets go in. What comes out is the short list of things your users keep saying.
        </p>
      </div>
    </div>
  );
}
