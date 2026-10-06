/** Hex colour to 0–1 RGB for a shader uniform. Accepts #rgb and #rrggbb. */
export function rgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const v = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(v)) return [0, 0, 0];
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

/** Orbit radii, in units of the frame's scale (see `unit`). Spaced like a quiet star chart. */
export const ORBITS = [0.287, 0.42, 0.56, 0.71, 0.87] as const;

/** The length everything is measured in: the height, but never more than 0.75 of the width, so phones keep the arch inside the frame. */
export function unit(width: number, height: number): number {
  return Math.max(1, Math.min(height, width * 0.75));
}

/** Where the node on ring `ring` at slot `slot` (0–2) sits at time t, in radians from the +x axis (counter-clockwise, upward). */
export function nodeAngle(ring: number, slot: number, t: number): number {
  const base = [0.75, 1.55, 2.37][slot] + ring * 0.07;
  const drift = (ring % 2 ? -1 : 1) * (0.012 + ring * 0.003);
  return base + t * drift;
}
