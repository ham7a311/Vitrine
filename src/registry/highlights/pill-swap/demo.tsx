"use client";

import { PillSwap, type PillWord } from "./PillSwap";

const PAPER: PillWord[] = [
  { text: "Jam", tint: "#ece1fb", dot: "#9a4fe6", ink: "#24123a" },
  { text: "Ship", tint: "#dcf3e4", dot: "#1f9d55", ink: "#0e3220" },
  { text: "Plan", tint: "#fdebcd", dot: "#e0860f", ink: "#3d2605" },
  { text: "Review", tint: "#dceafd", dot: "#2b78de", ink: "#0d2747" },
];
const NIGHT: PillWord[] = [
  { text: "Jam", tint: "#2b1e40", dot: "#b98cff", ink: "#f1e8ff" },
  { text: "Ship", tint: "#15301f", dot: "#45d17f", ink: "#dff8e9" },
  { text: "Plan", tint: "#3b2a10", dot: "#ffb23e", ink: "#fff1d8" },
  { text: "Review", tint: "#14263f", dot: "#5aa6ff", ink: "#e4f0ff" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center px-6 py-16 text-center ${night ? "bg-[#0d0c10] text-[#f3f1ee]" : "bg-[#fbfaf8] text-[#121114]"}`}>
      <p className={`mb-6 font-mono text-[11px] uppercase tracking-[0.18em] ${night ? "text-white/45" : "text-black/45"}`}>Vitrine · Studio</p>
      <h2 className="m-0 font-[family-name:Inter] text-[clamp(2.4rem,7.6vw,5.4rem)] font-bold leading-[1.06] tracking-[-0.045em]">
        Where teams and <br className="hidden sm:block" />agents <PillSwap words={night ? NIGHT : PAPER} theme={night ? "night" : "paper"} /> together.
      </h2>
      <p className={`mt-7 max-w-[44ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed ${night ? "text-white/60" : "text-black/60"}`}>
        One canvas for the people and the agents doing the work, with every change on the record.
      </p>
    </div>
  );
}
