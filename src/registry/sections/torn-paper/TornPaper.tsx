"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { fibres, poly, tear } from "./tear";
import "./torn-paper.css";

export type PaperPalette = { above: string; paper: string; core: string; ink: string; muted: string; accent: string; onAccent: string; note: string; noteInk: string };
export type PaperLink = { label: string; href: string };

export type TornPaperProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** A handwritten note pinned beside the headline. */
  note?: string;
  primary: PaperLink;
  secondary?: PaperLink;
  palette?: PaperPalette;
  seed?: number;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const DEFAULT: PaperPalette = { above: "#2a221b", paper: "#c9a677", core: "#ead6b6", ink: "#2a1c0f", muted: "#5a4630", accent: "#2a1c0f", onAccent: "#f4e6cc", note: "#fff6c9", noteInk: "#3a2f12" };
const BAND = 64;

/**
 * Torn Paper
 * A section that begins where a strip of paper has been ripped away: when it scrolls into view the
 * tear runs across from left to right, the strip curling off as it goes and leaving a ragged edge
 * with its pale core and loose fibres. A centred serif headline with a handwritten note pinned
 * beside it.
 */
export function TornPaper({ eyebrow, title, lead, note, primary, secondary, palette = DEFAULT, seed = 7, onNavigate, className = "" }: TornPaperProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [w, setW] = useState(1200);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(320, Math.round(e.contentRect.width))));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const foot = useMemo(() => tear(w, BAND * 0.45, 34, seed + 5), [w, seed]);
  const { edge, core, hairs } = useMemo(() => {
    const e = tear(w, BAND * 0.55, 40, seed);
    const c = e.map((p, i) => ({ x: p.x, y: p.y - 2.2 - ((i * 7) % 5) * 0.45 }));
    return { edge: e, core: c, hairs: fibres(c, seed + 1) };
  }, [w, seed]);
  // shapes run past the band so their shadows never draw a line at the seam
  const below = (pts: { x: number; y: number }[]) => `${poly(pts)}L${w} ${BAND + 12}L0 ${BAND + 12}Z`;
  const go = (l: PaperLink) => (e: React.MouseEvent) => onNavigate?.(l.href, e);
  const vars = Object.fromEntries(Object.entries(palette).map(([k, v]) => [`--tp-${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`, v])) as CSSProperties;

  return (
    <section ref={root} aria-labelledby={`${id}-t`} className={`tpaper ${className}`} data-shown={shown ? "" : undefined} style={vars}>
      <div className="tpaper__band" aria-hidden="true">
        <svg width={w} height={BAND} viewBox={`0 0 ${w} ${BAND}`}>
          <path d={below(core)} className="tpaper__core" />
          {hairs.map((f, i) => <line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} className="tpaper__fibre" />)}
          <path d={below(edge)} className="tpaper__body" />
          {/* the strip still to be torn away: everything above the edge, cleared from the left */}
          <path d={`M0 0H${w}V${BAND}H0Z`} className="tpaper__strip" />
        </svg>
        <i className="tpaper__curl" />
      </div>
      <div className="tpaper__body-copy">
        {eyebrow && <p className="tpaper__eyebrow">{eyebrow}</p>}
        <div className="tpaper__headline">
          <h2 id={`${id}-t`} className="tpaper__title">{title}</h2>
          {note && <p className="tpaper__note"><i aria-hidden="true" />{note}</p>}
        </div>
        {lead && <p className="tpaper__lead">{lead}</p>}
        <div className="tpaper__actions">
          <a className="tpaper__btn tpaper__btn--primary" href={primary.href} onClick={go(primary)}>{primary.label}</a>
          {secondary && <a className="tpaper__btn tpaper__btn--ghost" href={secondary.href} onClick={go(secondary)}>{secondary.label}</a>}
        </div>
      </div>
      {/* the bottom is torn too, more roughly, onto the same colour as above */}
      <div className="tpaper__foot" aria-hidden="true">
        <svg width={w} height={BAND} viewBox={`0 0 ${w} ${BAND}`}>
          <path d={`${poly(foot)}L${w} -12L0 -12Z`} className="tpaper__body" />
        </svg>
      </div>
    </section>
  );
}

export default TornPaper;
