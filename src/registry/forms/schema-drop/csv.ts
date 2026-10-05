export type ColumnType = "BIGINT" | "DOUBLE" | "BOOLEAN" | "DATE" | "TIMESTAMP" | "VARCHAR";
export const COLUMN_TYPES: ColumnType[] = ["BIGINT", "DOUBLE", "BOOLEAN", "DATE", "TIMESTAMP", "VARCHAR"];
export type InferredColumn = { name: string; type: ColumnType; nulls: number; samples: string[] };

/** Picks the delimiter that splits the first line into the most fields. */
export function sniffDelimiter(text: string) {
  const first = text.split(/\r?\n/, 1)[0] ?? "";
  return [",", ";", "\t", "|"].map((d) => ({ d, n: first.split(d).length })).sort((a, b) => b.n - a.n)[0].d;
}

/** RFC 4180 parsing: quoted fields may hold delimiters, doubled quotes and newlines. */
export function parseCsv(text: string, delimiter = sniffDelimiter(text)): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
    } else if (c === '"' && field === "") quoted = true;
    else if (c === delimiter) { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

const NULLS = new Set(["", "null", "na", "n/a", "nan", "none"]);
const isNull = (v: string) => NULLS.has(v.trim().toLowerCase());
const validDate = (y: number, m: number, d: number) => { const t = new Date(Date.UTC(y, m - 1, d)); return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d; };

const tests: [ColumnType, (v: string) => boolean][] = [
  ["BOOLEAN", (v) => /^(true|false|yes|no|t|f)$/i.test(v)],
  ["BIGINT", (v) => /^[+-]?\d{1,18}$/.test(v)],
  ["DOUBLE", (v) => /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(v)],
  ["DATE", (v) => { const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/); return !!m && validDate(+m[1], +m[2], +m[3]); }],
  ["TIMESTAMP", (v) => { const m = v.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/); return !!m && validDate(+m[1], +m[2], +m[3]) && +m[4] < 24 && +m[5] < 60; }],
];

/** The narrowest type every non-null value fits; VARCHAR when nothing else does. */
export function inferType(values: string[]): ColumnType {
  const present = values.map((v) => v.trim()).filter((v) => !isNull(v));
  if (!present.length) return "VARCHAR";
  for (const [type, ok] of tests) if (present.every(ok)) return type;
  return "VARCHAR";
}

/** Snake-case a header into a safe column or table name. */
export function identifier(raw: string, fallback: string) {
  const s = raw.trim().toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return !s ? fallback : /^\d/.test(s) ? `_${s}` : s;
}

export function inferColumns(rows: string[][], sample = 500): InferredColumn[] {
  const [header = [], ...body] = rows;
  const width = Math.max(header.length, ...body.slice(0, sample).map((r) => r.length));
  const seen = new Map<string, number>();
  return Array.from({ length: width }, (_, c) => {
    let name = identifier(header[c] ?? "", `column_${c + 1}`);
    const count = seen.get(name) ?? 0;
    seen.set(name, count + 1);
    if (count) name = `${name}_${count + 1}`;
    const values = body.slice(0, sample).map((r) => r[c] ?? "");
    return { name, type: inferType(values), nulls: body.filter((r) => isNull(r[c] ?? "")).length, samples: values.filter((v) => !isNull(v)).slice(0, 3) };
  });
}
