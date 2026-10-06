/** Hex colour to 0–1 RGB for a shader uniform. Accepts #rgb and #rrggbb. */
export function rgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const v = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(v)) return [0, 0, 0];
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

/**
 * The dome the dots fill, in frame units (x 0–1 across, y 0–1 down). It is an ellipse centred
 * just below the bottom edge, as wide as the frame allows and never narrower than the height.
 * Returns the normalised distance: 0 at the centre, 1 on the rim.
 */
export function domeDistance(x: number, y: number, aspect: number, rise = 0.68): number {
  const rx = Math.max(0.86 * aspect, 0.95);
  const dx = ((x - 0.5) * aspect) / rx;
  const dy = (y - 1.0) / (rise * Math.min(1, 0.45 + 0.3 * aspect));
  return Math.hypot(dx, dy);
}

/** Dot coverage for a distance: sparse speckle at the rim, dense just inside it, a softer plateau in the middle. */
export function coverage(d: number, core = 0.6): number {
  const s = (a: number, b: number, v: number) => {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const rim = Math.pow(s(1.12, 0.5, d), 1.6);
  const inner = 1 - (1 - core) * s(0.55, 0.12, d);
  return rim * inner;
}
