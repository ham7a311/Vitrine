"use client";

import { PaperPlane } from "./PaperPlane";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0e0e11] text-[#ecebf0]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className={`flex w-full max-w-sm flex-col gap-5 rounded-[20px] p-6 ${night ? "bg-[#18181d]" : "bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        <label className="block">
          <span className="text-[13px] opacity-60">Message to Hamza</span>
          <textarea rows={3} defaultValue="Dinner at 8 at Bait Al Luban? I'll book the table." className={`mt-2 w-full resize-none rounded-[12px] p-3 text-[14px] outline-none ${night ? "bg-white/[0.05]" : "bg-black/[0.04]"}`} />
        </label>
        <div className="flex justify-end">
          <PaperPlane />
        </div>
      </div>
    </div>
  );
}
