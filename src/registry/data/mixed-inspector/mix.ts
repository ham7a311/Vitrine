/* Mixed Inspector — records, staged edits and the value distributions a selection shows. Pure. */

export const STATUSES = ["Backlog", "Todo", "In progress", "Done"] as const;
export const PRIORITIES = ["Urgent", "High", "Medium", "Low"] as const;
export const PEOPLE = ["Noor", "Idris", "Mei", "Tomás"] as const;
export const LABELS = ["bug", "perf", "docs", "api", "design"] as const;

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Person = (typeof PEOPLE)[number];
export type Label = (typeof LABELS)[number];
export type Field = "status" | "priority" | "assignee";

export type Rec = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: Person;
  labels: Label[];
  /** Archived records are read-only; applying to them always fails. */
  archived?: boolean;
  /** The first save conflicts with someone else's edit; a retry goes through. */
  conflict?: boolean;
};

export type Patch = Partial<Pick<Rec, Field | "labels">>;

export const FIELDS: { id: Field; name: string; values: readonly string[] }[] = [
  { id: "status", name: "Status", values: STATUSES },
  { id: "priority", name: "Priority", values: PRIORITIES },
  { id: "assignee", name: "Assignee", values: PEOPLE },
];

export const RECORDS: Rec[] = [
  { id: "VT-118", title: "Export times out on large workspaces", status: "In progress", priority: "Urgent", assignee: "Noor", labels: ["bug", "perf"] },
  { id: "VT-121", title: "Retry webhooks with backoff", status: "Todo", priority: "High", assignee: "Idris", labels: ["api"] },
  { id: "VT-124", title: "Document the rate limits", status: "Todo", priority: "Medium", assignee: "Mei", labels: ["docs", "api"], conflict: true },
  { id: "VT-127", title: "Empty state for saved views", status: "Backlog", priority: "Low", assignee: "Tomás", labels: ["design"] },
  { id: "VT-130", title: "Slow first paint on the dashboard", status: "In progress", priority: "High", assignee: "Noor", labels: ["perf"] },
  { id: "VT-133", title: "Search ignores accented names", status: "Todo", priority: "High", assignee: "Idris", labels: ["bug"] },
  { id: "VT-136", title: "Old billing page redirect", status: "Done", priority: "Low", assignee: "Mei", labels: ["bug"], archived: true },
  { id: "VT-139", title: "Paginate the audit log API", status: "Backlog", priority: "Medium", assignee: "Idris", labels: ["api", "perf"] },
  { id: "VT-142", title: "Keyboard focus lost after delete", status: "Todo", priority: "Urgent", assignee: "Tomás", labels: ["bug", "design"] },
  { id: "VT-145", title: "Explain plan limits in settings", status: "Backlog", priority: "Low", assignee: "Mei", labels: ["docs"] },
];

export const apply = (r: Rec, p?: Patch): Rec => (p ? { ...r, ...p } : r);

/** Distinct values of a field across records, most common first, with the ids that hold each. */
export function distribution(recs: Rec[], field: Field): { value: string; ids: string[] }[] {
  const m = new Map<string, string[]>();
  for (const r of recs) m.set(r[field], [...(m.get(r[field]) ?? []), r.id]);
  return [...m.entries()].map(([value, ids]) => ({ value, ids })).sort((a, b) => b.ids.length - a.ids.length);
}

/** How many of the records carry a label. */
export const quorum = (recs: Rec[], label: Label) => recs.filter((r) => r.labels.includes(label)).length;

/**
 * A label's tri-state cycle. From a mixed start it goes all → none → back to exactly how it was, so a
 * partial state is never lost by clicking through it.
 */
export type Cycle = "orig" | "all" | "none";
export function nextCycle(c: Cycle, origCount: number, total: number): Cycle {
  const mixed = origCount > 0 && origCount < total;
  if (!mixed) return origCount === total ? (c === "none" ? "orig" : "none") : c === "all" ? "orig" : "all";
  return c === "orig" ? "all" : c === "all" ? "none" : "orig";
}

/** Plain-language summary of staged changes, for the diff bar. */
export function summarise(before: Rec[], after: Rec[]): { parts: string[]; changed: string[] } {
  const parts: string[] = [];
  const changed = new Set<string>();
  for (const f of FIELDS) {
    const to = new Map<string, number>();
    before.forEach((b, i) => {
      if (b[f.id] !== after[i][f.id]) {
        to.set(after[i][f.id], (to.get(after[i][f.id]) ?? 0) + 1);
        changed.add(b.id);
      }
    });
    to.forEach((n, v) => parts.push(`${f.name} → ${v} on ${n}`));
  }
  for (const l of LABELS) {
    let add = 0;
    let del = 0;
    before.forEach((b, i) => {
      const had = b.labels.includes(l);
      const has = after[i].labels.includes(l);
      if (had !== has) changed.add(b.id);
      if (!had && has) add++;
      if (had && !has) del++;
    });
    if (add) parts.push(`+${l} on ${add}`);
    if (del) parts.push(`−${l} on ${del}`);
  }
  return { parts, changed: [...changed] };
}

export const matches = (r: Rec, q: string) => {
  const s = q.trim().toLowerCase();
  return !s || `${r.id} ${r.title} ${r.assignee} ${r.status} ${r.labels.join(" ")}`.toLowerCase().includes(s);
};
