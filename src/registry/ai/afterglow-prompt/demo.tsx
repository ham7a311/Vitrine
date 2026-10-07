"use client";

import { useState } from "react";
import { AfterglowPrompt } from "./AfterglowPrompt";

const GLOWS: Record<string, [string, string]> = {
  dusk: ["#7a66ff", "#f6a33f"],
  lagoon: ["#2fb8ff", "#3fe0a8"],
  ember: ["#ff4f7a", "#ffb84a"],
};

export default function Demo({ variant = "dusk" }: { variant?: string }) {
  const [sent, setSent] = useState<string | null>(null);
  const glow = GLOWS[variant] ?? GLOWS.dusk;
  return (
    <div
      className="flex min-h-full w-full flex-col items-center justify-center gap-6 px-6 py-16"
      style={{ background: `radial-gradient(60% 55% at 50% 50%, color-mix(in srgb, ${glow[0]} 16%, #090817), #070612 70%)` }}
    >
      <AfterglowPrompt glow={glow} defaultValue="Provide complex widgets to improve d" onSubmit={(v) => setSent(`Sent${v.link ? " with a link" : ""}${v.mic ? " · mic on" : ""}`)} />
      <p className="min-h-5 text-[13px] text-[#8e8aa3]" role="status">
        {sent}
      </p>
    </div>
  );
}
