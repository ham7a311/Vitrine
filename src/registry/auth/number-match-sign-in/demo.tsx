"use client";

import { NumberMatchSignIn } from "./NumberMatchSignIn";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${night ? "bg-[#0d0e10]" : "bg-[#ece8e0]"}`}>
      <NumberMatchSignIn theme={night ? "night" : "paper"} product="Vitrine" device="MacBook Air" place="Muscat, OM" />
    </div>
  );
}
