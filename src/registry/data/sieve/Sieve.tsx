"use client";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { counts, failing, matches, options, toggle, type Facet, type Filters } from "./sieve";
import "./sieve.css";

export type { Facet, Filters } from "./sieve";
export type SieveProps<T> = {
  items: T[];
  facets: Facet<T>[];
  getId: (item: T) => string;
  getName: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  initial?: Filters;
  /** Called with the filters and the visible items (matches plus anything kept by hand). */
  onChange?: (filters: Filters, visible: T[]) => void;
  noun?: [string, string];
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const LEAVE_MS = 360;

/**
 * Sieve
 * Faceted filtering that shows its work: each option says how the results
 * would change before you tick it, and whatever the filters remove drops into
 * a tray below, grouped by the filter that set it aside, ready to bring back.
 */
export function Sieve<T>({ items, facets, getId, getName, renderItem, initial = {}, onChange, noun = ["item", "items"], theme = "light", motion = true, className = "" }: SieveProps<T>) {
  const id = useId();
  const [filters, setFilters] = useState<Filters>(initial);
  const [kept, setKept] = useState<Set<string>>(() => new Set());
  const [leaving, setLeaving] = useState<Set<string>>(() => new Set());
  const [trayOpen, setTrayOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduced = useRef(false);
  useEffect(() => { reduced.current = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches; }, [motion]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const plural = (n: number) => `${n} ${n === 1 ? noun[0] : noun[1]}`;
  const facetOptions = useMemo(() => facets.map((f) => ({ facet: f, opts: options(items, f) })), [items, facets]);
  const isVisible = (item: T, f: Filters, k: Set<string>) => matches(item, facets, f) || k.has(getId(item));
  const visible = items.filter((i) => isVisible(i, filters, kept));
  const matched = items.filter((i) => matches(i, facets, filters)).length;
  const aside = items.filter((i) => !isVisible(i, filters, kept));
  const next = useMemo(() => counts(items, facets, filters), [items, facets, filters]);
  const active = facets.filter((f) => filters[f.key]?.length);

  const apply = (f: Filters, k = kept) => {
    const before = new Set(items.filter((i) => isVisible(i, filters, kept)).map(getId));
    const after = items.filter((i) => isVisible(i, f, k));
    const gone = [...before].filter((x) => !after.some((i) => getId(i) === x));
    setFilters(f);
    setKept(k);
    onChange?.(f, after);
    const out = items.length - after.length;
    setMessage(`Showing ${after.length} of ${items.length}.${out ? ` ${out} set aside.` : ""}`);
    if (gone.length && !reduced.current) {
      clearTimeout(timer.current);
      setLeaving(new Set(gone));
      timer.current = setTimeout(() => setLeaving(new Set()), LEAVE_MS);
    }
  };
  const clearFacet = (key: string) => apply({ ...filters, [key]: [] });
  const keep = (item: T) => { const k = new Set(kept); k.add(getId(item)); apply(filters, k); setMessage(`${getName(item)} kept in the results.`); };
  const release = (item: T) => { const k = new Set(kept); k.delete(getId(item)); apply(filters, k); };

  // Items still animating out are rendered after the live ones, at the end of the grid.
  const ghosts = items.filter((i) => leaving.has(getId(i)) && !isVisible(i, filters, kept));
  const groups = active.map((f) => ({ facet: f, items: aside.filter((i) => failing(i, facets, filters).includes(f.key)) })).filter((g) => g.items.length);
  const label = (key: string) => facets.find((f) => f.key === key)?.label ?? key;

  return (
    <section className={`sieve sieve--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-label="Filtered results">
      <div className="sieve__body">
        <div className="sieve__side">
          <button type="button" className="sieve__panel-toggle" aria-expanded={panelOpen} aria-controls={`${id}-panel`} onClick={() => setPanelOpen((o) => !o)}>
            Filters{active.length ? ` (${active.reduce((a, f) => a + filters[f.key].length, 0)})` : ""}
          </button>
          <div id={`${id}-panel`} className="sieve__panel" data-open={panelOpen || undefined}>
            {facetOptions.map(({ facet, opts }) => (
              <fieldset key={facet.key} className="sieve__facet">
                <legend>{facet.label}</legend>
                {opts.map(({ value }) => {
                  const on = filters[facet.key]?.includes(value) ?? false;
                  const result = next[facet.key][value];
                  const delta = result - matched;
                  return (
                    <label key={value} className="sieve__opt" data-on={on || undefined} data-empty={result === 0 || undefined}>
                      <input type="checkbox" checked={on} onChange={() => apply(toggle(filters, facet.key, value))} />
                      <span className="sieve__opt-name">{value}</span>
                      <span className="sieve__delta" data-sign={delta > 0 ? "up" : delta < 0 ? "down" : "same"}>
                        <span className="sieve__sr">, {delta === 0 ? "no change" : `${delta > 0 ? "adds" : "removes"} ${Math.abs(delta)}`}</span>
                        <span aria-hidden="true">{delta > 0 ? `+${delta}` : delta < 0 ? `−${-delta}` : "±0"}</span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            ))}
            {active.length > 0 && <button type="button" className="sieve__link" onClick={() => apply({})}>Clear all filters</button>}
          </div>
        </div>

        <div className="sieve__main">
          <p className="sieve__status"><strong>{visible.length}</strong> of {plural(items.length)}{kept.size ? ` · ${kept.size} kept by you` : ""}</p>
          {visible.length === 0 && <p className="sieve__none">Nothing passes every filter. The tray below shows what each one removed.</p>}
          <ul className="sieve__grid">
            {visible.map((i) => (
              <li key={getId(i)} className="sieve__item" data-kept={!matches(i, facets, filters) || undefined}>
                {renderItem(i)}
                {!matches(i, facets, filters) && (
                  <span className="sieve__kept">Kept by you <button type="button" onClick={() => release(i)} aria-label={`Let the filters set aside ${getName(i)}`}>Release</button></span>
                )}
              </li>
            ))}
            {ghosts.map((i) => <li key={`ghost-${getId(i)}`} className="sieve__item sieve__item--leaving" aria-hidden="true">{renderItem(i)}</li>)}
          </ul>

          <div className="sieve__tray" data-open={trayOpen || undefined} data-empty={!aside.length || undefined}>
            <button type="button" className="sieve__tray-head" aria-expanded={trayOpen} aria-controls={`${id}-tray`} onClick={() => setTrayOpen((o) => !o)} disabled={!aside.length}>
              <span className="sieve__holes" aria-hidden="true" />
              <span>Set aside <span key={aside.length} className="sieve__tray-count">{aside.length}</span></span>
              <span className="sieve__tray-hint">{aside.length ? (trayOpen ? "Hide" : "See what the filters removed") : "Nothing removed yet"}</span>
            </button>
            {trayOpen && aside.length > 0 && (
              <div id={`${id}-tray`} className="sieve__tray-body">
                {groups.map(({ facet, items: list }) => (
                  <section key={facet.key} className="sieve__group" aria-labelledby={`${id}-g-${facet.key}`}>
                    <header>
                      <h4 id={`${id}-g-${facet.key}`}>Not {filters[facet.key].join(" or ")} <span>· {facet.label}</span></h4>
                      <button type="button" className="sieve__link" onClick={() => clearFacet(facet.key)}>Clear {facet.label.toLowerCase()} filter</button>
                    </header>
                    <ul>
                      {(expanded.has(facet.key) ? list : list.slice(0, 6)).map((i) => {
                        const also = failing(i, facets, filters).filter((k) => k !== facet.key);
                        return (
                          <li key={getId(i)}>
                            <span className="sieve__aside-name">{getName(i)}</span>
                            {also.length > 0 && <span className="sieve__also">also {also.map(label).join(", ").toLowerCase()}</span>}
                            <button type="button" onClick={() => keep(i)} aria-label={`Keep ${getName(i)} anyway`}>Keep anyway</button>
                          </li>
                        );
                      })}
                    </ul>
                    {list.length > 6 && !expanded.has(facet.key) && (
                      <button type="button" className="sieve__link sieve__more" onClick={() => setExpanded((e) => new Set(e).add(facet.key))}>Show all {list.length}</button>
                    )}
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="sieve__sr" aria-live="polite">{message}</p>
    </section>
  );
}
