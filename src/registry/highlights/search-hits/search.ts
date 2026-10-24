/**
 * Text folded for matching — lower case, accents removed — with a map from every folded character
 * back to the original character it came from, so a match can be shown on the original text.
 */
export function fold(text: string) {
  let out = "";
  const map: number[] = [];
  Array.from(text).reduce((at, ch) => {
    const folded = ch.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    for (const f of folded) { out += f; map.push(at); }
    return at + ch.length;
  }, 0);
  map.push(text.length);
  return { text: out, map };
}

/** Every non-overlapping match of the query, as [start, end) offsets in the original text. */
export function findHits(text: string, query: string): [number, number][] {
  const q = fold(query.trim()).text;
  if (!q) return [];
  const { text: hay, map } = fold(text);
  const hits: [number, number][] = [];
  for (let i = hay.indexOf(q); i !== -1; i = hay.indexOf(q, i + q.length)) {
    const end = map[i + q.length - 1];
    // End after the whole original character (it may be more than one UTF-16 unit).
    hits.push([map[i], end + Array.from(text.slice(end))[0].length]);
  }
  return hits;
}

/** The next hit index in a direction, wrapping round at either end. */
export const step = (index: number, count: number, dir: 1 | -1) => (count ? (index + dir + count) % count : 0);
