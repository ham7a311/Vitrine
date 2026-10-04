"use client";

import { TidelineCta } from "./TidelineCta";

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <TidelineCta
        theme={variant === "paper" ? "paper" : "night"}
        eyebrow="Muscat Design Week · 14 – 16 Feb"
        headline="The hall is filling up."
        sub="Three days of talks and workshops at the Royal Opera House. Members get early entry and a seat on the front rows."
        details={["Royal Opera House Muscat", "OMR 35 · members OMR 20", "Talks in Arabic & English"]}
        taken={0.73}
        action="Reserve a seat"
      />
    </div>
  );
}
