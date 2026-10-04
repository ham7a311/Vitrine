"use client";

import { BokehCity } from "./BokehCity";

export default function Demo({ variant = "muscat" }: { variant?: string }) {
  const rain = variant === "rain";
  return (
    <BokehCity theme={rain ? "rain" : "muscat"} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col items-center justify-center p-6 text-center text-white">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">{rain ? "Ruwi · a wet Thursday" : "Qurum · Thursday night"}</p>
        <h2 className="mt-4 max-w-[14ch] text-[clamp(2rem,5.6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.035em]">The city is better after dark.</h2>
      </div>
    </BokehCity>
  );
}
