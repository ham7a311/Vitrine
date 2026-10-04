"use client";

import { useState } from "react";
import { FireflySync } from "./FireflySync";

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  const [r, setR] = useState(0);
  const theme = variant === "midnight" ? "midnight" : "dusk";
  return (
    <FireflySync theme={theme} onSync={setR} className="h-full min-h-full w-full">
      <div className="pointer-events-none flex h-full flex-col justify-between p-6 text-white">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">Wadi Bani Khalid · 19:40</p>
          <h2 className="mt-3 max-w-[14ch] text-[clamp(1.8rem,4.6vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Some evenings are worth staying out for.</h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45 tabular-nums" aria-live="off">
          In step · {Math.round(r * 100)}%
        </p>
      </div>
    </FireflySync>
  );
}
