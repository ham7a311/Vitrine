"use client";

import { useState } from "react";
import { BellRing } from "./BellRing";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [n, setN] = useState(2);
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0e0e11] text-[#ecebf0]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className={`flex w-full max-w-sm flex-col gap-5 rounded-[20px] p-6 ${night ? "bg-[#18181d]" : "bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium">Inbox</p>
            <p className="text-[13px] opacity-55">{n ? `${n} unread` : "You're all caught up"}</p>
          </div>
          <BellRing count={n} onOpen={() => setN(0)} />
        </div>
        <button type="button" onClick={() => setN((x) => x + 1)} className={`h-10 rounded-full border text-[13px] ${night ? "border-white/15" : "border-black/12"}`}>
          Simulate a new message
        </button>
      </div>
    </div>
  );
}
