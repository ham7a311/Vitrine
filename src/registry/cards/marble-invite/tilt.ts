/** Card tilt in degrees from the pointer's position over it (0–1 on each axis), capped at `max`. */
export function tilt(x: number, y: number, max = 6) {
  const cx = Math.max(0, Math.min(1, x)) - 0.5, cy = Math.max(0, Math.min(1, y)) - 0.5;
  return { rx: Math.round(-cy * 2 * max * 10) / 10 || 0, ry: Math.round(cx * 2 * max * 10) / 10 || 0 };
}
