"use client";

import { LetterformHero, type LetterformProject } from "./LetterformHero";

// Covers are plain CSS backgrounds. In a real portfolio they'd be screenshots: `url(/work/vitrine.jpg) center / cover`.
const PROJECTS: LetterformProject[] = [
  {
    title: "Vitrine",
    kind: "Deploy dashboard",
    year: "2026",
    href: "#vitrine",
    cover: "repeating-linear-gradient(0deg, rgb(255 255 255 / 0.09) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.09) 0 1px, transparent 1px 22px), radial-gradient(ellipse at 28% 38%, #8fb4ff 0, transparent 42%), radial-gradient(ellipse at 78% 70%, #3b5ed8 0, transparent 50%), linear-gradient(140deg, #0d1a3f, #24489e 60%, #0b1430)",
  },
  {
    title: "Masar",
    kind: "Route planning, Oman",
    year: "2025",
    href: "#masar",
    cover: "repeating-radial-gradient(circle at 68% 58%, transparent 0 13px, rgb(96 40 18 / 0.4) 14px 15px), radial-gradient(circle at 30% 30%, #ffe2a6 0, transparent 45%), linear-gradient(165deg, #f4c27a, #d9813f 55%, #8f3f1d)",
  },
  {
    title: "Wally",
    kind: "Wallet app",
    year: "2025",
    href: "#wally",
    cover: "radial-gradient(circle at 70% 35%, #d8ffe6 0, transparent 30%), conic-gradient(from 210deg at 62% 52%, #0c4a2e, #2fae6f, #a9ecc4, #1d7a4c, #0c4a2e)",
  },
  {
    title: "Qalam",
    kind: "Arabic writing tool",
    year: "2024",
    href: "#qalam",
    cover: "radial-gradient(ellipse at 18% 75%, #c8b9ea 0, transparent 48%), radial-gradient(ellipse at 82% 22%, #7c5cc4 0, transparent 55%), repeating-linear-gradient(118deg, rgb(255 255 255 / 0.05) 0 2px, transparent 2px 9px), #1d1430",
  },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <div className="h-full min-h-[40rem] w-full">
      <LetterformHero
        theme={variant === "paper" ? "paper" : "night"}
        word="Hamza"
        name="Hamza Al-Bulushi"
        role="Software engineer · Muscat"
        note="Open to work from January"
        projects={PROJECTS}
      />
    </div>
  );
}
