export type Box = { x: number; y: number; w: number; h: number };
export type Knob = { x: number; y: number; dx: number; dy: number };

/**
 * Where the markers go. One line gets all eight — four corners and four edge midpoints. A phrase that
 * wraps is one selection: the first line carries the start (left corners, left and top midpoints),
 * the last line the end (right corners, right and bottom midpoints), and lines between carry none.
 * dx/dy point outward, which sets the way a triangle points.
 */
export function knobs(lines: Box[]): Knob[] {
  if (!lines.length) return [];
  const a = lines[0], z = lines[lines.length - 1];
  const start: Knob[] = [
    { x: a.x, y: a.y, dx: -1, dy: -1 },
    { x: a.x, y: a.y + a.h / 2, dx: -1, dy: 0 },
    { x: a.x, y: a.y + a.h, dx: -1, dy: 1 },
    { x: a.x + a.w / 2, y: a.y, dx: 0, dy: -1 },
  ];
  const end: Knob[] = [
    { x: z.x + z.w, y: z.y, dx: 1, dy: -1 },
    { x: z.x + z.w, y: z.y + z.h / 2, dx: 1, dy: 0 },
    { x: z.x + z.w, y: z.y + z.h, dx: 1, dy: 1 },
    { x: z.x + z.w / 2, y: z.y + z.h, dx: 0, dy: 1 },
  ];
  return [...start, ...end];
}

/** A marker of side s centred on 0,0; triangles point along (dx, dy). */
export function knobPath(shape: "circle" | "square" | "diamond" | "triangle", s: number, dx = 0, dy = -1) {
  const r = s / 2;
  if (shape === "square") return `M${-r} ${-r}h${s}v${s}h${-s}Z`;
  if (shape === "diamond") return `M0 ${-r * 1.25}L${r * 1.25} 0L0 ${r * 1.25}L${-r * 1.25} 0Z`;
  if (shape === "triangle") {
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len, px = -uy, py = ux;
    const tip = r * 1.35, base = r * 0.75, half = r * 0.95;
    const p = (a: number, b: number) => `${(ux * a + px * b).toFixed(2)} ${(uy * a + py * b).toFixed(2)}`;
    return `M${p(tip, 0)}L${p(-base, half)}L${p(-base, -half)}Z`;
  }
  return `M${-r} 0a${r} ${r} 0 1 0 ${s} 0a${r} ${r} 0 1 0 ${-s} 0Z`;
}

/** Fragments of one line (separate text nodes, inline elements) become a single box. */
export function mergeLines(rects: Box[]): Box[] {
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
