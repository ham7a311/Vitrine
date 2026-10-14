/** Keep only digits, up to the code length — what a paste or autofill turns into. */
export function clean(raw: string, length: number) {
  return raw.replace(/\D/g, "").slice(0, length);
}

/** The slot the caret sits in: the next empty one, or the last when full. */
export function caret(value: string, length: number) {
  return Math.min(value.length, length - 1);
}

/** Which slots just changed, so only they animate (a paste animates all of them in order). */
export function arrivals(prev: string, next: string) {
  const out: number[] = [];
  for (let i = 0; i < next.length; i++) if (prev[i] !== next[i]) out.push(i);
  return out;
}
