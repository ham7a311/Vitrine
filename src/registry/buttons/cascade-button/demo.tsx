"use client";

import { CascadeButton } from "./CascadeButton";

export default function Demo({ variant = "pair" }: { variant?: string }) {
  if (variant === "frost")
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#0b0e13] p-8">
        <CascadeButton href="#" label="Start building" tone="frost" onClick={(e) => e.preventDefault()} />
      </div>
    );
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-4 bg-[#0b080d] p-8">
      <CascadeButton href="#" label="Start a project" onClick={(e) => e.preventDefault()} />
      <CascadeButton href="#" label="See the work" tone="ink" onClick={(e) => e.preventDefault()} />
    </div>
  );
}
