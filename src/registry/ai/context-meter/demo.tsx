"use client";

import { ContextMeter } from "./ContextMeter";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-6 ${night ? "bg-[#0b0a0e]" : "bg-[#efede8]"}`}>
      <ContextMeter theme={night ? "night" : "paper"} />
    </div>
  );
}
