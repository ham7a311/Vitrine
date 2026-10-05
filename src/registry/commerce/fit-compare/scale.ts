export type Unit = "cm" | "in";
export type Size = { w: number; h: number };

export const MM_PER_IN = 25.4;

/** A length in the shopper's unit: "14.8 cm", "5.8 in". */
export function fmt(mm: number, unit: Unit) {
  const v = unit === "cm" ? mm / 10 : mm / MM_PER_IN;
  return `${v >= 100 ? Math.round(v) : Math.round(v * 10) / 10} ${unit}`;
}

/** A round scale-bar length near a quarter of the stage: 1, 2, 5, 10, 20… of the unit. */
export function scaleBar(stageMm: number, unit: Unit) {
  const per = unit === "cm" ? 10 : MM_PER_IN;
  const target = stageMm / 4 / per;
  const steps = [1, 2, 5, 10, 20, 50, 100];
  const n = steps.reduce((best, s) => (Math.abs(s - target) < Math.abs(best - target) ? s : best), steps[0]);
  return { mm: n * per, label: `${n} ${unit}` };
}

/** Stage size in mm that holds both shapes, either overlaid from one corner or side by side. */
export function stage(a: Size, b: Size, mode: "overlay" | "side", pad: number) {
  const w = mode === "overlay" ? Math.max(a.w, b.w) : a.w + b.w + pad;
  const h = Math.max(a.h, b.h);
  return { w: w + pad * 2, h: h + pad * 2 };
}

/**
 * Does `inner` fit inside `outer`, turning it if that helps?
 * Returns the tighter of the two orientations and the margin left, or how far over it is.
 */
export function fits(inner: Size, outer: Size) {
  const opts = [
    { rotated: false, dw: outer.w - inner.w, dh: outer.h - inner.h },
    { rotated: true, dw: outer.w - inner.h, dh: outer.h - inner.w },
  ];
  const ok = opts.filter((o) => o.dw >= 0 && o.dh >= 0).sort((x, y) => Math.min(y.dw, y.dh) - Math.min(x.dw, x.dh));
  if (ok.length) return { fits: true as const, rotated: ok[0].rotated, spare: Math.min(ok[0].dw, ok[0].dh) };
  // Report the orientation that misses by least, along its worse side.
  const miss = opts.map((o) => ({ ...o, over: Math.max(-o.dw, -o.dh), side: -o.dw > -o.dh ? ("wide" as const) : ("long" as const) })).sort((x, y) => x.over - y.over)[0];
  return { fits: false as const, rotated: miss.rotated, over: miss.over, side: miss.side };
}

/** "1.4× as tall", "about the same height", "0.6× as tall". */
export function ratio(a: number, b: number, word: string) {
  const r = a / b;
  if (Math.abs(r - 1) < 0.06) return `about the same ${word === "tall" ? "height" : "width"}`;
  return `${Math.round(r * 10) / 10}× as ${word}`;
}
