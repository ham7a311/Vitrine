"use client";

import { FeatureTrio } from "./FeatureTrio";

export default function Demo({ variant = "frost" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-8">
      <FeatureTrio accent={variant === "amber" ? "#e8a24a" : variant === "phosphor" ? "#8fe388" : "#b9cce4"} />
    </div>
  );
}
