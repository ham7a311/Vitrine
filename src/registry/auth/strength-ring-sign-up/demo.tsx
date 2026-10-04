"use client";

import { StrengthRingSignUp } from "./StrengthRingSignUp";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${night ? "bg-[#0b0a0d]" : "bg-[#f3f1ec]"}`}>
      <StrengthRingSignUp theme={night ? "night" : "paper"} product="Vitrine" />
    </div>
  );
}
