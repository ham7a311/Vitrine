/** Seeded random numbers, so a swatch keeps its shape across renders and resizes. */
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
 * One loaded-brush stroke, w × h px: a slanted, ragged start on the left, edges that wander a little,
 * and a dry end on the right where the bristles split into fingers of different lengths.
 */
export function swatchPath(w: number, h: number, seed = 1) {
  const r = seeded(seed);
  const j = (k: number) => (r() - 0.5) * k;
  const pts: [number, number][] = [];
  const start = h * 0.3;
  const dry = Math.min(h * 0.75, w * 0.22);
  // Top edge, left to right.
  const steps = Math.max(6, Math.round(w / 22));
  for (let i = 0; i <= steps; i++) {
    const x = start + ((w - dry - start) * i) / steps;
    pts.push([x, h * 0.1 + j(h * 0.07) - (i / steps) * h * 0.04]);
  }
  // The dry end: fingers of bristle reaching different lengths.
  const fingers = 5;
  for (let k = 0; k < fingers; k++) {
    const y0 = h * 0.08 + ((h * 0.86) * k) / fingers;
    const y1 = y0 + (h * 0.86) / fingers;
    pts.push([w - r() * dry * 0.35, y0 + (y1 - y0) * 0.35]);
    pts.push([w - dry * (0.55 + r() * 0.4), y1 - (y1 - y0) * 0.1]);
  }
  // Bottom edge, right to left.
  for (let i = steps; i >= 0; i--) {
    const x = start * 0.15 + ((w - dry - start * 0.15) * i) / steps;
    pts.push([x, h * 0.92 + j(h * 0.06) + (i / steps) * h * 0.02]);
  }
  // The start: pressed down on a slant, a little ragged.
  pts.push([h * 0.12 + j(h * 0.08), h * 0.62]);
  pts.push([h * 0.22 + j(h * 0.08), h * 0.34]);
  return "M" + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z";
}

/** Bristle streaks along the stroke: lighter where the brush ran dry, darker where paint pooled. */
export function streaks(w: number, h: number, seed = 1) {
  const r = seeded(seed * 7 + 3);
  return Array.from({ length: Math.max(4, Math.round(h / 12)) }, () => {
    const y = h * (0.12 + r() * 0.78);
    const x0 = h * 0.2 + r() * w * 0.25;
    const x1 = w * (0.55 + r() * 0.45);
    return { d: `M${f(x0)} ${f(y)}L${f(x1)} ${f(y + (r() - 0.5) * h * 0.05)}`, width: Math.max(0.8, h * (0.02 + r() * 0.05)), light: r() > 0.3 };
  });
}
