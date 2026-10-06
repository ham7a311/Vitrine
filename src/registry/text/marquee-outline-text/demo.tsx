"use client";
import { MarqueeOutlineText } from "./MarqueeOutlineText";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`motx-demo motx-demo--${theme}`}>
      <MarqueeOutlineText words={["Design", "Build", "Ship", "Listen", "Measure", "Repeat", "Prototype", "Iterate"]} theme={theme} />
    </div>
  );
}
