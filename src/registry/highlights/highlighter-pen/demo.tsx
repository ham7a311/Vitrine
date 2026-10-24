"use client";

import { HighlighterPen } from "./HighlighterPen";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-16 sm:px-14 ${night ? "bg-[#131416] text-[#ecebe6]" : "bg-[#fbf8f1] text-[#1c1a17]"}`}>
      <article className="mx-auto w-full max-w-[40rem] font-[family-name:Newsreader]">
        <p className={`mb-4 font-mono text-[11px] uppercase tracking-[0.18em] ${night ? "text-white/40" : "text-black/45"}`}>Field notes · Chapter 3</p>
        <h2 className="m-0 text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.02em]">
          The <HighlighterPen theme={theme} tone="pink" delay={250}>second draft</HighlighterPen> is where it gets good.
        </h2>
        <p className={`mt-7 text-[clamp(1.075rem,1.6vw,1.3rem)] leading-[1.7] ${night ? "text-white/80" : "text-black/80"}`}>
          Nobody writes a clear page the first time. You write to find out what you think, then you go back and{" "}
          <HighlighterPen theme={theme} tone="yellow" delay={900}>cut everything that was only there to help you think</HighlighterPen>. What remains is shorter, plainer and{" "}
          <HighlighterPen theme={theme} tone="green" delay={2300}>far easier to trust</HighlighterPen>.
        </p>
      </article>
    </div>
  );
}
