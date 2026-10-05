"use client";

import { useState } from "react";
import { PhraseDate } from "./PhraseDate";
import { formatField } from "./parse";

const TODAY = new Date(2026, 9, 14);

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [due, setDue] = useState<Date | null>(null);
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  return (
    <div className={`flex min-h-full w-full items-start justify-center px-6 py-12 ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`}>
      <div className="w-full max-w-[22rem]">
        <p className={`font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${muted}`}>New invoice · Masar</p>
        <h2 className="mb-8 mt-3 font-[family-name:Instrument_Serif] text-[2.25rem] leading-none tracking-[-0.02em]">When is it due?</h2>
        <PhraseDate theme={night ? "night" : "paper"} label="Due date" today={TODAY} min={TODAY} value={due} onChange={setDue} />
        <p className={`mt-6 font-[family-name:Geist_Mono] text-[0.75rem] ${muted}`} role="status">
          {due ? `Saved: ${formatField(due)}` : "Nothing saved yet. Press Enter, or leave the field."}
        </p>
        <p className={`mt-8 text-[0.8125rem] leading-relaxed ${muted}`}>Try “tomorrow”, “mon”, “next fri”, “in 3 weeks”, “12 mar” or “2026-12-01”. ArrowDown opens the grid.</p>
      </div>
    </div>
  );
}
