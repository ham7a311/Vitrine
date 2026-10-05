export type Jack = { id: string; name: string; type: string };
export type Input = { id: string; name: string; accepts: string[] };
export type Cable = { from: string; to: string };

export function check(out: Jack, input: Input): { ok: true } | { ok: false; reason: string } {
  if (input.accepts.includes(out.type) || input.accepts.includes("any")) return { ok: true };
  const list = input.accepts.length > 1 ? `${input.accepts.slice(0, -1).join(", ")} or ${input.accepts[input.accepts.length - 1]}` : input.accepts[0];
  return { ok: false, reason: `${input.name} expects ${list}, not ${out.type}` };
}

/** Plug a cable in. An input holds one cable, so a new one replaces the old; an output can feed many. */
export function connect(cables: Cable[], c: Cable): Cable[] {
  return [...cables.filter((x) => x.to !== c.to), c];
}

export function unplug(cables: Cable[], to: string): Cable[] {
  return cables.filter((x) => x.to !== to);
}

/**
 * The curve a cable of a given length hangs in between two points (SVG
 * coordinates, y down). Solved numerically for the catenary parameter, then
 * sampled into a polyline. `slack` is extra length as a fraction of the gap.
 */
export function catenary(x1: number, y1: number, x2: number, y2: number, slack = 0.25, samples = 28): string {
  if (x2 < x1) [x1, y1, x2, y2] = [x2, y2, x1, y1];
  const h = x2 - x1;
  const dist = Math.hypot(h, y2 - y1);
  const L = dist * (1 + slack) + 8;
  // Nearly vertical: no meaningful catenary; a gentle bow reads the same.
  if (h < 2) return `M${x1} ${y1}Q${x1 + L * 0.15} ${(y1 + y2) / 2} ${x2} ${y2}`;
  const v = -(y2 - y1); // y up
  const target = Math.sqrt(Math.max(L * L - v * v, h * h + 1e-6));
  let lo = h / 1400, hi = 1e6;
  for (let i = 0; i < 80; i++) {
    const a = (lo + hi) / 2;
    if (2 * a * Math.sinh(h / (2 * a)) > target) lo = a; else hi = a;
  }
  const a = (lo + hi) / 2;
  const x0 = (x1 + x2) / 2 - a * Math.atanh(Math.max(-0.999999, Math.min(0.999999, v / L)));
  const c = -y1 - a * Math.cosh((x1 - x0) / a);
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = x1 + (h * i) / samples;
    // Keep the ends exact whatever the rounding in the solve.
    const y = i === 0 ? y1 : i === samples ? y2 : -(a * Math.cosh((x - x0) / a) + c);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${pts.join("L")}`;
}

/** The lowest point of a path produced by catenary(), for tests and label placement. */
export function lowest(path: string) {
  return Math.max(...path.slice(1).split("L").map((p) => +p.split(" ")[1]));
}
