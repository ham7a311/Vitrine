/** Geometry for an H-pattern gate: one horizontal rail, one slot per state above or below it. */
export type Slot = { col: number; side: "up" | "down" };
export type Point = { x: number; y: number };

export const COL = 140, PAD = 70, RAIL = 150, DEPTH = 82, MOUTH = 14;

export function layout(slots: Record<string, Slot>) {
  const cols = Math.max(...Object.values(slots).map((s) => s.col)) + 1;
  const width = PAD * 2 + COL * (cols - 1);
  const x = (col: number) => PAD + col * COL;
  const at = (id: string) => {
    const s = slots[id], dir = s.side === "up" ? -1 : 1;
    return { cx: x(s.col), end: RAIL + dir * DEPTH, mouth: RAIL + dir * MOUTH, dir };
  };
  return { cols, width, height: RAIL * 2, railFrom: x(0), railTo: x(cols - 1), at };
}

type Layout = ReturnType<typeof layout>;

/** Nearest point on the cut, where `open` says how deep each slot may be entered. */
export function project(L: Layout, ids: string[], open: (id: string) => boolean, p: Point): Point {
  let best: Point = { x: Math.max(L.railFrom, Math.min(L.railTo, p.x)), y: RAIL };
  let bestD = Math.hypot(best.x - p.x, best.y - p.y);
  for (const id of ids) {
    const s = L.at(id);
    const limit = open(id) ? s.end : s.mouth;
    const lo = Math.min(RAIL, limit), hi = Math.max(RAIL, limit);
    const q = { x: s.cx, y: Math.max(lo, Math.min(hi, p.y)) };
    const d = Math.hypot(q.x - p.x, q.y - p.y);
    if (d < bestD) { best = q; bestD = d; }
  }
  return best;
}

/** Which slot a point sits in, and how far in (0 at the rail, 1 at the end). */
export function slotAt(L: Layout, ids: string[], p: Point): { id: string; depth: number } | null {
  for (const id of ids) {
    const s = L.at(id);
    if (Math.abs(p.x - s.cx) < 1 && (p.y - RAIL) * s.dir > 0) return { id, depth: ((p.y - RAIL) * s.dir) / DEPTH };
  }
  return null;
}

/** The way along the cut from a point to a point in a slot: out to the rail, along it, then in. */
export function route(L: Layout, from: Point, to: Point): Point[] {
  const pts: Point[] = [from];
  if (from.y !== RAIL && from.x !== to.x) pts.push({ x: from.x, y: RAIL });
  if (from.x !== to.x) pts.push({ x: to.x, y: RAIL });
  pts.push(to);
  return pts.filter((p, i) => i === 0 || p.x !== pts[i - 1].x || p.y !== pts[i - 1].y);
}
