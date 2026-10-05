export type TraceRoute = { href: string; label?: string };
export type TraceHop = { path: string; label?: string; found: boolean };
export type TraceResult = {
  /** Hops from the root to the first address that did not answer. */
  hops: TraceHop[];
  /** Deepest address that exists (a page, or a parent of pages). */
  lastGood: string;
  /** Real routes one level below `lastGood`, closest to the missing segment first. */
  next: TraceRoute[];
};

/** "/Pricing/Teams/?x=1#a" → "/pricing/teams" */
export function normalisePath(input: string) {
  const bare = input.split(/[?#]/)[0].trim().toLowerCase();
  const parts = bare.split("/").filter(Boolean);
  return "/" + parts.join("/");
}

function sharedPrefix(a: string, b: string) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

/** Follow the requested path segment by segment and stop where the site stops answering. */
export function traceRoute(path: string, routes: TraceRoute[], limit = 5): TraceResult {
  const target = normalisePath(path);
  const known = new Map<string, TraceRoute>();
  for (const route of routes) known.set(normalisePath(route.href), route);
  const exists = (p: string) => p === "/" || known.has(p) || [...known.keys()].some((k) => k.startsWith(p + "/"));

  const segments = target.split("/").filter(Boolean);
  const hops: TraceHop[] = [{ path: "/", label: known.get("/")?.label, found: true }];
  let lastGood = "/";
  for (let i = 1; i <= segments.length; i++) {
    const p = "/" + segments.slice(0, i).join("/");
    const found = exists(p);
    hops.push({ path: p, label: known.get(p)?.label, found });
    if (!found) break;
    lastGood = p;
  }

  const missing = segments[hops.length - 2] ?? "";
  // One level below the last good hop, including directories implied by deeper routes.
  const base = lastGood === "/" ? "" : lastGood;
  const children = new Map<string, TraceRoute>();
  for (const p of known.keys()) {
    if (!p.startsWith(base + "/") || p === lastGood) continue;
    const child = base + "/" + p.slice(base.length + 1).split("/")[0];
    if (!children.has(child)) children.set(child, known.get(child) ?? { href: child });
  }
  const leaf = (p: string) => p.slice(p.lastIndexOf("/") + 1);
  const next = [...children.entries()]
    .sort(([a], [b]) => sharedPrefix(leaf(b), missing) - sharedPrefix(leaf(a), missing) || a.localeCompare(b))
    .slice(0, limit)
    .map(([, route]) => route);
  return { hops, lastGood, next };
}
