/* Trend Tape — rate, projection and bands for a live value. Pure. */

export type Band = "ok" | "caution" | "over";
export type Scenario = "surge" | "steady" | "drain";

export const SCENARIOS: { id: Scenario; name: string; drift: number }[] = [
  { id: "surge", name: "Surge", drift: 7 },
  { id: "steady", name: "Steady", drift: 0 },
  { id: "drain", name: "Drain", drift: -9 },
];

/** Least-squares slope of the last few samples, in units per sample (one sample a second). */
export function rate(samples: number[], span = 6): number {
  const s = samples.slice(-span);
  const n = s.length;
  if (n < 2) return 0;
  const mx = (n - 1) / 2;
  const my = s.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  s.forEach((y, x) => {
    num += (x - mx) * (y - my);
    den += (x - mx) ** 2;
  });
  return num / den;
}

/** Below this the value counts as steady and the trend vector hides. */
export const STEADY = 0.8;

export const project = (v: number, r: number, secs: number) => v + r * secs;

/** Seconds until the value reaches `to` at the current rate, or null if it isn't heading there. */
export function secondsTo(v: number, r: number, to: number): number | null {
  if (Math.abs(r) < STEADY || to === v) return null;
  const s = (to - v) / r;
  return s > 0 ? s : null;
}

export const band = (v: number, caution: number, limit: number): Band => (v >= limit ? "over" : v >= caution ? "caution" : "ok");

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The demo feed: a drift plus noise, clamped to the scale. */
export function nextValue(v: number, drift: number, rng: () => number, min: number, max: number) {
  const noise = (rng() - 0.5) * 10;
  return Math.max(min, Math.min(max, Math.round(v + drift + noise)));
}

export const roughSeconds = (s: number) => (s < 60 ? `~${Math.max(1, Math.round(s))} s` : `~${Math.round(s / 60)} min`);
