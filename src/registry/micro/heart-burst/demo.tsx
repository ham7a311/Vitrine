"use client";

import { HeartBurst } from "./HeartBurst";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0e0e11] text-[#ecebf0]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className={`flex w-full max-w-sm flex-col gap-5 rounded-[20px] p-6 ${night ? "bg-[#18181d]" : "bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        <p className="text-[15px] leading-relaxed">Sunset from the Muttrah corniche — the fort just catching the last of the light.</p>
        <div className="flex items-center gap-3">
          <HeartBurst count={127} />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-50">Posted 2h ago</span>
        </div>
      </div>
    </div>
  );
}
