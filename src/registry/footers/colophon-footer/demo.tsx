"use client";

import { useRef } from "react";
import { ColophonFooter } from "./ColophonFooter";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const scroller = useRef<HTMLDivElement>(null);
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  return (
    <div ref={scroller} className={`h-full w-full overflow-y-auto ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`} style={{ height: "100%" }}>
      <div className="mx-auto flex min-h-full max-w-[44rem] flex-col justify-between px-6 pt-16">
        <main className="pb-10">
          <p className={`font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${muted}`}>Writing · No. 09</p>
          <h1 className="mt-4 max-w-[16ch] font-[family-name:Instrument_Serif] text-[3rem] leading-[1] tracking-[-0.02em]">A wallet that knows how to say no</h1>
          <p className={`mt-5 max-w-[48ch] text-[0.9375rem] leading-relaxed ${muted}`}>
            Wally began as a spreadsheet my family kept for Ramadan groceries. Every decision in it is a refusal: no balance on the home screen, no streaks, no notification that is not about money leaving.
          </p>
          <p className={`mt-4 max-w-[48ch] text-[0.9375rem] leading-relaxed ${muted}`}>
            The rest of this essay is on the way. The colophon below is real, and the button returns you to the top.
          </p>
          <div className="h-16" />
        </main>
        <div className="pb-10">
          <ColophonFooter
            theme={night ? "night" : "paper"}
            scrollRef={scroller}
            rows={[
              { label: "Set in", value: "Instrument Serif and Geist" },
              { label: "Made in", value: "Muscat, Oman" },
              { label: "Last revised", value: <time dateTime="2026-10-14">14 October 2026</time> },
              { label: "Source", value: <a href="#source">Published under MIT</a> },
            ]}
            legal="© 2026 Hamza Al-Bulushi"
            links={[{ label: "Privacy", href: "#privacy" }, { label: "Colophon", href: "#colophon" }, { label: "Feed", href: "#feed" }]}
          />
        </div>
      </div>
    </div>
  );
}
