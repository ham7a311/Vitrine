"use client";

import { TickerRingCta } from "./TickerRingCta";

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <TickerRingCta
        theme={variant === "paper" ? "paper" : "night"}
        eyebrow="Majlis Design School · Product design"
        headline="Learn product design in twelve evenings."
        sub="Small groups, real briefs from Muscat companies, and a portfolio piece you can show by the end of February."
        action="Apply for January"
        secondary={{ label: "Read the syllabus", href: "#" }}
        ticker={["Next intake 12 Jan", "18 of 24 seats left", "Muscat & online", "Applications close 20 Dec", "OMR 290 · instalments"]}
      />
    </div>
  );
}
