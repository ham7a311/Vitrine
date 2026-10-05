export type Redirect = {
  from: string;
  to: string;
  /** ISO date the old address was retired, e.g. "2026-02-14". */
  date?: string;
  /** Why it moved: "Renamed", "Merged into", "Moved". */
  reason?: string;
};
export type ForwardingTrail = {
  /** Each move, oldest first, starting from the requested address. */
  steps: Redirect[];
  /** Where the trail ends: the live address, or the repeated address when it loops. */
  final: string;
  loop: boolean;
};

export const normaliseAddress = (input: string) => "/" + input.split(/[?#]/)[0].trim().toLowerCase().split("/").filter(Boolean).join("/");

/** Follow a redirect table from the requested address until it settles, stopping if it loops. */
export function followRedirects(path: string, redirects: Redirect[], maxSteps = 20): ForwardingTrail {
  const table = new Map(redirects.map((r) => [normaliseAddress(r.from), r]));
  const seen = new Set<string>();
  const steps: Redirect[] = [];
  let current = normaliseAddress(path);
  while (table.has(current) && steps.length < maxSteps) {
    if (seen.has(current)) return { steps, final: current, loop: true };
    seen.add(current);
    const step = table.get(current)!;
    steps.push(step);
    current = normaliseAddress(step.to);
  }
  return { steps, final: current, loop: seen.has(current) || steps.length >= maxSteps };
}
