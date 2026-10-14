/** Particles for click bursts: seeded randomness, a radial spray, and one integration step. */

export type Particle = {
  x: number; y: number; vx: number; vy: number;
  /** angle and spin (rad, rad/s) */
  a: number; va: number;
  /** age and lifetime (s) */
  age: number; ttl: number;
  size: number; color: string;
  /** free per-kind values: a shape index and a phase */
  kind: number; ph: number;
  trail?: { x: number; y: number }[];
};

export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** n velocities spread evenly round a direction ± spread/2 (radians), each jittered, at speeds in [lo, hi]. */
export function spray(n: number, dir: number, spread: number, lo: number, hi: number, rand: () => number) {
  return Array.from({ length: n }, (_, i) => {
    const k = n === 1 ? 0.5 : i / (spread >= Math.PI * 2 ? n : n - 1);
    const a = dir - spread / 2 + spread * k + (rand() - 0.5) * (spread / n) * 0.8;
    const v = lo + rand() * (hi - lo);
    return { vx: Math.cos(a) * v, vy: Math.sin(a) * v };
  });
}

/** Advance one particle: gravity (px/s², down), drag (1/s, exponential), and an optional sideways sway (px/s). */
export function step(p: Particle, dt: number, gravity: number, drag: number, sway = 0) {
  const k = Math.exp(-drag * dt);
  p.vx *= k; p.vy = p.vy * k + gravity * dt;
  p.ph += dt;
  p.x += (p.vx + (sway ? Math.sin(p.ph * 2.6 + p.kind) * sway : 0)) * dt;
  p.y += p.vy * dt;
  p.a += p.va * dt;
  p.age += dt;
  return p.age < p.ttl;
}

/** How charged a press is: 0 for a click, rising to 1 after `full` ms of holding. */
export function charge(heldMs: number, full = 650) {
  return Math.max(0, Math.min(1, (heldMs - 120) / (full - 120)));
}
