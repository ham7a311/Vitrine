"use client";
import { useState } from "react";
import { QueryTokens, matchesQuery, tokenize, type KeyDef } from "./QueryTokens";

const KEYS: KeyDef[] = [
  { key: "status", label: "Status", kind: "enum", values: ["open", "closed", "draft"] },
  { key: "owner", label: "Owner", kind: "enum", values: ["me", "layla", "omar", "salma"] },
  { key: "label", label: "Label", kind: "enum", values: ["bug", "sync", "design", "docs", "billing"] },
  { key: "updated", label: "Updated", kind: "date" },
  { key: "priority", label: "Priority", kind: "number" },
];
const TITLES = ["Offline sync drops edits made on the plane", "Arabic menus clip in the sidebar", "Export to Word loses table borders", "Invoice PDF shows the wrong VAT line", "Share links expire a day early", "Search misses words inside PDFs", "Dark mode contrast on comments", "Sync conflict dialog has no undo", "Audit log time zone is UTC only", "Templates lose their cover image", "Phone app crashes on large folders", "Billing page double-counts seats", "Docs: how recovery bin works", "Mentions don't notify guests", "Slow first load in Salalah office", "Drag to reorder pages flickers", "Annual plan proration rounding", "Sync stalls after laptop sleep", "Comment threads collapse unexpectedly", "Docs: keyboard shortcuts page", "Design review: new onboarding", "Upload stalls at 99% on 3G", "Invite email lands in spam", "Tag filter ignores capitals", "Calendar view week starts on Monday", "Sync shows stale avatars", "Bug bash: field notes editor", "Docs: export formats", "Billing emails missing receipt", "Design: empty state for search"];
const OWNERS = ["me", "layla", "omar", "salma"];
const ISSUES = TITLES.map((title, i) => ({
  id: `MAS-${120 + i}`,
  title,
  status: ["open", "open", "closed", "draft"][i % 4],
  owner: OWNERS[(i * 3) % 4],
  label: [/sync/i.test(title) ? "sync" : /billing|invoice|plan|vat/i.test(title) ? "billing" : /docs/i.test(title) ? "docs" : /design|dark|empty/i.test(title) ? "design" : "bug"],
  updated: `2026-${String(7 + (i % 4)).padStart(2, "0")}-${String(1 + ((i * 7) % 28)).padStart(2, "0")}`,
  priority: 1 + ((i * 5) % 4),
}));

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const [q, setQ] = useState("status:open -label:docs updated:>2026-06 sync");
  const tokens = tokenize(q, KEYS);
  const shown = ISSUES.filter((i) => matchesQuery(tokens, i, KEYS));
  const muted = dark ? "text-[#96a0ad]" : "text-[#66707c]";
  return (
    <div className={`min-h-full w-full px-4 py-10 ${dark ? "bg-[#0d0f12]" : "bg-[#eef0f3]"}`}>
      <div className="mx-auto w-full max-w-[44rem]">
        <QueryTokens keys={KEYS} defaultValue={q} onChange={(_, text) => setQ(text)} label="Filter issues" theme={dark ? "dark" : "light"} />
        <p className={`mt-5 text-[13px] ${muted}`}>{shown.length} of {ISSUES.length} issues</p>
        <ul className={`mt-2 divide-y overflow-hidden rounded-xl border ${dark ? "divide-white/10 border-white/10 bg-[#16191d] text-[#e6e9ee]" : "divide-black/10 border-black/10 bg-white text-[#1b1f24]"}`}>
          {shown.map((i) => (
            <li key={i.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 text-[14px]">
              <span className={`font-mono text-[12px] ${muted}`}>{i.id}</span>
              <span className="truncate">{i.title}</span>
              <span className={`text-[12px] ${muted}`}>{i.status} · {i.owner} · {i.updated.slice(5)}</span>
            </li>
          ))}
          {shown.length === 0 && <li className={`px-4 py-6 text-center text-[14px] ${muted}`}>Nothing matches every filter.</li>}
        </ul>
      </div>
    </div>
  );
}
