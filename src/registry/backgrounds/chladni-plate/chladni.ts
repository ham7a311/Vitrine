/* Sand on a vibrating plate. Pure maths and a small particle system; no DOM, no React. */

/** A standing wave on a square plate: `n` and `m` are how many half-waves fit along each side. */
export type Mode = { n: number; m: number };

/** Anything whose zero lines the sand should gather on. Coordinates are pixels. */
export type Field = (x: number, y: number) => number;

/**
 * How far the plate moves at (u, v), in plate units (0…1 across one side).
 * Zero where the plate stands still: those are the lines the sand ends up on.
 * The two halves of the wave either cancel (sign −1: a figure with a diagonal) or add (sign +1: a figure that mirrors
 * left to right and top to bottom when u and v are measured from the middle).
 */
export function amplitude(u: number, v: number, n: number, m: number, sign: 1 | -1 = -1): number {
  const a = n * Math.PI, b = m * Math.PI;
  return Math.cos(a * u) * Math.cos(b * v) + sign * Math.cos(b * u) * Math.cos(a * v);
}

/** The plate as a pixel field: one plate side is `size` pixels, offset by (ox, oy). */
export const plate = (mode: Mode, size: number, ox = 0, oy = 0): Field => (x, y) => amplitude((x - ox) / size, (y - oy) / size, mode.n, mode.m);

/** A figure for a number: the same value always gives the same pair, and near values give different ones. */
export function modeFor(value: number): Mode {
  const n = 1.5 + ((Math.abs(value) * 0.0131) % 3.5);
  const m = n + 1 + ((Math.abs(value) * 0.0077) % 3);
  return { n: +n.toFixed(3), m: +m.toFixed(3) };
}

export const mix = (a: Mode, b: Mode, t: number): Mode => ({ n: a.n + (b.n - a.n) * t, m: a.m + (b.m - a.m) * t });
export const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Figures that read well together, in an order where each glide stays interesting. */
export const FIGURES: Mode[] = [
  { n: 2.35, m: 5.2 },
  { n: 3, m: 5 },
  { n: 1.6, m: 4.4 },
  { n: 4, m: 7 },
  { n: 2, m: 6.5 },
  { n: 3.5, m: 6 },
];

/** A small repeatable random source, so a figure can be drawn the same way twice. */
export function seeded(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

export type StepOptions = {
  /** Share of the distance to the nearest still line covered each step (0…1). */
  rate?: number;
  /** How hard the plate throws grains about where it moves, in pixels. */
  shake?: number;
  /** A little restlessness everywhere, in pixels: keeps the lines sandy rather than drawn. */
  drift?: number;
  /** Longest move in one step, in pixels. */
  reach?: number;
};

/** Grains on a plate. Positions are pixels inside (0…w, 0…h). */
export class Sand {
  readonly count: number;
  readonly x: Float32Array;
  readonly y: Float32Array;
  readonly vx: Float32Array;
  readonly vy: Float32Array;
  w: number;
  h: number;
  private rand: () => number;
  /** Typical steepness of the field under the grains, from the last step. */
  private slope = 0;

  constructor(count: number, w: number, h: number, rand: () => number = Math.random) {
    this.count = count;
    this.w = w;
    this.h = h;
    this.rand = rand;
    this.x = new Float32Array(count);
    this.y = new Float32Array(count);
    this.vx = new Float32Array(count);
    this.vy = new Float32Array(count);
    this.scatter();
  }

  /** Throw the sand evenly over the plate. */
  scatter() {
    for (let i = 0; i < this.count; i++) {
      this.x[i] = this.rand() * this.w;
      this.y[i] = this.rand() * this.h;
      this.vx[i] = this.vy[i] = 0;
    }
  }

  /** Keep every grain's relative place when the plate changes size. */
  resize(w: number, h: number) {
    const kx = w / (this.w || 1), ky = h / (this.h || 1);
    for (let i = 0; i < this.count; i++) {
      this.x[i] *= kx;
      this.y[i] *= ky;
    }
    this.w = w;
    this.h = h;
  }

  /** A thump at (cx, cy): grains within `radius` jump away from it. */
  kick(cx: number, cy: number, radius: number, force: number) {
    for (let i = 0; i < this.count; i++) {
      const dx = this.x[i] - cx, dy = this.y[i] - cy, d = Math.hypot(dx, dy);
      if (d > radius) continue;
      const k = (1 - d / radius) ** 2 * force, a = d > 0.01 ? 0 : this.rand() * 6.283;
      this.vx[i] += d > 0.01 ? (dx / d) * k : Math.cos(a) * k;
      this.vy[i] += d > 0.01 ? (dy / d) * k : Math.sin(a) * k;
    }
  }

  /**
   * One step: each grain is shaken in proportion to how much the plate moves under it, and walks
   * toward the nearest still line. Returns the mean distance moved, so a caller can tell when it has settled.
   */
  step(field: Field, { rate = 0.1, shake = 2.6, drift = 1.5, reach = 5 }: StepOptions = {}): number {
    const { x, y, vx, vy, w, h, rand } = this;
    let moved = 0, steep = 0;
    const typical = this.slope || 1;
    for (let i = 0; i < this.count; i++) {
      const px = x[i], py = y[i];
      const f = field(px, py);
      const gx = field(px + 1, py) - f, gy = field(px, py + 1) - f;
      const g2 = gx * gx + gy * gy + 1e-7, g = Math.sqrt(g2);
      steep += g;
      // Newton's step to the zero line, capped: far from a line the slope says little about the distance.
      let sx = (-f / g2) * gx * rate, sy = (-f / g2) * gy * rate;
      const s = Math.hypot(sx, sy);
      if (s > reach) {
        sx *= reach / s;
        sy *= reach / s;
      }
      // Most throws are short and a few are long: a dense core with loose grains around it.
      // Where the plate's slope is shallow the lines are held loosely and spread into clouds; where it is steep they stay fine.
      const loose = this.slope ? Math.min(3.6, Math.max(0.35, typical / g)) : 1;
      const jitter = Math.min(1, Math.abs(f)) * shake + drift * loose, a = rand() * 6.283, r = rand() * rand() * jitter * 2;
      let nx = px + sx + Math.cos(a) * r + vx[i], ny = py + sy + Math.sin(a) * r + vy[i];
      vx[i] *= 0.86;
      vy[i] *= 0.86;
      // Grains that reach the edge of the plate fall back on, a little way in.
      if (nx < 0) nx = rand() * 2; else if (nx > w) nx = w - rand() * 2;
      if (ny < 0) ny = rand() * 2; else if (ny > h) ny = h - rand() * 2;
      moved += Math.abs(nx - px) + Math.abs(ny - py);
      x[i] = nx;
      y[i] = ny;
    }
    this.slope = steep / (this.count || 1);
    return moved / (this.count || 1);
  }
}
