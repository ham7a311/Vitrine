"use client";

import { TuckBanner } from "./TuckBanner";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  return (
    <div className={`h-full w-full overflow-y-auto ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`} style={{ height: "100%" }}>
      <TuckBanner theme={night ? "night" : "paper"} label="Relay 4.2" action={{ label: "Read the notes", href: "#notes" }}>
        Rolling back a deploy now restores the database migration state too.
      </TuckBanner>
      <header className={`flex h-14 items-center gap-6 border-b px-6 text-[0.875rem] ${night ? "border-white/[0.09]" : "border-black/[0.09]"}`}>
        <span className="font-semibold tracking-[-0.01em]">Relay</span>
        <span className={muted}>Product</span>
        <span className={muted}>Pricing</span>
        <span className={muted}>Docs</span>
      </header>
      <main className="mx-auto max-w-[40rem] px-6 pb-24 pt-14">
        <p className={`font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${muted}`}>Dashboard</p>
        <h1 className="mt-3 font-[family-name:Instrument_Serif] text-[2.75rem] leading-none tracking-[-0.02em]">Good evening, Priya</h1>
        <p className={`mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed ${muted}`}>
          Tuck the banner away and it folds into the rail at the top; the tab keeps its name so you can read it again. In a real page it remembers, per announcement.
        </p>
      </main>
    </div>
  );
}
