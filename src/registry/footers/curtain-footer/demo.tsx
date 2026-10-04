"use client";

import { useRef } from "react";
import { CurtainFooter } from "./CurtainFooter";

export default function Demo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="h-full w-full overflow-y-auto bg-[#16130f]" style={{ height: "100%" }}>
      <CurtainFooter
        scrollRef={scroller}
        wordmark="Hamza"
        columns={[
          { title: "Work", links: ["Masar", "Wally", "OCS", "TransOcean"] },
          { title: "Site", links: ["About", "Writing", "Vitrine", "Contact"] },
          { title: "Elsewhere", links: ["GitHub", "LinkedIn", "Read.cv"] },
        ]}
      >
        <section className="px-8 pb-24 pt-16 text-[#efe8dc]">
          <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#6f6a64]">Scroll to the end</p>
          <h2 className="mt-3 max-w-[16ch] font-[family-name:Instrument_Serif] text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02] tracking-[-0.02em]">The page is a sheet. The footer is what's underneath.</h2>
          {Array.from({ length: 5 }, (_, i) => (
            <p key={i} className="mt-6 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[#a8a59c]">
              Selected work, notes and experiments. Every project here was designed and built end to end — from the first sketch to the last
              accessibility pass. Keep scrolling: at the bottom the page lifts away.
            </p>
          ))}
        </section>
      </CurtainFooter>
    </div>
  );
}
