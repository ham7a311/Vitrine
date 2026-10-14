/** A ragged paper tear: a seeded jagged line across a width, and loose fibres along it. */

export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Heights of a tear every `step` px across `width`, around `base`, by midpoint displacement (coarse waves plus fine tooth). */
export function tear(width: number, base: number, rough: number, seed = 1, step = 4) {
  const rand = seeded(seed), n = Math.max(2, Math.ceil(width / step)) + 1;
  let ys = [base + (rand() - 0.5) * rough, base + (rand() - 0.5) * rough];
  let amp = rough;
  while (ys.length < n) {
    const next: number[] = [];
    for (let i = 0; i < ys.length - 1; i++) next.push(ys[i], (ys[i] + ys[i + 1]) / 2 + (rand() - 0.5) * amp);
    next.push(ys[ys.length - 1]);
    ys = next; amp *= 0.68;
  }
  // resample to exactly n points
  return Array.from({ length: n }, (_, i) => {
    const t = (i / (n - 1)) * (ys.length - 1), lo = Math.floor(t), hi = Math.min(ys.length - 1, lo + 1);
    return { x: (i / (n - 1)) * width, y: ys[lo] + (ys[hi] - ys[lo]) * (t - lo) };
  });
}

/** Short fibres sticking out of the torn edge. */
export function fibres(edge: { x: number; y: number }[], seed = 2, every = 3) {
  const rand = seeded(seed);
  return edge.filter((_, i) => i % every === 0 && rand() < 0.7).map((p) => {
    const a = -Math.PI / 2 + (rand() - 0.5) * 1.6, len = 1.5 + rand() * 4;
    return { x1: p.x, y1: p.y, x2: p.x + Math.cos(a) * len, y2: p.y + Math.sin(a) * len };
  });
}

export const poly = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");
