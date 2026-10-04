"use client";

import { useRef } from "react";
import { RulerIndex } from "./RulerIndex";

const SECTIONS = ["Overview", "Materials", "Process", "Pricing", "Support"].map((label) => ({ id: `ri-${label.toLowerCase()}`, label }));

export default function Demo() {
  const root = useRef<HTMLDivElement>(null);
  return (
    <div ref={root} className="relative h-full overflow-y-auto bg-[#0b080d]">
      <div className="mx-auto flex max-w-2xl gap-10 px-6 py-10">
        <div className="min-w-0 flex-1 space-y-24">
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#7d7782]">0{i + 1}</p>
              <h3 className="mt-2 text-3xl text-[#efe8dc]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{s.label}</h3>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-[#a7a1ab]">
                Scroll this panel and the ruler on the right follows. Hover the ruler to reveal every label; click a tick to jump.
              </p>
              <div className="mt-6 h-28 rounded-xl border border-white/10 bg-white/[0.02]" />
            </section>
          ))}
          <div className="h-40" />
        </div>
        <div className="sticky top-10 h-fit self-start">
          <RulerIndex items={SECTIONS} scrollRoot={root} onSelect={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })} />
        </div>
      </div>
    </div>
  );
}
