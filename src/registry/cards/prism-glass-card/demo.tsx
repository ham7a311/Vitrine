"use client";

import { PrismGlassCard } from "./PrismGlassCard";

const LOOKS = {
  "spectrum-still": ["spectrum", "still", "none"],
  spectrum: ["spectrum", "full", "none"],
  "aurora-still": ["aurora", "still", "none"],
  aurora: ["aurora", "full", "none"],
  "solar-still": ["solar", "still", "none"],
  solar: ["solar", "full", "none"],
  "lines-still": ["spectrum", "still", "full"],
  lines: ["spectrum", "full", "full"],
} as const;

export default function Demo({ variant = "spectrum-still" }: { variant?: string }) {
  const [palette, motion, lines] = LOOKS[variant as keyof typeof LOOKS] ?? LOOKS["spectrum-still"];
  return (
    <div className="grid min-h-full w-full grid-cols-1 md:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div key={theme} className={`flex items-center justify-center px-6 py-16 ${theme === "dark" ? "bg-black" : "bg-[#ececec]"}`}>
          <PrismGlassCard theme={theme} palette={palette} motion={motion} lines={lines}>
            <p className="prismc__eyebrow">Studio · yearly</p>
            <h3 className="prismc__title">Everything, for the whole team</h3>
            <p className="prismc__text">Unlimited projects, shared libraries and version history that never expires.</p>
            <ul className="prismc__rows">
              <li><span>Seats</span><span>12 of 20</span></li>
              <li><span>Renews</span><span>3 March 2027</span></li>
              <li><span>Billed</span><span>$1,920 a year</span></li>
            </ul>
            <button type="button" className="prismc__action">Manage plan</button>
          </PrismGlassCard>
        </div>
      ))}
    </div>
  );
}
