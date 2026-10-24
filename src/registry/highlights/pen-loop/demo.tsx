"use client";

import { PenLoop } from "./PenLoop";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-16 sm:px-14 ${night ? "bg-[#111214] text-[#f2efe9]" : "bg-[#f7f4ee] text-[#18171a]"}`}>
      <div className="mx-auto w-full max-w-4xl">
        <p className={`mb-6 font-mono text-[11px] uppercase tracking-[0.18em] ${night ? "text-white/40" : "text-black/45"}`}>Vitrine · Licence</p>
        <h2 className="m-0 font-[family-name:Geist] text-[clamp(2.4rem,7.4vw,5.6rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
          Pay once.
          <br />
          Keep it <PenLoop theme={night ? "night" : "paper"} note="no subscription, ever">forever.</PenLoop>
        </h2>
        <p className={`mt-24 max-w-[44ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed ${night ? "text-white/60" : "text-black/60"}`}>
          One licence covers every update to this major version, on as many machines as you use.
        </p>
      </div>
    </div>
  );
}
