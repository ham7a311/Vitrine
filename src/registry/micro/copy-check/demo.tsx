"use client";

import { CopyCheck } from "./CopyCheck";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0e0e11] text-[#ecebf0]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className={`flex w-full max-w-sm flex-col gap-5 rounded-[20px] p-6 ${night ? "bg-[#18181d]" : "bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-50">API key · test mode</p>
        <div className={`flex items-center justify-between gap-3 rounded-[12px] px-3 py-2 font-mono text-[13px] ${night ? "bg-white/[0.05]" : "bg-black/[0.04]"}`}>
          <span className="truncate">vt_test_5f8a2c19e0b7</span>
          <CopyCheck text="vt_test_5f8a2c19e0b7" />
        </div>
      </div>
    </div>
  );
}
