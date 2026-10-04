"use client";

import { useState } from "react";
import { GlassLensSwitch } from "./GlassLensSwitch";

const SPEND: Record<string, { label: string; amount: string; note: string }> = {
  day: { label: "Today", amount: "OMR 18.450", note: "4 payments · mostly Lulu, Talabat" },
  week: { label: "This week", amount: "OMR 96.200", note: "21 payments · 12% less than last week" },
  month: { label: "September", amount: "OMR 412.875", note: "88 payments · rent paid on the 1st" },
  year: { label: "2026 so far", amount: "OMR 3,904.600", note: "On track to save OMR 1,200" },
};

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const [p, setP] = useState("week");
  const s = SPEND[p];
  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden p-8" style={{ background: paper ? "#ece7dd" : "#0b1220" }}>
      <div
        aria-hidden="true"
        className="absolute inset-[-20%]"
        style={{
          background: paper
            ? "radial-gradient(30% 40% at 30% 40%, #f5b98f, transparent 70%), radial-gradient(28% 36% at 70% 60%, #b9cce4, transparent 70%), radial-gradient(24% 30% at 52% 26%, #c8e6c9, transparent 70%)"
            : "radial-gradient(32% 42% at 30% 45%, #3b82f6, transparent 70%), radial-gradient(30% 40% at 72% 55%, #22c55e, transparent 70%), radial-gradient(25% 30% at 50% 22%, #e879f9, transparent 70%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-6 text-center">
        <GlassLensSwitch label="Period" theme={paper ? "paper" : "night"} value={p} onChange={setP} options={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "year", label: "Year" }]} />
        <div aria-live="polite" className={paper ? "text-[#1b1a17]" : "text-white"}>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] opacity-75">{s.label} · spent</p>
          <p className="mt-2 text-[2.5rem] font-semibold tracking-[-0.04em] tabular-nums">{s.amount}</p>
          <p className="mt-1 text-[0.875rem] opacity-80">{s.note}</p>
        </div>
      </div>
    </div>
  );
}
