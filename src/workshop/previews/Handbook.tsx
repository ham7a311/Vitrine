"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PleatCrumbs, type Crumb } from "@/registry/navigation/pleat-crumbs/PleatCrumbs";
import { ThumbedEdge, type EdgeSection } from "@/registry/navigation/thumbed-edge/ThumbedEdge";
import { VersionStack, type Version } from "@/registry/cards/version-stack/VersionStack";

type Node = { id: string; label: string; children?: Node[] };
const TREE: Node[] = [
  { id: "vitrine", label: "Vitrine", children: [
    { id: "handbook", label: "Handbook", children: [
      { id: "engineering", label: "Engineering", children: [{ id: "onboarding", label: "Onboarding" }, { id: "on-call", label: "On-call" }, { id: "security", label: "Security" }] },
      { id: "design", label: "Design", children: [{ id: "critique", label: "Critique" }, { id: "tokens", label: "Tokens" }] },
      { id: "people", label: "People", children: [{ id: "leave", label: "Leave" }, { id: "hiring", label: "Hiring" }] },
    ] },
    { id: "runbooks", label: "Runbooks", children: [{ id: "incidents", label: "Incidents", children: [{ id: "sev", label: "Severity levels" }] }] },
  ] },
];

function pathFor(ids: string[]): Crumb[] {
  const out: Crumb[] = [];
  let level: Node[] = TREE;
  for (const id of ids) {
    const node = level.find((n) => n.id === id);
    if (!node) break;
    out.push({ id: node.id, label: node.label, href: "#", siblings: level.map((n) => ({ id: n.id, label: n.label })) });
    level = node.children ?? [];
  }
  return out;
}
function extend(ids: string[], depth: number): string[] {
  const out = [...ids];
  let level: Node[] = TREE;
  for (const id of out) level = level.find((n) => n.id === id)?.children ?? [];
  while (out.length < depth && level.length) {
    out.push(level[0].id);
    level = level[0].children ?? [];
  }
  return out;
}

const SECTIONS: (EdgeSection & { body: string[] })[] = [
  { id: "hb-first-week", title: "Your first week", body: ["By Friday you should have shipped one small change to production. It will be something dull, a copy fix or a log line, and that is the point: the first change is about the path, not the code.", "Your buddy owns your first week. Ask them before you ask the channel; they have been told to expect it."] },
  { id: "hb-access", title: "Access & accounts", body: ["Sign in with your GUtech Microsoft account. Membership in the Vitrine workspace is granted by your lead within one working day.", "Production access is separate and time-boxed. Request it from the on-call rota; it lapses after twelve hours.", "If a repository disappears for you, the cause is almost always a missing team mapping, not a broken login."] },
  { id: "hb-environments", title: "Environments", body: ["Every change moves through preview, staging and production. Previews are created per pull request and deleted on merge.", "Staging mirrors production's configuration but never its data. Never point staging at a production database, even briefly.", "The banner in the top bar is always accurate. If it says production, act like it."] },
  { id: "hb-review", title: "Code review", body: ["Every pull request needs one review from someone who did not write it. Keep changes small enough to read in one sitting.", "Review for behaviour first, then correctness, then names, then style. Blocking comments say why; non-blocking ones start with nit."] },
  { id: "hb-releasing", title: "Releasing", body: ["We release on weekday mornings, never on Thursday afternoons. A release is a merge to main and a green deploy check.", "Every release has an owner who watches the dashboards for thirty minutes and rolls back at the first sign of trouble.", "Rollbacks are boring by design: one button, no discussion. Investigate afterwards.", "Write the release note before you deploy, not after."] },
  { id: "hb-incidents", title: "Incidents", body: ["If something is on fire, page on-call first and explain second. Declaring an incident is cheap; hiding one is not.", "Every incident ends with a written review within five working days. It names causes, not people."] },
  { id: "hb-changes", title: "Changes to this handbook", body: ["The handbook is versioned like the product. Drag the top sheet to go back through what changed and why."] },
];

const SEED: Record<string, number> = { "hb-first-week": 8, "hb-access": 22, "hb-environments": 11, "hb-review": 30, "hb-releasing": 54, "hb-incidents": 14, "hb-changes": 3 };

const VERSIONS: Version[] = [
  { version: "v12", date: "Sep 2026", title: "On-call gets a buddy", notes: [{ kind: "Added", text: "New on-call engineers shadow for two rotations first." }, { kind: "Changed", text: "Production access lapses after 12 hours, not 24." }] },
  { version: "v11", date: "Jul 2026", title: "No Thursday releases", notes: [{ kind: "Changed", text: "Releases stop at noon on Thursdays." }, { kind: "Fixed", text: "Broken links to the incident template." }] },
  { version: "v10", date: "May 2026", title: "Preview environments", notes: [{ kind: "Added", text: "Every pull request gets its own preview." }] },
  { version: "v9", date: "Feb 2026", title: "Review etiquette", notes: [{ kind: "Added", text: "The nit prefix for non-blocking comments." }] },
];

export default function Handbook() {
  const [ids, setIds] = useState(["vitrine", "handbook", "engineering", "onboarding"]);
  const path = useMemo(() => pathFor(ids), [ids]);
  const scroller = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  // Under 720px the edge turns on its side and runs across the top of the page.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < 720));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className="flex h-full w-full flex-col bg-[#f3f1ec] text-[#1b1a17]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <header className="flex flex-none flex-wrap items-center gap-x-6 gap-y-2 border-b border-black/[0.07] px-4 py-3 sm:px-8">
        <span className="text-[1.05rem] font-semibold tracking-[-0.02em]" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
          Vitrine Handbook
        </span>
        <div className="min-w-0 basis-full sm:basis-auto sm:flex-1">
          <PleatCrumbs path={path} onNavigate={(level, id) => setIds(extend([...ids.slice(0, level), id], ids.length))} />
        </div>
      </header>

      <div className={`mx-auto flex min-h-0 w-full max-w-[64rem] flex-1 ${narrow ? "flex-col gap-3 px-3 pt-3" : "gap-8 px-8 py-6"}`}>
        {narrow && (
          <div className="flex-none">
            <ThumbedEdge scroller={scroller} sections={SECTIONS} storageKey="workshop-handbook" seedWear={SEED} seedRibbon={{ id: "hb-releasing", at: 0.4 }} orientation="horizontal" />
          </div>
        )}
        <div ref={scroller} tabIndex={0} aria-label="Onboarding" className={`relative min-h-0 flex-1 overflow-y-auto bg-white ring-1 ring-black/[0.07] ${narrow ? "rounded-t-2xl px-5" : "rounded-2xl px-12"}`}>
          <div className={narrow ? "pb-4 pt-6" : "pb-6 pt-10"}>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#77736b]">Engineering · Onboarding</p>
            <h1 className="mt-2 text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] tracking-[-0.02em]" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
              Onboarding
            </h1>
            <p className="mt-3 max-w-[56ch] text-[0.95rem] leading-relaxed text-[#55524b]">The shortest path from your first day to your first merged change. Read it once from the top; after that it is a reference.</p>
          </div>
          {SECTIONS.map((s, k) => (
            <section key={s.id} id={s.id} className={narrow ? "py-5" : "py-7"}>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#77736b]">{String(k + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 text-[1.3rem] font-semibold tracking-[-0.02em]" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                {s.title}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 max-w-[62ch] text-[0.925rem] leading-[1.7] text-[#3b3a35]">
                  {p}
                </p>
              ))}
              {s.id === "hb-changes" && (
                <div className="mt-6 flex justify-center rounded-2xl bg-[#0b080d] px-2 py-10 sm:px-4">
                  <VersionStack versions={VERSIONS} />
                </div>
              )}
            </section>
          ))}
          <p className="pb-10 pt-4 text-[0.8125rem] text-[#77736b]">Last edited by Hamza Al-Bulushi · 12 Sep 2026 · Suggest a change in #handbook</p>
        </div>
        {!narrow && (
          <div className="flex min-h-0 w-[8.5rem] flex-none flex-col">
            <ThumbedEdge className="min-h-0 flex-1" scroller={scroller} sections={SECTIONS} storageKey="workshop-handbook" seedWear={SEED} seedRibbon={{ id: "hb-releasing", at: 0.4 }} />
          </div>
        )}
      </div>
    </div>
  );
}
