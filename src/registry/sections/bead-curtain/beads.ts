/** Strings of beads as Verlet chains: pinned at the top, pulled down by gravity, pushed aside by a pointer. */

export type Bead = { x: number; y: number; px: number; py: number };
export type Strand = { beads: Bead[]; seg: number };

/** A strand hanging straight down from (x, 0): n beads `seg` px apart. */
export function strand(x: number, n: number, seg: number): Strand {
  return { seg, beads: Array.from({ length: n }, (_, i) => ({ x, y: i * seg, px: x, py: i * seg })) };
}

/** How many beads hang at x: long at the sides, short in the middle, so the curtain parts like a doorway. */
export const lengthAt = (x: number, width: number, min = 6, max = 15) => Math.round(min + (max - min) * Math.min(1, Math.abs(x - width / 2) / (width / 2)) ** 1.3);

/** Advance a strand: integrate, then hold every link to its length and push beads out of the pointer (last, so it wins). */
export function step(s: Strand, dt: number, gravity = 900, damping = 0.985, collider: { x: number; y: number; r: number } | null = null, iterations = 5) {
  const b = s.beads, g = gravity * dt * dt;
  for (let i = 1; i < b.length; i++) {
    const p = b[i], vx = (p.x - p.px) * damping, vy = (p.y - p.py) * damping;
    p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + g;
  }
  for (let k = 0; k < iterations; k++) {
    for (let i = 1; i < b.length; i++) {
      const a = b[i - 1], c = b[i], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1e-6, diff = (d - s.seg) / d;
      if (i === 1) { c.x -= dx * diff; c.y -= dy * diff; }
      else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; c.x -= dx * diff * 0.5; c.y -= dy * diff * 0.5; }
    }
    if (collider) for (let i = 1; i < b.length; i++) {
      const p = b[i], dx = p.x - collider.x, dy = p.y - collider.y, d = Math.hypot(dx, dy);
      if (d < collider.r && d > 0) { p.x = collider.x + (dx / d) * collider.r; p.y = collider.y + (dy / d) * collider.r; }
    }
  }
  // how much it is still moving
  let e = 0;
  for (const p of b) e += Math.abs(p.x - p.px) + Math.abs(p.y - p.py);
  return e;
}
