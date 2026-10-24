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

const f = (n: number) => n.toFixed(1);

/**
 * An organic, closed blob around (cx, cy): an ellipse whose radius wanders with a few low harmonics,
 * the way a pool of water spreads on paper — never a circle, never spiky. Smoothed with Catmull-Rom.
 */
export function blob(cx: number, cy: number, rx: number, ry: number, seed = 1, n = 30) {
  const r = seeded(seed);
  const waves = [2, 3, 5].map((k, i) => ({ k, a: [0.07, 0.05, 0.025][i] * (0.6 + r() * 0.8), p: r() * Math.PI * 2 }));
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    const m = 1 + waves.reduce((s, w) => s + w.a * Math.sin(w.k * t + w.p), 0);
    return [cx + Math.cos(t) * rx * m, cy + Math.sin(t) * ry * m] as const;
  });
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}
