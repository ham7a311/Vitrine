"use client";

import { SignaturePad } from "./SignaturePad";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-4 p-6 ${night ? "bg-[#0c0b08]" : "bg-[#ebe5d8]"}`}>
      <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${night ? "text-white/45" : "text-black/45"}`}>Lease renewal · Bait Al Noor · page 3 of 3</p>
      <SignaturePad theme={night ? "night" : "paper"} label="Tenant signature" />
    </div>
  );
}
