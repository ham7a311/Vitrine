export type Level = "debug" | "info" | "warn" | "error";
export type LogLine = { id: number; t: number; level: Level; source?: string; msg: string };
export type Pattern = { re: RegExp | null; error?: string };

export const LEVELS: Level[] = ["debug", "info", "warn", "error"];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Compile a user pattern. An invalid regex never throws: it reports why and falls back to a literal match. */
export function compile(src: string, caseSensitive = false): Pattern {
  if (!src) return { re: null };
  const flags = caseSensitive ? "g" : "gi";
  try {
    const re = new RegExp(src, flags);
    // A pattern that can match nothing would loop forever and highlight nothing useful.
    if (re.test("")) return { re: new RegExp(escape(src), flags), error: "Matches empty text, searching literally" };
    re.lastIndex = 0;
    return { re };
  } catch (e) {
    return { re: new RegExp(escape(src), flags), error: `${(e as Error).message.replace(/^Invalid regular expression: (\/.*\/[a-z]*: )?/, "")}, searching literally` };
  }
}

/** Split text into plain and matched pieces. */
export function highlight(text: string, re: RegExp | null): { text: string; hit: boolean }[] {
  if (!re) return [{ text, hit: false }];
  const out: { text: string; hit: boolean }[] = [];
  let last = 0;
  re.lastIndex = 0;
  for (const m of text.matchAll(re)) {
    if (!m[0]) continue;
    const i = m.index!;
    if (i > last) out.push({ text: text.slice(last, i), hit: false });
    out.push({ text: m[0], hit: true });
    last = i + m[0].length;
  }
  if (last < text.length || !out.length) out.push({ text: text.slice(last), hit: false });
  return out;
}

export function matches(line: LogLine, re: RegExp | null) {
  if (!re) return true;
  re.lastIndex = 0;
  const ok = re.test(line.msg) || (!!line.source && (re.lastIndex = 0, re.test(line.source)));
  re.lastIndex = 0;
  return ok;
}

export function visible(lines: LogLine[], levels: Set<Level>, re: RegExp | null, onlyMatching: boolean) {
  return lines.filter((l) => levels.has(l.level) && (!onlyMatching || matches(l, re)));
}

/** "4s ago", "12m ago", "3h ago". */
export function ago(t: number, now: number) {
  const s = Math.max(0, Math.round((now - t) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

/** Which rows to render for a scroll position, with a few rows of overscan. */
export function windowOf(count: number, scrollTop: number, height: number, row: number, over = 8) {
  const from = Math.max(0, Math.floor(scrollTop / row) - over);
  const to = Math.min(count, Math.ceil((scrollTop + height) / row) + over);
  return { from, to };
}
