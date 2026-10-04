"use client";

import { LetterpressButton } from "./LetterpressButton";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const ink = variant === "ink";
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-6 p-10" style={{ background: ink ? "#0b080d" : "#1a1319" }}>
      <LetterpressButton tone={ink ? "ink" : "paper"}>Reserve a copy</LetterpressButton>
      <LetterpressButton tone={ink ? "ink" : "paper"}>Subscribe</LetterpressButton>
    </div>
  );
}
