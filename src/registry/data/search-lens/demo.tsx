"use client";

import { SearchLens, type LensItem, type LensSection, type RemoteHit } from "./SearchLens";

const Glyph = ({ d }: { d: string }) => (
  <svg viewBox="0 0 16 16">
    <path d={d} />
  </svg>
);
const ISSUE = <Glyph d="M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 6.5v3" />;
const DOC = <Glyph d="M4 2.5h5l3 3v8H4zM9 2.5v3h3M6 9h4M6 11h3" />;

const issue = (id: string, title: string, status: string, owner: string, extra = ""): LensItem => ({
  id,
  title,
  meta: `${id.toUpperCase()} · ${status.replace("-", " ")} · ${owner === "unassigned" ? "Unassigned" : owner === "hamza" ? "Hamza" : owner}${extra}`,
  icon: ISSUE,
  fields: { status, owner, is: owner === "hamza" ? "mine" : "" },
  detail: (
    <p className="m-0 text-[13px] leading-relaxed opacity-75">
      Opened in <b>Cycle 18</b>. Last activity 2 hours ago. <a href="#" onClick={(e) => e.preventDefault()} className="underline underline-offset-2">Open issue →</a>
    </p>
  ),
});
const doc = (id: string, title: string, meta: string, owner = "hamza", pinned = false): LensItem => ({
  id,
  title,
  meta,
  icon: DOC,
  fields: { owner, is: [owner === "hamza" ? "mine" : "", pinned ? "pinned" : ""].join(" ") },
  detail: <p className="m-0 text-[13px] leading-relaxed opacity-75">Edited by Hamza Al-Bulushi · 4 comments · shared with GUtech Studio</p>,
});
const person = (id: string, title: string, meta: string, initials: string): LensItem => ({
  id,
  title,
  meta,
  icon: <span>{initials}</span>,
  detail: <p className="m-0 text-[13px] leading-relaxed opacity-75">Member of Vitrine since March. 12 open issues, 3 docs.</p>,
});

const SECTIONS: LensSection[] = [
  {
    id: "issues",
    label: "Issues",
    items: [
      issue("atl-212", "Move search to the edge runtime", "in-progress", "hamza"),
      issue("atl-209", "Deploy previews fail on large monorepos", "open", "unassigned"),
      issue("atl-205", "Invoice reminders send twice", "open", "hamza"),
      issue("atl-198", "Add pagination to the projects API", "done", "hamza"),
      issue("atl-196", "Dark mode for the docs site", "open", "unassigned"),
      issue("atl-190", "Rate-limit the public search endpoint", "in-progress", "ci-bot"),
      issue("atl-184", "Upgrade Postgres to 17", "done", "ci-bot"),
      issue("atl-177", "Wayfinding map misses Building C", "open", "hamza"),
    ],
  },
  {
    id: "docs",
    label: "Docs",
    items: [
      doc("d-roadmap", "Q3 roadmap", "Doc · updated yesterday", "hamza", true),
      doc("d-deploy", "How we deploy Vitrine", "Runbook · 12 min read", "hamza", true),
      doc("d-search", "Search architecture notes", "Doc · updated 3 days ago"),
      doc("d-webhooks", "Webhooks API reference", "Reference · ci-bot", "ci-bot"),
      doc("d-thesis", "Thesis draft v4 — methods", "Doc · private"),
      doc("d-onboard", "Onboarding for new contributors", "Guide · updated last week", "unassigned"),
    ],
  },
  {
    id: "people",
    label: "People",
    items: [
      person("p-hamza", "Hamza Al-Bulushi", "Software Engineer · Owner", "HA"),
      person("p-ci", "ci-bot", "Automation · deploys and releases", "CI"),
      person("p-studio", "GUtech Studio", "Workspace · 14 members", "GS"),
    ],
  },
];

const ELSEWHERE: RemoteHit[] = [
  { id: "r1", place: "Wayfinder", title: "Search index for campus rooms", meta: "Issue · WAY-41" },
  { id: "r2", place: "Thesis", title: "Deploy the survey app to Oman servers", meta: "Doc" },
  { id: "r3", place: "GUtech Studio", title: "Design review: search results page", meta: "Meeting notes" },
  { id: "r4", place: "Wayfinder", title: "Invoice for the map printing", meta: "PDF" },
];

const searchElsewhere = (q: string) =>
  new Promise<RemoteHit[]>((resolve) =>
    setTimeout(() => {
      const words = q
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w && !w.includes(":"));
      resolve(words.length ? ELSEWHERE.filter((h) => words.every((w) => `${h.title} ${h.meta}`.toLowerCase().includes(w))) : []);
    }, 550),
  );

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex h-full min-h-[640px] w-full justify-center overflow-auto px-4 py-8 ${night ? "bg-[#0f1012]" : "bg-[#f3f1ec]"}`}>
      <div className="w-full max-w-[640px]">
        <SearchLens
          theme={night ? "night" : "paper"}
          title="Vitrine"
          subtitle="GUtech Studio · 17 issues, 6 docs"
          sections={SECTIONS}
          operators={{ owner: ["hamza", "unassigned", "ci-bot"], status: ["open", "in-progress", "done"], is: ["mine", "pinned"] }}
          remote={searchElsewhere}
          remoteLabel="Elsewhere in GUtech Studio"
        />
        <p className={`mt-3 text-[12px] ${night ? "text-[#8b8d93]" : "text-[#77736b]"}`}>Press / to search · try “deploy”, then “owner:” · ↑↓ and Enter · Esc</p>
      </div>
    </div>
  );
}
