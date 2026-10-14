"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { MOTIFS, delay, type Motif } from "./motifs";
import "./tile-breaker.css";

export type BreakerPalette = {
  /** Section ground. */
  ground: string;
  /** Tiles, the primary button and the chip's dot. */
  tile: string;
  /** Text on the tile colour. */
  onTile: string;
  ink: string;
  muted: string;
  line: string;
};

export type BreakerLink = { label: string; href: string };

export type TileBreakerProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  primary: BreakerLink;
  secondary?: BreakerLink;
  points?: string[];
  motif?: Motif;
  palette?: BreakerPalette;
  /** End the section in a mirrored band of tiles under a progressive blur. */
  blur?: boolean;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const DEFAULT: BreakerPalette = { ground: "#efe9df", tile: "#b0441f", onTile: "#fbf7f0", ink: "#1d1712", muted: "#5e554c", line: "rgba(29, 23, 18, 0.14)" };
const COLS = 30;

function Band({ motif, flip }: { motif: Motif; flip?: boolean }) {
  const d = MOTIFS[motif];
  return (
    <div className={`tbreak__band ${flip ? "tbreak__band--flip" : ""}`} aria-hidden="true">
      {Array.from({ length: COLS * 2 }, (_, i) => {
        const c = i % COLS, r = Math.floor(i / COLS);
        return (
          <svg key={i} className="tbreak__tile" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ ["--d" as string]: `${delay(c, r)}ms` } as CSSProperties}>
            <path d={d} />
          </svg>
        );
      })}
    </div>
  );
}

/**
 * Tile Breaker
 * A section that opens under a bold band of repeating tiles, which flip into place in a diagonal
 * wave when it scrolls into view. A centred headline, two buttons and a strip of check points
 * follow, and the section can end in a mirrored band of the same tiles dissolving under a
 * progressive blur.
 */
export function TileBreaker({ eyebrow, title, lead, primary, secondary, points = [], motif = "wave", palette = DEFAULT, blur = true, onNavigate, className = "" }: TileBreakerProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (l: BreakerLink) => (e: React.MouseEvent) => onNavigate?.(l.href, e);
  return (
    <section
      ref={root}
      aria-labelledby={`${id}-title`}
      data-motif={motif}
      data-shown={shown ? "" : undefined}
      className={`tbreak ${blur ? "tbreak--blur" : ""} ${className}`}
      style={{
        ["--tb-ground" as string]: palette.ground, ["--tb-tile" as string]: palette.tile, ["--tb-on-tile" as string]: palette.onTile,
        ["--tb-ink" as string]: palette.ink, ["--tb-muted" as string]: palette.muted, ["--tb-line" as string]: palette.line,
      } as CSSProperties}
    >
      <Band motif={motif} />
      <div className="tbreak__body">
        {eyebrow && <p className="tbreak__eyebrow"><i aria-hidden="true" />{eyebrow}</p>}
        <h2 id={`${id}-title`} className="tbreak__title">{title}</h2>
        {lead && <p className="tbreak__lead">{lead}</p>}
        <div className="tbreak__actions">
          <a className="tbreak__btn tbreak__btn--primary" href={primary.href} onClick={go(primary)}>{primary.label}</a>
          {secondary && (
            <a className="tbreak__btn tbreak__btn--ghost" href={secondary.href} onClick={go(secondary)}>
              {secondary.label}
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          )}
        </div>
        {points.length > 0 && (
          <ul className="tbreak__points">
            {points.map((p) => (
              <li key={p}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="1" y="1" width="16" height="16" rx="5" fill="currentColor" opacity=".14" /><path d="m5.2 9.3 2.4 2.4 5.2-5.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>
      {blur && (
        <div className="tbreak__foot" aria-hidden="true">
          <Band motif={motif} flip />
          <div className="tbreak__glow" />
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="tbreak__blur" style={{ ["--b" as string]: i, ["--blur" as string]: `${[1.5, 3, 6, 12, 20, 32][i]}px` } as CSSProperties} />)}
        </div>
      )}
    </section>
  );
}

export default TileBreaker;
