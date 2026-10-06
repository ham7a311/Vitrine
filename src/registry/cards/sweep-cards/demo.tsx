"use client";
import { SweepCards, TONES, type SweepCard } from "./SweepCards";

const CARDS: SweepCard[] = [
  {
    title: "Why do answer engines skip your site?",
    body: "Most pages are built only for human eyes, so AI crawlers are left to guess what they mean. We find [[the quiet problems in your markup]] that make answer engines pass you by.",
    tone: TONES.sky,
  },
  {
    title: "How do you make a site easy for AI to read?",
    body: "We build a lean second copy of your site, full of [[clean structured data]] taken straight from the pages you already have, so language models can read it at a glance.",
    tone: TONES.mint,
  },
  {
    title: "How do you get named in AI answers?",
    body: "Assistants skip past layout code and go looking for [[clear, well-labelled facts]]. That is what gets Masar recommended accurately when people ask.",
    tone: TONES.butter,
  },
];

export default function Demo({ variant = "dark" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center" style={{ background: variant === "light" ? "#f4f4f2" : "#000" }}>
      <SweepCards cards={CARDS} theme={variant === "light" ? "light" : "dark"} className="w-full" />
    </div>
  );
}
