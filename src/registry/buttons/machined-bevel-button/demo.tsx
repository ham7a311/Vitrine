"use client";

import { MachinedBevelButton } from "./MachinedBevelButton";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#14161a]" : "bg-[#dfe2e6]"}`}>
      <div className="flex flex-col items-center gap-4 text-center">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${night ? "text-[#8b9099]" : "text-[#5d636c]"}`}>Vitrine Field Kit · Sensor 04 · Sohar Port</p>
        <MachinedBevelButton theme={night ? "night" : "paper"} label="Connect device" doneLabel="Connected · 38 ms" />
      </div>
    </div>
  );
}
