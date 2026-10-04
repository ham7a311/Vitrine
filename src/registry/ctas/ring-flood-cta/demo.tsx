"use client";

import { RingFloodCta } from "./RingFloodCta";

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <RingFloodCta
        theme={variant === "paper" ? "paper" : "night"}
        eyebrow="Vitrine · for teams of 5 to 500"
        headline="Ship the release notes before the release."
        sub="Vitrine drafts them from your merged work, routes them for review and posts them the moment you deploy. Your Monday stand-up gets shorter."
        action="Start a 14-day trial"
        secondary={{ label: "Talk to sales", href: "#" }}
        note="No card needed · Cancel from settings"
      />
    </div>
  );
}
