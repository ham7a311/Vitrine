"use client";

import { Cyanotype } from "./Cyanotype";

export default function Demo({ variant = "sheet" }: { variant?: string }) {
  const print = variant === "print";
  return (
    <div className="h-full min-h-[26rem] w-full">
      <Cyanotype edge={print ? "print" : "sheet"}>
        <div className={`pointer-events-none flex h-full flex-col items-center justify-center px-8 text-center ${print ? "py-16" : "py-10"}`}>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#dfe8f2]/80">Oman Botanic Garden · Saturday 14 November</p>
          <p className="mt-3 max-w-[16ch] font-[family-name:Instrument_Serif] text-[clamp(2.25rem,6vw,4rem)] leading-[0.98] text-[#f4f6f2]">Sun prints from the garden, in an afternoon.</p>
        </div>
      </Cyanotype>
    </div>
  );
}
