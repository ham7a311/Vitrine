/** Ease-out count from 0 to target over `ms`; returns the value at elapsed time `t`. */
export function countAt(t: number, target: number, ms = 1400) {
  const k = Math.min(1, Math.max(0, t / ms));
  return target * (1 - Math.pow(1 - k, 3));
}

/** 4_210_000 → "4.21M", 18_400 → "18.4K", 940 → "940". */
export function compact(n: number) {
  const a = Math.abs(n);
  const fix = (v: number) => (v >= 100 ? Math.round(v).toString() : v >= 10 ? v.toFixed(1) : v.toFixed(2)).replace(/\.?0+$/, "");
  if (a >= 1e9) return `${fix(n / 1e9)}B`;
  if (a >= 1e6) return `${fix(n / 1e6)}M`;
  if (a >= 1e3) return `${fix(n / 1e3)}K`;
  return Math.round(n).toString();
}

/** Deterministic day states for an uptime strip: 0 ok, 1 degraded, 2 down. */
export function uptimeDays(days: number, seed = 7) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: days }, () => { const r = rnd(); return r > 0.985 ? 2 : r > 0.955 ? 1 : 0; });
}

/** Where the inversion wipe starts: the pointer, as a percentage of the tile, clamped inside it. */
export function origin(x: number, y: number, box: { left: number; top: number; width: number; height: number }) {
  const px = ((x - box.left) / Math.max(1, box.width)) * 100;
  const py = ((y - box.top) / Math.max(1, box.height)) * 100;
  return { x: Math.round(Math.min(100, Math.max(0, px))), y: Math.round(Math.min(100, Math.max(0, py))) };
}
