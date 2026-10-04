"use client";

import { useState } from "react";
import { DetentKnob } from "./DetentKnob";

export default function Demo({ variant = "studio" }: { variant?: string }) {
  const bakelite = variant === "bakelite";
  const [v, setV] = useState(62);
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 px-4 py-12" style={{ background: bakelite ? "#cdbf9f" : "#0b0b0d" }}>
      <p className={`font-mono text-[11px] uppercase tracking-[0.18em] ${bakelite ? "text-black/50" : "text-white/40"}`}>Monitor out · Studio B</p>
      <DetentKnob label="Volume" defaultValue={62} onChange={setV} theme={bakelite ? "bakelite" : "studio"} />
      <p className={`text-[13px] ${bakelite ? "text-black/55" : "text-white/45"}`} aria-live="polite">{v === 0 ? "Muted" : v > 85 ? "Loud — mind your ears" : `Playing at ${v}%`}</p>
    </div>
  );
}
