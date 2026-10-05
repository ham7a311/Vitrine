/**
 * Dust-and-magnet layout. Each magnet stands for one attribute; every item is
 * pulled toward each magnet in proportion to how much of that attribute it has
 * (or how little, when the magnet is flipped). The rest position is a weighted
 * mean, then a fixed number of relaxation passes stops dots overlapping. Same
 * input, same picture: there is no simulation running in the background.
 */
export type MagnetItem = { id: string; label: string; values: Record<string, number> };
export type Magnet = { key: string; x: number; y: number; invert?: boolean };
export type Range = Record<string, [number, number]>;
export type Pos = { x: number; y: number };

export function ranges(items: MagnetItem[], keys: string[]): Range {
  const out: Range = {};
  for (const k of keys) {
    const vs = items.map((i) => i.values[k]).filter((v) => Number.isFinite(v));
    out[k] = [Math.min(...vs), Math.max(...vs)];
  }
  return out;
}

/** 0..1 pull of one magnet on one item. */
export function pull(item: MagnetItem, m: Magnet, r: Range) {
  const [lo, hi] = r[m.key] ?? [0, 1];
  const t = hi > lo ? (item.values[m.key] - lo) / (hi - lo) : 0.5;
  const v = m.invert ? 1 - t : t;
  return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0;
}

const CENTRE = 0.35;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** Positions in pixels for a board of w×h, dots of radius `rad`. Magnet coordinates are 0..1. */
export function layout(items: MagnetItem[], magnets: Magnet[], r: Range, w: number, h: number, rad = 8, passes = 40): Pos[] {
  const pad = rad + 4;
  const pts = items.map((item, i) => {
    let sx = CENTRE * 0.5, sy = CENTRE * 0.5, sw = CENTRE;
    for (const m of magnets) { const p = pull(item, m, r) ** 2; sx += p * m.x; sy += p * m.y; sw += p; }
    // A small, fixed spiral offset so identical items don't sit on one point.
    const a = i * GOLDEN, d = 2 + Math.sqrt(i) * 1.5;
    return { x: (sx / sw) * w + Math.cos(a) * d, y: (sy / sw) * h + Math.sin(a) * d };
  });
  const min = rad * 2 + 3;
  for (let pass = 0; pass < passes; pass++) {
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y;
      const dist = Math.hypot(dx, dy) || 0.01;
      if (dist >= min) continue;
      const push = (min - dist) / 2, ux = dx / dist, uy = dy / dist;
      pts[i].x -= ux * push; pts[i].y -= uy * push; pts[j].x += ux * push; pts[j].y += uy * push;
    }
    for (const p of pts) { p.x = Math.max(pad, Math.min(w - pad, p.x)); p.y = Math.max(pad, Math.min(h - pad, p.y)); }
  }
  return pts;
}

/** Items ordered by how strongly one magnet pulls them. */
export function closest(items: MagnetItem[], m: Magnet, r: Range) {
  return [...items].sort((a, b) => pull(b, m, r) - pull(a, m, r));
}
