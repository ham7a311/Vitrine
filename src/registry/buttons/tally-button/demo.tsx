"use client";

import { TallyButton } from "./TallyButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const t = paper ? "paper" : "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-6 ${paper ? "bg-[#f3f1ec]" : "bg-[#0b0a0d]"}`}>
      <div className={`w-full max-w-[26rem] rounded-[20px] p-5 ${paper ? "bg-white shadow-[inset_0_0_0_1px_rgb(27_26_23/0.08)]" : "bg-[#121015] shadow-[inset_0_0_0_1px_rgb(239_232_220/0.08)]"}`}>
        <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>Recipe · 40 minutes</p>
        <p className={`mt-2 text-[1.125rem] font-semibold tracking-[-0.015em] ${paper ? "text-[#1b1a17]" : "text-[#efe8dc]"}`}>Shuwa-spiced lamb with saffron rice</p>
        <p className={`mt-1 text-[0.875rem] ${paper ? "text-[#6f6a62]" : "text-[#9c96a1]"}`}>A weeknight version of the Eid classic, from Umm Faisal&rsquo;s kitchen in Ibra.</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <TallyButton theme={t} label="Save" noun="saves" count={1299} />
          <TallyButton theme={t} label="Like" noun="likes" icon="heart" count={99} />
        </div>
      </div>
    </div>
  );
}
