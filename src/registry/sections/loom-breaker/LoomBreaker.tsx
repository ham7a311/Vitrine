"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { loom, type Weave } from "./weave";
import "./loom-breaker.css";

export type LoomPalette = {
  ground: string;
  /** Two warp (vertical) colours and two weft (horizontal) colours, alternating. */
  warp: [string, string];
  weft: [string, string];
  ink: string;
  muted: string;
  line: string;
  /** The primary button and the point ticks. */
  accent: string;
  onAccent: string;
};
export type LoomLink = { label: string; href: string };

export type LoomBreakerProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  primary: LoomLink;
  secondary?: LoomLink;
  points?: string[];
  weave?: Weave;
  palette?: LoomPalette;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const DEFAULT: LoomPalette = { ground: "#eef0f4", warp: ["#1f3a6b", "#2c4f8c"], weft: ["#e9e2d3", "#c7d4ea"], ink: "#111a2c", muted: "#4b5568", line: "rgba(17, 26, 44, 0.14)", accent: "#1f3a6b", onAccent: "#f4f6fb" };
const BAND = 132;

/**
 * Loom Breaker
 * A section that opens under a band of cloth weaving itself: warp threads drop into place, then
 * each weft row is shuttled across and the crossings lock over and under as it passes, leaving a
 * short fringe. Copy sits on the left, the actions and a checklist on the right, and a thin
 * selvedge stripe closes the section.
 */
export function LoomBreaker({ eyebrow, title, lead, primary, secondary, points = [], weave = "plain", palette = DEFAULT, onNavigate, className = "" }: LoomBreakerProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [w, setW] = useState(1200);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(320, Math.round(e.contentRect.width))));
    ro.observe(el);
    if (typeof IntersectionObserver === "undefined") { setShown(true); return () => ro.disconnect(); }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const pitch = w < 640 ? 24 : 30;
  const { warps, wefts, overs } = loom(w, BAND, weave, pitch);
  const go = (l: LoomLink) => (e: React.MouseEvent) => onNavigate?.(l.href, e);
  const pass = (j: number) => 380 + j * 150; // when row j starts across
  const vars = {
    ["--lb-ground" as string]: palette.ground, ["--lb-warp0" as string]: palette.warp[0], ["--lb-warp1" as string]: palette.warp[1],
    ["--lb-weft0" as string]: palette.weft[0], ["--lb-weft1" as string]: palette.weft[1], ["--lb-ink" as string]: palette.ink,
    ["--lb-muted" as string]: palette.muted, ["--lb-line" as string]: palette.line, ["--lb-accent" as string]: palette.accent, ["--lb-on-accent" as string]: palette.onAccent,
  } as CSSProperties;

  return (
    <section ref={root} aria-labelledby={`${id}-t`} className={`loomb ${className}`} data-shown={shown ? "" : undefined} style={vars}>
      <svg className="loomb__band" width={w} height={BAND + 18} viewBox={`0 0 ${w} ${BAND + 18}`} aria-hidden="true">
        {warps.map((s) => (
          <g key={`w${s.i}`} className="loomb__warp" style={{ ["--d" as string]: `${(s.i % 40) * 9}ms` } as CSSProperties}>
            <rect x={s.x} y={0} width={s.w} height={s.h} className={`loomb__thread loomb__warp-${s.tone}`} />
            {/* the fringe below the cloth */}
            <path d={`M${s.x + s.w * 0.3} ${BAND} l-1 14 M${s.x + s.w * 0.7} ${BAND} l1 15`} className={`loomb__fringe loomb__stroke-${s.tone}`} pathLength={1} />
          </g>
        ))}
        {wefts.map((s) => (
          <rect key={`f${s.i}`} x={s.x} y={s.y} width={s.w} height={s.h} className={`loomb__thread loomb__weft loomb__weft-${s.tone}`} style={{ ["--d" as string]: `${pass(s.i)}ms` } as CSSProperties} />
        ))}
        {overs.map((s) => (
          <rect key={`o${s.i}-${s.j}`} x={s.x} y={s.y - 1} width={s.w} height={s.h + 2} className={`loomb__thread loomb__over loomb__warp-${s.tone}`}
            style={{ ["--d" as string]: `${pass(s.j) + Math.round((Math.max(0, s.x) / w) * 760)}ms` } as CSSProperties} />
        ))}
      </svg>

      <div className="loomb__body">
        <div className="loomb__copy">
          {eyebrow && <p className="loomb__eyebrow">{eyebrow}</p>}
          <h2 id={`${id}-t`} className="loomb__title">{title}</h2>
          {lead && <p className="loomb__lead">{lead}</p>}
        </div>
        <div className="loomb__side">
          {points.length > 0 && (
            <ul className="loomb__points">
              {points.map((p) => (
                <li key={p}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M8 2v12" /></svg>{p}</li>
              ))}
            </ul>
          )}
          <div className="loomb__actions">
            <a className="loomb__btn loomb__btn--primary" href={primary.href} onClick={go(primary)}>{primary.label}</a>
            {secondary && <a className="loomb__btn loomb__btn--ghost" href={secondary.href} onClick={go(secondary)}>{secondary.label}</a>}
          </div>
        </div>
      </div>
      <div className="loomb__selvedge" aria-hidden="true" />
    </section>
  );
}

export default LoomBreaker;
