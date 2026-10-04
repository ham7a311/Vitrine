"use client";

import { EntryPointCard } from "./EntryPointCard";

const WORK = [
  { client: "Oman Air Holidays", year: "2026", title: "Packages people can book in one sitting", summary: "We rebuilt the holiday builder around the one question travellers actually start with: when can you go?", result: { value: "+38%", label: "completed bookings in 3 months" }, tags: ["Product design", "Booking flow"] },
  { client: "Bahla Pottery", year: "2025", title: "A shop that sells the clay, not just the cup", summary: "A small catalogue where every glaze is photographed on the same cup in the same light, so choosing is easy.", result: { value: "2.4×", label: "average order value" }, tags: ["E-commerce", "Photography"] },
  { client: "Muscat Municipality", year: "2025", title: "Permits explained before they're applied for", summary: "Plain-language guides for the 40 most common permits, each ending in a checklist you can print.", result: { value: "−61%", label: "rejected applications" }, tags: ["Content design", "Public service"] },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 sm:px-10 ${night ? "bg-[#0b0a0d] text-[#efe8dc]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className="w-full max-w-[64rem]">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[1.625rem] font-semibold tracking-[-0.02em]">Selected work</h2>
          <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${night ? "text-[#9c96a1]" : "text-[#6f6a62]"}`}>Studio Qantab · 2025 – 2026</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-4">
          {WORK.map((w) => <EntryPointCard key={w.client} href="#" theme={night ? "night" : "paper"} {...w} onClick={(e) => e.preventDefault()} />)}
        </div>
      </div>
    </div>
  );
}
