"use client";

import { OneFieldSignIn } from "./OneFieldSignIn";

export default function Demo({ variant = "night" }: { variant?: string }) {
  if (variant === "paper")
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#f3eee4] p-8">
        <OneFieldSignIn theme="paper" accent="#c4673f" title="Sign in to Vitrine" />
      </div>
    );
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 bg-[#0b080d] p-8">
      <OneFieldSignIn />
      <p className="font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em] text-[#6f6a74]">demo · any code works except 000000</p>
    </div>
  );
}
