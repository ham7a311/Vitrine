"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { countAt, seam } from "./seam";
import "./pixel-seam.css";

export type SeamPalette = {
  /** The section before and after, which the seams dissolve out of and into. */
  above: string;
  below: string;
  ground: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  onAccent: string;
};
export type SeamLink = { label: string; href: string };
export type SeamStat = { value: number; label: string; prefix?: string; suffix?: string; decimals?: number };

export type PixelSeamProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  stats?: SeamStat[];
  primary: SeamLink;
  secondary?: SeamLink;
  palette?: SeamPalette;
  /** Square size and how many rows each seam is deep. */
  cell?: number;
  rows?: number;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const DEFAULT: SeamPalette = { above: "#f3f1ea", below: "#f3f1ea", ground: "#0d3b2e", ink: "#effaf4", muted: "#a9cdbd", line: "rgba(239, 250, 244, 0.16)", accent: "#8ef0c4", onAccent: "#06281d" };

function Seam({ cols, rows, cell, seed, flip }: { cols: number; rows: number; cell: number; seed: number; flip?: boolean }) {
  const cells = seam(cols, rows, seed);
  return (
    <svg className={`pseam__edge ${flip ? "pseam__edge--below" : "pseam__edge--above"}`} width={cols * cell} height={rows * cell} viewBox={`0 0 ${cols * cell} ${rows * cell}`} aria-hidden="true">
      {cells.map((q) => (
        // both seams thicken downwards: the top one into this section, the bottom one into the next
        <rect key={`${q.c}-${q.r}`} x={q.c * cell} y={q.r * cell} width={cell + 1} height={cell + 1} style={{ ["--d" as string]: `${q.delay + (flip ? 500 : 0)}ms` } as CSSProperties} />
      ))}
    </svg>
  );
}

/**
 * Pixel Seam
 * A section whose edges are made of squares: at the top it dithers in out of the section before
 * it, at the bottom it breaks back up into the one after — the squares popping in row by row when
 * it scrolls into view. Left-aligned copy, a row of figures that count up, and two actions.
 */
export function PixelSeam({ eyebrow, title, lead, stats = [], primary, secondary, palette = DEFAULT, cell = 18, rows = 7, onNavigate, className = "" }: PixelSeamProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [w, setW] = useState(1200);
  const [shown, setShown] = useState(false);
  const [k, setK] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(320, Math.round(e.contentRect.width))));
    ro.observe(el);
    if (typeof IntersectionObserver === "undefined") { setShown(true); setK(1); return () => ro.disconnect(); }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  // the figures count up once, after the seam has formed
  useEffect(() => {
    if (!shown) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setK(1); return; }
    let raf = 0;
    const t0 = performance.now() + 450;
    const step = (now: number) => { const v = Math.max(0, (now - t0) / 1400); setK(Math.min(1, v)); if (v < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shown]);

  const size = w < 640 ? Math.round(cell * 0.7) : cell;
  const cols = Math.ceil(w / size);
  const go = (l: SeamLink) => (e: React.MouseEvent) => onNavigate?.(l.href, e);
  const fmt = (s: SeamStat, v: number) => `${s.prefix ?? ""}${v.toLocaleString("en-GB", { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0 })}${s.suffix ?? ""}`;
  const vars = { ["--ps-above" as string]: palette.above, ["--ps-below" as string]: palette.below, ["--ps-ground" as string]: palette.ground, ["--ps-ink" as string]: palette.ink, ["--ps-muted" as string]: palette.muted, ["--ps-line" as string]: palette.line, ["--ps-accent" as string]: palette.accent, ["--ps-on-accent" as string]: palette.onAccent } as CSSProperties;

  return (
    <section ref={root} aria-labelledby={`${id}-t`} className={`pseam ${className}`} data-shown={shown ? "" : undefined} style={vars}>
      <Seam cols={cols} rows={rows} cell={size} seed={3} />
      <div className="pseam__body">
        <div className="pseam__copy">
          {eyebrow && <p className="pseam__eyebrow"><i aria-hidden="true" />{eyebrow}</p>}
          <h2 id={`${id}-t`} className="pseam__title">{title}</h2>
          {lead && <p className="pseam__lead">{lead}</p>}
          <div className="pseam__actions">
            <a className="pseam__btn pseam__btn--primary" href={primary.href} onClick={go(primary)}>{primary.label}</a>
            {secondary && <a className="pseam__btn pseam__btn--ghost" href={secondary.href} onClick={go(secondary)}>{secondary.label}<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" /></svg></a>}
          </div>
        </div>
        {stats.length > 0 && (
          <dl className="pseam__stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd><span aria-hidden="true">{fmt(s, countAt(s.value, k))}</span><span className="pseam__sr">{fmt(s, s.value)}</span></dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <Seam cols={cols} rows={rows} cell={size} seed={8} flip />
    </section>
  );
}

export default PixelSeam;
