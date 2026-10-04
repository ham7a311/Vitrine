"use client";

import { PulseLoader } from "./PulseLoader";

export default function Demo({ variant = "frost" }: { variant?: string }) {
  const color = variant === "lilac" ? "#c8b9ea" : variant === "amber" ? "#f3b45f" : "#b9cce4";
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-10 bg-[#0b080d] p-10">
      <PulseLoader size="lg" label="Syncing your library" color={color} />
      <PulseLoader label="Loading" color={color} />
      <PulseLoader size="sm" label="Saving" color={color} />
    </div>
  );
}
