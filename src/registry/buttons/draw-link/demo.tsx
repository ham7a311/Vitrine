"use client";

import { DrawLink } from "./DrawLink";

export default function Demo({ variant = "editorial" }: { variant?: string }) {
  if (variant === "nav")
    return (
      <div className="flex min-h-full w-full items-center justify-center gap-8 bg-[#0b080d] p-8 font-[family-name:Hanken_Grotesk] text-[0.9375rem]">
        {["Work", "About", "Writing", "Contact"].map((l) => (
          <DrawLink key={l} href="#" arrow={false} onClick={(e) => e.preventDefault()}>{l}</DrawLink>
        ))}
      </div>
    );
  return (
    <div className="flex min-h-full w-full items-center bg-[#0b080d] px-[10%] py-10">
      <p className="max-w-[26ch] font-[family-name:Instrument_Serif] text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.2] tracking-[-0.015em] text-[#a7a1ab]">
        Currently building <DrawLink href="#" onClick={(e) => e.preventDefault()}>Vitrine</DrawLink>, writing about{" "}
        <DrawLink href="#" onClick={(e) => e.preventDefault()}>interface motion</DrawLink>, and studying at{" "}
        <DrawLink href="#" onClick={(e) => e.preventDefault()}>GUtech</DrawLink>.
      </p>
    </div>
  );
}
