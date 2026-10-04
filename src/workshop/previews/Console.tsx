"use client";

import { useEffect, useMemo, useState } from "react";
import { WorkspaceSidebar } from "@/registry/sidebars/workspace-sidebar/WorkspaceSidebar";
import { MetricMorph } from "@/registry/stats/metric-morph/MetricMorph";
import { UptimeRibbon, type Day } from "@/registry/stats/uptime-ribbon/UptimeRibbon";
import { FocusTable, type Column } from "@/registry/data/focus-table/FocusTable";
import { ActivityStream, type Activity } from "@/registry/data/activity-stream/ActivityStream";

const i = (d: string) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d={d} />
  </svg>
);

function days(seed: number, incidents: Record<number, [number, string]>): Day[] {
  const base = new Date(2026, 8, 29);
  return Array.from({ length: 90 }, (_, idx) => {
    const d = new Date(base);
    d.setDate(base.getDate() - (89 - idx));
    const inc = incidents[idx];
    return {
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      uptime: inc ? inc[0] : 99.96 + ((Math.sin(idx * seed) + 1) / 2) * 0.04,
      incident: inc?.[1],
    };
  });
}

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
  const services = useMemo(
    () => [
      { name: "API", days: days(1.3, { 23: [99.41, "Elevated latency in eu-central for 38 minutes."], 71: [98.2, "Partial outage: 2% of requests returned 503."] }) },
      { name: "Web", days: days(2.1, { 55: [99.7, "Slow page loads after a CDN change."] }) },
      { name: "Workers", days: days(0.7, {}) },
    ],
    [],
  );
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
      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-[72rem]">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="m-0 text-[1.375rem] font-semibold tracking-[-0.02em]">Overview</h1>
            <span className="text-[0.8125rem] text-[#8b8d93]">Vitrine · Production · last 24 hours</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/[0.07] ring-1 ring-white/[0.07] lg:grid-cols-4">
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

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,44rem)_minmax(0,1fr)]">
            <section aria-labelledby="cs-uptime">
              <h2 id="cs-uptime" className="mb-3 text-[0.8125rem] font-medium text-[#a1a3a9]">
                Uptime, 90 days
              </h2>
              <UptimeRibbon services={services} />
            </section>
            <ActivityStream theme="night" label="Activity" now={now} events={log} />
          </div>

          <div className="mt-8">
            <FocusTable caption="Deployments" theme="night" columns={COLS} rows={ROWS} rowId={(d) => d.id} rowLabel={(d) => `${d.service} ${d.status}`} />
          </div>
        </div>
      </main>
    </div>
  );
}
