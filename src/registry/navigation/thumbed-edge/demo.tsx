"use client";

import { useEffect, useRef, useState } from "react";
import { ThumbedEdge, type EdgeSection } from "./ThumbedEdge";

const SECTIONS: (EdgeSection & { body: string[] })[] = [
  { id: "welcome", title: "Welcome to Vitrine", body: ["Vitrine is where GUtech Studio plans, builds and ships its campus tools. This handbook is the shortest path from your first day to your first merged change.", "Read it once from the top. After that, treat it as a reference: you will come back to the same three or four chapters again and again."] },
  { id: "access", title: "Access & accounts", body: ["Sign in with your GUtech Microsoft account. Membership in the Vitrine workspace is granted by your team lead within one working day.", "Production access is separate and time-boxed. Request it from the on-call rota, and it lapses after twelve hours.", "If you lose access to a repository, the fix is almost always a missing team mapping, not a broken login."] },
  { id: "environments", title: "Environments", body: ["Every change moves through preview, staging and production. Preview environments are created per pull request and deleted on merge.", "Staging mirrors production's configuration but not its data. Never point staging at a production database, even briefly.", "The environment banner in the top bar is always accurate. If it says production, act like it."] },
  { id: "reviews", title: "Code review", body: ["Every pull request needs one review from someone who did not write it. Keep changes small enough to read in a single sitting.", "Review for behaviour first: does it do what the description says? Then correctness, then names, then style.", "Blocking comments say why. Non-blocking comments are prefixed with nit."] },
  { id: "releases", title: "Releasing", body: ["We release on weekday mornings, never on Thursdays after noon. A release is a merge to main and a green deploy check.", "Every release has an owner. The owner watches the dashboards for thirty minutes after the deploy and rolls back at the first sign of trouble.", "Rollbacks are boring by design: one button, no discussion. Investigate afterwards.", "Write the release note before you deploy, not after."] },
  { id: "incidents", title: "Incidents", body: ["If something is on fire, page the on-call engineer first and explain second. Declaring an incident is cheap; hiding one is not.", "The incident channel has one owner at a time. Hand over explicitly, out loud.", "Every incident ends with a short written review within five working days. It names causes, not people."] },
  { id: "data", title: "Working with data", body: ["Student records are personal data. You may look at the minimum needed to fix the problem in front of you, and you must not copy them off the platform.", "Use the anonymised snapshot for analysis. If the snapshot cannot answer your question, ask the data steward before reaching for the real tables."] },
  { id: "tools", title: "Tools we use", body: ["Linear for planning, GitHub for code, Vercel for hosting, Figma for design, and a shared runbook for everything that must not live in someone's head.", "We keep the list short on purpose. Adding a tool means retiring one."] },
  { id: "help", title: "Getting help", body: ["Ask in the team channel before you are stuck for more than half an hour. Nobody has ever been criticised for asking early.", "For anything about people, pay or contracts, talk to your lead directly, not to the channel."] },
];

const SEED: Record<string, number> = { welcome: 6, access: 22, environments: 9, reviews: 34, releases: 58, incidents: 12, data: 4, tools: 2, help: 1 };

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const scroller = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  // Narrow container: the edge turns on its side and runs across the top of the document.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < 600));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-8 ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f3f1ec] text-[#1b1a17]"}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div ref={wrap} className={`flex w-full max-w-[720px] ${narrow ? "h-[min(640px,calc(100svh-4rem))] flex-col-reverse gap-3" : "h-[520px] gap-5"}`}>
        <div ref={scroller} className={`min-h-0 flex-1 overflow-y-auto rounded-2xl px-5 py-1 ring-1 sm:px-9 ${night ? "bg-[#16171a] ring-white/[0.07]" : "bg-white ring-black/[0.07]"}`} tabIndex={0} aria-label="Vitrine handbook">
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className={narrow ? "py-5" : "py-7"}>
              <p className={`text-[11px] font-medium uppercase tracking-[0.14em] ${night ? "text-[#8b8d93]" : "text-[#77736b]"}`}>{String(i + 1).padStart(2, "0")}</p>
              <h2 className={`mt-1 font-semibold tracking-[-0.02em] ${narrow ? "text-[1.2rem]" : "text-[1.35rem]"}`} style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className={`mt-3 text-[0.9rem] leading-[1.65] ${night ? "text-[#c9cacf]" : "text-[#3b3a35]"}`}>{p}</p>
              ))}
            </section>
          ))}
        </div>
        <div className={narrow ? "flex-none px-1" : "flex min-h-0 w-[8.5rem] flex-col"}>
          <ThumbedEdge className={narrow ? "" : "min-h-0 flex-1"} scroller={scroller} sections={SECTIONS} storageKey={`thumbed-edge-demo-${variant}`} seedWear={SEED} seedRibbon={{ id: "releases", at: 0.55 }} orientation={narrow ? "horizontal" : "vertical"} theme={night ? "night" : "paper"} />
        </div>
      </div>
    </div>
  );
}
