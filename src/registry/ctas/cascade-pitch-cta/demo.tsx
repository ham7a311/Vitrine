"use client";

import { CascadePitchCta, type Pitch } from "./CascadePitchCta";

const PITCHES: Pitch[] = [
  { id: "designer", role: "designer", headline: "Hand off designs that build themselves right.", sub: "Specs, tokens and redlines stay attached to the frame, so nobody has to ask twice what you meant.", action: "Try Vitrine for design" },
  { id: "founder", role: "founder", headline: "See every release before your customers do.", sub: "One page for what shipped, what's next and who's blocked, ready for Monday's board update.", action: "Start a team trial" },
  { id: "engineer", role: "engineer", headline: "Ship from the spec, not from a screenshot.", sub: "Vitrine turns frames into typed components and tickets, linked both ways to your repository.", action: "Connect GitHub" },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <CascadePitchCta theme={variant === "paper" ? "paper" : "night"} eyebrow="Vitrine · the workspace for product teams" pitches={PITCHES} defaultPitch="designer" />
    </div>
  );
}
