"use client";

import { CreditTierPricing } from "./CreditTierPricing";

const ACCENTS: Record<string, string> = { violet: "#7b4dff", cyan: "#1fb6ff", ember: "#ff6a2b" };

export default function Demo({ variant = "violet" }: { variant?: string }) {
  return <CreditTierPricing accent={ACCENTS[variant] ?? ACCENTS.violet} className="min-h-full" />;
}
