"use client";

import { MarginNotes, Note, type MarginComment } from "./MarginNote";

const NOTES: MarginComment[] = [
  { id: "a", author: "Maya", time: "10:24", body: "Can we name the study? “Research shows” will get questioned." },
  { id: "b", author: "Tomás", time: "11:02", body: "Love this line. Maybe make it the pull quote?" },
  { id: "c", author: "Ife", time: "11:40", body: "Worth adding that this only held for teams under twelve." },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center px-5 py-14 sm:px-12 ${night ? "bg-[#111113]" : "bg-[#f4f1ea]"}`}>
      <div className="mx-auto w-full max-w-5xl">
        <p className={`mb-5 font-mono text-[11px] uppercase tracking-[0.18em] ${night ? "text-white/40" : "text-black/45"}`}>Draft · Why small teams ship</p>
        <MarginNotes notes={NOTES} theme={night ? "night" : "paper"} className="font-[family-name:Newsreader] text-[clamp(1.05rem,1.7vw,1.2rem)] leading-[1.75]">
          <h2 className="m-0 mb-5 text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.02em]">Fewer people, fewer meetings, more finished work.</h2>
          <p className="m-0 mb-5">
            Every new person on a team adds conversations, not just hands. <Note id="a">Research shows that coordination grows faster than headcount</Note>, so a team of
            fifteen spends far more of its week agreeing than a team of five.
          </p>
          <p className="m-0">
            The small teams we spoke to had one thing in common: <Note id="b">they decided once, wrote it down, and stopped deciding</Note>. Reviews were short because
            the standards were clear, and <Note id="c">releases went out weekly without anyone asking for permission</Note>.
          </p>
        </MarginNotes>
      </div>
    </div>
  );
}
