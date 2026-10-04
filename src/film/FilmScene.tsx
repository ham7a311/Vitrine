"use client";

// Conceptual product environments for the launch film: real Vitrine components composed into
// unbranded apps. Dev-only (see src/app/film/[scene]/page.tsx); never part of the public site.

import { useEffect, useState } from "react";
import { ConversationSidebar, type Chat } from "@/registry/sidebars/conversation-sidebar/ConversationSidebar";
import { ThinkingTrace } from "@/registry/ai/thinking-trace/ThinkingTrace";
import { PromptComposer } from "@/registry/ai/prompt-composer/PromptComposer";
import { MetricMorph } from "@/registry/stats/metric-morph/MetricMorph";
import { FocusTable, type Column } from "@/registry/data/focus-table/FocusTable";

const CHATS: Chat[] = [
  { id: "1", title: "Board deck vs churn data", when: "today", pinned: true },
  { id: "2", title: "Release notes for v4.0", when: "today" },
  { id: "3", title: "Accessible tabs in React", when: "today" },
  { id: "4", title: "Yearly discount per plan", when: "yesterday" },
  { id: "5", title: "Arabic type pairing ideas", when: "yesterday" },
  { id: "6", title: "Postgres index for search", when: "week" },
  { id: "7", title: "Rewrite the README intro", when: "week" },
];

function AiScene() {
  return (
    <div className="flex h-full w-full bg-[#f5f1e8]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="hidden md:flex">
        <ConversationSidebar chats={CHATS} theme="paper" />
      </div>
      <main className="flex min-w-0 flex-1 flex-col items-center px-5 pb-6 pt-[8vh] sm:px-6 sm:pb-8">
        <div className="flex w-full max-w-[40rem] flex-1 flex-col gap-6">
          <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[#e9e2d4] px-4 py-3 text-[15px] leading-relaxed text-[#2a2520]">
            Compare the Q3 board deck with churn by cohort. Where do the numbers disagree?
          </p>
          <ThinkingTrace
            theme="paper"
            steps={[
              { label: "Reading Q3-board-deck.pdf", ms: 1300 },
              { label: "Matching slides to churn-by-cohort.csv", ms: 1700 },
              { label: "Checking retention on slide 12", ms: 1500 },
            ]}
          />
          <p className="max-w-[60ch] text-[15px] leading-[1.7] text-[#3a342d]" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 19 }}>
            Two places. Slide 12 reports 94% retention for the March cohort, but the export shows 88% once refunds are excluded. And the deck rounds churn per month, while the CSV is per week.
          </p>
        </div>
        <div className="w-full max-w-[40rem]">
          <PromptComposer theme="paper" placeholder="Reply…" />
        </div>
      </main>
    </div>
  );
}

type Deploy = { id: string; service: string; env: string; status: string; secs: number; mins: number };
const ROWS: Deploy[] = [
  { id: "1", service: "web", env: "Production", status: "Ready", secs: 102, mins: 4 },
  { id: "2", service: "api", env: "Production", status: "Building", secs: 38, mins: 6 },
  { id: "3", service: "search", env: "Preview", status: "Failed", secs: 71, mins: 19 },
  { id: "4", service: "docs", env: "Preview", status: "Ready", secs: 54, mins: 33 },
  { id: "5", service: "worker", env: "Staging", status: "Ready", secs: 86, mins: 52 },
  { id: "6", service: "auth", env: "Production", status: "Ready", secs: 128, mins: 75 },
  { id: "7", service: "billing", env: "Production", status: "Ready", secs: 91, mins: 140 },
];
const tone: Record<string, string> = { Ready: "#4ade80", Building: "#fbbf24", Failed: "#f87171" };
const cols: Column<Deploy>[] = [
  { key: "service", label: "Service", priority: "primary", sort: (a, b) => a.service.localeCompare(b.service), render: (d) => <span className="font-medium">{d.service}</span> },
  {
    key: "status",
    label: "Status",
    priority: "badge",
    render: (d) => (
      <span className="inline-flex items-center gap-1.5">
        <span className="size-1.5 rounded-full" style={{ background: tone[d.status] }} />
        {d.status}
      </span>
    ),
  },
  { key: "env", label: "Environment", priority: "secondary", grow: true, render: (d) => d.env },
  { key: "dur", label: "Duration", align: "end", priority: "secondary", render: (d) => `${Math.floor(d.secs / 60)}m ${String(d.secs % 60).padStart(2, "0")}s` },
  { key: "time", label: "Created", align: "end", priority: "secondary", render: (d) => (d.mins < 60 ? `${d.mins}m ago` : `${Math.floor(d.mins / 60)}h ago`) },
];

function AnalyticsScene() {
  const [v, setV] = useState({ users: 12430, conv: 0.0342, rev: 9980, p95: 184, r: 0 });
  useEffect(() => {
    const t = window.setInterval(
      () => setV((p) => ({ users: p.users + 20 + Math.round(Math.random() * 60), conv: +(p.conv + 0.0006).toFixed(4), rev: p.rev + 3 + Math.round(Math.random() * 8), p95: p.p95 - 2, r: p.r + 1 })),
      1600,
    );
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="flex h-full w-full bg-[#0f1012] text-[#ececea]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <nav className="hidden w-14 shrink-0 flex-col sm:flex items-center gap-3 border-r border-white/[0.06] py-4" aria-hidden="true">
        <span className="size-7 rounded-lg bg-white/10" />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`size-7 rounded-lg ${i === 0 ? "bg-white/[0.08] ring-1 ring-white/10" : ""}`} />
        ))}
      </nav>
      <main className="min-w-0 flex-1 overflow-hidden px-4 py-6 sm:px-8 sm:py-7">
        <div className="flex items-baseline gap-3">
          <h1 className="m-0 text-[20px] font-semibold tracking-[-0.02em]">Overview</h1>
          <span className="text-[13px] text-[#8b8d93]">Last 24 hours</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-px lg:grid-cols-4 overflow-hidden rounded-2xl bg-white/[0.07] ring-1 ring-white/[0.07]">
          {[
            <MetricMorph key="u" theme="night" label="Active users" compareLabel="vs 5 min ago" value={v.users} revision={v.r} />,
            <MetricMorph key="c" theme="night" label="Checkout conversion" compareLabel="vs 5 min ago" value={v.conv} format="percent" decimals={2} revision={v.r} />,
            <MetricMorph key="v" theme="night" label="Revenue today (OMR)" compareLabel="vs 5 min ago" value={v.rev} revision={v.r} />,
            <MetricMorph key="p" theme="night" label="p95 latency (ms)" compareLabel="lower is better" value={v.p95} invert revision={v.r} />,
          ].map((m, i) => (
            <div key={i} className="bg-[#16171a] p-4 sm:p-5">
              {m}
            </div>
          ))}
        </div>
        <div className="mt-5">
          <FocusTable caption="Deployments" theme="night" columns={cols} rows={ROWS} rowId={(d) => d.id} rowLabel={(d) => `${d.service} ${d.status}`} />
        </div>
      </main>
    </div>
  );
}

export function FilmScene({ scene }: { scene: string }) {
  if (scene === "ai") return <AiScene />;
  if (scene === "analytics") return <AnalyticsScene />;
  return null;
}
