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

const f = (n: number) => n.toFixed(1);

/** Fragments of one line become a single box. */
export function mergeLines(rects: Box[]) {
  const lines: Box[] = [];
  for (const r of rects) {
    if (r.w < 1) continue;
    const last = lines[lines.length - 1];
    if (last && Math.abs(r.y - last.y) < Math.max(2, last.h * 0.3)) {
      const x2 = Math.max(last.x + last.w, r.x + r.w);
      last.x = Math.min(last.x, r.x);
      last.w = x2 - last.x;
      last.h = Math.max(last.h, r.h);
    } else lines.push({ ...r });
  }
  return lines;
}

/**
 * A redaction bar for one line: a marker stroke that fully covers the text — overshooting both ends
 * and the line's height a little — with edges that are not quite straight.
 */
export function bar(b: Box, fs: number, seed: number) {
  const r = seeded(seed);
  const x0 = b.x - fs * 0.08, x1 = b.x + b.w + fs * 0.1;
  const y0 = b.y + b.h * 0.04, y1 = b.y + b.h * 0.98;
  const n = Math.max(3, Math.round((x1 - x0) / (fs * 1.1)));
  const wob = fs * 0.03;
  const top = Array.from({ length: n + 1 }, (_, i) => `${f(x0 + ((x1 - x0) * i) / n)} ${f(y0 + (r() - 0.5) * wob)}`);
  const bottom = Array.from({ length: n + 1 }, (_, i) => `${f(x1 - ((x1 - x0) * i) / n)} ${f(y1 + (r() - 0.5) * wob)}`);
  const end = `${f(x1 + fs * (0.02 + r() * 0.04))} ${f((y0 + y1) / 2)}`;
  const start = `${f(x0 - fs * (0.02 + r() * 0.03))} ${f((y0 + y1) / 2 + (r() - 0.5) * wob)}`;
  return `M${top.join("L")}L${end}L${bottom.join("L")}L${start}Z`;
}
