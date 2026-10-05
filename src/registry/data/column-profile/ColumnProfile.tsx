"use client";
import { useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { profileColumns, type ColumnStats, type ProfileColumn } from "./profile";
import "./column-profile.css";

export type ColumnProfileProps = {
  table: string;
  columns: ProfileColumn[];
  rows: Record<string, unknown>[];
  bins?: number;
  locale?: string;
  theme?: "light" | "dark";
  className?: string;
};

type Sort = "order" | "nulls" | "distinct";
const KIND_LABEL = { number: "Number", date: "Date", text: "Text", boolean: "Boolean" } as const;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Histogram({ stats, fmt, label }: { stats: ColumnStats; fmt: (n: number) => string; label: string }) {
  const id = useId();
  const [active, setActive] = useState<number | null>(null);
  const bins = stats.bins ?? [];
  const peak = Math.max(1, ...bins.map((b) => b.count));
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    setActive((a) => {
      if (e.key === "Home") return 0;
      if (e.key === "End") return bins.length - 1;
      const cur = a ?? (e.key === "ArrowRight" ? -1 : bins.length);
      return Math.max(0, Math.min(bins.length - 1, cur + (e.key === "ArrowRight" ? 1 : -1)));
    });
  };
  const bin = active !== null ? bins[active] : null;
  return (
    <div className="cprof__chart">
      <div
        className="cprof__bars"
        tabIndex={0}
        role="group"
        aria-label={`${label} distribution, ${bins.length} bins. Use the arrow keys to read each bin.`}
        aria-describedby={`${id}-read`}
        onKeyDown={key}
        onMouseLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
      >
        {bins.map((b, i) => (
          <span key={i} className="cprof__bar" data-active={active === i || undefined} onMouseEnter={() => setActive(i)} style={{ "--h": `${Math.max(3, (b.count / peak) * 100)}%` } as CSSProperties} />
        ))}
      </div>
      <p id={`${id}-read`} className="cprof__readout" aria-live="polite">
        {bin ? <span><b>{fmt(bin.from)}{bins.length > 1 ? ` – ${fmt(bin.to)}` : ""}</b> · {bin.count} {bin.count === 1 ? "row" : "rows"}</span> : <><span>{fmt(stats.min ?? 0)}</span><span>{fmt(stats.max ?? 0)}</span></>}
      </p>
    </div>
  );
}

/**
 * Column Profile
 * Every column of a table summarised on its own card: how many values are
 * missing, how many are distinct, and the shape of what's there — a
 * histogram you can read bin by bin, the top values, or a true/false split.
 */
export function ColumnProfile({ table, columns, rows, bins = 14, locale, theme = "light", className = "" }: ColumnProfileProps) {
  const [sort, setSort] = useState<Sort>("order");
  const stats = useMemo(() => profileColumns(columns, rows, bins), [columns, rows, bins]);
  const sorted = useMemo(() => {
    const list = [...stats];
    if (sort === "nulls") list.sort((a, b) => b.nulls - a.nulls);
    if (sort === "distinct") list.sort((a, b) => b.distinct - a.distinct);
    return list;
  }, [stats, sort]);
  const cards = useRef(new Map<string, HTMLLIElement>());
  const last = useRef(new Map<string, { x: number; y: number }>());
  const int = new Intl.NumberFormat(locale);
  const dec = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const pct = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 });
  const day = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" });

  // FLIP on offsets, so cards glide to their new places when the sort changes.
  useLayoutEffect(() => {
    const prev = last.current;
    const now = new Map([...cards.current].map(([k, el]) => [k, { x: el.offsetLeft, y: el.offsetTop }]));
    last.current = now;
    if (reduced()) return;
    cards.current.forEach((el, k) => {
      const a = prev.get(k), b = now.get(k);
      if (!a || !b || (a.x === b.x && a.y === b.y)) return;
      el.animate([{ transform: `translate(${a.x - b.x}px, ${a.y - b.y}px)` }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }, [sorted]);

  return (
    <section className={`cprof cprof--${theme} ${className}`} aria-label={`Profile of ${table}`}>
      <header className="cprof__head">
        <p className="cprof__table"><code>{table}</code><span>{int.format(rows.length)} rows · {columns.length} columns</span></p>
        <label className="cprof__sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="order">Table order</option>
            <option value="nulls">Most nulls</option>
            <option value="distinct">Most distinct</option>
          </select>
        </label>
      </header>
      <ul className="cprof__grid">
        {sorted.map((s) => {
          const fmt = (n: number) => (s.kind === "date" ? day.format(new Date(n)) : dec.format(n));
          const nullShare = s.rows ? s.nulls / s.rows : 0;
          return (
            <li key={s.name} ref={(el) => { if (el) cards.current.set(s.name, el); else cards.current.delete(s.name); }} className="cprof__card" data-kind={s.kind}>
              <div className="cprof__card-head">
                <h3 className="cprof__name">{s.name}</h3>
                <span className="cprof__kind">{KIND_LABEL[s.kind]}</span>
              </div>
              <dl className="cprof__stats">
                <div data-warn={nullShare > 0.1 || undefined}><dt>Nulls</dt><dd>{pct.format(nullShare)}</dd></div>
                <div><dt>Distinct</dt><dd>{int.format(s.distinct)}</dd></div>
                {s.mean !== undefined && s.kind === "number" && <div><dt>Mean</dt><dd>{dec.format(s.mean)}</dd></div>}
              </dl>
              {(s.kind === "number" || s.kind === "date") && s.bins && <Histogram stats={s} fmt={fmt} label={s.name} />}
              {s.kind === "text" && s.top && (
                <ol className="cprof__top" aria-label={`Most common values in ${s.name}`}>
                  {s.top.map((t) => (
                    <li key={t.value} style={{ "--w": `${(t.count / (s.top![0]?.count || 1)) * 100}%` } as CSSProperties}>
                      <span className="cprof__value">{t.value}</span><span className="cprof__n">{int.format(t.count)}</span>
                    </li>
                  ))}
                </ol>
              )}
              {s.kind === "boolean" && (
                <div className="cprof__split" role="img" aria-label={`${s.yes} true, ${s.no} false`}>
                  <span className="cprof__yes" style={{ flexGrow: s.yes || 0.0001 }}>{s.yes ? `true ${int.format(s.yes)}` : ""}</span>
                  <span className="cprof__no" style={{ flexGrow: s.no || 0.0001 }}>{s.no ? `false ${int.format(s.no)}` : ""}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
