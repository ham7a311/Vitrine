/** A seeded random stream, so demos are stable between renders. */
export function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Sequential level 0–4 for a value against the max (0 only for zero). */
export function level(v: number, max: number) {
  if (v <= 0 || max <= 0) return 0;
  return Math.min(4, Math.max(1, Math.ceil((v / max) * 4)));
}

/** Days → columns of seven (weeks), oldest first; the first column is padded so weeks start on Monday. */
export function weeks<T>(days: T[], firstWeekday: number): (T | null)[][] {
  const pad = (firstWeekday + 6) % 7; // Monday = 0
  const cells: (T | null)[] = [...Array(pad).fill(null), ...days];
  const out: (T | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7).concat(Array(Math.max(0, 7 - cells.slice(i, i + 7).length)).fill(null)));
  return out;
}

/** An SVG path through values, scaled into w × h with `pad` top room. Returns the line and the closed area. */
export function spark(values: number[], w: number, h: number, pad = 6) {
  const lo = Math.min(...values), hi = Math.max(...values), span = hi - lo || 1;
  const pts = values.map((v, i) => [values.length === 1 ? 0 : (i / (values.length - 1)) * w, pad + (1 - (v - lo) / span) * (h - pad * 2)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return { line, area: `${line} L${w} ${h} L0 ${h} Z`, pts };
}

/** Percentage change from a to b, rounded to one decimal. */
export const delta = (a: number, b: number) => (a === 0 ? 0 : Math.round(((b - a) / a) * 1000) / 10);

/** Step-to-step conversion through a funnel, as whole percentages. */
export const conversions = (steps: number[]) => steps.slice(1).map((v, i) => (steps[i] ? Math.round((v / steps[i]) * 100) : 0));

/** Arc segments for a donut: start/end angles (radians from 12 o'clock) with a gap between slices. */
export function slices(values: number[], gap = 0.035) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  let at = 0;
  return values.map((v) => {
    const sweep = (v / total) * Math.PI * 2;
    const s = { start: at + gap / 2, end: at + sweep - gap / 2, share: v / total };
    at += sweep;
    return s;
  });
}

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
