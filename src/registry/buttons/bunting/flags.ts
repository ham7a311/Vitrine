/** A string of pennants: where they hang on a sagging line, and how each one swings. */

export type Hang = { x: number; y: number; slope: number };

/** Flags every `gap` px along a line from x0 to x1 at height y that sags `sag` px in the middle (a parabola, close enough to a catenary this shallow). */
export function line(x0: number, x1: number, y: number, sag: number, gap: number): Hang[] {
  const n = Math.max(1, Math.floor((x1 - x0) / gap)), mid = (x0 + x1) / 2, half = (x1 - x0) / 2;
  const at = (x: number) => y + sag * (1 - ((x - mid) / half) ** 2);
  return Array.from({ length: n }, (_, i) => {
    const x = x0 + (i + 0.5) * ((x1 - x0) / n);
    return { x, y: at(x), slope: (Math.atan((-2 * sag * (x - mid)) / (half * half)) * 180) / Math.PI };
  });
}

/** The line itself as a path. */
export function string(x0: number, x1: number, y: number, sag: number) {
  return `M${x0} ${y}Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`;
}

export type Swing = { a: number; v: number };

/** One step of a damped pendulum (angle in degrees) pushed by `force`. */
export function swing(s: Swing, dt: number, force = 0, k = 60, c = 3.2) {
  s.v += (-k * s.a - c * s.v + force) * dt;
  s.a += s.v * dt;
  return s;
}
