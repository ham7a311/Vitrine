"use client";

import { SoftBodyButton } from "./SoftBodyButton";

const TONES = { tangerine: "bg-[#fff3ea]", mint: "bg-[#0d1512]", ink: "bg-[#efeee9]" } as const;

export default function Demo({ variant = "tangerine" }: { variant?: string }) {
  const tone = (variant in TONES ? variant : "tangerine") as keyof typeof TONES;
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-9 p-8 ${TONES[tone]}`}>
      <SoftBodyButton tone={tone} style={{ minHeight: 72, padding: "0 48px", fontSize: "1.1875rem" }}>Press and hold me</SoftBodyButton>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <SoftBodyButton tone={tone}>Add to bag</SoftBodyButton>
        <SoftBodyButton tone={tone} softness={1.8}>Extra soft</SoftBodyButton>
      </div>
    </div>
  );
}
