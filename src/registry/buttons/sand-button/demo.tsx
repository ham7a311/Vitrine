"use client";

import { useState } from "react";
import { SandButton } from "./SandButton";

export default function Demo({ variant = "gold" }: { variant?: string }) {
  const ash = variant === "ash";
  const theme = ash ? "ash" : "gold";
  const [taken, setTaken] = useState(0);
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${ash ? "bg-[#e9e4d8]" : "bg-[#0c0b08]"}`}>
      <div className="flex flex-col items-center gap-7 text-center">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${ash ? "text-[#6b655c]" : "text-[#9a927d]"}`}>Standing Waves · live in Muscat, 14 March</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <SandButton theme={theme} size="lg" onClick={() => setTaken((n) => n + 1)}>Reserve a seat</SandButton>
          <SandButton theme={theme} disabled>Sold out</SandButton>
        </div>
        <p className={`text-[0.8125rem] ${ash ? "text-[#6b655c]" : "text-[#9a927d]"}`} aria-live="polite">
          {taken ? `${taken} ${taken === 1 ? "seat" : "seats"} held for ten minutes` : "OMR 12 · doors at 19:30"}
        </p>
      </div>
    </div>
  );
}
