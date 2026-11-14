"use client";

import { PrismGlassButton } from "./PrismGlassButton";

const LOOKS = {
  "spectrum-still": ["spectrum", "still", "full"],
  spectrum: ["spectrum", "full", "full"],
  "aurora-still": ["aurora", "still", "full"],
  aurora: ["aurora", "full", "full"],
  "solar-still": ["solar", "still", "full"],
  solar: ["solar", "full", "full"],
  "bare-still": ["spectrum", "still", "none"],
  "bare": ["spectrum", "full", "none"],
} as const;

const ARROW = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.3 4.3a1 1 0 0 1 1.4 0l7 7a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4-1.4l5.3-5.3H3a1 1 0 1 1 0-2h15.6l-5.3-5.3a1 1 0 0 1 0-1.4Z" /></svg>;
const PLUS = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a1.2 1.2 0 0 1 1.2 1.2v6.1h6.1a1.2 1.2 0 0 1 0 2.4h-6.1v6.1a1.2 1.2 0 0 1-2.4 0v-6.1H4.7a1.2 1.2 0 0 1 0-2.4h6.1V4.7A1.2 1.2 0 0 1 12 3.5Z" /></svg>;

export default function Demo({ variant = "spectrum-still" }: { variant?: string }) {
  const [palette, motion, lines] = LOOKS[variant as keyof typeof LOOKS] ?? LOOKS["spectrum-still"];
  return (
    <div className="grid min-h-full w-full grid-cols-1 sm:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div key={theme} className={`flex flex-col items-center justify-center gap-10 px-6 py-14 ${theme === "dark" ? "bg-black" : "bg-[#ececec]"}`}>
          <PrismGlassButton theme={theme} palette={palette} motion={motion} lines={lines} size={84}>Get started</PrismGlassButton>
          <div className="flex items-center gap-8">
            <PrismGlassButton theme={theme} palette={palette} motion={motion} lines={lines}>Continue {ARROW}</PrismGlassButton>
            <PrismGlassButton theme={theme} palette={palette} motion={motion} lines={lines} shape="tile" size={64} aria-label="New item">{PLUS}</PrismGlassButton>
          </div>
        </div>
      ))}
    </div>
  );
}
