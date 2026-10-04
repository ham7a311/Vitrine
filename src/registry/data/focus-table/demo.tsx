"use client";

import { useState } from "react";
import { FocusTable, type Column } from "./FocusTable";

type Deploy = {
  id: string;
  service: string;
  env: "Production" | "Preview" | "Staging";
  status: "Ready" | "Building" | "Failed" | "Canceled";
  secs: number;
  sha: string;
  message: string;
  author: string;
  mins: number;
};

const DATA: Deploy[] = [
  { id: "d1", service: "vitrine-web", env: "Production", status: "Ready", secs: 102, sha: "7f3c2a1", message: "Move search to edge runtime", author: "Hamza Al-Bulushi", mins: 4 },
  { id: "d2", service: "vitrine-api", env: "Production", status: "Building", secs: 38, sha: "a91e04d", message: "Add pagination to /projects", author: "Hamza Al-Bulushi", mins: 6 },
  { id: "d3", service: "search-edge", env: "Preview", status: "Failed", secs: 71, sha: "c0ffee1", message: "Try Bun for the indexer", author: "Hamza Al-Bulushi", mins: 19 },
  { id: "d4", service: "vitrine-docs", env: "Preview", status: "Ready", secs: 54, sha: "4b2d9e0", message: "Document the webhooks API", author: "ci-bot", mins: 33 },
  { id: "d5", service: "worker-mail", env: "Staging", status: "Ready", secs: 86, sha: "e3a7713", message: "Retry SES bounces with backoff", author: "Hamza Al-Bulushi", mins: 52 },
  { id: "d6", service: "auth", env: "Production", status: "Ready", secs: 128, sha: "18fa6b2", message: "Rotate session keys", author: "ci-bot", mins: 75 },
  { id: "d7", service: "vitrine-web", env: "Preview", status: "Canceled", secs: 12, sha: "90d1c4f", message: "WIP: new sidebar", author: "Hamza Al-Bulushi", mins: 96 },
  { id: "d8", service: "vitrine-api", env: "Staging", status: "Ready", secs: 91, sha: "5c61a0e", message: "Upgrade to Postgres 17", author: "ci-bot", mins: 140 },
  { id: "d9", service: "search-edge", env: "Production", status: "Ready", secs: 67, sha: "b7e2f19", message: "Cache facets for 60 seconds", author: "Hamza Al-Bulushi", mins: 210 },
  { id: "d10", service: "worker-mail", env: "Production", status: "Failed", secs: 44, sha: "2ad9cc3", message: "Template for invoice reminders", author: "ci-bot", mins: 305 },
];

const fmtDur = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${s}s`);
const fmtAgo = (m: number) => (m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`);
const MAX = Math.max(...DATA.map((d) => d.secs));

const TONE: Record<Deploy["status"], string> = { Ready: "#16a34a", Building: "#d97706", Failed: "#dc2626", Canceled: "#9ca3af" };

const columns: Column<Deploy>[] = [
  { key: "service", label: "Service", priority: "primary", sort: (a, b) => a.service.localeCompare(b.service), render: (d) => <span className="font-medium">{d.service}</span> },
  {
    key: "status",
    label: "Status",
    priority: "badge",
    sort: (a, b) => a.status.localeCompare(b.status),
    render: (d) => (
      <span className="inline-flex items-center gap-1.5">
        <span className={`size-1.5 rounded-full ${d.status === "Building" ? "animate-pulse motion-reduce:animate-none" : ""}`} style={{ background: TONE[d.status] }} aria-hidden="true" />
        {d.status}
      </span>
    ),
  },
  { key: "env", label: "Environment", priority: "secondary", sort: (a, b) => a.env.localeCompare(b.env), render: (d) => d.env },
  {
    key: "duration",
    label: "Duration",
    align: "end",
    priority: "secondary",
    sort: (a, b) => a.secs - b.secs,
    render: (d) => (
      <span className="inline-flex items-center justify-end gap-2">
        <span className="hidden h-1 w-10 overflow-hidden rounded-full bg-current/10 md:block" aria-hidden="true">
          <span className="block h-full rounded-full bg-current/45" style={{ width: `${(d.secs / MAX) * 100}%` }} />
        </span>
        <span className="tabular-nums">{fmtDur(d.secs)}</span>
      </span>
    ),
  },
  {
    key: "commit",
    label: "Commit",
    grow: true,
    priority: "meta",
    render: (d) => (
      <span className="truncate">
        <span className="font-mono text-[0.75rem] opacity-60">{d.sha}</span> {d.message}
      </span>
    ),
  },
  { key: "time", label: "Created", align: "end", priority: "secondary", sort: (a, b) => a.mins - b.mins, render: (d) => fmtAgo(d.mins) },
];

type Mode = "ready" | "loading" | "empty" | "error";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [mode, setMode] = useState<Mode>("ready");
  const [rows, setRows] = useState(DATA);

  const btn = night ? "ring-white/10 hover:bg-white/[0.06]" : "ring-black/10 hover:bg-black/[0.04]";

  return (
    <div className={`flex h-full min-h-[600px] w-full justify-center overflow-auto px-4 py-8 ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f3f1ec] text-[#1b1a17]"}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="w-full max-w-[960px]">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Deployments</h1>
          <div className={`ml-auto flex rounded-lg p-0.5 text-[12px] ring-1 ${night ? "ring-white/10" : "ring-black/10"}`} role="group" aria-label="Demo state">
            {(["ready", "loading", "empty", "error"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`h-7 rounded-md px-2.5 capitalize ${mode === m ? (night ? "bg-white/10" : "bg-black/[0.07]") : "opacity-60"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <FocusTable
          caption="Vitrine · last 24 hours"
          theme={night ? "night" : "paper"}
          columns={columns}
          rows={mode === "empty" ? [] : rows}
          status={mode}
          rowId={(d) => d.id}
          rowLabel={(d) => `${d.service}, ${d.env}, ${d.status}, ${fmtAgo(d.mins)}`}
          onRetry={() => setMode("loading")}
          empty={
            <>
              <strong>No deployments match these filters.</strong>
              <span>Nothing has shipped to Vitrine in the last 24 hours.</span>
              <button type="button" onClick={() => setMode("ready")}>
                Clear filters
              </button>
            </>
          }
          bulkActions={(ids, clear) => (
            <>
              <button type="button" className={`h-7 rounded-md px-2.5 text-[12.5px] ring-1 ${btn}`} onClick={clear}>
                Redeploy
              </button>
              <button
                type="button"
                className={`h-7 rounded-md px-2.5 text-[12.5px] ring-1 ${btn}`}
                onClick={() => {
                  setRows((r) => r.map((d) => (ids.includes(d.id) && d.status === "Building" ? { ...d, status: "Canceled" } : d)));
                  clear();
                }}
              >
                Cancel builds
              </button>
            </>
          )}
          detail={(d) => (
            <div className="grid gap-3">
              <pre className={`overflow-x-auto rounded-lg p-3 font-mono text-[11.5px] leading-[1.6] ${night ? "bg-black/40 text-[#c9cbd1]" : "bg-[#f6f5f1] text-[#4a4740]"}`}>
                {`▲ ${d.service} · ${d.sha} · "${d.message}" — ${d.author}
  Installing dependencies… done in 14.2s
  Building… ${d.status === "Failed" ? "error: build exited with code 1" : `compiled in ${fmtDur(Math.round(d.secs * 0.6))}`}
  ${d.status === "Ready" ? "✓ Deployed to " + (d.env === "Production" ? "vitrine.gutech.app" : `${d.service}-${d.sha}.preview.gutech.app`) : d.status === "Building" ? "… uploading build output" : d.status === "Canceled" ? "Canceled by Hamza Al-Bulushi" : "✗ See full log for details"}`}
              </pre>
              <div className="flex flex-wrap gap-2 text-[12.5px]">
                <button type="button" className={`h-7 rounded-md px-2.5 ring-1 ${btn}`}>
                  View full log
                </button>
                <button type="button" className={`h-7 rounded-md px-2.5 ring-1 ${btn}`}>
                  Redeploy
                </button>
                {d.env !== "Production" && d.status === "Ready" && (
                  <button type="button" className={`h-7 rounded-md px-2.5 ring-1 ${btn}`}>
                    Promote to Production
                  </button>
                )}
              </div>
            </div>
          )}
        />
        <p className={`mt-3 text-[12px] ${night ? "text-[#8b8d93]" : "text-[#76726a]"}`}>Hover or arrow through rows · Space selects · Shift extends · Enter expands</p>
      </div>
    </div>
  );
}
