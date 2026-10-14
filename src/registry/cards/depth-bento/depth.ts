/** Tilt (degrees) for a pointer at (x, y) in 0–1 tile coordinates: up to `max`, leaning towards the pointer. */
export function lean(x: number, y: number, max = 8) {
  const cx = Math.min(1, Math.max(0, x)) - 0.5, cy = Math.min(1, Math.max(0, y)) - 0.5;
  return { rx: +(-cy * 2 * max).toFixed(2) || 0, ry: +(cx * 2 * max).toFixed(2) || 0 };
}
