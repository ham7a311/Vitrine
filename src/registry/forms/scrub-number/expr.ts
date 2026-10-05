/**
 * Arithmetic for number fields: numbers, + − × ÷, parentheses, and the
 * relative forms "+=8", "-=8", "*=2", "/=2" applied to the current value.
 * A small recursive-descent parser, so nothing typed is ever executed.
 * Returns null for anything it doesn't understand.
 */
export function evaluate(input: string, current = 0): number | null {
  let src = input.trim().replace(/[,\s]/g, "").replace(/(px|%|°|deg|ms|s)$/i, "");
  src = src.replace(/×/g, "*").replace(/(?<=[\d)])x(?=[\d(.])/gi, "*").replace(/÷/g, "/").replace(/−/g, "-");
  const rel = /^([+\-*/])=(.*)$/.exec(src);
  if (rel) src = rel[2];
  let i = 0;
  const peek = () => src[i];
  const num = (): number | null => {
    const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(src.slice(i));
    if (!m) return null;
    i += m[0].length;
    return Number(m[0]);
  };
  const factor = (): number | null => {
    if (peek() === "-") { i++; const v = factor(); return v === null ? null : -v; }
    if (peek() === "+") { i++; return factor(); }
    if (peek() === "(") {
      i++;
      const v = expr();
      if (v === null || peek() !== ")") return null;
      i++;
      return v;
    }
    return num();
  };
  const term = (): number | null => {
    let v = factor();
    while (v !== null && (peek() === "*" || peek() === "/")) {
      const op = src[i++], r = factor();
      if (r === null || (op === "/" && r === 0)) return null;
      v = op === "*" ? v * r : v / r;
    }
    return v;
  };
  const expr = (): number | null => {
    let v = term();
    while (v !== null && (peek() === "+" || peek() === "-")) {
      const op = src[i++], r = term();
      if (r === null) return null;
      v = op === "+" ? v + r : v - r;
    }
    return v;
  };
  if (!src) return null;
  const v = expr();
  if (v === null || i !== src.length || !Number.isFinite(v)) return null;
  if (!rel) return v;
  const op = rel[1];
  if (op === "/" && v === 0) return null;
  return op === "+" ? current + v : op === "-" ? current - v : op === "*" ? current * v : current / v;
}
