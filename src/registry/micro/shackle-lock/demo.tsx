"use client";
import { ShackleLock } from "./ShackleLock";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const night = variant !== "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0e0d12] text-[#ecebf2]" : "bg-[#f3f1ec] text-[#1b1a17]"}`} style={{ fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui' }}>
      <div className={`flex w-full max-w-md items-center justify-between gap-4 rounded-[20px] p-5 ${night ? "bg-[#18171e]" : "bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        <div>
          <p className="text-[16px] font-semibold">Studio moodboard</p>
          <p className={`mt-1 text-[13px] ${night ? "text-[#a3a1ad]" : "text-[#5f5c55]"}`}>42 pins · shared with 3 people</p>
        </div>
        <ShackleLock name="Keep this board private" theme={night ? "night" : "paper"} />
      </div>
    </div>
  );
}
