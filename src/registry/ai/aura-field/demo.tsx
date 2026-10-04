"use client";

import { AuraField } from "./AuraField";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-5 p-8 ${dark ? "bg-[#000000]" : "bg-[#f2f2f7]"}`}>
      <AuraField theme={dark ? "dark" : "light"} />
      <p className={`font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em] ${dark ? "text-[#636366]" : "text-[#8e8e93]"}`}>pick a tool · undo to compare</p>
    </div>
  );
}
