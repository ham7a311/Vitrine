/* Outcome Flicker — seeded simulated runs, so every frame is reproducible. Pure. */

export type Option = { id: string; name: string; note: string; mean: number; sd: number };

/** Working days until the release is ready. "On time" means ready by Friday: 5 days or fewer. */
export const DEADLINE = 5;
export const RUNS = 100;
export const QUESTION = "Ready by Friday?";

export const OPTIONS: Option[] = [
  { id: "a", name: "Ship as planned", note: "all 9 tickets", mean: 4.6, sd: 1.3 },
  { id: "b", name: "Cut the importer", note: "7 tickets", mean: 3.8, sd: 0.9 },
  { id: "c", name: "Add the audit log", note: "12 tickets", mean: 5.6, sd: 1.7 },
];

/** mulberry32: a tiny seeded generator, enough for demo draws. */
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

/** A normal draw via Box–Muller. */
export function normal(rng: () => number) {
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** One option's simulated runs: days to ready, rounded to a tenth, never below half a day. */
export function simulate(o: Option, seed: number, runs = RUNS): number[] {
  const rng = mulberry32(seed);
  return Array.from({ length: runs }, () => Math.round(Math.max(0.5, o.mean + o.sd * normal(rng)) * 10) / 10);
}

export const onTime = (days: number) => days <= DEADLINE;

export function tally(days: number[], upTo = days.length) {
  const seen = days.slice(0, upTo);
  const yes = seen.filter(onTime).length;
  return { yes, no: seen.length - yes, seen: seen.length, pct: seen.length ? Math.round((yes / seen.length) * 100) : 0 };
}

/** "about 7 in 10" — the plain phrasing frequency formats are read best in. */
export const inTen = (pct: number) => `${Math.round(pct / 10)} in 10`;
