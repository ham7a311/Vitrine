"use client";

import { StratumButton } from "./StratumButton";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-8 bg-[#0b080d] p-10">
      <StratumButton>Open the archive</StratumButton>
      <StratumButton spread={14}>Stack it up</StratumButton>
    </div>
  );
}
