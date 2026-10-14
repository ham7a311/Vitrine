/** Packed circles: radii from shares, and one relaxation step that pulls them together without overlaps. */

export type Node = { x: number; y: number; r: number; target: number };

/** Radii so the circles together cover `fill` of a w × h area, each in proportion to its value. */
export function radii(values: number[], w: number, h: number, fill = 0.52) {
  const sum = values.reduce((s, v) => s + v, 0) || 1;
  return values.map((v) => Math.sqrt(((v / sum) * w * h * fill) / Math.PI));
}

/** Start positions on a seeded spiral round the centre, biggest in the middle. */
export function seed(rs: number[], cx: number, cy: number): Node[] {
  const order = rs.map((r, i) => ({ r, i })).sort((a, b) => b.r - a.r);
  const out: Node[] = Array(rs.length);
  order.forEach(({ r, i }, k) => {
    const a = k * 2.4, d = k === 0 ? 0 : 12 * Math.sqrt(k) * 4;
    out[i] = { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, r, target: r };
  });
  return out;
}

/** One step: radii ease to their targets, everything drifts to the centre, overlaps are pushed apart, and circles stay inside the box. */
export function relax(ns: Node[], cx: number, cy: number, w: number, h: number, pull = 0.035, gap = 3) {
  for (const n of ns) { n.r += (n.target - n.r) * 0.2; n.x += (cx - n.x) * pull; n.y += (cy - n.y) * pull; }
  for (let k = 0; k < 3; k++)
    for (let i = 0; i < ns.length; i++)
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i], b = ns[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01, min = a.r + b.r + gap;
        if (d < min) {
          const push = (min - d) / 2, ux = dx / d, uy = dy / d, wa = b.r / (a.r + b.r), wb = a.r / (a.r + b.r);
          a.x -= ux * push * 2 * wa; a.y -= uy * push * 2 * wa; b.x += ux * push * 2 * wb; b.y += uy * push * 2 * wb;
        }
      }
  for (const n of ns) { n.x = Math.max(n.r, Math.min(w - n.r, n.x)); n.y = Math.max(n.r, Math.min(h - n.r, n.y)); }
}

/** The worst overlap between any two circles (0 when none touch). */
export function overlap(ns: Node[]) {
  let worst = 0;
  for (let i = 0; i < ns.length; i++) for (let j = i + 1; j < ns.length; j++) worst = Math.max(worst, ns[i].r + ns[j].r - Math.hypot(ns[i].x - ns[j].x, ns[i].y - ns[j].y));
  return worst;
}
