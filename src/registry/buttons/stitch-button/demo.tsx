"use client";

import { useState } from "react";
import { StitchButton } from "./StitchButton";

export default function Demo({ variant = "leather" }: { variant?: string }) {
  const denim = variant === "denim";
  const [n, setN] = useState(0);
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${denim ? "bg-[#ebe8e1]" : "bg-[#efe6d8]"}`}>
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#6f6458]">{denim ? "Indigo apron · Nizwa workshop" : "Card wallet · Hand-stitched in Muttrah"}</p>
        <p className="font-[family-name:Instrument_Serif] text-[2rem] leading-none text-[#2b231c]">{denim ? "OMR 14.000" : "OMR 18.500"}</p>
        <StitchButton material={denim ? "denim" : "leather"} onClick={() => setN((x) => x + 1)}>
          {n ? `In your basket · ${n}` : "Add to basket"}
        </StitchButton>
      </div>
    </div>
  );
}
