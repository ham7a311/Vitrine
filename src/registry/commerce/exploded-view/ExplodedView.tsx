"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { leader, move, spread, travel, type Vec } from "./explode";
import "./exploded-view.css";

export type { Vec } from "./explode";
export type ExplodedPart = {
  id: string;
  name: string;
  detail?: string;
  /** Drawing for this part, in the shared viewBox. Use the classes xview__s (solid), xview__d (detail line), xview__rod and xview__rod-in. */
  shape: ReactNode;
  /** Where the part travels at full explosion, in viewBox units. */
  dir: Vec;
  /** The point a callout leader attaches to, at rest. */
  anchor: Vec;
  side?: "left" | "right";
};
export type ExplodedViewProps = {
  title: string;
  parts: ExplodedPart[];
  viewBox: [number, number];
  defaultAmount?: number;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const R = 11;

/**
 * Exploded View
 * A product drawing whose parts separate along their own axes, with numbered
 * balloons and a parts list linked to the drawing both ways: point at a part
 * in either place and it comes out on its own.
 */
export function ExplodedView({ title, parts, viewBox: [W, H], defaultAmount = 0.35, theme = "light", motion = true, className = "" }: ExplodedViewProps) {
  const id = useId();
  const [t, setT] = useState(defaultAmount);
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const focus = pinned ?? hover;

  // Each part eases toward its target travel; leaders and axes read the same value, so they move together.
  const target = Object.fromEntries(parts.map((p) => [p.id, travel(t, p.id === focus)]));
  const key = parts.map((p) => target[p.id]).join();
  const [shown, setShown] = useState(target);
  const live = useRef(shown);
  useEffect(() => {
    const still = !motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) { live.current = target; setShown(target); return; }
    let raf = 0;
    const step = () => {
      let done = true;
      const next: Record<string, number> = {};
      for (const p of parts) {
        const a = live.current[p.id] ?? 0, b = target[p.id];
        const v = Math.abs(b - a) < 0.002 ? b : a + (b - a) * 0.2;
        if (v !== b) done = false;
        next[p.id] = v;
      }
      live.current = next;
      setShown(next);
      if (!done) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, motion]);

  const placed = parts.map((p, i) => {
    const k = shown[p.id] ?? 0;
    const at = move(p.anchor, p.dir, k);
    return { p, n: i + 1, k, at, side: p.side ?? (p.anchor[0] < W / 2 ? "left" : "right") as "left" | "right" };
  });
  const ys = {
    ...spread(placed.filter((x) => x.side === "left").map((x) => ({ id: x.p.id, y: x.at[1] })), R * 2 + 8, R + 8, H - R - 8),
    ...spread(placed.filter((x) => x.side === "right").map((x) => ({ id: x.p.id, y: x.at[1] })), R * 2 + 8, R + 8, H - R - 8),
  };
  const focused = placed.find((x) => x.p.id === focus);

  return (
    <section className={`xview xview--${theme} ${className}`} data-motion={motion ? undefined : "off"} data-focus={focus ? true : undefined} aria-labelledby={`${id}-t`}>
      <div className="xview__wrap">
      <div className="xview__sheet">
        <header className="xview__head">
          <h3 id={`${id}-t`} className="xview__title">{title}</h3>
          <span className="xview__stamp" aria-hidden="true">Exploded view · {parts.length} parts</span>
        </header>
        <svg className="xview__svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}, exploded ${Math.round(t * 100)}%${focused ? `, ${focused.p.name} drawn out` : ""}`}>
          <defs>
            <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" className="xview__grid" /></pattern>
          </defs>
          <rect width={W} height={H} fill={`url(#${id}-grid)`} />
          {/* Assembly axes: where each part came from. */}
          {placed.map(({ p, k, at }) => k > 0.02 && <line key={`a${p.id}`} className="xview__axis" x1={p.anchor[0]} y1={p.anchor[1]} x2={at[0]} y2={at[1]} />)}
          {placed.map(({ p, k }) => (
            <g
              key={p.id}
              className="xview__part"
              data-on={p.id === focus || undefined}
              style={{ transform: `translate(${p.dir[0] * k}px, ${p.dir[1] * k}px)` } as CSSProperties}
              onPointerEnter={() => setHover(p.id)}
              onPointerLeave={() => setHover((h) => (h === p.id ? null : h))}
              onClick={() => setPinned((x) => (x === p.id ? null : p.id))}
            >
              {p.shape}
            </g>
          ))}
          {placed.map(({ p, n, at, side }) => {
            const bx = side === "left" ? R + 10 : W - R - 10, by = ys[p.id];
            return (
              <g key={`b${p.id}`} className="xview__balloon" data-on={p.id === focus || undefined}>
                <path d={leader([bx, by], at, side, R)} className="xview__leader" />
                <circle cx={at[0]} cy={at[1]} r={2.2} className="xview__dot" />
                <circle cx={bx} cy={by} r={R} className="xview__ring" />
                <text x={bx} y={by} textAnchor="middle" dominantBaseline="central">{n}</text>
              </g>
            );
          })}
        </svg>
        <div className="xview__scrub">
          <label htmlFor={`${id}-r`}>Explode <output>{Math.round(t * 100)}%</output></label>
          <input id={`${id}-r`} type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => setT(+e.target.value)} />
          <button type="button" onClick={() => setT(t > 0.5 ? 0 : 1)}>{t > 0.5 ? "Assemble" : "Explode"}</button>
        </div>
      </div>

      <div className="xview__list">
        <h4 id={`${id}-l`}>Parts</h4>
        <ol aria-labelledby={`${id}-l`}>
          {placed.map(({ p, n }) => (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={pinned === p.id}
                data-on={p.id === focus || undefined}
                onPointerEnter={() => setHover(p.id)}
                onPointerLeave={() => setHover((h) => (h === p.id ? null : h))}
                onFocus={() => setHover(p.id)}
                onBlur={() => setHover((h) => (h === p.id ? null : h))}
                onClick={() => setPinned((x) => (x === p.id ? null : p.id))}
              >
                <span className="xview__n" aria-hidden="true">{n}</span>
                <span className="xview__name">{p.name}</span>
                {p.detail && <span className="xview__detail">{p.detail}</span>}
              </button>
            </li>
          ))}
        </ol>
        <p className="xview__hint">Point at a part to draw it out; click to keep it out.</p>
      </div>
      </div>
    </section>
  );
}
