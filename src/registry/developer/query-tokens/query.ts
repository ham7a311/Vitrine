/**
 * Filter syntax that stays plain text: `status:open owner:me -label:bug
 * updated:>2026-09 "offline sync"`. Every token keeps its position in the
 * text so it can be highlighted, completed or removed in place.
 */
export type KeyDef = { key: string; label: string; kind: "enum" | "text" | "date" | "number"; values?: string[] };
export type Op = ":" | ">" | "<" | ">=" | "<=";
export type Term = { type: "term"; key: string; op: Op; value: string; negate: boolean; start: number; end: number; keyEnd: number; known: boolean; suggestion?: string; badValue?: boolean };
export type Text = { type: "text"; value: string; negate: boolean; start: number; end: number };
export type Token = Term | Text;

export function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const closest = (word: string, options: string[]) => {
  let best: string | undefined, score = Infinity;
  for (const o of options) { const s = distance(word.toLowerCase(), o.toLowerCase()); if (s < score) { score = s; best = o; } }
  return best !== undefined && score <= Math.max(1, Math.floor(word.length / 3)) ? best : undefined;
};

export function tokenize(text: string, keys: KeyDef[]): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < text.length) {
    if (/\s/.test(text[i])) { i++; continue; }
    const start = i;
    const negate = text[i] === "-" && i + 1 < text.length && !/\s/.test(text[i + 1]);
    if (negate) i++;
    const term = /^([a-zA-Z_][\w-]*):(>=|<=|>|<)?/.exec(text.slice(i));
    if (term) {
      const key = term[1];
      const keyEnd = i + key.length;
      i += term[0].length;
      let value = "";
      if (text[i] === '"') { const close = text.indexOf('"', i + 1); value = text.slice(i + 1, close < 0 ? text.length : close); i = close < 0 ? text.length : close + 1; }
      else { const m = /^\S*/.exec(text.slice(i))!; value = m[0]; i += value.length; }
      const def = keys.find((k) => k.key.toLowerCase() === key.toLowerCase());
      const t: Term = { type: "term", key: def?.key ?? key, op: (term[2] as Op) || ":", value, negate, start, end: i, keyEnd, known: !!def };
      if (!def) t.suggestion = closest(key, keys.map((k) => k.key));
      else if (def.kind === "enum" && value && def.values && !def.values.some((v) => v.toLowerCase() === value.toLowerCase())) { t.badValue = true; t.suggestion = closest(value, def.values); }
      out.push(t);
      continue;
    }
    let value: string;
    if (text[i] === '"') { const close = text.indexOf('"', i + 1); value = text.slice(i + 1, close < 0 ? text.length : close); i = close < 0 ? text.length : close + 1; }
    else { const m = /^\S+/.exec(text.slice(i))!; value = m[0]; i += value.length; }
    if (value) out.push({ type: "text", value, negate, start, end: i });
  }
  return out;
}

/** The token text to put back, quoting values that contain spaces. */
export function render(t: Token): string {
  const q = (v: string) => (/\s/.test(v) ? `"${v}"` : v);
  return `${t.negate ? "-" : ""}${t.type === "term" ? `${t.key}:${t.op === ":" ? "" : t.op}${q(t.value)}` : q(t.value)}`;
}

/** A readable phrase for a token: "status is open", "not label bug", "updated after 2026-09". */
export function phrase(t: Token, keys: KeyDef[]): string {
  if (t.type === "text") return `${t.negate ? "doesn't contain" : "contains"} "${t.value}"`;
  const label = keys.find((k) => k.key === t.key)?.label.toLowerCase() ?? t.key;
  const verb = { ":": t.negate ? "is not" : "is", ">": "after", "<": "before", ">=": "on or after", "<=": "on or before" }[t.op];
  const kind = keys.find((k) => k.key === t.key)?.kind;
  const cmp = kind === "number" ? { ">": "above", "<": "below", ">=": "at least", "<=": "at most" } : null;
  return `${label} ${t.op !== ":" && cmp ? cmp[t.op] : verb} ${t.value || "…"}`;
}

/** Whether a record passes every complete token. Records map keys to strings, numbers or lists. */
export function test(tokens: Token[], record: Record<string, string | number | string[]>, keys: KeyDef[]): boolean {
  return tokens.every((t) => {
    if (t.type === "text") {
      const hay = Object.values(record).flat().join(" ").toLowerCase();
      return hay.includes(t.value.toLowerCase()) !== t.negate;
    }
    if (!t.known || !t.value || t.badValue) return true;
    const v = record[t.key], kind = keys.find((k) => k.key === t.key)?.kind;
    let ok: boolean;
    if (t.op === ":") ok = Array.isArray(v) ? v.some((x) => x.toLowerCase() === t.value.toLowerCase()) : kind === "text" ? String(v).toLowerCase().includes(t.value.toLowerCase()) : String(v).toLowerCase() === t.value.toLowerCase();
    else {
      const a = kind === "number" ? Number(v) : String(v), b = kind === "number" ? Number(t.value) : t.value;
      // Dates compare as text, so "2026-09" means the whole of September for > and <.
      const cmp = kind === "number" ? (a as number) - (b as number) : String(a).slice(0, String(b).length).localeCompare(String(b));
      ok = t.op === ">" ? cmp > 0 : t.op === "<" ? cmp < 0 : t.op === ">=" ? cmp >= 0 : cmp <= 0;
    }
    return ok !== t.negate;
  });
}
