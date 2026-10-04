"use client";

import { FoldawayButton } from "./FoldawayButton";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-8 bg-[#0b080d] p-10">
      <FoldawayButton reveal="Sent ✓">Send message</FoldawayButton>
      <FoldawayButton reveal="Opening…" className="!w-[14rem]">
        Open the folio
      </FoldawayButton>
    </div>
  );
}
