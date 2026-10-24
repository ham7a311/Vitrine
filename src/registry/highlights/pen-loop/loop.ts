export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type P = [number, number];
const f = (n: number) => n.toFixed(1);

/** A smooth path through points (Catmull-Rom turned into cubic Béziers). */
export function smooth(pts: P[]) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/**
 * A pen loop around a w × h word: started at the upper left, carried round clockwise a little more
 * than once so the end overshoots the start, drifting outward as hands do, its radius wobbling
 * gently and the whole ellipse tipped a few degrees. Returns the loop and the points along the bottom
 * of its first turn, where an arrow from a note can land.
 */
export function loop(w: number, h: number, fs: number, seed = 1) {
  const r = seeded(seed);
  const cx = w / 2, cy = h / 2 + h * 0.03;
  const rx = w / 2 + fs * 0.2, ry = h / 2 + fs * 0.22;
  const tip = ((-3 - r() * 4) * Math.PI) / 180;
  const p1 = r() * 6.28, p2 = r() * 6.28;
  const a1 = 0.025 + r() * 0.02, a2 = 0.015 + r() * 0.015;
  const start = Math.PI * (1.08 + r() * 0.08);
  const sweep = Math.PI * 2 * (1.1 + r() * 0.07);
  const n = 56;
  const at = (k: number): P => {
    const t = k / n, th = start + sweep * t;
    const grow = 1 + t * 0.07;
    const wob = 1 + a1 * Math.sin(th + p1) + a2 * Math.sin(2 * th + p2);
    const x = Math.cos(th) * rx * grow * wob, y = Math.sin(th) * ry * grow * wob;
    return [cx + x * Math.cos(tip) - y * Math.sin(tip), cy + x * Math.sin(tip) + y * Math.cos(tip)];
  };
  const pts = Array.from({ length: n + 1 }, (_, k) => at(k));
  // The bottom of the first time round (between about 30° and 150°).
  const k0 = Math.ceil(((Math.PI * 2.17 - start) / sweep) * n), k1 = Math.floor(((Math.PI * 2.83 - start) / sweep) * n);
  return { d: smooth(pts), bottom: pts.slice(Math.max(0, k0), Math.min(n, k1) + 1) };
}

/** A hand-drawn arrow from a note up to the loop: it leaves the note sideways, curves up, and lands
 * pointing at the loop with a two-stroke head. */
export function arrow(from: P, to: P, fs: number) {
  const c1: P = [from[0] - fs * 0.38, from[1] - fs * 0.04];
  const c2: P = [to[0] - fs * 0.22, to[1] + fs * 0.42];
  const ang = Math.atan2(to[1] - c2[1], to[0] - c2[0]);
  const len = Math.max(7, fs * 0.11);
  const h1: P = [to[0] - len * Math.cos(ang - 0.5), to[1] - len * Math.sin(ang - 0.5)];
  const h2: P = [to[0] - len * Math.cos(ang + 0.5), to[1] - len * Math.sin(ang + 0.5)];
  return {
    shaft: `M${f(from[0])} ${f(from[1])}C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(to[0])} ${f(to[1])}`,
    head: `M${f(h1[0])} ${f(h1[1])}L${f(to[0])} ${f(to[1])}L${f(h2[0])} ${f(h2[1])}`,
  };
}
