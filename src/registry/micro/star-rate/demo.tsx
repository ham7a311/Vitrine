"use client";

import { StarRate } from "./StarRate";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0e0e11] text-[#ecebf0]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className={`flex w-full max-w-sm flex-col gap-5 rounded-[20px] p-6 ${night ? "bg-[#18181d]" : "bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        <div className="text-center">
          <p className="text-[15px] font-medium">How was the dhow cruise?</p>
          <p className="mb-4 text-[13px] opacity-55">Thursday 17:30 · Al Mouj marina</p>
          <StarRate label="Rate the dhow cruise" />
        </div>
      </div>
    </div>
  );
}
