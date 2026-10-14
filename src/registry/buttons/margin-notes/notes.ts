export type Kind = "arrowLeft" | "arrowRight" | "circle" | "underline" | "sparkles" | "bang" | "star";
export const KINDS: Kind[] = ["arrowLeft", "arrowRight", "circle", "underline", "sparkles", "bang", "star"];

/** A seeded random in [0, 1). */
export function seeded(seed: number) {
  let s = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/**
 * Which notes to draw on hover number n: always one that points at the button (an arrow or the
 * circle), plus two or three others, never the same set twice in a row.
 */
export function pick(n: number): Kind[] {
  const r = seeded(n * 7919 + 13);
  const lead: Kind[] = ["arrowLeft", "arrowRight", "circle"];
  const first = lead[n % 3];
  const rest = KINDS.filter((k) => k !== first && !(first === "circle" && k === "underline"));
  const out: Kind[] = [first];
  const want = 2 + Math.floor(r() * 2);
  while (out.length < want + 1) {
    const k = rest[Math.floor(r() * rest.length)];
    const clash = (x: Kind, y: Kind) => (k === x && out.includes(y)) || (k === y && out.includes(x));
    if (!out.includes(k) && !clash("arrowLeft", "arrowRight") && !clash("circle", "underline")) out.push(k);
  }
  return out;
}

const f = (n: number) => n.toFixed(1);

/** The strokes for one note round a w × h button, wobbled by `r` so it looks drawn by hand. Each entry is drawn in order. */
export function strokes(kind: Kind, w: number, h: number, r: () => number): string[] {
  const j = (a: number) => (r() - 0.5) * 2 * a;
  switch (kind) {
    case "arrowLeft": {
      const x0 = -78 + j(6), y0 = -26 + j(8), x1 = -10 + j(2), y1 = h * 0.5 + j(3);
      const c = `M${f(x0)} ${f(y0)}C${f(x0 + 18)} ${f(y0 - 10 + j(6))} ${f(x1 - 30)} ${f(y1 - 34)} ${f(x1)} ${f(y1)}`;
      return [c, `M${f(x1 - 10)} ${f(y1 - 9 + j(2))}L${f(x1)} ${f(y1)}L${f(x1 - 12)} ${f(y1 + 3 + j(2))}`];
    }
    case "arrowRight": {
      const x0 = w + 80 + j(6), y0 = h + 22 + j(8), x1 = w + 10 + j(2), y1 = h * 0.55 + j(3);
      const c = `M${f(x0)} ${f(y0)}C${f(x0 - 10)} ${f(y0 + 8)} ${f(x1 + 34)} ${f(y1 + 30)} ${f(x1)} ${f(y1)}`;
      return [c, `M${f(x1 + 12)} ${f(y1 - 2 + j(2))}L${f(x1)} ${f(y1)}L${f(x1 + 6)} ${f(y1 + 11 + j(2))}`];
    }
    case "circle": {
      // a loop and a bit, like a pen going round twice without lifting
      const cx = w / 2, cy = h / 2, rx = w / 2 + 14, ry = h / 2 + 11, pts: string[] = [];
      const turns = 1.12, steps = 48, a0 = -2.2 + j(0.3);
      for (let i = 0; i <= steps; i++) {
        const a = a0 + (i / steps) * Math.PI * 2 * turns, grow = 1 + (i / steps) * 0.06 + j(0.012);
        pts.push(`${i ? "L" : "M"}${f(cx + Math.cos(a) * rx * grow)} ${f(cy + Math.sin(a) * ry * grow - 2)}`);
      }
      return [pts.join("")];
    }
    case "underline": {
      const y = h + 12 + j(2), x0 = w * 0.12 + j(4), x1 = w * 0.88 + j(4);
      return [`M${f(x0)} ${f(y)}Q${f(w / 2)} ${f(y + 4 + j(2))} ${f(x1)} ${f(y - 2)}`, `M${f(x0 + 14)} ${f(y + 6)}Q${f(w / 2)} ${f(y + 9 + j(2))} ${f(x1 - 10)} ${f(y + 5)}`];
    }
    case "sparkles": {
      const out: string[] = [];
      [[w + 8, -14, 7], [w + 26, 4, 4.5], [w - 6, -30, 4]].forEach(([x, y, s]) => {
        const X = x + j(3), Y = y + j(3);
        out.push(`M${f(X)} ${f(Y - s)}L${f(X)} ${f(Y + s)}M${f(X - s)} ${f(Y)}L${f(X + s)} ${f(Y)}`);
      });
      return out;
    }
    case "bang": {
      const x = -16 + j(3), y = -30 + j(3);
      return [`M${f(x)} ${f(y)}L${f(x + 3)} ${f(y + 15)}`, `M${f(x + 4)} ${f(y + 21)}l0.4 0.4`, `M${f(x + 10)} ${f(y - 3)}L${f(x + 12)} ${f(y + 12)}`, `M${f(x + 13)} ${f(y + 18)}l0.4 0.4`];
    }
    case "star": {
      const cx = w * 0.82 + j(4), cy = h + 26 + j(3), R = 8, out: string[] = [];
      let d = "";
      for (let i = 0; i <= 5; i++) {
        const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
        d += `${i ? "L" : "M"}${f(cx + Math.cos(a) * R + j(0.8))} ${f(cy + Math.sin(a) * R + j(0.8))}`;
      }
      out.push(d);
      return out;
    }
  }
}
