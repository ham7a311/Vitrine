"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WorkspaceSidebar } from "@/registry/sidebars/workspace-sidebar/WorkspaceSidebar";
import { MetricMorph } from "@/registry/stats/metric-morph/MetricMorph";
import { AnnotatedTimeline, type TimelineEvent } from "@/registry/analytics/annotated-timeline/AnnotatedTimeline";
import { LatencyHeatmap, type LatencyColumn } from "@/registry/analytics/latency-heatmap/LatencyHeatmap";
import { edges as makeEdges } from "@/registry/analytics/latency-heatmap/latency";
import { ShortcutPalette, type Command } from "@/registry/overlays/shortcut-palette/ShortcutPalette";
import { FocusTable, type Column } from "@/registry/data/focus-table/FocusTable";
import { ActivityStream, type Activity } from "@/registry/data/activity-stream/ActivityStream";

const i = (d: string) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d={d} />
  </svg>
);

/* Thirty days of API error rate, with what the team shipped and what broke. */
const N = 30;
let seedT = 7;
const rt = () => ((seedT = (seedT * 1664525 + 1013904223) >>> 0) / 4294967296);
const ERRORS = Array.from({ length: N }, (_, i) => {
  let v = 0.42 + Math.sin(i / 2.6) * 0.03 + (rt() - 0.5) * 0.06;
  if (i >= 9 && i <= 11) v += [0.9, 0.55, 0.18][i - 9]; // bad deploy, rolled back
  if (i >= 19) v -= 0.14; // retry budget
  return +v.toFixed(2);
});
const DAYS = Array.from({ length: N }, (_, i) => new Date(Date.UTC(2026, 8, 1 + i)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }));
const TIMELINE: TimelineEvent[] = [
  { id: "d1", at: 4, kind: "deploy", title: "Search moved to the edge", body: "vitrine-web 7f3c2a1 · 38 routes", by: "Hamza" },
  { id: "i1", at: 9, kind: "incident", title: "503s from vitrine-api in eu-central", body: "A connection-pool change starved the workers; rolled back after 38 minutes.", by: "On-call · Salim", window: 3 },
  { id: "d2", at: 12, kind: "deploy", title: "Pool size pinned per region", body: "Config moved out of the image so it can't ship by accident.", by: "Salim" },
  { id: "f1", at: 19, kind: "flag", title: "Retry budget on for all clients", body: "Clients back off after two failures instead of hammering.", by: "Aisha", window: 6 },
  { id: "d3", at: 25, kind: "deploy", title: "Worker autoscaling", body: "Scale on queue depth, not CPU.", by: "Hamza" },
];

/* A day of checkout-api latency in half-hour slots, with an incident as a hot band at 14:00. */
const EDGES = makeEdges(4, 8000, 22);
const erf = (x: number) => { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
const cdf = (v: number, median: number, sigma: number) => 0.5 * (1 + erf((Math.log(v) - Math.log(median)) / (sigma * Math.SQRT2)));
const mass = (median: number, sigma: number) => EDGES.slice(1).map((e, i) => cdf(e, median, sigma) - cdf(EDGES[i], median, sigma));
let seedL = 41;
const rl = () => ((seedL = (seedL * 1664525 + 1013904223) >>> 0) / 4294967296);
const LATENCY: LatencyColumn[] = Array.from({ length: 48 }, (_, c) => {
  const hour = c / 2;
  const load = 900 + 1500 * Math.exp(-((hour - 12.5) ** 2) / 6) + 1900 * Math.exp(-((hour - 20) ** 2) / 5);
  const incident = c >= 28 && c <= 31 ? [0.6, 1, 0.85, 0.45][c - 28] : 0;
  const main = mass(48 * (1 + incident * 5) * (1 + load / 9000), 0.42 + incident * 0.25);
  const tail = mass(2400, 0.5);
  const share = 0.004 + incident * 0.05;
  return { label: `${String(Math.floor(hour)).padStart(2, "0")}:${c % 2 ? "30" : "00"}`, counts: main.map((m, i) => Math.round(load * ((1 - share) * m + share * tail[i]) * (0.9 + rl() * 0.2))) };
});

const COMMANDS: Command[] = [
  { id: "deploys", label: "Go to deployments", group: "Navigate", keys: ["G", "D"], keywords: "releases history" },
  { id: "logs", label: "Open logs", group: "Navigate", keys: ["G", "L"] },
  { id: "incident", label: "Open the incident runbook", group: "Navigate", keywords: "outage on-call" },
  { id: "deploy", label: "Deploy vitrine-web to production", group: "Act", keys: ["⇧", "⌘", "D"], keywords: "ship release promote" },
  { id: "rollback", label: "Roll back the last deploy", group: "Act", keys: ["⇧", "⌘", "Z"], keywords: "revert undo" },
  { id: "pause", label: "Pause deploys for everyone", group: "Act", keywords: "freeze" },
  { id: "invite", label: "Invite a teammate", group: "Account", keywords: "team" },
];

type Deploy = { id: string; service: string; env: string; status: string; secs: number; mins: number; by: string };
const ROWS: Deploy[] = [
  { id: "1", service: "vitrine-web", env: "Production", status: "Ready", secs: 102, mins: 3, by: "Hamza" },
  { id: "2", service: "vitrine-api", env: "Production", status: "Building", secs: 38, mins: 6, by: "CI" },
  { id: "3", service: "search-edge", env: "Preview", status: "Failed", secs: 71, mins: 19, by: "Salim" },
  { id: "4", service: "docs", env: "Preview", status: "Ready", secs: 54, mins: 33, by: "Aisha" },
  { id: "5", service: "worker-mail", env: "Staging", status: "Ready", secs: 86, mins: 52, by: "CI" },
  { id: "6", service: "auth", env: "Production", status: "Ready", secs: 128, mins: 75, by: "Hamza" },
];
const tone: Record<string, string> = { Ready: "#4ade80", Building: "#fbbf24", Failed: "#f87171" };
const COLS: Column<Deploy>[] = [
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
  { key: "by", label: "By", priority: "meta", render: (d) => d.by },
  { key: "dur", label: "Duration", align: "end", priority: "secondary", sort: (a, b) => a.secs - b.secs, render: (d) => `${Math.floor(d.secs / 60)}m ${String(d.secs % 60).padStart(2, "0")}s` },
  { key: "time", label: "Created", align: "end", priority: "meta", sort: (a, b) => a.mins - b.mins, render: (d) => (d.mins < 60 ? `${d.mins}m ago` : `${Math.floor(d.mins / 60)}h ago`) },
];

const M = 60_000;
function events(now: number): Activity[] {
  const at = (m: number) => now - m * M;
  const log = (lines: string[]) => <pre className="m-0 whitespace-pre-wrap font-mono text-[11.5px] leading-[1.6] opacity-80">{lines.join("\n")}</pre>;
  return [
    { id: "a1", at: at(3), actor: "Hamza", kind: "deploy", text: <>deployed <em>vitrine-web</em> to Production</>, status: { label: "Ready", tone: "ok" }, detail: log(["7f3c2a1 · Move search to edge runtime", "Built in 1m 42s · 38 routes"]) },
    { id: "a2", at: at(9), actor: "CI", kind: "approve", text: <>checks passed on <em>PR #212</em></>, status: { label: "12 / 12", tone: "ok" } },
    { id: "a3", at: at(19), actor: "Salim", kind: "deploy", text: <>deployed <em>search-edge</em> to Preview</>, status: { label: "Failed", tone: "bad" }, detail: log(["2ad9cc3 · Facet cache keys", "error: WORKSPACE_ID is not defined", "✗ Previous preview kept"]) },
    { id: "a4", at: at(24), actor: "Aisha", kind: "comment", text: <>commented on <em>ATL-209 · Deploy previews</em></> },
    { id: "a5", at: at(140), actor: "Hamza", kind: "status", text: <>moved <em>ATL-205</em> to Review</> },
    { id: "a6", at: at(300), actor: "GUtech Studio", kind: "approve", text: <>approved the <em>Q4 roadmap</em></>, status: { label: "Approved", tone: "ok" } },
  ];
}

export default function Console() {
  const [v, setV] = useState({ req: 182430, err: 0.0021, p95: 184, users: 1284, r: 0 });
  const [now] = useState(() => Date.now());
  const log = useMemo(() => events(now), [now]);
  const main = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState(false);
  const [ran, setRan] = useState("");
  useEffect(() => {
    const t = window.setInterval(
      () => setV((p) => ({ req: p.req + 40 + Math.round(Math.random() * 120), err: Math.max(0.0012, +(p.err + (Math.random() < 0.5 ? -0.0001 : 0.0001)).toFixed(4)), p95: Math.max(160, p.p95 + (Math.random() < 0.55 ? -2 : 3)), users: p.users + Math.round(Math.random() * 6) - 2, r: p.r + 1 })),
      2200,
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="flex h-full w-full bg-[#09090b] text-[#ececea]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="hidden md:flex">
        <WorkspaceSidebar
          workspace="Vitrine"
          items={[
            { id: "overview", label: "Overview", icon: i("M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z") },
            { id: "deploys", label: "Deployments", count: 1, icon: i("M8 2.5l4.5 8h-9zM8 10.5v3") },
            { id: "logs", label: "Logs", icon: i("M3 4h10M3 8h10M3 12h6") },
            { id: "services", label: "Services", icon: i("M2.5 4.5h4l1 1.5h6v6.5h-11z"), children: [{ id: "s-api", label: "API" }, { id: "s-web", label: "Web" }, { id: "s-workers", label: "Workers" }] },
            { id: "settings", label: "Settings", icon: i("M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2") },
          ]}
          pinned={[
            { id: "p-incident", label: "Incident runbook", color: "#f0a2a2" },
            { id: "p-release", label: "Release checklist", color: "#e8a24a" },
          ]}
        />
      </div>
      <div ref={main} tabIndex={-1} className="relative min-w-0 flex-1 outline-none">
      <main className="h-full overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-[72rem]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="m-0 text-[1.375rem] font-semibold tracking-[-0.02em]">Overview</h1>
            <span className="text-[0.8125rem] text-[#8b8d93]">Vitrine · Production · last 24 hours</span>
            <button
              type="button"
              onClick={() => setPalette(true)}
              className="ml-auto flex h-9 items-center gap-3 whitespace-nowrap rounded-lg px-3 text-[0.8125rem] text-[#a1a3a9] ring-1 ring-white/15 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7aa2ff]"
            >
              Run a command
              <kbd className="font-[family-name:Geist_Mono] text-[0.6875rem]">⌘K</kbd>
            </button>
          </div>
          <p className="mt-1 min-h-5 font-[family-name:Geist_Mono] text-[0.75rem] text-[#8b8d93]" role="status">{ran}</p>

          <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/[0.07] ring-1 ring-white/[0.07] lg:grid-cols-4">
            {[
              <MetricMorph key="r" theme="night" label="Requests" compareLabel="vs 5 min ago" value={v.req} revision={v.r} />,
              <MetricMorph key="e" theme="night" label="Error rate" compareLabel="lower is better" value={v.err} format="percent" decimals={2} invert revision={v.r} />,
              <MetricMorph key="p" theme="night" label="p95 latency (ms)" compareLabel="lower is better" value={v.p95} invert revision={v.r} />,
              <MetricMorph key="u" theme="night" label="Signed in now" compareLabel="vs 5 min ago" value={v.users} revision={v.r} />,
            ].map((m, k) => (
              <div key={k} className="bg-[#111114] p-4 sm:p-5">
                {m}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <AnnotatedTimeline title="API error rate · last 30 days" values={ERRORS} labels={DAYS} events={TIMELINE} format={(n) => `${n.toFixed(2)}%`} theme="night" className="max-w-none!" />
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <LatencyHeatmap title="checkout-api · response time, today" columns={LATENCY} edges={EDGES} slo={400} theme="night" />
            <ActivityStream theme="night" label="Activity" now={now} events={log} />
          </div>

          <div className="mt-8">
            <FocusTable caption="Deployments" theme="night" columns={COLS} rows={ROWS} rowId={(d) => d.id} rowLabel={(d) => `${d.service} ${d.status}`} />
          </div>
        </div>
      </main>
      <ShortcutPalette
        contained
        theme="night"
        commands={COMMANDS}
        open={palette}
        onOpenChange={setPalette}
        onRun={(c) => setRan(`Ran: ${c.label} (preview, nothing changed)`)}
        hotkeyScope={main}
      />
      </div>
    </div>
  );
}
