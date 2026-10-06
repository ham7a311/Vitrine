"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { arcPath, arcs } from "../line-chart/chart";
import "./donut-chart.css";

export type Slice = { name: string; value: number };
export type DonutChartProps = {
  title: string;
  /** Up to five parts of a whole, in a fixed colour order. */
  slices: Slice[];
  /** What the total is called in the middle ("Total spend"). */
  totalLabel?: string;
  format?: (n: number) => string;
  theme?: "light" | "dark";
  className?: string;
};

const SIZE = 220, R1 = 104, R0 = 70, GAP = 0.022, PUSH = 7;

/**
 * Donut Chart
 * Parts of a whole as a ring with a hairline between parts. Point at a part,
 * or its row in the legend, and it steps out of the ring while the middle
 * shows its value and share; otherwise the middle counts up to the total.
 */
export function DonutChart({ title, slices, totalLabel = "Total", format = (n) => n.toLocaleString("en-US"), theme = "light", className = "" }: DonutChartProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);
  const [count, setCount] = useState(0);
  const total = slices.reduce((a, s) => a + Math.max(0, s.value), 0);
  const angles = arcs(slices.map((s) => s.value), GAP);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The total counts up once, as the ring draws in.
  useEffect(() => {
    if (!seen) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(total); return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 1000);
      setCount(total * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, total]);

  const share = (v: number) => (total ? `${((v / total) * 100).toFixed(1)}%` : "0%");
  const c = SIZE / 2, ring = 2 * Math.PI * ((R0 + R1) / 2);
  const a = active != null ? slices[active] : null;

  return (
    <section ref={root} className={`dnut dnut--${theme} ${className}`} data-in={seen || undefined} aria-labelledby={`${id}-t`}>
      <h3 id={`${id}-t`}>{title}</h3>
      <div className="dnut__body">
        <div className="dnut__figure">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" onPointerLeave={() => setActive(null)}>
            <defs>
              {/* The ring draws in clockwise from 12 o'clock through this mask. */}
              <mask id={`${id}-m`}>
                <circle className="dnut__reveal" cx={c} cy={c} r={(R0 + R1) / 2} transform={`rotate(-90 ${c} ${c})`}
                  style={{ strokeWidth: R1 - R0 + PUSH * 2 + 4, strokeDasharray: ring, ["--ring" as string]: ring } as CSSProperties} />
              </mask>
            </defs>
            <g mask={`url(#${id}-m)`}>
              {slices.map((s, i) => {
                const [a0, a1] = angles[i];
                if (a1 <= a0) return null;
                const mid = (a0 + a1) / 2;
                return (
                  <path key={s.name} className={`dnut__slice dnut__slice--${i + 1}`} d={arcPath(c, c, R0, R1, a0, a1)}
                    data-on={active === i || undefined} data-dim={(active != null && active !== i) || undefined}
                    style={{ ["--dx" as string]: `${Math.sin(mid) * PUSH}px`, ["--dy" as string]: `${-Math.cos(mid) * PUSH}px` } as CSSProperties}
                    onPointerEnter={() => setActive(i)} />
                );
              })}
            </g>
          </svg>
          <div className="dnut__center" aria-hidden="true">
            {a ? (
              <><span>{a.name}</span><strong>{format(a.value)}</strong><small>{share(a.value)} of {totalLabel.toLowerCase()}</small></>
            ) : (
              <><span>{totalLabel}</span><strong>{format(Math.round(count))}</strong><small>{slices.length} channels</small></>
            )}
          </div>
        </div>
        <ul className="dnut__legend">
          {slices.map((s, i) => (
            <li key={s.name}>
              <button type="button" className={`dnut__row dnut__row--${i + 1}`} data-on={active === i || undefined}
                onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}
                aria-label={`${s.name}: ${format(s.value)}, ${share(s.value)}`}>
                <i aria-hidden="true" />
                <span className="dnut__name">{s.name}</span>
                <strong>{format(s.value)}</strong>
                <span className="dnut__share">{share(s.value)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <table className="dnut__sr">
        <caption>{title}</caption>
        <thead><tr><th scope="col">Part</th><th scope="col">Value</th><th scope="col">Share</th></tr></thead>
        <tbody>
          {slices.map((s) => <tr key={s.name}><th scope="row">{s.name}</th><td>{format(s.value)}</td><td>{share(s.value)}</td></tr>)}
          <tr><th scope="row">{totalLabel}</th><td>{format(total)}</td><td>100%</td></tr>
        </tbody>
      </table>
    </section>
  );
}
