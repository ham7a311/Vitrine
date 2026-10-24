"use client";

import { WashiTape } from "./WashiTape";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-16 sm:px-14 ${night ? "bg-[#161513] text-[#f2ede4]" : "bg-[#f5f0e6] text-[#1d1a17]"}`}>
      <div className="mx-auto w-full max-w-4xl">
        <p className={`mb-6 font-mono text-[11px] uppercase tracking-[0.18em] ${night ? "text-white/40" : "text-black/45"}`}>Vitrine · Journal</p>
        <h2 className="m-0 font-[family-name:Instrument_Serif] text-[clamp(2.8rem,8.4vw,6.4rem)] font-normal leading-[1.02] tracking-[-0.02em]">
          Notes from a <WashiTape theme={theme} color={night ? "#5fb89c" : "#9bd8c3"} pattern="stripes" angle={-3} seed={4} delay={300}>slow</WashiTape>
          <br />
          <WashiTape theme={theme} color={night ? "#d9799b" : "#f4b6c8"} pattern="dots" angle={2} seed={9} delay={900}>summer</WashiTape> by the sea
        </h2>
        <p className={`mt-9 max-w-[44ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed ${night ? "text-white/60" : "text-black/60"}`}>
          Tide tables, the names of birds we didn&rsquo;t know, and the bakery that sold out by nine every morning. A small book of a long month.
        </p>
      </div>
    </div>
  );
}
