export type Bubble = { x: number; r: number; ms: number; sway: number; escape: boolean };

/** A normal-ish random from three uniforms (cheap, no trig). */
const bell = (rand: () => number) => (rand() + rand() + rand()) / 1.5 - 1;

/**
 * One bubble rising inside a w × h glass: it starts near the pointer's x (most of them within a
 * quarter of the width), grows with its size, rises faster when bigger, and a few escape over the rim.
 */
export function bubble(w: number, h: number, pointerX: number | null, rand: () => number): Bubble {
  const centre = pointerX ?? w / 2;
  const spread = pointerX === null ? w * 0.45 : w * 0.3;
  const x = Math.min(w - 6, Math.max(6, centre + bell(rand) * spread));
  const r = 1.6 + rand() * rand() * 4.4;
  return { x, r, ms: Math.round((h / (34 + r * 9)) * 1000), sway: (rand() - 0.5) * 8, escape: rand() < 0.22 };
}

/** A seeded random in [0, 1), for tests and stable demos. */
export function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
