"use client";
import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { monotone } from "./curve";
import { impact, lanes, next } from "./timeline";
import "./annotated-timeline.css";

export type EventKind = "deploy" | "incident" | "flag";
export type TimelineEvent = {
  id: string;
  /** Index into the series where it happened. */
  at: number;
  kind: EventKind;
  title: string;
  body: string;
  by: string;
  /** How many points after it to measure and shade (default 5). */
  window?: number;
};

export type AnnotatedTimelineProps = {
  title: string;
  /** One value per point, with a label per point (e.g. "12 Aug"). */
  values: number[];
  labels: string[];
  events: TimelineEvent[];
  format?: (n: number) => string;
  /** How a change reads: "pts" for percentage points, "%" for relative. */
  change?: "pts" | "%";
  theme?: "night" | "paper";
  className?: string;
};

const H = 230, LANE = 30, PAD = { l: 46, r: 14, t: 16, b: 22 };
const KINDS: { id: EventKind; label: string }[] = [{ id: "deploy", label: "Deploys" }, { id: "incident", label: "Incidents" }, { id: "flag", label: "Flags" }];
const ICON: Record<EventKind, string> = {
  deploy: "M8 2.5v8M4.8 7.3 8 10.5l3.2-3.2M3.5 13h9",
  incident: "M8 2.6 14 13H2zM8 6.6v3M8 11.3v.2",
  flag: "M4 13.5V2.8M4 3h7.6l-1.6 2.6 1.6 2.6H4",
};

/**
 * Annotated Timeline
 * A metric over time with the things that happened to it pinned underneath — deploys, incidents
 * and feature flags. Point at or step to a pin and its note opens above the chart, the days after
 * it are shaded and the change against the days before is measured for you.
 */
export function AnnotatedTimeline({ title, values, labels, events, format = (n) => n.toFixed(2), change = "pts", theme = "night", className = "" }: AnnotatedTimelineProps) {
  const uid = useId();
  const box = useRef<HTMLDivElement>(null);
  const pins = useRef<Record<string, HTMLButtonElement | null>>({});
  const [w, setW] = useState(720);
  const [show, setShow] = useState<Record<EventKind, boolean>>({ deploy: true, incident: true, flag: true });
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sorted = useMemo(() => [...events].sort((a, b) => a.at - b.at), [events]);
  const visible = sorted.filter((e) => show[e.kind]);
  const n = values.length, iw = w - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const min = Math.min(...values), max = Math.max(...values), pad = (max - min) * 0.18 || 1;
  const lo = min - pad, hi = max + pad;
  const X = (i: number) => PAD.l + (i / Math.max(1, n - 1)) * iw;
  const Y = (v: number) => PAD.t + ih - ((v - lo) / (hi - lo)) * ih;
  const pts = values.map((v, i) => ({ x: X(i), y: Y(v) }));
  const line = monotone(pts);
  const lane = lanes(visible.map((e) => X(e.at)), 26);
  const deep = Math.max(0, ...lane) + 1;
  const activeId = hover ?? pinned;
  const active = visible.find((e) => e.id === activeId) ?? null;
  const win = active?.window ?? 5;
  const m = active ? impact(values, active.at, win) : null;
  const ticks = [0, 1, 2, 3].map((k) => lo + ((hi - lo) * (k + 0.5)) / 4);
  const every = Math.max(1, Math.round(n / (w < 520 ? 3 : 6)));
  const rove = focusId && visible.some((e) => e.id === focusId) ? focusId : visible[0]?.id;

  const key = (e: KeyboardEvent, id: string) => {
    const ids = visible.map((v) => v.id);
    let to: string | undefined;
    if (e.key === "ArrowRight") to = next(ids, id, 1);
    else if (e.key === "ArrowLeft") to = next(ids, id, -1);
    else if (e.key === "Home") to = ids[0];
    else if (e.key === "End") to = ids[ids.length - 1];
    else if (e.key === "Escape") { setPinned(null); setHover(null); return; }
    if (to) { e.preventDefault(); setFocusId(to); setHover(to); pins.current[to]?.focus(); }
  };
  const fmtChange = (c: number, rel: number) => change === "pts" ? `${c >= 0 ? "+" : "−"}${Math.abs(c).toFixed(2)} pts` : `${rel >= 0 ? "+" : "−"}${Math.abs(rel * 100).toFixed(1)}%`;

  return (
    <section className={`atl atl--${theme} ${className}`} aria-labelledby={`${uid}-t`}>
      <header className="atl__head">
        <div>
          <h3 id={`${uid}-t`} className="atl__title">{title}</h3>
          <p className="atl__now"><span className="atl__num">{format(values[n - 1])}</span><span className="atl__when">{labels[n - 1]}</span></p>
        </div>
        <div className="atl__filters" aria-label="Show events">
          {KINDS.map((k) => (
            <button key={k.id} type="button" className={`atl__filter atl__filter--${k.id}`} aria-pressed={show[k.id]} onClick={() => setShow((s) => ({ ...s, [k.id]: !s[k.id] }))}>
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d={ICON[k.id]} /></svg>
              {k.label}<span>{events.filter((e) => e.kind === k.id).length}</span>
            </button>
          ))}
        </div>
      </header>

      <div ref={box} className="atl__plot">
        <svg width={w} height={H + LANE * deep} viewBox={`0 0 ${w} ${H + LANE * deep}`} role="img" aria-label={`${title}, from ${format(values[0])} on ${labels[0]} to ${format(values[n - 1])} on ${labels[n - 1]}, with ${visible.length} events marked.`}>
          <defs><linearGradient id={`${uid}-a`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" className="atl__fade0" /><stop offset="1" className="atl__fade1" /></linearGradient></defs>
          {ticks.map((t, i) => (
            <g key={i}><line className="atl__grid" x1={PAD.l} x2={w - PAD.r} y1={Y(t)} y2={Y(t)} /><text className="atl__axis" x={PAD.l - 8} y={Y(t) + 3.5} textAnchor="end">{format(t)}</text></g>
          ))}
          {labels.map((l, i) => (i % every === 0 ? <text key={i} className="atl__axis" x={X(i)} y={H - 4} textAnchor={i === 0 ? "start" : "middle"}>{l}</text> : null))}
          {active && <rect className={`atl__window atl__window--${active.kind}`} x={X(active.at)} y={PAD.t} width={Math.max(2, X(Math.min(n - 1, active.at + win - 1)) - X(active.at))} height={ih} rx={4} />}
          <path d={`${line}L${X(n - 1)},${PAD.t + ih}L${X(0)},${PAD.t + ih}Z`} fill={`url(#${uid}-a)`} />
          <path className="atl__line" d={line} />
          {visible.map((e, i) => {
            const y = H + 6 + lane[i] * LANE;
            return <line key={e.id} className={`atl__stem atl__stem--${e.kind} ${e.id === activeId ? "is-on" : ""}`} x1={X(e.at)} x2={X(e.at)} y1={Y(values[e.at])} y2={y} />;
          })}
          {visible.map((e) => <circle key={e.id} className={`atl__mark atl__mark--${e.kind} ${e.id === activeId ? "is-on" : ""}`} cx={X(e.at)} cy={Y(values[e.at])} r={e.id === activeId ? 4.5 : 3} />)}
        </svg>

        <div className="atl__pins" role="toolbar" aria-label="Events" aria-orientation="horizontal">
          {visible.map((e, i) => (
            <button
              key={e.id} ref={(el) => { pins.current[e.id] = el; }} type="button"
              className={`atl__pin atl__pin--${e.kind} ${e.id === activeId ? "is-on" : ""}`}
              style={{ left: X(e.at), top: H + 6 + lane[i] * LANE }}
              tabIndex={e.id === rove ? 0 : -1} aria-pressed={pinned === e.id}
              aria-label={`${KINDS.find((k) => k.id === e.kind)!.label.slice(0, -1)}: ${e.title}, ${labels[e.at]}`}
              onPointerEnter={() => setHover(e.id)} onPointerLeave={() => setHover(null)}
              onFocus={() => { setFocusId(e.id); setHover(e.id); }} onBlur={() => setHover(null)}
              onClick={() => setPinned((p) => (p === e.id ? null : e.id))} onKeyDown={(ev) => key(ev, e.id)}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d={ICON[e.kind]} /></svg>
            </button>
          ))}
        </div>

        {active && m && (
          <div className={`atl__note atl__note--${active.kind}`} style={X(active.at) < w / 2 ? { left: Math.min(X(Math.min(n - 1, active.at + win - 1)) + 14, Math.max(4, w - 284)) } : { right: Math.min(w - X(active.at) + 14, Math.max(4, w - 284)) }} role="status">
            <p className="atl__note-kind">{KINDS.find((k) => k.id === active.kind)!.label.slice(0, -1)} · {labels[active.at]} · {active.by}</p>
            <p className="atl__note-title">{active.title}</p>
            <p className="atl__note-body">{active.body}</p>
            <p className={`atl__note-impact ${m.change < 0 ? "is-down" : "is-up"}`}>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d={m.change < 0 ? "M5 8.5 1.5 4h7z" : "M5 1.5 8.5 6h-7z"} fill="currentColor" /></svg>
              {fmtChange(m.change, m.rel)} <span>over the next {win} days vs the {win} before</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default AnnotatedTimeline;
