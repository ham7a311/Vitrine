"use client";
import { useEffect, useState } from "react";
import { SourceSweep, type SourceRun, type SweepResult } from "./SourceSweep";
import type { SourceId } from "./sources";

/* What each source turns up, and how long it takes to look. */
const PLAN: { id: SourceId; ms: number; results: SweepResult[] }[] = [
  { id: "google", ms: 1500, results: [
    { title: "Rate limiting a public API: token bucket or sliding window?", meta: "fieldnotes.dev · 6 min read" },
    { title: "How we stopped one tenant from starving the rest", meta: "blog.parcelhub.io" },
    { title: "Sliding-window counters in Redis, with the edge cases", meta: "kvpatterns.com" },
  ] },
  { id: "notion", ms: 1100, results: [
    { title: "API limits — decision log (March)", meta: "Platform team · edited 3 weeks ago" },
    { title: "Incident 212: burst from the import job", meta: "Postmortems" },
  ] },
  { id: "reddit", ms: 1300, results: [
    { title: "Per-user vs per-key limits — which did you regret?", meta: "r/backend · 148 comments" },
    { title: "Our 429s doubled after moving to a sliding window", meta: "r/devops · 61 comments" },
  ] },
  { id: "github", ms: 1700, results: [
    { title: "ratelimit/middleware.ts — bucket refill runs on every request", meta: "parcelhub/api · issue #1832" },
    { title: "Add burst allowance to the limiter config", meta: "parcelhub/api · pull request #1907" },
    { title: "leaky-bucket: a tiny limiter with a Redis store", meta: "ossworks/leaky-bucket · 2.1k stars" },
  ] },
  { id: "wikipedia", ms: 900, results: [] },
];
const QUERY = "how other teams rate-limit their public API";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  const [at, setAt] = useState(-1); // index of the source being searched; PLAN.length when all done
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (at >= PLAN.length) return;
    const id = window.setTimeout(() => setAt((a) => a + 1), at < 0 ? 700 : PLAN[at].ms);
    return () => window.clearTimeout(id);
  }, [at, run]);

  const runs: SourceRun[] = PLAN.map((p, i) => ({
    id: p.id,
    status: i < at ? "done" : i === at ? "searching" : "waiting",
    found: p.results.length,
    results: p.results,
  }));

  const t = light
    ? { page: "bg-[#ecebe8] text-[#1a1a1a]", card: "border-[#e0dfdb] bg-white", bubble: "bg-[#ecebe8]", btn: "border-[#e0dfdb] hover:bg-[#f2f1ee]" }
    : { page: "bg-[#0b0b0b] text-[#ececec]", card: "border-[#1f1f1f] bg-[#131313]", bubble: "bg-[#262626]", btn: "border-[#2a2a2a] hover:bg-[#1c1c1c]" };

  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 ${t.page}`} style={{ fontFamily: '"Inter", "Hanken Grotesk Variable", "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif' }}>
      <div className={`grid w-full max-w-[38rem] gap-5 rounded-2xl border p-5 sm:p-6 ${t.card}`}>
        <p className={`max-w-[85%] justify-self-end rounded-2xl px-4 py-2.5 text-[15px] ${t.bubble}`}>Before we pick one, how are other teams rate-limiting their public APIs? Check our notes too.</p>
        <SourceSweep key={run} query={QUERY} runs={runs} theme={light ? "light" : "dark"} />
        <button type="button" disabled={at < PLAN.length} onClick={() => { setAt(-1); setRun((r) => r + 1); }} className={`h-9 justify-self-start rounded-lg border px-3 text-[13px] font-medium disabled:opacity-40 ${t.btn}`}>
          Search again
        </button>
      </div>
    </div>
  );
}
