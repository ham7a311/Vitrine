"use client";

import { BookmarkFold } from "./BookmarkFold";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0e0e11] text-[#ecebf0]" : "bg-[#f3f1ec] text-[#1b1a17]"}`}>
      <div className={`flex w-full max-w-sm flex-col gap-5 rounded-[20px] p-6 ${night ? "bg-[#18181d]" : "bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-50">Guide · 6 min read</p>
            <p className="mt-2 text-[17px] font-medium leading-snug">Three days in Jabal Akhdar: terraces, roses and a very cold morning.</p>
          </div>
          <BookmarkFold label="Save this guide" />
        </div>
      </div>
    </div>
  );
}
