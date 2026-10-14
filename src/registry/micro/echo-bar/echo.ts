/** Counting rules for Echo Bar, kept apart from the component so they can be tested on their own. */

const UNITS: [number, string][] = [[1e9, "B"], [1e6, "M"], [1e3, "K"]];

/**
 * Compact count, rounded down so a post never claims more than it has:
 * 999 → "999", 1,234 → "1.2K", 12,345 → "12K", 1,250,000 → "1.2M".
 * One decimal only below ten of a unit, and a trailing ".0" is dropped.
 */
export function compact(n: number): string {
  const v = Math.max(0, Math.floor(n));
  for (const [size, suffix] of UNITS) {
    if (v < size) continue;
    const whole = v / size;
    if (whole >= 1000 && suffix !== "B") continue;
    const shown = whole < 10 ? Math.floor(whole * 10) / 10 : Math.floor(whole);
    return `${String(shown).replace(/\.0$/, "")}${suffix}`;
  }
  return String(v);
}

/** Full count for labels: 1204 → "1,204". */
export const full = (n: number) => Math.max(0, Math.floor(n)).toLocaleString("en-US");

export type Glyph = { key: string; char: string; digit: boolean };

/**
 * Characters keyed by position from the right, so when 1,204 becomes 1,205 only the last
 * reel moves, and when 999 becomes 1K the suffix arrives as a new glyph instead of a jump.
 */
export function glyphs(text: string): Glyph[] {
  const chars = [...text];
  let digitPos = 0;
  return chars
    .reverse()
    .map((char) => {
      const digit = char >= "0" && char <= "9";
      const key = digit ? `d${digitPos++}` : `s${char}`;
      return { key, char, digit };
    })
    .reverse();
}

/**
 * What to show while your own action is in flight or settled. The server count includes you
 * only when the server says you acted; the screen includes you whenever you meant to.
 * So a fresh server count never double-counts your optimistic +1.
 */
export function shown(serverCount: number, serverOn: boolean, intent: boolean): number {
  return Math.max(0, serverCount - (serverOn ? 1 : 0) + (intent ? 1 : 0));
}

export function noun(n: number, one: string, many: string) {
  return `${full(n)} ${n === 1 ? one : many}`;
}
