import { length, pointAt } from "./perimeter";

export const KINDS = ["star", "bolt", "heart", "badge", "smiley", "rainbow", "check"] as const;
export type Kind = (typeof KINDS)[number];
export type Placed = { kind: Kind; x: number; y: number; tilt: number; size: number; delay: number };

export function seeded(seed: number) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/**
 * Where this hover's stickers go: `count` different designs, spaced round the outline from the
 * entry point with a little jitter, each centred a few px outside the edge so it overlaps the rim,
 * tilted, and slapped on in order of distance from the entry point.
 */
export function layout(hover: number, w: number, h: number, r: number, s0: number, count = 5): Placed[] {
  const rand = seeded(hover + 1), L = length(w, h, r);
  const pool = [...KINDS];
  // a fresh shuffle each hover
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return Array.from({ length: count }, (_, i) => {
    const step = L / count;
    const off = (i % 2 ? 1 : -1) * Math.ceil(i / 2) * step + (rand() - 0.5) * step * 0.35;
    const p = pointAt(w, h, r, s0 + off);
    const size = 32 + Math.round(rand() * 10);
    const out = size * 0.18;
    return { kind: pool[i], x: p.x + p.nx * out, y: p.y + p.ny * out, tilt: Math.round((rand() - 0.5) * 44), size, delay: Math.ceil(i / 2) * 85 + (i % 2) * 30 };
  });
}
