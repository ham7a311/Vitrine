"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./sunburst-drill.css";

/**
 * Sunburst Drill
 * Where the money went, from the big categories down to the shop. Each
 * ring is a level; each arc's angle is its share of the ring inside it.
 * Click an arc and the chart zooms into it — arcs tween to their new
 * angles and rings shift inward — so you never lose your place; click the
 * centre (or the breadcrumb) to go back up. Children take lighter steps of
 * their parent's colour, so a category's family is easy to follow.
 */

export type Node = { name: string; value?: number; children?: Node[] };
type Props = { data: Node; currency?: string; title?: string; theme?: "light" | "dark"; motion?: "full" | "reduced"; className?: string };
type P = { id: string; name: string; value: number; depth: number; x0: number; x1: number; parent: P | null; children: P[]; top: number; sib: number };

const SIZE = 420, R = SIZE / 2, RING = 58, HOLE = 66;
const fmt = (v: number) => Math.round(v).toLocaleString("en-GB");

/** Lay the tree out as fractions of a circle. */
function partition(root: Node): P[] {
  const out: P[] = [];
  const total = (n: Node): number => n.children ? n.children.reduce((s, c) => s + total(c), 0) : n.value ?? 0;
  // Top-down: each child takes its share of its parent's span.
  const place = (n: Node, depth: number, x0: number, x1: number, parent: P | null, top: number, sib: number, path: string) => {
    const p: P = { id: path, name: n.name, value: total(n), depth, x0, x1, parent, children: [], top, sib };
    out.push(p);
    let x = x0;
    (n.children ?? []).forEach((c, i) => {
      const span = (total(c) / p.value) * (x1 - x0);
      const child = place(c, depth + 1, x, x + span, p, depth === 0 ? i : top, i, `${path}/${c.name}`);
      p.children.push(child);
      x += span;
    });
    return p;
  };
  place(root, 0, 0, 1, null, 0, 0, root.name);
  return out;
}

function arc(a0: number, a1: number, r0: number, r1: number) {
  const pad = Math.min(0.006, (a1 - a0) / 4);
  a0 += pad; a1 -= pad;
  if (a1 <= a0) return "";
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p = (a: number, r: number) => `${(R + r * Math.sin(a)).toFixed(2)} ${(R - r * Math.cos(a)).toFixed(2)}`;
  return `M${p(a0, r1)} A${r1} ${r1} 0 ${large} 1 ${p(a1, r1)} L${p(a1, r0)} A${r0} ${r0} 0 ${large} 0 ${p(a0, r0)} Z`;
}

export function SunburstDrill({ data, currency = "OMR", title = "Trip spending", theme = "light", motion = "full", className = "" }: Props) {
  const uid = useId();
  const nodes = useMemo(() => partition(data), [data]);
  const root = nodes[0];
  const [focus, setFocus] = useState<P>(root);
  const [hover, setHover] = useState<P | null>(null);
  // The current view (which slice of the circle and which depth fill the chart), tweened on zoom.
  const [view, setView] = useState({ x0: 0, x1: 1, d: 0 });
  const viewRef = useRef(view);
  const reduced = () => motion === "reduced" || (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const to = { x0: focus.x0, x1: focus.x1, d: focus.depth };
    if (reduced()) { setView(to); viewRef.current = to; return; }
    const from = viewRef.current, t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 720), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const v = { x0: from.x0 + (to.x0 - from.x0) * e, x1: from.x1 + (to.x1 - from.x1) * e, d: from.d + (to.d - from.d) * e };
      setView(v); viewRef.current = v;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [focus]); // eslint-disable-line react-hooks/exhaustive-deps

  const ang = (x: number) => Math.max(0, Math.min(1, (x - view.x0) / (view.x1 - view.x0))) * Math.PI * 2;
  const rad = (depth: number) => HOLE + (depth - view.d - 1) * RING;
  // Colour follows the family (the top-level category's slot) and depth relative to the current level:
  // the innermost ring is full strength, each ring outward a lighter step; zoomed in, siblings step apart.
  const color = (n: P) => {
    if (n.depth === 0) return "var(--surface)";
    const base = `var(--s${n.top + 1})`;
    const rel = n.depth - focus.depth;
    if (rel <= 1 && n.depth === 1) return base;
    const k = rel <= 1 ? 100 - (n.sib % 3) * 16 : rel === 2 ? 62 + (n.sib % 3) * 8 : 40 + (n.sib % 3) * 7;
    return `color-mix(in oklab, ${base} ${k}%, var(--surface))`;
  };
  const visible = nodes.filter((n) => n.depth > view.d - 0.001 && n.depth <= view.d + 3.001 && n.depth > 0 && ang(n.x1) - ang(n.x0) > 0.0005);
  const crumbs: P[] = [];
  for (let n: P | null = focus; n; n = n.parent) crumbs.unshift(n);
  const shown = hover ?? focus;
  const share = shown === root ? 1 : shown.value / root.value;
  const zoomable = (n: P) => n.children.length > 0;
  const summary = `${title}: ${currency} ${fmt(root.value)} in total. ${root.children.map((c) => `${c.name} ${Math.round((c.value / root.value) * 100)}%`).join(", ")}.`;

  return (
    <section className={`sb sb--${theme} ${className}`} data-motion={motion} aria-labelledby={`${uid}-t`}>
      <header className="sb__head">
        <h3 id={`${uid}-t`} className="sb__title">{title}</h3>
        <nav aria-label="Level" className="sb__crumbs">
          {crumbs.map((c, i) => (
            <span key={c.id}>
              {i > 0 && <span className="sb__sep" aria-hidden="true">/</span>}
              {c === focus ? <span aria-current="page">{c.name}</span> : <button type="button" onClick={() => setFocus(c)}>{c.name}</button>}
            </span>
          ))}
        </nav>
      </header>
      <div className="sb__body">
        <div className="sb__wheel">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={summary}>
            {visible.map((n) => {
              const r0 = rad(n.depth), r1 = r0 + RING;
              if (r1 <= HOLE - 0.5 || r0 > R) return null;
              const d = arc(ang(n.x0), ang(n.x1), Math.max(HOLE, r0), Math.min(R, r1));
              const onPath = hover && (hover === n || hover.id.startsWith(n.id + "/"));
              const mid = (ang(n.x0) + ang(n.x1)) / 2, rm = (Math.max(HOLE, r0) + Math.min(R, r1)) / 2;
              const roomy = (ang(n.x1) - ang(n.x0)) * rm > n.name.length * 6.6 + 8 && r0 >= HOLE - 1 && r1 <= R + 1 && n.depth - view.d <= 2.01;
              const rot = (mid * 180) / Math.PI;
              const flip = rot > 180;
              return (
                <g key={n.id}>
                  <path
                    d={d}
                    style={{ fill: color(n) }}
                    className="sb__arc"
                    data-dim={(hover && !onPath) || undefined}
                    data-click={zoomable(n) || undefined}
                    onPointerEnter={() => setHover(n)}
                    onPointerLeave={() => setHover(null)}
                    onClick={() => zoomable(n) && setFocus(n)}
                  />
                  {roomy && (
                    <text
                      className="sb__label"
                      transform={`translate(${R + rm * Math.sin(mid)} ${R - rm * Math.cos(mid)}) rotate(${flip ? rot + 90 : rot - 90})`}
                      dy="0.34em"
                      textAnchor="middle"
                    >{n.name}</text>
                  )}
                </g>
              );
            })}
            <circle cx={R} cy={R} r={HOLE - 4} className="sb__hole" data-up={focus !== root || undefined} onClick={() => focus.parent && setFocus(focus.parent)} />
          </svg>
          {/* The centre reads out whatever is under the pointer, or the current level. */}
          <div className="sb__centre" aria-hidden="true">
            <span className="sb__c-name">{shown.name}</span>
            <span className="sb__c-val">{currency} {fmt(shown.value)}</span>
            <span className="sb__c-share">{Math.round(share * 100)}% of all</span>
            {focus !== root && !hover && <span className="sb__c-up">↑ back</span>}
          </div>
        </div>
        {/* The same breakdown as a list: keyboard and screen-reader friendly, and the table view. */}
        <div className="sb__list">
          <p className="sb__list-h">{focus.name} · {currency} {fmt(focus.value)}</p>
          <ul>
            {focus.children.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="sb__row"
                  disabled={!zoomable(c)}
                  onClick={() => setFocus(c)}
                  onPointerEnter={() => setHover(c)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(c)}
                  onBlur={() => setHover(null)}
                  aria-label={`${c.name}: ${currency} ${fmt(c.value)}, ${Math.round((c.value / focus.value) * 100)}% of ${focus.name}${zoomable(c) ? ". Open." : ""}`}
                >
                  <i style={{ background: color(c) }} />
                  <span className="sb__row-n">{c.name}</span>
                  <span className="sb__row-v">{fmt(c.value)}</span>
                  <span className="sb__row-p">{Math.round((c.value / focus.value) * 100)}%</span>
                  <span className="sb__row-bar"><b style={{ width: `${(c.value / focus.children[0].value) * 100}%`, background: color(c) }} /></span>
                </button>
              </li>
            ))}
          </ul>
          {focus.parent && <button type="button" className="sb__up" onClick={() => setFocus(focus.parent!)}>← Back to {focus.parent.name}</button>}
        </div>
      </div>
    </section>
  );
}
