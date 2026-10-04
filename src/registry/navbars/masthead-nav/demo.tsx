"use client";

import { useRef } from "react";
import { MastheadNav } from "./MastheadNav";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Writing", href: "#writing" },
  { label: "Lab", href: "#lab" },
];

const WORK = [
  ["Masar", "Trip planning for Oman", "2025"],
  ["Wally", "Household wallet", "2024"],
  ["OCS", "Website & design system", "2024"],
  ["TransOcean", "Logistics platform", "2023"],
  ["Vitrine", "Component library", "2026"],
];

export default function Demo({ variant = "frost" }: { variant?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const accent = variant === "amber" ? "#e8a24a" : "#b9cce4";
  return (
    <div ref={scroller} className="h-full w-full overflow-y-auto bg-[#0b080d]" style={{ height: "100%" }}>
      <MastheadNav
        name="Hamza Al-Bulushi"
        links={LINKS}
        cta={{ label: "Contact", href: "#contact" }}
        meta={["Muscat · Software engineer", "Available for new work"]}
        scrollRef={scroller}
        accent={accent}
      />
      {/* the masthead hangs over this padding at the top */}
      <main className="px-7 pb-24 pt-[8.5rem] text-[#efe8dc]">
        <p className="max-w-[40ch] text-[1.0625rem] leading-relaxed text-[#a7a1ab]">
          I design and build calm, careful software — interfaces for travel, money and logistics, and the systems underneath them.
        </p>
        <h2 className="mt-16 font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#6f6a74]">Selected work</h2>
        <ul className="mt-4 border-t border-[rgb(239_232_220/0.08)]">
          {WORK.map(([t, d, y]) => (
            <li key={t} className="flex items-baseline justify-between gap-6 border-b border-[rgb(239_232_220/0.08)] py-5">
              <span className="font-[family-name:Instrument_Serif] text-[2rem] leading-none tracking-[-0.015em]">{t}</span>
              <span className="hidden flex-1 text-[0.9375rem] text-[#a7a1ab] sm:block">{d}</span>
              <span className="font-[family-name:Geist_Mono] text-[0.75rem] tabular-nums text-[#6f6a74]">{y}</span>
            </li>
          ))}
        </ul>
        <p className="mt-16 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[#a7a1ab]">
          Scroll back up to watch the masthead unfold again. Resize the preview to a phone width to see the menu.
        </p>
        <div className="h-[40vh]" />
      </main>
    </div>
  );
}
