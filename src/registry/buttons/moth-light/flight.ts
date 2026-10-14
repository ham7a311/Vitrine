import { pointAt } from "./perimeter";

export type Body = { x: number; y: number; vx: number; vy: number };

export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** A damped spring towards (tx, ty) plus a jolt of random flutter — the erratic flight of a moth. */
export function flutter(b: Body, tx: number, ty: number, dt: number, rand: () => number, k = 26, damp = 5.5, jolt = 900) {
  const ax = (tx - b.x) * k - b.vx * damp + (rand() - 0.5) * jolt;
  const ay = (ty - b.y) * k - b.vy * damp + (rand() - 0.5) * jolt;
  b.vx += ax * dt; b.vy += ay * dt;
  b.x += b.vx * dt; b.y += b.vy * dt;
}

/** A point `off` px outside the pill's edge at outline distance s. */
export function ring(w: number, h: number, r: number, s: number, off: number) {
  const p = pointAt(w, h, r, s);
  return { x: p.x + p.nx * off, y: p.y + p.ny * off };
}

/** A firefly's light over time: dark most of the cycle, a quick swell and a slower fade. 0–1. */
export function blink(t: number, period: number, phase: number) {
  const k = (((t / period + phase) % 1) + 1) % 1;
  if (k < 0.12) return k / 0.12;
  if (k < 0.42) return 1 - (k - 0.12) / 0.3;
  return 0;
}
