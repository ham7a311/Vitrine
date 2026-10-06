/** Geometry of the card helix. Angles in radians; 0 faces the camera. */
export type Helix = { count: number; step: number; pitch: number; radius: number; arc: number; height: number };

export const DEFAULT_HELIX: Helix = { count: 14, step: (52 * Math.PI) / 180, pitch: 0.62, radius: 2.6, arc: 2.05 / 2.6, height: 1.32 };

/**
 * The helix moves as a screw: as `lift` rises by one pitch, every card climbs
 * one place and the helix turns one step, so card i faces the camera at the
 * centre exactly when lift = i × pitch.
 */
export function turnFor(lift: number, h: Helix) {
  return (-lift / h.pitch) * h.step;
}

/** Where card i sits for a given lift: its angle round the axis, height, and how squarely it faces the camera (-1..1). */
export function place(i: number, lift: number, h: Helix) {
  const angle = i * h.step + turnFor(lift, h);
  const y = -i * h.pitch + lift;
  return { angle, y, x: h.radius * Math.sin(angle), z: h.radius * Math.cos(angle), facing: Math.cos(angle) };
}

/** The card nearest the front centre of the view. */
export function front(lift: number, h: Helix) {
  let best = 0, score = -Infinity;
  for (let i = 0; i < h.count; i++) {
    const p = place(i, lift, h);
    const s = p.facing - Math.abs(p.y) * 0.9;
    if (s > score) { score = s; best = i; }
  }
  return best;
}

/** Lift that brings card i to the front. */
export function liftFor(i: number, h: Helix) {
  return i * h.pitch;
}

/** How far through a tall scrolling section the viewport is, 0..1. */
export function progress(top: number, height: number, viewport: number) {
  const run = height - viewport;
  if (run <= 0) return 0;
  return Math.min(1, Math.max(0, -top / run));
}

/** One step of a critically damped spring toward `target`. Returns [position, velocity]. */
export function spring(x: number, v: number, target: number, dt: number, omega = 9): [number, number] {
  const e = Math.exp(-omega * dt);
  const d = x - target;
  const t = (v + omega * d) * dt;
  return [target + (d + t) * e, (v - omega * t) * e];
}

/** Two triangles per segment of a card strip, as (u, v) pairs in 0..1. */
export function strip(segments: number) {
  const out: number[] = [];
  for (let s = 0; s < segments; s++) {
    const a = s / segments, b = (s + 1) / segments;
    out.push(a, 0, b, 0, b, 1, a, 0, b, 1, a, 1);
  }
  return new Float32Array(out);
}

/** The element that scrolls this one: the nearest scrolling ancestor, else the page. */
export function scroller(el: HTMLElement): HTMLElement {
  for (let n = el.parentElement; n; n = n.parentElement) {
    const o = getComputedStyle(n).overflowY;
    if ((o === "auto" || o === "scroll") && n.scrollHeight > n.clientHeight) return n;
  }
  return (document.scrollingElement as HTMLElement) ?? document.documentElement;
}
