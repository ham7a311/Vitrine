"use client";

import { RippleRimCard } from "./RippleRimCard";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-start justify-center px-4 pb-10 pt-[12vh] sm:px-10 ${paper ? "bg-[#f3f1ec] text-[#1b1a17]" : "bg-[#0b0a0d] text-[#efe8dc]"}`}>
      <div className="w-full max-w-[34rem]">
        <p className={`mb-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Bait Al Noor · Lease renewal · Step 2 of 3</p>
        <h2 className="mb-1.5 text-[1.5rem] font-semibold tracking-[-0.02em]">Upload your signed lease</h2>
        <p className={`mb-6 text-[0.9375rem] leading-relaxed ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Sign every page, then scan it or take clear photos. We&rsquo;ll confirm by WhatsApp within a working day.</p>
        <RippleRimCard theme={paper ? "paper" : "night"} title="Drop the signed lease here" hint="PDF or photo, up to 10 MB" accept=".pdf,.jpg,.jpeg,.png,.heic" multiple />
      </div>
    </div>
  );
}
