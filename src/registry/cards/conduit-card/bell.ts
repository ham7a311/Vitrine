/**
 * Half-width of a poured beam at a point along it. `d` is the distance (in viewBox units) from
 * where the beam meets a surface: far away it is a thread of `w0`, close in it flares like
 * liquid spreading on contact, reaching about `w0 + flare / soft` right at the surface.
 */
export function bellHalfWidth(d: number, w0 = 5, flare = 900, soft = 6): number {
  return w0 + flare / (Math.max(0, d) + soft);
}

/**
 * A closed SVG path for a beam running from y0 to y1 (either direction) centred on cx, flaring
 * at y1. Points are spaced more tightly near the flare so the curve stays smooth.
 */
export function bellPath(cx: number, y0: number, y1: number, w0 = 5, flare = 900, soft = 6, steps = 40): string {
  const dir = Math.sign(y1 - y0) || 1;
  const len = Math.abs(y1 - y0);
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = 1 - Math.pow(1 - i / steps, 2.2);
    const y = y0 + dir * len * t;
    const w = bellHalfWidth(len * (1 - t), w0, flare, soft);
    const r = (n: number) => Math.round(n * 10) / 10;
    left.push(`${r(cx - w)} ${r(y)}`);
    right.unshift(`${r(cx + w)} ${r(y)}`);
  }
  return `M${left.join(" L")} L${right.join(" L")} Z`;
}
