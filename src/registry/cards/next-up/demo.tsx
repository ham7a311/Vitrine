"use client";

import { useEffect, useMemo, useState } from "react";
import { NextUp } from "./NextUp";

const START = new Date("2026-10-14T14:00:00+04:00");
const END = new Date("2026-10-14T15:00:00+04:00");

const STEPS: { id: string; label: string; offset: number }[] = [
  { id: "far", label: "Monday", offset: -3 * 24 * 60 },
  { id: "today", label: "This morning", offset: -3 * 60 - 20 },
  { id: "soon", label: "12 min before", offset: -12 },
  { id: "live", label: "Running", offset: 21 },
  { id: "done", label: "Finished", offset: 62 },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  const [joined, setJoined] = useState("");
  const now = useMemo(() => new Date(START.getTime() + STEPS[i].offset * 60_000), [i]);

  useEffect(() => {
    if (!play) return;
    const t = window.setTimeout(() => (i < STEPS.length - 1 ? setI(i + 1) : setPlay(false)), 1900);
    return () => window.clearTimeout(t);
  }, [play, i]);

  return (
    <div className={`flex min-h-full w-full flex-col items-center justify-center gap-6 px-4 py-14 ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f3f1ec] text-[#1b1a17]"}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <NextUp theme={night ? "night" : "paper"} title="Thesis review with Dr. Salim" start={START} end={END} now={now} place="Room B214" people="3 people" onJoin={() => setJoined("Joined")} onNotes={() => setJoined("Notes opened")} />
      <div className="flex max-w-[30rem] flex-wrap justify-center gap-1.5 text-[12.5px]">
        {STEPS.map((s, n) => (
          <button key={s.id} type="button" aria-pressed={i === n} onClick={() => { setPlay(false); setI(n); }} className={`h-8 rounded-lg px-3 ring-1 ${i === n ? (night ? "bg-white/10 ring-white/20" : "bg-black/[0.06] ring-black/20") : night ? "ring-white/10 text-[#8b8d93]" : "ring-black/10 text-[#77736b]"}`}>
            {s.label}
          </button>
        ))}
        <button type="button" onClick={() => { setI(0); setPlay(true); }} className={`h-8 rounded-lg px-3 ring-1 ${night ? "ring-white/10 text-[#8b8d93]" : "ring-black/10 text-[#77736b]"}`}>
          Play through
        </button>
      </div>
      <p className={`h-4 text-[12px] ${night ? "text-[#8b8d93]" : "text-[#77736b]"}`}>{joined}</p>
    </div>
  );
}
