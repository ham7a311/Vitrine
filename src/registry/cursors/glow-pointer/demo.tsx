"use client";

import { useState } from "react";
import { GlowPointer } from "./GlowPointer";

const THEMES = {
  azure: { glow: "#3b82f6", arrow: "dark" as const, page: "bg-white text-[#111113]", muted: "text-[#6b6b73]", line: "border-black/[0.08]", chip: "bg-[#f6f6f7]", btn: "bg-[#111113] text-white", ring: "focus-visible:outline-[#3b82f6]" },
  ember: { glow: "#fb923c", arrow: "light" as const, page: "bg-[#0c0b0a] text-[#f2ede6]", muted: "text-[#9a938a]", line: "border-white/[0.08]", chip: "bg-white/[0.04]", btn: "bg-[#f2ede6] text-[#0c0b0a]", ring: "focus-visible:outline-[#fb923c]" },
  violet: { glow: "#8b5cf6", arrow: "dark" as const, page: "bg-[#f5f3ee] text-[#1c1b17]", muted: "text-[#76716a]", line: "border-black/[0.08]", chip: "bg-[#ece8df]", btn: "bg-[#1c1b17] text-[#f5f3ee]", ring: "focus-visible:outline-[#8b5cf6]" },
};

const SLOTS = ["Sun 10:00", "Sun 14:30", "Mon 09:00", "Mon 16:00", "Tue 11:30"];

export default function Demo({ variant = "azure" }: { variant?: string }) {
  const t = THEMES[variant as keyof typeof THEMES] ?? THEMES.azure;
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  return (
    <GlowPointer color={t.glow} arrow={t.arrow} className={`min-h-full w-full ${t.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-5 py-14 sm:px-8">
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${t.muted}`}>Vitrine Studio · Qurum</p>
        <h2 className="mt-3 max-w-[16ch] text-[clamp(1.9rem,5vw,2.9rem)] font-semibold leading-[1.04] tracking-[-0.03em]">A quiet half hour to walk through your project.</h2>
        <p className={`mt-4 max-w-[44ch] text-[15px] leading-relaxed ${t.muted}`}>Pick a time that suits you. We’ll bring tea and the sketches; you bring the questions.</p>

        <div role="radiogroup" aria-label="Available times" className="mt-8 flex flex-wrap gap-2">
          {SLOTS.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={slot === s}
              onClick={() => { setSlot(s); setBooked(false); }}
              className={`rounded-full border px-4 py-2 font-mono text-[12.5px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${t.line} ${t.chip} ${t.ring} ${slot === s ? "!border-current" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={!slot}
            onClick={() => setBooked(true)}
            className={`h-11 rounded-xl px-5 text-[14px] font-medium transition-opacity disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 ${t.btn} ${t.ring}`}
          >
            {booked ? "Booked" : slot ? `Book ${slot}` : "Choose a time"}
          </button>
          <p className={`text-[13px] ${t.muted}`} role="status">
            {booked ? `See you ${slot}. A calendar invite is on its way.` : "Thirty minutes, free, in person or on a call."}
          </p>
        </div>
      </div>
    </GlowPointer>
  );
}
