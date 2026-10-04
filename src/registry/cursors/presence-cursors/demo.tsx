"use client";

import { PresenceCursors, type Person } from "./PresenceCursors";

const PEOPLE: Person[] = [
  {
    id: "maryam",
    name: "Maryam",
    color: "#e5603b",
    script: [
      { to: { pid: "n1" }, dwell: 1400 },
      { to: { pid: "n2" }, dwell: 2600, act: "select" },
      { to: { pid: "n2", fx: 0.8, fy: 0.75 }, dwell: 900 },
      { to: { x: 0.22, y: 0.86 }, dwell: 1100, act: "deselect" },
      { to: { pid: "title", fx: 0.3, fy: 0.5 }, dwell: 1800 },
    ],
  },
  {
    id: "yousef",
    name: "Yousef",
    color: "#3e63dd",
    offset: 700,
    script: [
      { to: { pid: "n5" }, dwell: 900 },
      { to: { pid: "n5", fx: 0.5, fy: 0.3 }, dwell: 500, act: "grab" },
      { to: { pid: "col-next", fx: 0.5, fy: 0.78 }, dwell: 700, act: "drop" },
      { to: { x: 0.86, y: 0.62 }, dwell: 2200, act: "deselect" },
      { to: { pid: "n5", fx: 0.5, fy: 0.3 }, dwell: 500, act: "grab" },
      { to: { pid: "n5-home", fx: 0.5, fy: 0.3 }, dwell: 700, act: "drop" },
      { to: { pid: "n6" }, dwell: 1800, act: "deselect" },
    ],
  },
  {
    id: "aisha",
    name: "Aisha",
    color: "#2f9e6b",
    offset: 1600,
    script: [
      { to: { pid: "n3" }, dwell: 1200 },
      { to: { pid: "n4", fx: 0.6, fy: 0.55 }, dwell: 4400, act: "chat", text: "Can we move launch to the 14th?" },
      { to: { pid: "n4", fx: 0.4, fy: 0.4 }, dwell: 2200, act: "select" },
      { to: { x: 0.55, y: 0.9 }, dwell: 1400, act: "deselect" },
      { to: { pid: "n1", fx: 0.7, fy: 0.6 }, dwell: 3800, act: "chat", text: "Copy’s ready ✓" },
    ],
  },
];

const COLS = [
  { id: "col-now", title: "Now", notes: [{ id: "n1", t: "Arabic onboarding copy", s: "Aisha · due Thu", c: "#fde8a7" }, { id: "n2", t: "Fix bus ETA drift on Route 4", s: "Maryam · in review", c: "#ffd2c2" }] },
  { id: "col-next", title: "Next", notes: [{ id: "n3", t: "Ramadan timetable mode", s: "Needs data from Mwasalat", c: "#cfe3ff" }, { id: "n4", t: "Launch: Muscat Metro week", s: "Target 21 Oct", c: "#d4f0dc" }] },
  { id: "col-later", title: "Later", notes: [{ id: "n6", t: "Offline maps for Salalah", s: "Spike, 2 days", c: "#e9ddff" }] },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const c = night
    ? { page: "#131416", dot: "rgb(255 255 255 / 0.07)", ink: "text-[#eeece7]", muted: "text-[#8d8f95]", col: "bg-white/[0.03] border-white/[0.07]", note: "text-[#1d1c19]" }
    : { page: "#f6f5f1", dot: "rgb(0 0 0 / 0.09)", ink: "text-[#1d1c19]", muted: "text-[#77736b]", col: "bg-white/60 border-black/[0.06]", note: "text-[#1d1c19]" };

  return (
    <PresenceCursors
      people={PEOPLE}
      theme={night ? "night" : "paper"}
      className={`h-full min-h-[600px] w-full ${c.ink}`}
      style={{ background: c.page, backgroundImage: `radial-gradient(${c.dot} 1px, transparent 1.2px)`, backgroundSize: "18px 18px", fontFamily: "Geist, ui-sans-serif, system-ui" }}
    >
      <div className="mx-auto flex h-full min-h-[600px] w-full max-w-5xl flex-col px-5 pb-8 pt-16 sm:px-8">
        <div data-pid="title" className="relative w-fit rounded-md">
          <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${c.muted}`}>Masar · board</p>
          <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.02em]">Q4 launch plan</h2>
        </div>
        <p className={`mt-1 text-[13px] ${c.muted}`}>Three people are here with you. Press / to say something at your cursor.</p>

        <div className="mt-6 grid flex-1 gap-4 sm:grid-cols-3">
          {COLS.map((col) => (
            <section key={col.id} data-pid={col.id} className={`relative flex flex-col gap-3 rounded-2xl border p-3 ${c.col}`} aria-labelledby={`${col.id}-h`}>
              <h3 id={`${col.id}-h`} className={`px-1 font-mono text-[11px] uppercase tracking-[0.14em] ${c.muted}`}>
                {col.title}
              </h3>
              {col.notes.map((n) => (
                <article key={n.id} data-pid={n.id} className={`relative rounded-xl p-3.5 shadow-[0_1px_0_rgb(0_0_0/0.05),0_6px_14px_-10px_rgb(0_0_0/0.35)] ${c.note}`} style={{ background: n.c }}>
                  <p className="text-[14px] font-medium leading-snug">{n.t}</p>
                  <p className="mt-2 text-[11.5px] opacity-60">{n.s}</p>
                </article>
              ))}
              {col.id === "col-later" && (
                // The note moves; its home stays put, so it can be dragged back exactly.
                <div data-home="n5-home" className="relative">
                  <article data-pid="n5" className={`relative z-[1] rounded-xl p-3.5 shadow-[0_1px_0_rgb(0_0_0/0.05),0_6px_14px_-10px_rgb(0_0_0/0.35)] ${c.note}`} style={{ background: "#ffe1ef" }}>
                    <p className="text-[14px] font-medium leading-snug">Widget for the lock screen</p>
                    <p className="mt-2 text-[11.5px] opacity-60">Yousef · exploring</p>
                  </article>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </PresenceCursors>
  );
}
