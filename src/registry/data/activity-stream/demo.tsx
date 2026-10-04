"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityStream, type Activity } from "./ActivityStream";

const M = 60_000;

function seed(now: number): Activity[] {
  const at = (minsAgo: number) => now - minsAgo * M;
  const log = (lines: string[]) => <pre className="m-0 whitespace-pre-wrap font-mono text-[11.5px] leading-[1.6] opacity-80">{lines.join("\n")}</pre>;
  return [
    { id: "e1", at: at(3), actor: "Hamza", kind: "deploy", text: <>deployed <em>vitrine-web</em> to Production</>, status: { label: "Ready", tone: "ok" }, detail: log(["7f3c2a1 · Move search to edge runtime", "Built in 1m 42s · 38 routes", "✓ vitrine.gutech.app"]) },
    { id: "e2", at: at(9), actor: "CI", kind: "approve", text: <>checks passed on <em>PR #212</em></>, status: { label: "12 / 12", tone: "ok" } },
    { id: "e3", at: at(14), actor: "Hamza", kind: "comment", text: <>commented on <em>Search architecture notes</em></>, detail: <p className="m-0 max-w-[52ch] leading-relaxed">“Edge cache keys need the workspace id, otherwise GUtech Studio and Wayfinder will share facets. Adding that before we flip the flag.”</p> },
    { id: "e4", at: at(16), actor: "Hamza", kind: "status", text: <>moved <em>ATL-212</em> from In progress to Review</> },
    { id: "e5", at: at(24), actor: "Hamza", kind: "upload", groupKey: "upload-wayfinder", groupText: (n) => <>uploaded {n} files to <em>Wayfinder</em></>, text: <>uploaded <em>floor-c-plan.pdf</em></> },
    { id: "e6", at: at(26), actor: "Hamza", kind: "upload", groupKey: "upload-wayfinder", groupText: (n) => <>uploaded {n} files to <em>Wayfinder</em></>, text: <>uploaded <em>room-index.csv</em></> },
    { id: "e7", at: at(27), actor: "Hamza", kind: "upload", groupKey: "upload-wayfinder", groupText: (n) => <>uploaded {n} files to <em>Wayfinder</em></>, text: <>uploaded <em>signage-photos.zip</em></> },
    { id: "e8", at: at(31), actor: "Hamza", kind: "upload", groupKey: "upload-wayfinder", groupText: (n) => <>uploaded {n} files to <em>Wayfinder</em></>, text: <>uploaded <em>entrances.geojson</em></> },
    { id: "e9", at: at(214), actor: "CI", kind: "deploy", text: <>deployed <em>worker-mail</em> to Production</>, status: { label: "Failed", tone: "bad" }, detail: log(["2ad9cc3 · Template for invoice reminders", "error: Cannot find module './reminder.mjml'", "✗ Rolled back to e3a7713"]) },
    { id: "e10", at: at(222), actor: "Hamza", kind: "assign", text: <>assigned <em>ATL-205 · Invoice reminders send twice</em> to themself</> },
    { id: "e11", at: at(300), actor: "GUtech Studio", kind: "approve", text: <>approved the <em>Q3 roadmap</em></>, status: { label: "Approved", tone: "ok" } },
    { id: "e12", at: at(24 * 60 + 40), actor: "Hamza", kind: "status", text: <>closed <em>WAY-41 · Room search index</em></>, status: { label: "Done", tone: "neutral" } },
    { id: "e13", at: at(24 * 60 + 55), actor: "CI", kind: "deploy", text: <>deployed <em>vitrine-api</em> to Staging</>, status: { label: "Ready", tone: "ok" } },
    { id: "e14", at: at(24 * 60 + 300), actor: "Hamza", kind: "comment", text: <>commented on <em>Thesis draft v4 — methods</em></>, detail: <p className="m-0 max-w-[52ch] leading-relaxed">“Section 3.2 still reads like a list. Rewriting it as a narrative of the survey rounds.”</p> },
  ];
}

const INCOMING: Omit<Activity, "id" | "at">[] = [
  { actor: "CI", kind: "approve", text: <>checks passed on <em>PR #214</em></>, status: { label: "12 / 12", tone: "ok" } },
  { actor: "Hamza", kind: "comment", text: <>replied in <em>ATL-209 · Deploy previews</em></>, detail: <p className="m-0 leading-relaxed">“Reproduced on the monorepo fixture — it's the 10 MB manifest limit.”</p> },
  { actor: "Hamza", kind: "deploy", text: <>deployed <em>search-edge</em> to Preview</>, status: { label: "Building", tone: "warn" } },
];

type Mode = "live" | "loading" | "empty";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [now, setNow] = useState(() => Date.now());
  const base = useMemo(() => seed(now), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [events, setEvents] = useState<Activity[]>(base);
  const [mode, setMode] = useState<Mode>("live");
  const [n, setN] = useState(0);

  const push = () => {
    const t = Date.now();
    setNow(t);
    setEvents((e) => [{ ...INCOMING[n % INCOMING.length], id: `new${n}`, at: t }, ...e]);
    setN((x) => x + 1);
  };

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const c = night ? { page: "bg-[#121315] text-[#ecebe7]", seg: "ring-white/10", on: "bg-white/10", muted: "text-[#8f9197]" } : { page: "bg-[#fbfaf6] text-[#1b1a17]", seg: "ring-black/10", on: "bg-black/[0.07]", muted: "text-[#7a766d]" };

  return (
    <div className={`flex h-full min-h-[640px] w-full justify-center overflow-auto px-5 py-8 ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="w-full max-w-[720px]">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <h1 className="m-0 mr-auto text-[20px] font-semibold tracking-[-0.02em]">Vitrine activity</h1>
          <button type="button" onClick={push} disabled={mode !== "live"} className={`h-8 rounded-lg px-3 text-[12.5px] ring-1 disabled:opacity-40 ${c.seg}`}>
            Simulate new event
          </button>
          <div className={`flex rounded-lg p-0.5 text-[12px] ring-1 ${c.seg}`} role="group" aria-label="Demo state">
            {(["live", "loading", "empty"] as Mode[]).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`h-7 rounded-md px-2.5 capitalize ${mode === m ? c.on : "opacity-60"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <ActivityStream
          theme={night ? "night" : "paper"}
          label="Vitrine activity"
          now={now}
          loading={mode === "loading"}
          events={mode === "empty" ? [] : events}
          empty={
            <>
              <p>A quiet project, so far.</p>
              <span className={`mt-2 block text-[13px] ${c.muted}`}>Deploys, comments, uploads and reviews in Vitrine will appear here as they happen.</span>
            </>
          }
        />
      </div>
    </div>
  );
}
