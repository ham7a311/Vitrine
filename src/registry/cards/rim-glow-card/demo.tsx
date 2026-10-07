"use client";

import { ICONS, RimGlowCard } from "./RimGlowCard";
import { TONES } from "./rim";

const COPY = {
  amber: { icon: ICONS.inbox, title: "Morning Brief", text: "Everything worth knowing, read in five minutes before your coffee cools.", action: "Get the brief" },
  azure: { icon: ICONS.tools, title: "Tested Tools", text: "The apps worth paying for, tried for a month and rated honestly.", action: "Browse the list" },
  emerald: { icon: ICONS.network, title: "Field Notes", text: "Long reads from the people building the next wave of products.", action: "Read the notes" },
} as const;

export default function Demo({ variant = "amber" }: { variant?: string }) {
  const key = (variant in COPY ? variant : "amber") as keyof typeof COPY;
  const c = COPY[key];
  return (
    <div
      className="flex min-h-full w-full items-center justify-center px-4 py-16"
      style={{ background: "linear-gradient(rgb(255 255 255 / 0.025) 1px, transparent 1px) 0 0 / 56px 56px, linear-gradient(90deg, rgb(255 255 255 / 0.025) 1px, transparent 1px) 0 0 / 56px 56px, #111214" }}
    >
      <RimGlowCard tone={TONES[key]} icon={c.icon} title={c.title} action={c.action}>
        {c.text}
      </RimGlowCard>
    </div>
  );
}
