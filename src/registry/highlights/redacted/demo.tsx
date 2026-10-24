"use client";

import { useState } from "react";
import { Redacted } from "./Redacted";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  const [all, setAll] = useState(false);
  let n = 0;
  // A plain function, not a component, so every bar keeps its identity (and its transition) across renders.
  const r = (words: string) => <Redacted theme={theme} revealed={all} order={n++}>{words}</Redacted>;
  return (
    <div className={`flex min-h-full w-full items-center px-6 py-14 sm:px-14 ${night ? "bg-[#121214] text-[#e7e3db]" : "bg-[#f3efe6] text-[#1b1a18]"}`}>
      <article className={`mx-auto w-full max-w-[42rem] rounded-sm border p-6 font-[family-name:IBM_Plex_Mono] sm:p-10 ${night ? "border-white/10 bg-[#18181b]" : "border-black/10 bg-[#fbf9f4] shadow-[0_1px_0_rgb(0_0_0/0.04),0_12px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        <div className={`flex flex-wrap items-baseline justify-between gap-3 border-b pb-4 text-[11px] uppercase tracking-[0.16em] ${night ? "border-white/10 text-white/45" : "border-black/10 text-black/50"}`}>
          <span>Incident review · INC-2291</span>
          <span>Internal</span>
        </div>
        <h2 className="mt-6 text-[clamp(1.3rem,3.2vw,1.75rem)] font-medium leading-snug tracking-[-0.01em]">
          Checkout outage on {r("14 March")}, 41 minutes
        </h2>
        <p className={`mt-5 text-[clamp(0.9rem,1.7vw,1rem)] leading-[1.9] ${night ? "text-white/80" : "text-black/80"}`}>
          At 09:12 a configuration change to {r("the payments gateway")} was rolled out to every region at once. Requests from{" "}
          {r("two of our largest customers")} began failing within a minute. The change was reverted by {r("the on-call engineer")} at 09:53, and no orders were lost.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setAll((v) => !v)}
            aria-pressed={all}
            className={`rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors ${night ? "border-white/20 text-white/75 hover:bg-white/5" : "border-black/20 text-black/70 hover:bg-black/[0.04]"}`}
          >
            {all ? "Redact again" : "Declassify"}
          </button>
          <span className={`text-[11px] ${night ? "text-white/40" : "text-black/45"}`}>or press and hold a bar to peek</span>
        </div>
      </article>
    </div>
  );
}
