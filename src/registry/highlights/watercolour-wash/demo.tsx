"use client";

import { WatercolourWash } from "./WatercolourWash";

const PIGMENTS: Record<string, { a: [string, string]; b: [string, string] }> = {
  indigo: { a: ["#3a4fb0", "#1f2a6e"], b: ["#4a7fc0", "#22406e"] },
  sienna: { a: ["#c3612b", "#7e3510"], b: ["#d0903a", "#7a4d12"] },
};

export default function Demo({ variant = "indigo" }: { variant?: string }) {
  const { a, b } = PIGMENTS[variant] ?? PIGMENTS.indigo;
  return (
    <div className="flex min-h-full w-full items-center bg-[#fbf7ee] px-6 py-16 text-[#1e1b18] sm:px-14">
      <div className="mx-auto w-full max-w-4xl">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-black/45">Vitrine · Studio classes</p>
        <h2 className="m-0 font-[family-name:Instrument_Serif] text-[clamp(2.8rem,8.6vw,6.6rem)] font-normal leading-[1.04] tracking-[-0.02em]">
          Learn to paint <WatercolourWash pigment={a[0]} edge={a[1]} seed={5} delay={300}><em>slowly</em></WatercolourWash>,
          <br />
          and <WatercolourWash pigment={b[0]} edge={b[1]} seed={11} delay={1100}><em>loosely</em></WatercolourWash>.
        </h2>
        <p className="mt-10 max-w-[44ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed text-black/60">
          Six Saturday mornings, one sheet of paper each. Bring nothing; we supply brushes, pans and very patient tea.
        </p>
      </div>
    </div>
  );
}
