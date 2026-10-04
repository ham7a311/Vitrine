"use client";

import { WaxLamp } from "./WaxLamp";

export default function Demo({ variant = "sunset" }: { variant?: string }) {
  const theme = (["sunset", "lagoon", "mono"].includes(variant) ? variant : "sunset") as "sunset" | "lagoon" | "mono";
  return (
    <WaxLamp theme={theme} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col justify-end p-6 text-white sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Vitrine · Slow mode</p>
        <h2 className="mt-3 max-w-[13ch] text-[clamp(2rem,5.4vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">Nothing here is in a hurry.</h2>
      </div>
    </WaxLamp>
  );
}
