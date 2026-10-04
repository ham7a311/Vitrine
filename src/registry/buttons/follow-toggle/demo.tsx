"use client";

import { FollowToggle } from "./FollowToggle";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-8">
      <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl bg-[#121015] p-4 shadow-[inset_0_0_0_1px_rgb(239_232_220/0.08)]">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#2a2233] font-[family-name:Instrument_Serif] text-xl text-[#efe8dc]">H</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9375rem] font-semibold text-[#efe8dc]">Hamza Al-Bulushi</p>
          <p className="truncate text-[0.8125rem] text-[#a7a1ab]">Software engineer · Muscat</p>
        </div>
        <FollowToggle name="Hamza" />
      </div>
    </div>
  );
}
