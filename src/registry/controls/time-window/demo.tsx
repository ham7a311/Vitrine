"use client";

import { useEffect, useState } from "react";
import { TimeWindow, fmtTime, type Busy, type Range } from "./TimeWindow";

const BUSY: Busy[] = [
  { start: 9 * 60, end: 9 * 60 + 15, label: "Standup" },
  { start: 10 * 60, end: 11 * 60, label: "Design review" },
  { start: 12 * 60 + 30, end: 13 * 60 + 15, label: "Lunch" },
  { start: 16 * 60, end: 17 * 60, label: "Vitrine deploy window" },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [range, setRange] = useState<Range>({ start: 13 * 60 + 30, end: 15 * 60 });
  const [now, setNow] = useState<number | undefined>(undefined);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const t = window.setInterval(tick, 30_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className={`flex h-full min-h-[600px] w-full items-center justify-center overflow-auto px-4 py-10 ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f3f1ec] text-[#1b1a17]"}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="w-full max-w-[880px]">
        <p className={`mb-3 text-[13px] ${night ? "text-[#8b8d93]" : "text-[#77736b]"}`}>
          Book the Vitrine planning session · Thursday, 1 October · Muscat time (GST)
        </p>
        <TimeWindow theme={night ? "night" : "paper"} label="Planning session" value={range} onChange={setRange} busy={BUSY} now={now} step={15} minDuration={30} maxDuration={240} />
        <p className={`mt-3 text-[12px] ${night ? "text-[#8b8d93]" : "text-[#77736b]"}`}>
          Drag the window or its edges · click the day to move it · arrows nudge 15 min, Shift for an hour · selected {fmtTime(range.start)}–{fmtTime(range.end)}
        </p>
      </div>
    </div>
  );
}
