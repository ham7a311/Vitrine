"use client";
import { useEffect, useState } from "react";
import { ACTIVITIES, ActivityGlyph, type Activity, type ActivityState } from "./ActivityGlyphs";

/* One agent run: each step works for a while, then lands — the upload fails. */
const STEPS: { activity: Activity; active: string; done: string; detail: string; ms: number; fails?: string }[] = [
  { activity: "reading", active: "Reading 4 files", done: "Read 4 files", detail: "src/billing/", ms: 2000 },
  { activity: "analysing", active: "Analysing invoices", done: "Analysed 1,284 invoices", detail: "Q3", ms: 2200 },
  { activity: "writing", active: "Writing", done: "Wrote", detail: "late-fees.ts", ms: 2400 },
  { activity: "running", active: "Running tests", done: "Tests passed", detail: "42 of 42", ms: 2000 },
  { activity: "image", active: "Generating a chart", done: "Generated a chart", detail: "fees-by-month.png", ms: 2600 },
  { activity: "uploading", active: "Uploading to Drive", done: "", detail: "report.pdf", ms: 2200, fails: "Upload failed: Drive is out of space" },
];

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  const theme = light ? "light" : "dark";
  const [at, setAt] = useState(0);
  const [run, setRun] = useState(0);
  const over = at >= STEPS.length;

  useEffect(() => {
    if (over) return;
    const id = window.setTimeout(() => setAt((a) => a + 1), STEPS[at].ms);
    return () => window.clearTimeout(id);
  }, [at, over, run]);

  const t = light
    ? { page: "bg-[#ecebe8] text-[#1a1a1a]", card: "border-[#e0dfdb] bg-white", tag: "text-[#9a9a9a]", btn: "border-[#e0dfdb] hover:bg-[#f2f1ee]" }
    : { page: "bg-[#0b0b0b] text-[#ececec]", card: "border-[#1f1f1f] bg-[#131313]", tag: "text-[#5c5c5c]", btn: "border-[#2a2a2a] hover:bg-[#1c1c1c]" };

  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${t.page}`} style={{ fontFamily: '"Inter", "Hanken Grotesk Variable", "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif' }}>
      <div className="grid w-full max-w-[44rem] gap-4">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ACTIVITIES.map((a) => (
            <li key={a.id} className={`grid gap-3 rounded-2xl border p-4 ${t.card}`}>
              <span className={`font-mono text-[11px] uppercase tracking-[0.08em] ${t.tag}`}>{a.name}</span>
              <span className="text-[26px]"><ActivityGlyph activity={a.id} label="" theme={theme} /></span>
            </li>
          ))}
        </ul>

        <div className={`grid gap-3 rounded-2xl border p-5 ${t.card}`}>
          <ol className="grid gap-2.5 text-[14.5px]">
            {STEPS.slice(0, Math.min(at + 1, STEPS.length)).map((s, i) => {
              const state: ActivityState = i < at ? (s.fails ? "error" : "done") : "active";
              const label = state === "active" ? s.active : state === "error" ? s.fails! : s.done;
              return (
                <li key={i} style={{ animation: "acgl-demo-in .3s ease-out" }}>
                  <ActivityGlyph activity={s.activity} state={state} label={label} detail={state === "error" ? undefined : s.detail} theme={theme} />
                </li>
              );
            })}
          </ol>
          <button type="button" disabled={!over} onClick={() => { setAt(0); setRun((r) => r + 1); }} className={`h-9 justify-self-start rounded-lg border px-3 text-[13px] font-medium disabled:opacity-40 ${t.btn}`}>
            Run again
          </button>
        </div>
      </div>
      <style>{`@keyframes acgl-demo-in { from { opacity: 0; transform: translateY(3px); } } @media (prefers-reduced-motion: reduce) { [style*="acgl-demo-in"] { animation: none !important; } }`}</style>
    </div>
  );
}
