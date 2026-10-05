"use client";

import { useRef } from "react";
import { RunningHead } from "./RunningHead";

const SECTIONS = [
  {
    index: "01",
    title: "Selected work, in the order it shipped",
    lede: "Four projects I would still put my name on, each with what it cost to get right.",
    meta: "Four of twenty-one",
    rows: [["Masar", "Trip planning for Oman", "2025"], ["Wally", "A household wallet", "2024"], ["OCS", "Website and design system", "2024"], ["TransOcean", "Logistics platform", "2023"], ["Qalam", "Arabic writing tool", "2022"]],
  },
  {
    index: "02",
    title: "Notes written while building",
    lede: "Short, dated, and corrected in the open when I was wrong.",
    meta: "Nine essays",
    rows: [["Right-to-left is not a mirror", "Layout", "Mar 2026"], ["A wallet that says no", "Product", "Nov 2025"], ["Why the map is not the route", "Maps", "Jul 2025"], ["Counting seats, not builds", "Pricing", "Feb 2025"], ["Everything I got wrong in Qalam", "Retrospective", "Dec 2024"]],
  },
  {
    index: "03",
    title: "Where I have worked",
    lede: "Small teams, long projects, one city.",
    meta: "Since 2019",
    rows: [["GUtech Studio", "Lead engineer", "2023 to now"], ["GUtech Research Lab", "Research engineer", "2021 to 2023"], ["TransOcean", "Contract", "2019 to 2021"], ["Qalam", "Founder", "2020 to 2022"]],
  },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const scroller = useRef<HTMLDivElement>(null);
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  const line = night ? "border-white/[0.09]" : "border-black/[0.09]";
  return (
    <div ref={scroller} className={`h-full w-full overflow-y-auto ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`} style={{ height: "100%" }}>
      <div className="mx-auto max-w-[44rem] px-6 pb-32 pt-16">
        {SECTIONS.map((s) => (
          <section key={s.index} className="pb-24">
            <RunningHead index={s.index} title={s.title} label={s.title.split(",")[0]} lede={s.lede} meta={s.meta} scrollRef={scroller} theme={night ? "night" : "paper"} />
            <ul className={`mt-12 border-t ${line}`}>
              {s.rows.map(([a, b, c]) => (
                <li key={a} className={`flex items-baseline gap-4 border-b py-5 ${line}`}>
                  <span className="font-[family-name:Instrument_Serif] text-[1.5rem] leading-none tracking-[-0.01em]">{a}</span>
                  <span className={`hidden flex-1 text-[0.875rem] sm:block ${muted}`}>{b}</span>
                  <span className={`ml-auto font-[family-name:Geist_Mono] text-[0.75rem] tabular-nums ${muted}`}>{c}</span>
                </li>
              ))}
            </ul>
            <div className="h-48" />
          </section>
        ))}
      </div>
    </div>
  );
}
