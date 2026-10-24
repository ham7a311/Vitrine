export type Box = { x: number; y: number; w: number; h: number };
export type Kind = "wave" | "zigzag" | "double" | "scribble";

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

/** Smooth path through points (Catmull-Rom as cubic Béziers). */
function smooth(pts: [number, number][]) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** Wavelength of the travelling wave, so the page can shift it by exactly one period. */
export const waveLength = (fs: number) => fs * 0.44;

/**
 * The underline for one line of text, drawn under its baseline. Waves are kept strictly periodic and
 * run one period past each end, so shifting them by a wavelength (clipped to the line) loops
 * seamlessly; the other kinds are hand-jittered and stay within the line.
 */
export function underline(kind: Kind, b: Box, fs: number, seed: number): string[] {
  const r = seeded(seed);
  const y = b.y + b.h * 0.92;
  const x0 = b.x - fs * 0.03, x1 = b.x + b.w + fs * 0.03;
  if (kind === "wave") {
    const L = waveLength(fs), a = fs * 0.055;
    const start = x0 - L * 2;
    const n = Math.ceil((x1 - start) / (L / 2)) + 2;
    let d = `M${f(start)} ${f(y)}`;
    for (let i = 0; i < n; i++) d += `q${f(L / 4)} ${f(i % 2 ? a * 2 : -a * 2)} ${f(L / 2)} 0`;
    return [d];
  }
  if (kind === "zigzag") {
    const step = fs * 0.15, a = fs * 0.065;
    const pts: string[] = [];
    let i = 0;
    for (let x = x0; x <= x1; x += step * (0.88 + r() * 0.24), i++) pts.push(`${f(x)} ${f(y + (i % 2 ? a : -a) + (r() - 0.5) * a * 0.4)}`);
    return ["M" + pts.join("L")];
  }
  if (kind === "double") {
    // Two quick strokes: the second a little lower, starting later and stopping sooner.
    const line = (ya: number, from: number, to: number) => {
      const n = Math.max(3, Math.round((to - from) / (fs * 1.2)));
      return smooth(Array.from({ length: n + 1 }, (_, k) => [from + ((to - from) * k) / n, ya + (r() - 0.5) * fs * 0.045 - (k / n) * fs * 0.03] as [number, number]));
    };
    const w = x1 - x0;
    return [line(y - fs * 0.02, x0, x1), line(y + fs * 0.11, x0 + w * (0.04 + r() * 0.05), x1 - w * (0.04 + r() * 0.08))];
  }
  // Cursive loops, like a row of joined "e"s.
  const loopR = fs * 0.09, pitch = fs * 0.27;
  const pts: [number, number][] = [];
  const turns = Math.max(2, Math.floor((x1 - x0 - loopR * 2) / pitch));
  for (let k = 0; k <= turns * 10; k++) {
    const t = (k / 10) * Math.PI * 2;
    const wob = 1 + (r() - 0.5) * 0.08;
    pts.push([x0 + loopR + (pitch * t) / (Math.PI * 2) - loopR * Math.sin(t) * wob, y - loopR * 0.2 + loopR * Math.cos(t) * 0.9 * wob]);
  }
  return [smooth(pts)];
}
