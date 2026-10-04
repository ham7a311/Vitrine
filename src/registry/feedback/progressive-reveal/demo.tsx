"use client";

import { useState } from "react";
import { Reveal, RevealProvider, useTierSchedule, type Tier } from "./ProgressiveReveal";

type Mode = "cards" | "list" | "article";
type Speed = "instant" | "fast" | "slow" | "fail";

const SCHEDULES: Record<Speed, [number, number, number]> = {
  instant: [40, 70, 110],
  fast: [260, 480, 760],
  slow: [900, 2100, 3600],
  fail: [900, 2100, 3200],
};

const PROJECTS = [
  { name: "Vitrine", mark: "A", tone: "#b4532a", open: 12, label: "open issues", desc: "The GUtech Studio platform: projects, deploys and search.", updated: "4m ago", spark: [3, 5, 4, 7, 6, 9, 8] },
  { name: "Wayfinder", mark: "W", tone: "#2f6bff", open: 5, label: "open issues", desc: "Indoor maps and room search for the Halban campus.", updated: "2h ago", spark: [2, 2, 3, 2, 4, 3, 5] },
  { name: "Thesis", mark: "T", tone: "#16a34a", open: 3, label: "chapters left", desc: "Survey tooling and analysis for the final-year thesis.", updated: "yesterday", spark: [1, 3, 2, 2, 4, 5, 4] },
];

const FEED = [
  { who: "HA", title: "Hamza merged PR #212 into vitrine-web", meta: "Vitrine · Pull request", time: "4m" },
  { who: "CI", title: "Deployment vitrine-api-a91e04d is live", meta: "Vitrine · Deploy", time: "6m" },
  { who: "HA", title: "Hamza commented on “Search architecture notes”", meta: "Vitrine · Doc", time: "38m" },
  { who: "CI", title: "Nightly backup completed (2.3 GB)", meta: "Wayfinder · Job", time: "2h" },
  { who: "HA", title: "Hamza closed WAY-41: room search index", meta: "Wayfinder · Issue", time: "3h" },
];

function Spark({ data, tone }: { data: number[]; tone: string }) {
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 80},${22 - (v / max) * 18}`).join(" ");
  return (
    <svg width="80" height="24" viewBox="0 0 80 24" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={tone} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [mode, setMode] = useState<Mode>("cards");
  const [speed, setSpeed] = useState<Speed>("slow");
  const [run, setRun] = useState(1);
  const { stage, failed, setFailed } = useTierSchedule(SCHEDULES[speed], speed === "fail" ? [3] : [], run);

  const c = night
    ? { page: "bg-[#0f1012] text-[#ececea]", card: "bg-[#16171a] ring-white/[0.08]", muted: "text-[#8b8d93]", line: "border-white/[0.07]", seg: "ring-white/10", on: "bg-white/10" }
    : { page: "bg-[#f3f1ec] text-[#1b1a17]", card: "bg-white ring-black/[0.08]", muted: "text-[#77736b]", line: "border-black/[0.07]", seg: "ring-black/10", on: "bg-black/[0.07]" };

  const replay = () => setRun((r) => r + 1);
  const retry = (tier: Tier) => {
    setFailed((f) => f.filter((t) => t !== tier));
  };

  const seg = <T extends string>(label: string, value: T, set: (v: T) => void, opts: [T, string][]) => (
    <div className={`flex rounded-lg p-0.5 text-[12px] ring-1 ${c.seg}`} role="group" aria-label={label}>
      {opts.map(([v, l]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => {
            set(v);
            replay();
          }}
          className={`h-7 rounded-md px-2.5 ${value === v ? c.on : "opacity-60"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  const detailsFail = (
    <span className={`text-[12px] ${c.muted}`}>
      Activity unavailable ·{" "}
      <button type="button" className="font-medium text-[#b4532a] underline-offset-2 hover:underline" onClick={() => retry(3)}>
        Retry
      </button>
    </span>
  );

  return (
    <div className={`flex h-full min-h-[640px] w-full justify-center overflow-auto px-4 py-8 ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="w-full max-w-[880px]">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {seg("Layout", mode, setMode, [
            ["cards", "Cards"],
            ["list", "List"],
            ["article", "Article"],
          ])}
          {seg("Speed", speed, setSpeed, [
            ["instant", "Instant"],
            ["fast", "Fast"],
            ["slow", "Slow"],
            ["fail", "Details fail"],
          ])}
          <button type="button" onClick={replay} className={`ml-auto h-8 rounded-lg px-3 text-[12.5px] ring-1 ${c.seg}`}>
            Replay
          </button>
        </div>

        <RevealProvider key={`${mode}-${run}`} stage={stage} failed={failed} onRetry={retry} theme={night ? "night" : "paper"} label={mode === "cards" ? "Projects" : mode === "list" ? "Activity" : "Article"}>
          {mode === "cards" && (
            <div className="grid gap-3 sm:grid-cols-3">
              {PROJECTS.map((p, i) => (
                <article key={p.name} className={`flex flex-col gap-3 rounded-2xl p-4 ring-1 ${c.card}`}>
                  <div className="flex items-center gap-2.5">
                    <Reveal.Block tier={3} w={28} h={28} radius={8} order={i}>
                      <span className="grid size-7 place-items-center rounded-lg text-[12px] font-semibold text-white" style={{ background: p.tone }}>
                        {p.mark}
                      </span>
                    </Reveal.Block>
                    <h3 className="m-0 min-w-0 flex-1 text-[15px] font-semibold">
                      <Reveal.Text tier={1} chars={10} order={i}>
                        {p.name}
                      </Reveal.Text>
                    </h3>
                  </div>
                  <p className="m-0 flex items-baseline gap-1.5">
                    <span className="text-[28px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                      <Reveal.Text tier={1} chars={2} order={i}>
                        {p.open}
                      </Reveal.Text>
                    </span>
                    <span className={`text-[13px] ${c.muted}`}>
                      <Reveal.Text tier={2} chars={11} order={i}>
                        {p.label}
                      </Reveal.Text>
                    </span>
                  </p>
                  <div className={`text-[13px] leading-[1.5] ${c.muted}`}>
                    <Reveal.Lines tier={2} lines={2} order={i}>
                      <p className="m-0">{p.desc}</p>
                    </Reveal.Lines>
                  </div>
                  <div className={`mt-auto flex h-7 items-center justify-between gap-2 border-t pt-3 ${c.line}`}>
                    <Reveal.Block tier={3} w={80} h={24} radius={4} order={i} fallback={detailsFail}>
                      <Spark data={p.spark} tone={p.tone} />
                    </Reveal.Block>
                    <span className={`text-[12px] ${c.muted}`}>
                      <Reveal.Text tier={3} chars={8} order={i}>
                        {p.updated}
                      </Reveal.Text>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {mode === "list" && (
            <ul className={`m-0 list-none divide-y rounded-2xl p-0 ring-1 ${c.card} ${night ? "divide-white/[0.07]" : "divide-black/[0.07]"}`}>
              {FEED.map((f, i) => (
                <li key={f.title} className="flex items-center gap-3 px-4 py-3">
                  <Reveal.Block tier={3} w={30} h={30} radius={99} order={i} fallback={<span className={`size-[30px] rounded-full ring-1 ${c.seg}`} />}>
                    <span className={`grid size-[30px] place-items-center rounded-full text-[11px] font-semibold ${f.who === "HA" ? "bg-[#b4532a] text-white" : night ? "bg-white/10" : "bg-black/[0.07]"}`}>{f.who}</span>
                  </Reveal.Block>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-[13.5px] font-medium">
                      <Reveal.Text tier={1} chars={Math.min(42, f.title.length)} order={i}>
                        {f.title}
                      </Reveal.Text>
                    </p>
                    <p className={`m-0 text-[12px] ${c.muted}`}>
                      <Reveal.Text tier={2} chars={f.meta.length} order={i}>
                        {f.meta}
                      </Reveal.Text>
                    </p>
                  </div>
                  <span className={`shrink-0 text-[12px] tabular-nums ${c.muted}`}>
                    <Reveal.Text tier={3} chars={3} order={i}>
                      {f.time}
                    </Reveal.Text>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {mode === "article" && (
            <article className={`mx-auto max-w-[620px] rounded-2xl p-6 ring-1 sm:p-8 ${c.card}`}>
              <p className="m-0 text-[12px] font-medium uppercase tracking-[0.08em] text-[#b4532a]">
                <Reveal.Text tier={2} chars={11}>
                  Engineering
                </Reveal.Text>
              </p>
              <h2 className="mb-0 mt-2 text-[30px] font-normal leading-[1.12] tracking-[-0.015em]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                <Reveal.Lines tier={1} lines={2}>
                  <span>Moving Vitrine search to the edge, and what it cost us</span>
                </Reveal.Lines>
              </h2>
              <div className={`mt-3 flex items-center gap-2 border-b pb-4 text-[12.5px] ${c.line} ${c.muted}`}>
                <Reveal.Block tier={3} w={22} h={22} radius={99} fallback={null}>
                  <span className="grid size-[22px] place-items-center rounded-full bg-[#b4532a] text-[9px] font-semibold text-white">HA</span>
                </Reveal.Block>
                <Reveal.Text tier={2} chars={16}>
                  Hamza Al-Bulushi
                </Reveal.Text>
                <span aria-hidden="true">·</span>
                <Reveal.Text tier={3} chars={11}>
                  30 Sep 2026
                </Reveal.Text>
              </div>
              <div className="mt-4 grid gap-3 text-[15px] leading-[1.65]">
                <Reveal.Lines tier={2} lines={3} order={0}>
                  <p className="m-0">Search in Vitrine used to run in one region. For anyone outside the Gulf, every keystroke crossed an ocean before a result came back.</p>
                </Reveal.Lines>
                <Reveal.Lines tier={2} lines={3} order={1}>
                  <p className="m-0">We moved the query path to the edge and kept the index where it was. Median latency fell from 410 ms to 62 ms; the bill rose by less than we feared.</p>
                </Reveal.Lines>
              </div>
              <div className="mt-5">
                <Reveal.Block
                  tier={3}
                  w="100%"
                  h={140}
                  radius={12}
                  fallback={<div className={`grid h-[140px] place-items-center rounded-xl border border-dashed text-[12.5px] ${c.line} ${c.muted}`}>{detailsFail}</div>}
                >
                  <figure className="m-0">
                    <div className={`flex h-[140px] items-end gap-1.5 rounded-xl p-4 ${night ? "bg-white/[0.04]" : "bg-[#f6f5f1]"}`} aria-label="Latency before and after" role="img">
                      {[82, 76, 80, 71, 20, 14, 13, 12, 14, 12].map((h, i) => (
                        <span key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i < 4 ? (night ? "#555" : "#c9c4b8") : "#b4532a" }} />
                      ))}
                    </div>
                    <figcaption className={`mt-2 text-[12px] ${c.muted}`}>p50 search latency, ms — before and after the move.</figcaption>
                  </figure>
                </Reveal.Block>
              </div>
            </article>
          )}
        </RevealProvider>

        <p className={`mt-4 text-[12px] ${c.muted}`} aria-hidden="true">
          Stage {Math.min(stage, 3)} of 3 · {stage >= 4 ? "complete" : ["structure", "primary", "secondary", "details"][stage]}
        </p>
      </div>
    </div>
  );
}
