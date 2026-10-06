// Small formatting rules for the pulse buttons.

/** Compact counts the way live products show them: 999, 1.2k, 12k, 1.4M. */
export function compact(n: number) {
  if (n < 1000) return String(Math.max(0, Math.round(n)));
  if (n < 10_000) return `${(Math.floor(n / 100) / 10).toFixed(1).replace(/\.0$/, "")}k`;
  if (n < 1_000_000) return `${Math.floor(n / 1000)}k`;
  return `${(Math.floor(n / 100_000) / 10).toFixed(1).replace(/\.0$/, "")}M`;
}

/** A badge shows up to 99, then "99+". */
export const badge = (n: number) => (n > 99 ? "99+" : String(Math.max(0, n)));
