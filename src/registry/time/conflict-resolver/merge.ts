/**
 * Three-way merge for one record: compare each field's base, mine and theirs.
 * Changes on one side only are taken automatically; tags merge as sets; long
 * text merges line by line (diff3), so only overlapping edits need a person.
 */
export type FieldKind = "text" | "longtext" | "enum" | "tags" | "date";
export type Value = string | string[];
export type Hunk = { type: "ok"; lines: string[] } | { type: "conflict"; base: string[]; mine: string[]; theirs: string[] };
export type FieldMerge =
  | { status: "unchanged" | "same" | "mine" | "theirs"; value: Value }
  | { status: "merged"; value: Value; hunks?: Hunk[] }
  | { status: "conflict"; base: Value; mine: Value; theirs: Value; hunks?: Hunk[] };

const eq = (a: Value, b: Value) => (Array.isArray(a) && Array.isArray(b) ? a.length === b.length && a.every((x, i) => x === b[i]) : a === b);

/** Indices of a longest common subsequence, as pairs [i in a, j in b]. */
export function lcs<T>(a: T[], b: T[]): [number, number][] {
  const n = a.length, m = b.length;
  const t = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
  const out: [number, number][] = [];
  for (let i = 0, j = 0; i < n && j < m;) {
    if (a[i] === b[j]) { out.push([i, j]); i++; j++; }
    else if (t[i + 1][j] >= t[i][j + 1]) i++;
    else j++;
  }
  return out;
}

/** Line-level three-way merge. */
export function diff3(base: string[], mine: string[], theirs: string[]): Hunk[] {
  const toMine = new Map(lcs(base, mine)), toTheirs = new Map(lcs(base, theirs));
  // Anchors: base lines kept, in order, by both sides.
  const anchors: [number, number, number][] = [];
  for (let i = 0; i < base.length; i++) if (toMine.has(i) && toTheirs.has(i)) {
    const prev = anchors[anchors.length - 1];
    const jm = toMine.get(i)!, jt = toTheirs.get(i)!;
    if (!prev || (jm > prev[1] && jt > prev[2])) anchors.push([i, jm, jt]);
  }
  anchors.push([base.length, mine.length, theirs.length]);
  const hunks: Hunk[] = [];
  const ok = (lines: string[]) => { if (!lines.length) return; const last = hunks[hunks.length - 1]; if (last?.type === "ok") last.lines.push(...lines); else hunks.push({ type: "ok", lines: [...lines] }); };
  let b = 0, m = 0, t = 0;
  for (const [ab, am, at] of anchors) {
    const B = base.slice(b, ab), M = mine.slice(m, am), T = theirs.slice(t, at);
    if (B.length || M.length || T.length) {
      if (eq(M, T)) ok(M);
      else if (eq(M, B)) ok(T);
      else if (eq(T, B)) ok(M);
      else hunks.push({ type: "conflict", base: B, mine: M, theirs: T });
    }
    if (ab < base.length) ok([base[ab]]);
    b = ab + 1; m = am + 1; t = at + 1;
  }
  return hunks;
}

export function mergeField(kind: FieldKind, base: Value, mine: Value, theirs: Value): FieldMerge {
  if (eq(mine, theirs)) return { status: eq(mine, base) ? "unchanged" : "same", value: mine };
  if (eq(mine, base)) return { status: "theirs", value: theirs };
  if (eq(theirs, base)) return { status: "mine", value: mine };
  if (kind === "tags") {
    const B = base as string[], M = mine as string[], T = theirs as string[];
    const removed = new Set([...B.filter((x) => !M.includes(x)), ...B.filter((x) => !T.includes(x))]);
    const added = [...M, ...T].filter((x) => !B.includes(x));
    return { status: "merged", value: [...new Set([...B, ...added])].filter((x) => !removed.has(x)) };
  }
  if (kind === "longtext") {
    const hunks = diff3((base as string).split("\n"), (mine as string).split("\n"), (theirs as string).split("\n"));
    if (!hunks.some((h) => h.type === "conflict")) return { status: "merged", value: hunks.flatMap((h) => (h.type === "ok" ? h.lines : [])).join("\n"), hunks };
    return { status: "conflict", base, mine, theirs, hunks };
  }
  return { status: "conflict", base, mine, theirs };
}

export type Piece = { type: "same" | "add" | "del"; text: string };
/** Word-level differences from a to b, for showing what each side changed. */
export function words(a: string, b: string): Piece[] {
  const A = a.split(/(\s+)/), B = b.split(/(\s+)/);
  const pairs = lcs(A, B);
  const out: Piece[] = [];
  const push = (type: Piece["type"], text: string) => { if (!text) return; const last = out[out.length - 1]; if (last?.type === type) last.text += text; else out.push({ type, text }); };
  let i = 0, j = 0;
  for (const [pi, pj] of [...pairs, [A.length, B.length] as [number, number]]) {
    while (i < pi) push("del", A[i++]);
    while (j < pj) push("add", B[j++]);
    if (pi < A.length) push("same", A[pi]);
    i = pi + 1; j = pj + 1;
  }
  return out;
}
