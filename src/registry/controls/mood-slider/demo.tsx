"use client";

import { MoodSlider } from "./MoodSlider";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-12" style={{ background: night ? "#0a0a0c" : "#ece7dc" }}>
      <MoodSlider theme={night ? "night" : "paper"} />
    </div>
  );
}
