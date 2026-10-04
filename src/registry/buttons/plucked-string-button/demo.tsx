"use client";

import { PluckedStringButton } from "./PluckedStringButton";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-6 bg-[#0b080d] p-10">
      <PluckedStringButton>Listen closely</PluckedStringButton>
      <PluckedStringButton tension={16} className="min-w-[14rem]">
        Tune in to the release
      </PluckedStringButton>
    </div>
  );
}
