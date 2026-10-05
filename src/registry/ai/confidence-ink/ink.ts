export type Alt = { text: string; p: number };
export type Token = { text: string; p: number; alternatives?: Alt[] };
export type Placed = Token & { edited?: boolean };

/** Percent as people say it: "<1%", "38%", ">99%". */
export function pct(p: number) {
  if (p < 0.01) return "<1%";
  if (p > 0.99) return ">99%";
  return `${Math.round(p * 100)}%`;
}

/** Ink strength for an uncertain token: never fainter than readable, darker as it nears the threshold. */
export function ink(p: number, threshold: number) {
  if (p >= threshold) return 1;
  return Math.round((0.5 + 0.4 * (p / threshold)) * 100) / 100;
}

export function uncertain(tokens: Token[], threshold: number) {
  return tokens.flatMap((t, i) => (t.p < threshold && t.text.trim() ? [i] : []));
}

/**
 * Swap token i for one of its alternatives. The replaced text joins the
 * alternatives so the choice can be undone, and the list stays sorted by p.
 */
export function swap(tokens: Placed[], i: number, alt: Alt, original: string): Placed[] {
  const t = tokens[i];
  const rest = (t.alternatives ?? []).filter((a) => a.text !== alt.text);
  const alternatives = [...rest, { text: t.text, p: t.p }].sort((a, b) => b.p - a.p);
  const next = [...tokens];
  next[i] = { text: alt.text, p: alt.p, alternatives, edited: alt.text !== original };
  return next;
}

/** Leading whitespace stays outside the highlighted word. */
export function split(text: string): [string, string] {
  const m = /^(\s*)([\s\S]*)$/.exec(text)!;
  return [m[1], m[2]];
}
