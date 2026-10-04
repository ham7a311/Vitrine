"use client";

import { RelayButton } from "./RelayButton";

export default function Demo({ variant = "deploy" }: { variant?: string }) {
  if (variant === "export")
    return (
      <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 bg-[#0b0e13] p-8">
        <RelayButton tone="frost" labels={{ idle: "Export report", working: "Exporting", done: "Saved to Downloads", error: "Couldn't export — retry" }} />
      </div>
    );
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 bg-[#0b080d] p-8">
      <RelayButton />
      <p className="font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em] text-[#6f6a74]">the first run fails on purpose</p>
    </div>
  );
}
