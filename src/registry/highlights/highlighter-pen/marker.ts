export type Box = { x: number; y: number; w: number; h: number };

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

/** A stable seed from the marked words, so the same phrase is always marked the same way. */
export function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

const f = (n: number) => n.toFixed(1);

export type Stroke = {
  /** The ink, chisel start to lifted end. */
  body: string;
  /** Where the pen went back over the end: a second layer, so the ink is darker there. */
  redo: string;
  /** Pen path along the stroke's middle, for revealing it at writing speed. */
  pen: string;
  from: number;
  to: number;
};

/**
 * One pass of a chisel-tip highlighter over a line box. It is not careful: it sits low on the line,
 * starts a little late or early, stops short or runs over, tilts slightly, and its edges wander.
 */
export function stroke(b: Box, fs: number, seed: number): Stroke {
  const r = seeded(seed);
  const from = b.x + (r() - 0.3) * fs * 0.28;
  const to = b.x + b.w + (r() - 0.55) * fs * 0.42;
  const top = b.y + b.h * (0.3 + r() * 0.06);
  const bottom = b.y + b.h * (0.86 + r() * 0.06);
  const tilt = (r() - 0.5) * b.h * 0.09;
  const at = (x: number) => ((x - from) / Math.max(1, to - from)) * tilt;
  const steps = Math.max(3, Math.round((to - from) / (fs * 0.9)));
  const slant = fs * 0.14;
  const edge = (y: number, dir: 1 | -1) =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const k = dir === 1 ? i : steps - i;
      const x = from + slant * (dir === 1 ? 1 : 0) + ((to - from - slant) * k) / steps;
      return [x, y + at(x) + (r() - 0.5) * b.h * 0.035] as const;
    });
  const topEdge = edge(top, 1);
  const bottomEdge = edge(bottom, -1);
  // The lifted end: the tip leaves the paper slightly rounded and uneven.
  const endMid = [to + fs * 0.03 + r() * fs * 0.03, (top + bottom) / 2 + at(to)] as const;
  const pts = [...topEdge, endMid, ...bottomEdge, [from, bottom + at(from)] as const];
  const body = "M" + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z";
  // The pen goes back over the last stretch a little offset.
  const rs = to - fs * (0.5 + r() * 0.5);
  const off = (r() - 0.5) * b.h * 0.08;
  const redo = `M${f(rs)} ${f(top + at(rs) + off)}L${f(to - fs * 0.02)} ${f(top + at(to) + off)}L${f(endMid[0] - fs * 0.04)} ${f(endMid[1] + off)}L${f(to - fs * 0.04)} ${f(bottom + at(to) + off)}L${f(rs - fs * 0.1)} ${f(bottom + at(rs) + off)}Z`;
  const mid = (top + bottom) / 2;
  const pen = `M${f(from - fs * 0.2)} ${f(mid + at(from))}L${f(endMid[0] + fs * 0.2)} ${f(mid + at(to))}`;
  return { body, redo, pen, from, to };
}

/** Writing speed: wider lines take longer, within a range that still feels like one gesture. */
export const penTime = (width: number) => Math.round(Math.min(720, Math.max(240, width * 1.25)));
