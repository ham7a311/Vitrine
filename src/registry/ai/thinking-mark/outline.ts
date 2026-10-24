import type { Contour, Outline, Vec } from "./geometry";

const cache = new Map<string, Outline>();
const STEP = 0.1;

/**
 * Walks an SVG path (in its own units) into closed contours with outward normals. The browser measures the path,
 * so curves and arcs need no parser; a jump between two samples marks where one subpath ends and the next begins.
 */
export function outline(d: string): Outline {
  const hit = cache.get(d);
  if (hit) return hit;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const raw: Vec[][] = [];
  try {
    const total = path.getTotalLength();
    let run: Vec[] = [];
    let prev: Vec | null = null;
    for (let s = 0; s <= total; s += STEP) {
      const q = path.getPointAtLength(s);
      if (prev && Math.hypot(q.x - prev.x, q.y - prev.y) > STEP * 4) {
        raw.push(run);
        run = [];
      }
      run.push({ x: q.x, y: q.y });
      prev = q;
    }
    raw.push(run);
  } finally {
    svg.remove();
  }

  // Which side is outside: step a little along the normal and ask the filled shape.
  const shape = new Path2D(d);
  const probe = document.createElement("canvas").getContext("2d")!;
  const contours: Contour[] = [];
  for (const pts of raw) {
    if (pts.length < 8) continue;
    const n = pts.length;
    const c: Contour = { x: new Float32Array(n), y: new Float32Array(n), nx: new Float32Array(n), ny: new Float32Array(n), step: STEP, len: n * STEP };
    for (let i = 0; i < n; i++) {
      const a = pts[(i - 2 + n) % n], b = pts[(i + 2) % n];
      let tx = b.x - a.x, ty = b.y - a.y;
      const l = Math.hypot(tx, ty) || 1;
      tx /= l; ty /= l;
      let nx = -ty, ny = tx;
      if (probe.isPointInPath(shape, pts[i].x + nx * 0.25, pts[i].y + ny * 0.25, "evenodd")) { nx = -nx; ny = -ny; }
      c.x[i] = pts[i].x; c.y[i] = pts[i].y; c.nx[i] = nx; c.ny[i] = ny;
    }
    contours.push(c);
  }
  const result = { contours, total: contours.reduce((a, c) => a + c.len, 0) };
  cache.set(d, result);
  return result;
}
