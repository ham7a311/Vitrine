"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { archPath, arches, skyAt, sunAt, travel } from "./sky";
import "./arcade-breaker.css";

export type ArcadePalette = { wall: string; shade: string; ink: string; muted: string; line: string; accent: string; onAccent: string };
export type ArcadeLink = { label: string; href: string };

export type ArcadeBreakerProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  primary: ArcadeLink;
  secondary?: ArcadeLink;
  palette?: ArcadePalette;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const DEFAULT: ArcadePalette = { wall: "#9c4528", shade: "#7d341c", ink: "#fff4ea", muted: "#f1d3c2", line: "rgba(255, 244, 234, 0.22)", accent: "#fff4ea", onAccent: "#5a2210" };

/**
 * Arcade Breaker
 * A section that opens under a colonnade: a row of arches, the middle one taller, each a window
 * onto the same sky. As the section scrolls through the viewport the day passes behind them —
 * dawn, a blue noon, a warm dusk — with the sun crossing from arch to arch and clouds drifting by.
 * The copy sits centred under the great arch.
 */
export function ArcadeBreaker({ eyebrow, title, lead, primary, secondary, palette = DEFAULT, onNavigate, className = "" }: ArcadeBreakerProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [w, setW] = useState(1200);
  const H = Math.round(Math.min(300, Math.max(180, w * 0.21)));

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const a = el.firstElementChild as HTMLElement, r = a.getBoundingClientRect(), t = travel(r.top, r.height / 2, window.innerHeight);
      const sky = skyAt(t), sun = sunAt(t);
      el.style.setProperty("--ab-top", sky.top); el.style.setProperty("--ab-bottom", sky.bottom); el.style.setProperty("--ab-sun", sky.sun);
      el.style.setProperty("--ab-sun-x", `${(sun.x * 100).toFixed(2)}%`); el.style.setProperty("--ab-sun-y", sun.y.toFixed(3));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const ro = new ResizeObserver(([e]) => { setW(Math.max(320, Math.round(e.contentRect.width))); queue(); });
    ro.observe(el);
    // listen only while the section is on screen, to scrolling anywhere (the window or a scrolling ancestor)
    let on = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; document.addEventListener("scroll", queue, { passive: true, capture: true }); queue(); }
      else if (!e.isIntersecting && on) { on = false; document.removeEventListener("scroll", queue, { capture: true }); }
    });
    io.observe(el);
    paint();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("scroll", queue, { capture: true }); };
  }, []);

  const list = arches(w, H), base = H - 12;
  const wall = `M0 0H${w}V${H}H0Z ${list.map((a) => archPath(a, base)).join(" ")}`;
  const go = (l: ArcadeLink) => (e: React.MouseEvent) => onNavigate?.(l.href, e);
  const vars = { ["--ab-wall" as string]: palette.wall, ["--ab-shade" as string]: palette.shade, ["--ab-ink" as string]: palette.ink, ["--ab-muted" as string]: palette.muted, ["--ab-line" as string]: palette.line, ["--ab-accent" as string]: palette.accent, ["--ab-on-accent" as string]: palette.onAccent, ["--ab-h" as string]: `${H}px` } as CSSProperties;

  return (
    <section ref={root} aria-labelledby={`${id}-t`} className={`arcb ${className}`} style={vars}>
      <div className="arcb__arcade" aria-hidden="true">
        <div className="arcb__sky">
          <i className="arcb__sun" />
          <i className="arcb__cloud arcb__cloud--a" /><i className="arcb__cloud arcb__cloud--b" /><i className="arcb__cloud arcb__cloud--c" />
        </div>
        <svg className="arcb__wall" width={w} height={H} viewBox={`0 0 ${w} ${H}`}>
          <path d={wall} fillRule="evenodd" className="arcb__stone" />
          {list.map((a, i) => (
            <g key={i}>
              {/* the reveal: a darker band just inside each opening */}
              <path d={archPath(a, base)} className="arcb__reveal" />
              <path d={`M${a.x + a.w / 2 - 7} ${a.top - 2}h14l-3 12h-8z`} className="arcb__key" />
            </g>
          ))}
          <rect x={0} y={base} width={w} height={H - base} className="arcb__sill" />
        </svg>
      </div>
      <div className="arcb__body">
        {eyebrow && <p className="arcb__eyebrow">{eyebrow}</p>}
        <h2 id={`${id}-t`} className="arcb__title">{title}</h2>
        {lead && <p className="arcb__lead">{lead}</p>}
        <div className="arcb__actions">
          <a className="arcb__btn arcb__btn--primary" href={primary.href} onClick={go(primary)}>{primary.label}</a>
          {secondary && <a className="arcb__btn arcb__btn--ghost" href={secondary.href} onClick={go(secondary)}>{secondary.label}</a>}
        </div>
      </div>
    </section>
  );
}

export default ArcadeBreaker;
