/** How old a page's last check is, as a stage the page can wear and a phrase a person can read. */
export type Stage = 0 | 1 | 2 | 3;
export const STAGES = ["Fresh", "Ageing", "Stale", "Old"] as const;

/** Days since `checked` at `now`, both ISO dates or timestamps. */
export const days = (checked: string | number, now: number) => Math.max(0, Math.floor((now - new Date(checked).getTime()) / 86_400_000));

/** thresholds: the day counts at which a page becomes Ageing, Stale and Old. */
export function stage(d: number, thresholds: [number, number, number] = [90, 180, 365]): Stage {
  return d >= thresholds[2] ? 3 : d >= thresholds[1] ? 2 : d >= thresholds[0] ? 1 : 0;
}

export function since(d: number): string {
  if (d < 1) return "today";
  if (d < 2) return "yesterday";
  if (d < 14) return `${d} days ago`;
  if (d < 60) return `${Math.round(d / 7)} weeks ago`;
  if (d < 365 * 2) return `${Math.round(d / 30.44)} months ago`;
  return `${Math.floor(d / 365)} years ago`;
}
