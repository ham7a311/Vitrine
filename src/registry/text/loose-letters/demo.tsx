"use client";

import { LooseLetters } from "./LooseLetters";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className="h-full min-h-[520px] w-full" style={{ background: night ? "radial-gradient(90% 70% at 50% 20%, #1c1a17, #0b0a09)" : "radial-gradient(90% 70% at 50% 20%, #fbf6ec, #efe6d4)" }}>
      <LooseLetters text="Open late" theme={night ? "night" : "paper"} />
    </div>
  );
}
