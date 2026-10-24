export type Vec = { x: number; y: number };

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** CSS cubic-bezier(x1, y1, x2, y2) as a function of progress, solved by Newton's method with a bisection fallback. */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const e = sx(t) - x, d = dx(t);
      if (Math.abs(e) < 1e-5) return sy(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 24; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
    return sy(t);
  };
}

/** The distance from p to the farthest corner of a w × h box. */
export const farthest = (p: Vec, w: number, h: number) => Math.hypot(Math.max(p.x, w - p.x), Math.max(p.y, h - p.y));

const n = (v: number) => (Math.round(v * 10) / 10).toString();
/** Path data for a rectangle, clockwise. */
export const rect = (x: number, y: number, w: number, h: number) => `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}z`;
/** Path data for a circle, clockwise. */
export const circle = (cx: number, cy: number, r: number) => {
  const q = Math.max(0.01, r);
  return `M${n(cx - q)} ${n(cy)}a${n(q)} ${n(q)} 0 1 1 ${n(2 * q)} 0a${n(q)} ${n(q)} 0 1 1 ${n(-2 * q)} 0z`;
};
/** Path data for a closed polygon. */
export const poly = (pts: Vec[]) => (pts.length < 3 ? "" : `M${pts.map((p) => `${n(p.x)} ${n(p.y)}`).join("L")}z`);
/** A polygon as CSS polygon() points (an empty one hides everything). */
export const polygon = (pts: Vec[]) => (pts.length < 3 ? "polygon(0 0, 0 0, 0 0)" : `polygon(${pts.map((p) => `${n(p.x)}px ${n(p.y)}px`).join(", ")})`);

/** Clip a convex polygon to the half-plane where (p − at) · dir ≥ 0 (Sutherland–Hodgman, one edge). */
export function keep(pts: Vec[], at: Vec, dir: Vec): Vec[] {
  const side = (p: Vec) => (p.x - at.x) * dir.x + (p.y - at.y) * dir.y;
  const out: Vec[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], sa = side(a), sb = side(b);
    if (sa >= 0) out.push(a);
    if ((sa >= 0) !== (sb >= 0)) { const t = sa / (sa - sb); out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }); }
  }
  return out;
}

/** Reflect p across the line through `at` with unit normal `dir`. */
export function mirror(p: Vec, at: Vec, dir: Vec): Vec {
  const d = (p.x - at.x) * dir.x + (p.y - at.y) * dir.y;
  return { x: p.x - 2 * d * dir.x, y: p.y - 2 * d * dir.y };
}

export const box = (w: number, h: number): Vec[] => [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h }];

/** Voronoi cells of the seeds inside a w × h box: each is the box cut by the bisector with every other seed. */
export function voronoi(seeds: Vec[], w: number, h: number): Vec[][] {
  return seeds.map((s, i) => {
    let cell = box(w, h);
    for (let j = 0; j < seeds.length && cell.length; j++) {
      if (j === i) continue;
      const o = seeds[j], mid = { x: (s.x + o.x) / 2, y: (s.y + o.y) / 2 };
      cell = keep(cell, mid, { x: s.x - o.x, y: s.y - o.y });
    }
    return cell;
  });
}

export const centroid = (pts: Vec[]): Vec => {
  let x = 0, y = 0;
  for (const p of pts) { x += p.x; y += p.y; }
  return { x: x / (pts.length || 1), y: y / (pts.length || 1) };
};
