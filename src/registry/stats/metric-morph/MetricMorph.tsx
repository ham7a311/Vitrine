"use client";

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import "./metric-morph.css";

/**
 * Metric Morph
 * A live metric where only the place values that changed move. Unchanged digits
 * hold still; changed digits turn over in the direction of the change and carry
 * its colour for a moment. A rule stays under the changed range, so the size of
 * the last change — units, hundreds, thousands — reads at a glance.
 */

type Props = {
  value: number | null;
  label: string;
  /** Context for the delta, e.g. "vs 5 min ago". */
  compareLabel?: string;
  format?: "number" | "percent" | "currency";
  currency?: string;
  decimals?: number;
  /** For metrics where down is good (latency, errors). */
  invert?: boolean;
  loading?: boolean;
  /** Bump to register a new reading even when the value is unchanged. */
  revision?: number;
  theme?: "paper" | "night";
};

/** `cur`/`prev` hold only the numeric body; affixes (currency code, %) stay still. */
type Frame = { cur: string; prev: string; pre: string; suf: string; id: number; dir: 1 | -1 | 0; delta: number; pct: number | null };

function formatter(format: Props["format"], currency: string, decimals: number) {
  if (format === "percent") return new Intl.NumberFormat("en", { style: "percent", minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  if (format === "currency") return new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: "code", minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return new Intl.NumberFormat("en", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const NUMERIC = new Set(["minusSign", "integer", "group", "decimal", "fraction"]);

/** Split a reading into prefix, the numeric body that is aligned by place value, and suffix. */
function split(fmt: Intl.NumberFormat, value: number | null) {
  if (value === null) return { pre: "", body: "", suf: "" };
  const parts = fmt.formatToParts(value);
  const first = parts.findIndex((p) => p.type === "minusSign" || p.type === "integer");
  let last = first;
  for (let i = first; i < parts.length && NUMERIC.has(parts[i].type); i++) last = i;
  const join = (ps: Intl.NumberFormatPart[]) => ps.map((p) => p.value).join("");
  return { pre: join(parts.slice(0, first)).trim(), body: join(parts.slice(first, last + 1)), suf: join(parts.slice(last + 1)).trim() };
}

export function MetricMorph({ value, label, compareLabel = "vs previous", format = "number", currency = "OMR", decimals = 0, invert = false, loading = false, revision = 0, theme = "paper" }: Props) {
  const fmt = useMemo(() => formatter(format, currency, decimals), [format, currency, decimals]);
  const text = value === null ? "" : fmt.format(value);
  const { pre, body, suf } = split(fmt, value);
  const last = useRef<number | null>(value);
  const lastRev = useRef(revision);
  const [frame, setFrame] = useState<Frame>({ cur: body, prev: body, pre, suf, id: 0, dir: 0, delta: 0, pct: null });

  // Before paint: remember what the number was, so the change can be drawn against it.
  useLayoutEffect(() => {
    const before = last.current;
    last.current = value;
    if (value === null || before === null) {
      setFrame((f) => ({ ...f, cur: body, prev: body, pre, suf }));
      return;
    }
    if (body === frame.cur && pre === frame.pre && suf === frame.suf && value === before && revision === lastRev.current) return;
    lastRev.current = revision;
    const delta = value - before;
    setFrame((f) => ({ cur: body, prev: f.cur, pre, suf, id: f.id + 1, dir: delta > 0 ? 1 : delta < 0 ? -1 : 0, delta, pct: before !== 0 ? delta / Math.abs(before) : null }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, value, revision]);

  const cur = [...frame.cur];
  const prev = [...frame.prev];
  const len = Math.max(cur.length, prev.length);
  const changedAt = (i: number) => frame.id > 0 && frame.dir !== 0 && /\d/.test(cur[i] ?? "") && cur[i] !== prev[prev.length - cur.length + i];
  const firstChanged = cur.findIndex((_, i) => changedAt(i));

  const good = frame.dir === 0 ? "flat" : (frame.dir > 0) !== invert ? "up" : "down";
  const deltaText =
    frame.dir === 0
      ? "No change"
      : format === "percent"
        ? `${frame.delta > 0 ? "+" : "−"}${(Math.abs(frame.delta) * 100).toFixed(decimals)} pts`
        : `${frame.delta > 0 ? "+" : "−"}${fmt.format(Math.abs(frame.delta)).replace(/^[A-Z]{3}\s?/, "")}${frame.pct !== null ? ` · ${frame.delta > 0 ? "+" : "−"}${Math.abs(frame.pct * 100).toFixed(Math.abs(frame.pct) < 0.001 ? 2 : 1)}%` : ""}`;

  // Columns, right-aligned by place value; leading columns that vanished fold away.
  const columns = Array.from({ length: len }, (_, k) => {
    const place = len - 1 - k;
    const ci = cur.length - 1 - place;
    const pi = prev.length - 1 - place;
    return { place, ch: ci >= 0 ? cur[ci] : null, old: pi >= 0 ? prev[pi] : null, ci };
  });

  return (
    <figure className={`metric-morph metric-morph--${theme}`} data-trend={frame.id ? good : undefined} aria-busy={loading || undefined}>
      <figcaption className="metric-morph__label">{label}</figcaption>
      <p className="metric-morph__value" aria-hidden="true">
        {value === null ? (
          <span className="metric-morph__placeholder" />
        ) : (
          <>
            {frame.pre && <span className="metric-morph__affix metric-morph__affix--pre">{frame.pre}</span>}
            {columns.map(({ place, ch, old, ci }) => {
            if (ch === null)
              return (
                <span key={`${place}-gone-${frame.id}`} className="metric-morph__col" data-leaving>
                  <span className="metric-morph__win">{old}</span>
                </span>
              );
            const changed = ci >= 0 && changedAt(ci);
            const entering = old === null && frame.id > 0;
            const inRange = firstChanged >= 0 && ci >= firstChanged;
            const order = firstChanged >= 0 ? ci - firstChanged : 0;
            return (
              <span
                key={changed || entering ? `${place}-${frame.id}` : place}
                className="metric-morph__col"
                data-changed={changed || undefined}
                data-entering={entering || undefined}
                data-range={inRange || undefined}
                data-range-start={ci === firstChanged || undefined}
                data-dir={frame.dir > 0 ? "up" : "down"}
                data-digit={/\d/.test(ch) || undefined}
                style={{ "--mm-i": order } as CSSProperties}
              >
                <span className="metric-morph__win">
                  {changed && old !== null && /\d/.test(old) && (
                    <span className="metric-morph__old" aria-hidden="true">
                      {old}
                    </span>
                  )}
                  <span className="metric-morph__new">{ch}</span>
                </span>
              </span>
            );
            })}
            {frame.suf && <span className="metric-morph__affix metric-morph__affix--suf">{frame.suf}</span>}
          </>
        )}
      </p>
      <span className="metric-morph__sr">{value === null ? "Loading" : `${label}: ${text}${frame.id ? `, ${deltaText} ${compareLabel}` : ""}`}</span>
      <p className="metric-morph__delta">
        {loading ? (
          <span className="metric-morph__updating">Updating…</span>
        ) : frame.id ? (
          <>
            <span className="metric-morph__arrow" aria-hidden="true">
              {frame.dir > 0 ? "↑" : frame.dir < 0 ? "↓" : "→"}
            </span>
            <span key={frame.id} className="metric-morph__delta-text">
              {deltaText}
            </span>
            <span className="metric-morph__compare">{compareLabel}</span>
          </>
        ) : (
          <span className="metric-morph__compare">{compareLabel === "vs previous" ? "Waiting for the next reading" : compareLabel}</span>
        )}
      </p>
    </figure>
  );
}
