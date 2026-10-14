"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { radii, relax, seed, type Node } from "./pack";
import "./bubble-pack.css";

export type Share = { label: string; value: number };

export type BubblePackProps = {
  title: string;
  items: Share[];
  /** What the values add up to, e.g. "visits this month". */
  unit?: string;
  format?: (n: number) => string;
  theme?: "paper" | "night";
  className?: string;
};

const H = 340;

/**
 * Bubble Pack
 * Shares of a whole as circles that pack themselves together: they drift in and settle when it
 * first appears, each sized by its value. Point at a bubble — or its row in the list —
 * and it swells while the others make room; the list beside it holds the same numbers for reading
 * and for the keyboard.
 */
export function BubblePack({ title, items, unit = "", format = (n) => n.toLocaleString("en-GB"), theme = "paper", className = "" }: BubblePackProps) {
  const uid = useId();
  const box = useRef<HTMLDivElement>(null);
  const circles = useRef<(SVGGElement | null)[]>([]);
  const [w, setW] = useState(460);
  const [hot, setHot] = useState<number | null>(null);
  const nodes = useRef<Node[]>([]);
  const sim = useRef({ raf: 0, steps: 0 });
  const total = items.reduce((s, i) => s + i.value, 0);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    setW(Math.max(260, el.clientWidth));
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paint = () => nodes.current.forEach((n, i) => {
    const g = circles.current[i];
    if (!g) return;
    g.setAttribute("transform", `translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`);
    (g.firstElementChild as SVGCircleElement | null)?.setAttribute("r", n.r.toFixed(1));
  });

  const run = (steps = 160) => {
    const s = sim.current;
    s.steps = Math.max(s.steps, steps);
    if (s.raf) return;
    const tick = () => {
      relax(nodes.current, w / 2, H / 2, w, H);
      paint();
      s.steps -= 1;
      s.raf = s.steps > 0 ? requestAnimationFrame(tick) : 0;
    };
    s.raf = requestAnimationFrame(tick);
  };

  // (re)build the pack whenever the size or data change
  useEffect(() => {
    const rs = radii(items.map((i) => i.value), w, H);
    const start = seed(rs, w / 2, H / 2);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let k = 0; k < 300; k++) relax(start, w / 2, H / 2, w, H);
      nodes.current = start; paint(); return;
    }
    // scattered a little wider first, so they drift together
    nodes.current = start.map((n) => ({ ...n, x: w / 2 + (n.x - w / 2) * 2.2, y: H / 2 + (n.y - H / 2) * 2.2, r: n.r * 0.4 }));
    paint(); run(200);
    return () => { cancelAnimationFrame(sim.current.raf); sim.current.raf = 0; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, items]);

  useEffect(() => {
    const rs = radii(items.map((i) => i.value), w, H);
    nodes.current.forEach((n, i) => { n.target = rs[i] * (hot === i ? 1.14 : hot !== null ? 0.97 : 1); });
    if (nodes.current.length) run(90);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hot]);

  const pct = (v: number) => `${((v / total) * 100).toFixed(v / total < 0.1 ? 1 : 0)}%`;
  const rs = radii(items.map((i) => i.value), w, H);
  return (
    <section className={`bpack bpack--${theme} ${className}`} aria-labelledby={`${uid}-t`}>
      <header className="bpack__head">
        <h3 id={`${uid}-t`} className="bpack__title">{title}</h3>
        <p className="bpack__total">{format(total)} {unit}</p>
      </header>
      <div className="bpack__body">
        <div ref={box} className="bpack__field">
          <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} aria-hidden="true">
            {items.map((it, i) => (
              <g key={it.label} ref={(el) => { circles.current[i] = el; }} className={`bpack__bubble bpack__c${i % 8}`} data-hot={hot === i ? "" : undefined} data-dim={hot !== null && hot !== i ? "" : undefined}
                onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(null)}>
                <circle r={0} />
                {rs[i] > 30 && <text className="bpack__label" y={-2}>{it.label}</text>}
                {rs[i] > 30 && <text className="bpack__pct" y={15}>{pct(it.value)}</text>}
                {rs[i] <= 30 && rs[i] > 16 && <text className="bpack__pct bpack__pct--small" y={4}>{pct(it.value)}</text>}
              </g>
            ))}
          </svg>
        </div>
        <ul className="bpack__list">
          {items.map((it, i) => (
            <li key={it.label}>
              <button type="button" className={`bpack__row bpack__c${i % 8}`} data-hot={hot === i ? "" : undefined}
                onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(i)} onBlur={() => setHot(null)}
                aria-label={`${it.label}: ${format(it.value)}, ${pct(it.value)}`}>
                <i aria-hidden="true" /><span className="bpack__row-label">{it.label}</span>
                <span className="bpack__row-value">{format(it.value)}</span><span className="bpack__row-pct">{pct(it.value)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BubblePack;
