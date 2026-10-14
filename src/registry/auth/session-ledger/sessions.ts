export type Device = "laptop" | "desktop" | "phone" | "tablet";
export type Session = { id: string; device: Device; name: string; browser: string; place: string; lastActive: number; current?: boolean };

/** Take sessions out, remembering where each was so they can go back exactly. */
export function remove<T extends { id: string }>(list: T[], ids: string[]) {
  const removed: { item: T; index: number }[] = [];
  list.forEach((item, index) => { if (ids.includes(item.id)) removed.push({ item, index }); });
  return { kept: list.filter((s) => !ids.includes(s.id)), removed };
}

/** Put removed sessions back in their old places. */
export function restore<T extends { id: string }>(list: T[], removed: { item: T; index: number }[]) {
  const out = list.filter((s) => !removed.some((r) => r.item.id === s.id));
  for (const r of [...removed].sort((a, b) => a.index - b.index)) out.splice(Math.min(r.index, out.length), 0, r.item);
  return out;
}

/** "Active now", "12 minutes ago", "3 hours ago", "Yesterday", "4 days ago", "2 weeks ago". */
export function ago(ts: number, now: number) {
  const m = Math.max(0, Math.round((now - ts) / 60000));
  if (m < 2) return "Active now";
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return h === 1 ? "An hour ago" : `${h} hours ago`;
  const d = Math.round(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 14) return `${d} days ago`;
  return `${Math.round(d / 7)} weeks ago`;
}
