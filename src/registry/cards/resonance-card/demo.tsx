"use client";

import { useState } from "react";
import { ResonanceCard } from "./ResonanceCard";

// A fictional ambient record: each track is tuned to one frequency, and the card draws it.
const TRACKS = [
  { id: "low-tide", title: "Low Tide", value: 174, subtitle: "Standing Waves · 6:48" },
  { id: "night-bus", title: "Night Bus", value: 432, subtitle: "Standing Waves · 4:12" },
  { id: "glass-hour", title: "Glass Hour", value: 639, subtitle: "Standing Waves · 5:30" },
];

export default function Demo({ variant = "gold" }: { variant?: string }) {
  const ash = variant === "ash";
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-5 py-10 ${ash ? "bg-[#e9e4d8]" : "bg-[#0a0907]"}`}>
      <div className="grid w-full max-w-[66rem] justify-items-center gap-5 sm:grid-cols-3">
        {TRACKS.map((t) => (
          <ResonanceCard key={t.id} theme={ash ? "ash" : "gold"} title={t.title} subtitle={t.subtitle} value={t.value} playing={playing === t.id} onPlayingChange={(on) => setPlaying(on ? t.id : null)} />
        ))}
      </div>
    </div>
  );
}
