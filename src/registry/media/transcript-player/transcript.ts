export type Word = { text: string; start: number; end: number; speaker?: string };

/** The word being spoken at time t: the last one that has started, or -1 before the first. */
export function wordAt(words: Word[], t: number) {
  let lo = 0, hi = words.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid].start <= t) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return ans;
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}']+/gu, "");

/** Every place a phrase occurs, as [first, last] word indices. Punctuation and case are ignored. */
export function find(words: Word[], query: string): [number, number][] {
  const q = query.trim().split(/\s+/).map(norm).filter(Boolean);
  if (!q.length) return [];
  const w = words.map((x) => norm(x.text));
  const out: [number, number][] = [];
  for (let i = 0; i + q.length <= w.length; i++) {
    let ok = true;
    for (let k = 0; k < q.length && ok; k++) {
      // The last query word may be partial, so results appear while typing.
      ok = k === q.length - 1 ? w[i + k].startsWith(q[k]) : w[i + k] === q[k];
    }
    if (ok) out.push([i, i + q.length - 1]);
  }
  return out;
}

/** Index of the first word of every sentence. */
export function sentences(words: Word[]) {
  const s = words.length ? [0] : [];
  words.forEach((w, i) => { if (i < words.length - 1 && /[.?!]["”’)]?$/.test(w.text)) s.push(i + 1); });
  return s;
}

/** Group words into paragraphs at each change of speaker. */
export function turns(words: Word[]) {
  const out: { speaker?: string; from: number; to: number }[] = [];
  words.forEach((w, i) => {
    const last = out[out.length - 1];
    if (last && last.speaker === w.speaker) last.to = i;
    else out.push({ speaker: w.speaker, from: i, to: i });
  });
  return out;
}

export function clock(t: number) {
  const s = Math.max(0, Math.floor(t));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return `${h ? `${h}:${String(m).padStart(2, "0")}` : m}:${String(r).padStart(2, "0")}`;
}
