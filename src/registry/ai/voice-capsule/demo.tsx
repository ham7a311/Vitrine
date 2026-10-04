"use client";

import { VoiceCapsule } from "./VoiceCapsule";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-6 p-8 ${night ? "bg-[#0f0e10]" : "bg-[#f5f1e8]"}`}>
      <VoiceCapsule theme={night ? "night" : "paper"} />
      <p className={`font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em] ${night ? "text-[#6f6a74]" : "text-[#a39b8f]"}`}>
        hold the mic · slide left to cancel · or hold space
      </p>
    </div>
  );
}
