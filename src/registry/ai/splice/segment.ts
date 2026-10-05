/** Split text into sentences, keeping each sentence's trailing space out of it. */
export type Sentence = { id: string; text: string };

const ABBR = /\b(?:e\.g|i\.e|etc|vs|Dr|Mr|Ms|Mrs|St|No|approx)\.$/i;

export function sentences(text: string, prefix = "s"): Sentence[] {
  const out: string[] = [];
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string }> } }).Segmenter;
  if (Seg) {
    for (const { segment } of new Seg("en", { granularity: "sentence" }).segment(text)) {
      const s = segment.trim();
      if (!s) continue;
      // Segmenters still split after some abbreviations; join those back.
      if (out.length && ABBR.test(out[out.length - 1])) out[out.length - 1] += ` ${s}`;
      else out.push(s);
    }
  } else {
    for (const m of text.matchAll(/[^.!?]+(?:[.!?]+["”’)]*|$)/g)) {
      const s = m[0].trim();
      if (!s) continue;
      if (out.length && ABBR.test(out[out.length - 1])) out[out.length - 1] += ` ${s}`;
      else out.push(s);
    }
  }
  return out.map((t, i) => ({ id: `${prefix}${i}`, text: t }));
}

export const wordCount = (t: string) => t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
