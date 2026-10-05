/**
 * Faceted filtering that can explain itself. Options within a facet are
 * alternatives (OR); facets narrow each other (AND). For every option it can
 * say how many results you'd have if you toggled it, and for every hidden item
 * which filters hid it.
 */
export type Facet<T> = { key: string; label: string; get: (item: T) => string | string[] };
export type Filters = Record<string, string[]>;

const values = <T,>(f: Facet<T>, item: T) => { const v = f.get(item); return Array.isArray(v) ? v : [v]; };
const passes = <T,>(f: Facet<T>, item: T, sel: string[] | undefined) => !sel?.length || values(f, item).some((v) => sel.includes(v));

export function matches<T>(item: T, facets: Facet<T>[], filters: Filters, skip?: string) {
  return facets.every((f) => f.key === skip || passes(f, item, filters[f.key]));
}

/** Every option of a facet with how many items carry it, in first-seen order. */
export function options<T>(items: T[], facet: Facet<T>) {
  const seen = new Map<string, number>();
  for (const item of items) for (const v of values(facet, item)) seen.set(v, (seen.get(v) ?? 0) + 1);
  return [...seen].map(([value, total]) => ({ value, total }));
}

/** For each facet and option: the result count if that one option were toggled. */
export function counts<T>(items: T[], facets: Facet<T>[], filters: Filters) {
  const out: Record<string, Record<string, number>> = {};
  for (const f of facets) {
    const base = items.filter((item) => matches(item, facets, filters, f.key));
    const sel = filters[f.key] ?? [];
    out[f.key] = {};
    for (const { value } of options(items, f)) {
      const next = sel.includes(value) ? sel.filter((s) => s !== value) : [...sel, value];
      out[f.key][value] = base.filter((item) => passes(f, item, next)).length;
    }
  }
  return out;
}

/** The facets an item fails under the current filters. */
export function failing<T>(item: T, facets: Facet<T>[], filters: Filters) {
  return facets.filter((f) => !passes(f, item, filters[f.key])).map((f) => f.key);
}

export function toggle(filters: Filters, key: string, value: string): Filters {
  const sel = filters[key] ?? [];
  return { ...filters, [key]: sel.includes(value) ? sel.filter((s) => s !== value) : [...sel, value] };
}
