"use client";

import { DoubleRuleButton } from "./DoubleRuleButton";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0b130f]" : "bg-[#efeadc]"}`}>
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${night ? "text-[#8f9a8f]" : "text-[#5f6b60]"}`}>Lease · Al Khuwair, Flat 12 · 12 months</p>
        <p className={`text-[0.9375rem] leading-relaxed ${night ? "text-[#c9c2b0]" : "text-[#3f463f]"}`}>By signing, you agree to the terms above. You&rsquo;ll get a copy by email and can download it any time.</p>
        <DoubleRuleButton theme={night ? "night" : "paper"}>Sign the agreement</DoubleRuleButton>
      </div>
    </div>
  );
}
