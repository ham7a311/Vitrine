"use client";

import { EntryPointButton } from "./EntryPointButton";

export default function Demo({ variant = "lilac" }: { variant?: string }) {
  const tone = variant === "frost" ? "frost" : variant === "ember" ? "ember" : "lilac";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-5 p-8 ${tone === "ember" ? "bg-[#0e0a07]" : "bg-[#0b080d]"}`}>
      <EntryPointButton tone={tone}>Book a call</EntryPointButton>
      <p className="font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em] text-[#6f6a74]">enter from any side</p>
    </div>
  );
}
