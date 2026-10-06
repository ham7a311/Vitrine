"use client";

import { GlossTerm } from "./GlossTerm";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  const muted = night ? "text-[#8d8f95]" : "text-[#6b6861]";
  return (
    <div className={`h-full w-full overflow-y-auto ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f6f5f1] text-[#1b1a17]"}`} style={{ height: "100%" }}>
      <article className="mx-auto max-w-[34rem] px-6 pb-40 pt-16">
        <p className={`font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] ${muted}`}>Field Notes · No. 24</p>
        <h1 className="mt-3 font-[family-name:Instrument_Serif] text-[2.75rem] leading-[1] tracking-[-0.02em]">Rolling back without losing the data</h1>
        <div className="mt-8 space-y-5 text-[1.0625rem] leading-[1.7]">
          <p>
            Most deploy tools treat a rollback as a code problem. You ship the previous build and hope. The trouble starts when the new build ran a{" "}
            <GlossTerm theme={theme} gloss="A scripted change to the shape of a database: a new column, a renamed table. Migrations run in order and are recorded, so the database always knows which ones it has had." also="schema change" more={{ label: "How Relay tracks them", href: "#migrations" }}>migration</GlossTerm>{" "}
            on the way up, because the old code no longer fits the tables it finds.
          </p>
          <p>
            The fix is to make every step{" "}
            <GlossTerm theme={theme} gloss="Safe to run twice. Doing it again leaves the result exactly as it was after the first time, which is what you want from anything that might be retried at 3 a.m." also="repeatable">idempotent</GlossTerm>
            , and to deploy in two colours: keep the old version running beside the new one, a{" "}
            <GlossTerm theme={theme} title="Blue-green deploy" gloss="Two identical environments, one live. You release to the idle one, test it, then move traffic across. Rolling back is moving it back." also="red-black">blue–green</GlossTerm>{" "}
            release, until you trust it.
          </p>
          <p className={muted}>
            Move the pointer onto a dotted word, tab to it, or tap it. Near the edge of the screen the card slides over and its notch still points at the word.{" "}
            <span className="float-right">
              <GlossTerm theme={theme} gloss="Where the card flips above the word when there is no room below, and slides to stay inside the window.">edge case</GlossTerm>
            </span>
          </p>
        </div>
      </article>
    </div>
  );
}
