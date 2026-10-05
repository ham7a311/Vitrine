"use client";
import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { build, criticalPath, type Span } from "./trace";
import "./span-waterfall.css";

export type { Span } from "./trace";
export type SpanWaterfallProps = {
  spans: Span[];
  title?: string;
  theme?: "light" | "dark";
  className?: string;
};

const SERVICE_HUES = 6;
const ms = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(2)} s` : `${v < 10 ? v.toFixed(1) : Math.round(v)} ms`);

/**
 * Span Waterfall
 * A trace as nested bars on one time axis. Collapse what you don't need,
 * follow the critical path that decided the total time, and open any span
 * for its attributes and its own (self) time.
 */
export function SpanWaterfall({ spans, title = "Trace", theme = "light", className = "" }: SpanWaterfallProps) {
  const id = useId();
  const t = useMemo(() => build(spans), [spans]);
  const crit = useMemo(() => criticalPath(t), [t]);
  const services = useMemo(() => [...new Set(spans.map((s) => s.service))], [spans]);
  const [closed, setClosed] = useState<Set<string>>(() => new Set());
  const [selected, setSelected] = useState<string>(t.roots[0]);
  const [onlyCrit, setOnlyCrit] = useState(false);
  const rows = useRef(new Map<string, HTMLDivElement>());

  const total = t.end - t.start || 1;
  const hiddenBy = (sid: string) => { for (let p = t.byId.get(sid)!.parent; p; p = t.byId.get(p)?.parent) if (closed.has(p)) return true; return false; };
  const visible = t.order.filter((sid) => !hiddenBy(sid) && (!onlyCrit || crit.has(sid)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * total);
  const sel = t.byId.get(selected)!;

  const toggle = (sid: string, open?: boolean) => setClosed((c) => { const n = new Set(c); const isOpen = !n.has(sid); if (open ?? !isOpen) n.delete(sid); else n.add(sid); return n; });
  const focusRow = (sid: string) => { setSelected(sid); rows.current.get(sid)?.focus(); };
  const onKey = (e: KeyboardEvent<HTMLDivElement>, sid: string) => {
    const i = visible.indexOf(sid), n = t.byId.get(sid)!;
    if (e.key === "ArrowDown" && visible[i + 1]) { e.preventDefault(); focusRow(visible[i + 1]); }
    else if (e.key === "ArrowUp" && visible[i - 1]) { e.preventDefault(); focusRow(visible[i - 1]); }
    else if (e.key === "ArrowRight") { e.preventDefault(); if (n.children.length && closed.has(sid)) toggle(sid, true); else if (n.children[0]) focusRow(n.children[0]); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); if (n.children.length && !closed.has(sid)) toggle(sid, false); else if (n.parent) focusRow(n.parent); }
    else if (e.key === "Home") { e.preventDefault(); focusRow(visible[0]); }
    else if (e.key === "End") { e.preventDefault(); focusRow(visible[visible.length - 1]); }
  };

  return (
    <section className={`swfall swfall--${theme} ${className}`} aria-labelledby={`${id}-t`}>
      <header className="swfall__head">
        <div>
          <h3 id={`${id}-t`} className="swfall__title">{title}</h3>
          <p className="swfall__sum">{spans.length} spans · {services.length} services · {ms(total)} total · critical path {[...crit].length} spans</p>
        </div>
        <label className="swfall__crit"><input type="checkbox" checked={onlyCrit} onChange={(e) => setOnlyCrit(e.target.checked)} /> Critical path only</label>
      </header>

      <div className="swfall__body">
        <div className="swfall__table" role="treegrid" aria-labelledby={`${id}-t`} aria-readonly="true">
          <div className="swfall__axis" role="row" aria-hidden="true">
            <span role="columnheader">Span</span>
            <span role="columnheader" className="swfall__ticks">{ticks.map((v, i) => <i key={i} style={{ left: `${(v / total) * 100}%` }}>{ms(v)}</i>)}</span>
          </div>
          {visible.map((sid) => {
            const n = t.byId.get(sid)!;
            const left = ((n.start - t.start) / total) * 100, width = Math.max(0.4, (n.duration / total) * 100);
            return (
              <div
                key={sid}
                ref={(el) => { if (el) rows.current.set(sid, el); else rows.current.delete(sid); }}
                role="row"
                aria-level={n.depth + 1}
                aria-expanded={n.children.length ? !closed.has(sid) : undefined}
                aria-selected={sid === selected}
                tabIndex={sid === selected ? 0 : -1}
                className="swfall__row"
                data-crit={crit.has(sid) || undefined}
                data-error={n.error || undefined}
                style={{ "--h": services.indexOf(n.service) % SERVICE_HUES } as CSSProperties}
                onClick={() => setSelected(sid)}
                onKeyDown={(e) => onKey(e, sid)}
              >
                <span role="gridcell" className="swfall__name" style={{ paddingLeft: `${n.depth * 14 + 4}px` }}>
                  {n.children.length ? (
                    <button type="button" tabIndex={-1} className="swfall__caret" aria-label={closed.has(sid) ? "Expand" : "Collapse"} onClick={(e) => { e.stopPropagation(); toggle(sid); }}>{closed.has(sid) ? "▸" : "▾"}</button>
                  ) : <span className="swfall__caret" />}
                  <b>{n.name}</b>
                  <em>{n.service}</em>
                </span>
                <span role="gridcell" className="swfall__lane" aria-label={`starts at ${ms(n.start - t.start)}, takes ${ms(n.duration)}${crit.has(sid) ? ", on the critical path" : ""}${n.error ? ", failed" : ""}`}>
                  <i className="swfall__bar" style={{ left: `${left}%`, width: `${width}%` }} />
                  <span className="swfall__dur" style={{ left: `calc(${left + width}% + 6px)` }}>{ms(n.duration)}</span>
                </span>
              </div>
            );
          })}
        </div>

        <aside className="swfall__detail" aria-live="polite" aria-label="Selected span">
          <p className="swfall__detail-svc" style={{ "--h": services.indexOf(sel.service) % SERVICE_HUES } as CSSProperties}>{sel.service}</p>
          <h4>{sel.name}</h4>
          <dl>
            <div><dt>Duration</dt><dd>{ms(sel.duration)}</dd></div>
            <div><dt>Self time</dt><dd>{ms(sel.self)}</dd></div>
            <div><dt>Starts at</dt><dd>+{ms(sel.start - t.start)}</dd></div>
            <div><dt>Share of trace</dt><dd>{Math.round((sel.duration / total) * 100)}%</dd></div>
            {Object.entries(sel.attrs ?? {}).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}
          </dl>
          {crit.has(sel.id) && <p className="swfall__note">On the critical path: making this faster makes the whole request faster.</p>}
          {sel.error && <p className="swfall__note swfall__note--bad">This span ended in an error.</p>}
        </aside>
      </div>
    </section>
  );
}
