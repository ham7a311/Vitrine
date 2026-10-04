"use client";

import { useState } from "react";
import { SwellButton } from "./SwellButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const [n, setN] = useState(0);
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <div className="flex flex-col items-center gap-5 text-center">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Daymaniyat Islands · half-day trip</p>
        <SwellButton theme={paper ? "paper" : "night"} onClick={() => setN((v) => v + 1)}>Book the boat trip</SwellButton>
        <p className={`text-[0.8125rem] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`} aria-live="polite">{n ? `Held ${n} ${n === 1 ? "seat" : "seats"} for Friday, 7:30am` : "Fridays from Al Mouj Marina · OMR 38"}</p>
      </div>
    </div>
  );
}
