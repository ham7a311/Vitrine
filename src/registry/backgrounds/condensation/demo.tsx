"use client";

import { Condensation } from "./Condensation";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const morning = variant === "morning";
  return (
    <div className="h-full min-h-[26rem] w-full">
      <Condensation scene={morning ? "morning" : "night"}>
        <div className="pointer-events-none flex h-full flex-col justify-end p-8 sm:p-12">
          <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${morning ? "text-[#3d4a3f]" : "text-[#efe8dc]/70"}`}>Wipe the glass</p>
          <p className={`mt-2 max-w-[18ch] font-[family-name:Instrument_Serif] text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] ${morning ? "text-[#1d2620]" : "text-[#efe8dc]"}`}>
            {morning ? "A slow morning, the garden through wet glass." : "Rain on the window, the city still awake."}
          </p>
        </div>
      </Condensation>
    </div>
  );
}
