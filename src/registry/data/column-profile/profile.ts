export type ColumnKind = "number" | "date" | "text" | "boolean";
export type ProfileColumn = { name: string; kind: ColumnKind };
export type Bin = { from: number; to: number; count: number };
export type ColumnStats = {
  name: string;
  kind: ColumnKind;
  rows: number;
  nulls: number;
  distinct: number;
  min?: number;
  max?: number;
  mean?: number;
  bins?: Bin[];
  top?: { value: string; count: number }[];
  yes?: number;
  no?: number;
};

const isNull = (v: unknown) => v === null || v === undefined || (typeof v === "string" && v.trim() === "") || (typeof v === "number" && Number.isNaN(v));

function toNumber(v: unknown, kind: ColumnKind) {
  if (kind === "date") { const t = v instanceof Date ? v.getTime() : Date.parse(String(v)); return Number.isFinite(t) ? t : null; }
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Equal-width bins between min and max; the last bin includes max. */
export function histogram(values: number[], bins: number): Bin[] {
  if (!values.length) return [];
  let min = Infinity, max = -Infinity;
  for (const v of values) { if (v < min) min = v; if (v > max) max = v; }
  if (min === max) return [{ from: min, to: max, count: values.length }];
  const width = (max - min) / bins;
  const out = Array.from({ length: bins }, (_, i) => ({ from: min + i * width, to: i === bins - 1 ? max : min + (i + 1) * width, count: 0 }));
  for (const v of values) out[Math.min(bins - 1, Math.floor((v - min) / width))].count++;
  return out;
}

/** Summarise each column: nulls, distinct values, range and shape. */
export function profileColumns(columns: ProfileColumn[], rows: Record<string, unknown>[], bins = 12): ColumnStats[] {
  return columns.map(({ name, kind }) => {
    const raw = rows.map((r) => r[name]);
    const present = raw.filter((v) => !isNull(v));
    const stats: ColumnStats = { name, kind, rows: raw.length, nulls: raw.length - present.length, distinct: new Set(present.map((v) => (v instanceof Date ? v.getTime() : String(v)))).size };
    if (kind === "number" || kind === "date") {
      const nums = present.map((v) => toNumber(v, kind)).filter((n): n is number => n !== null);
      if (nums.length) {
        stats.min = Math.min(...nums);
        stats.max = Math.max(...nums);
        stats.mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        stats.bins = histogram(nums, bins);
      }
    } else if (kind === "boolean") {
      const truthy = (v: unknown) => v === true || /^(true|t|yes|y|1)$/i.test(String(v));
      stats.yes = present.filter(truthy).length;
      stats.no = present.length - stats.yes;
      stats.distinct = (stats.yes ? 1 : 0) + (stats.no ? 1 : 0);
    } else {
      const counts = new Map<string, number>();
      for (const v of present) counts.set(String(v), (counts.get(String(v)) ?? 0) + 1);
      stats.top = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5).map(([value, count]) => ({ value, count }));
    }
    return stats;
  });
}
