"use client";

import { InlineDiff } from "./InlineDiff";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 bg-[#0a0a0a] p-8">
      <InlineDiff />
      <p className="font-[family-name:Geist_Mono] text-[0.625rem] uppercase tracking-[0.14em] text-[#5c5c5c]">focus the editor · ⌘↵ accept · ⌘⌫ reject</p>
    </div>
  );
}
