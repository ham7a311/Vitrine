/** Hex colour to 0–1 RGB for a shader uniform. Accepts #rgb and #rrggbb. */
export function rgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const v = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(v)) return [0, 0, 0];
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

/**
 * Half-width of the beam's white core, in units of the frame height, at a given distance above
 * the floor (0 at the bottom edge, 1 at the top). A hyperbola: a hairline at the top that flares
 * into a wide pool as it reaches the floor, like poured liquid spreading.
 */
export function beamWidth(aboveFloor: number, flare = 1): number {
  const f = Math.max(0, aboveFloor);
  return (0.0045 * flare) / (f + 0.015);
}

/** The beam's x position (0–1 across), eased toward a pointer by at most `sway`. */
export function beamX(base: number, pointer: number | null, sway = 0.015): number {
  if (pointer == null) return base;
  const d = Math.max(-1, Math.min(1, (pointer - base) * 2));
  return base + d * sway;
}
