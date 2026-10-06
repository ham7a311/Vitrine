/** Angle from the tile centre to a point, in CSS conic-gradient terms: 0° is up, clockwise. */
export function edgeAngle(x: number, y: number, w: number, h: number) {
  const a = (Math.atan2(x - w / 2, -(y - h / 2)) * 180) / Math.PI;
  return (a + 360) % 360;
}

/** Step an angle toward a target along the shorter way round. */
export function approach(from: number, to: number, k: number) {
  const d = ((to - from + 540) % 360) - 180;
  return (from + d * k + 360) % 360;
}

/** Dot centres on a regular grid, centred in the tile so the margins match on every side. */
export function grid(w: number, h: number, step: number) {
  const cols = Math.max(1, Math.floor(w / step)), rows = Math.max(1, Math.floor(h / step));
  const ox = (w - (cols - 1) * step) / 2, oy = (h - (rows - 1) * step) / 2;
  const pts: [number, number][] = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) pts.push([ox + i * step, oy + j * step]);
  return pts;
}

/** A stable pseudo-random number in [0, 1) for dot i. */
export function hash(i: number) {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * How bright one dot is: its own slow twinkle, lifted near the pointer.
 * Returns 0..1. `reach` is the radius of the pointer's influence in px.
 */
export function intensity(i: number, x: number, y: number, px: number, py: number, t: number, reach = 140) {
  const phase = hash(i) * Math.PI * 2, speed = 0.6 + hash(i + 7) * 1.6;
  const tw = 0.5 + 0.5 * Math.sin(t * speed + phase);
  const near = Math.exp(-((x - px) ** 2 + (y - py) ** 2) / (2 * reach * reach));
  return Math.min(1, (0.1 + 0.62 * tw * tw * tw) * (0.55 + 0.45 * near) + 0.4 * near * tw);
}
