"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { field, levels, march, type Hill } from "./topo";
import "./topo-contours.css";

export type TopoPalette = { ground: string; line: string; index: string; ink: string; muted: string; rule: string; accent: string; onAccent: string };
export type TopoLink = { label: string; href: string };
export type TopoStat = { value: string; label: string };

export type TopoContoursProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  stats?: TopoStat[];
  primary: TopoLink;
  secondary?: TopoLink;
  palette?: TopoPalette;
  seed?: number;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const DEFAULT: TopoPalette = { ground: "#f1ece0", line: "#c08a5c", index: "#7d4a22", ink: "#2b1d10", muted: "#5d4a37", rule: "rgba(43, 29, 16, 0.16)", accent: "#2b1d10", onAccent: "#f6f1e6" };
const BAND = 250, CELL = 10, STEP = 0.045;
const metres = (l: number) => (Math.round((l * 1600 + 400) / 10) * 10).toLocaleString("en-GB");

/**
 * Topo Contours
 * A section that opens under a strip of survey map: contour lines traced across it as it scrolls
 * into view, every fifth one heavier and labelled with its height. Move the pointer over the map
 * and a hill rises under it, the lines gathering round it as you go. Copy sits to the right with
 * its figures inline.
 */
export function TopoContours({ eyebrow, title, lead, stats = [], primary, secondary, palette = DEFAULT, seed = 4, onNavigate, className = "" }: TopoContoursProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    const el = root.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, raf = 0, last = 0, reveal = still ? 1 : 0, lift = 0, liftTo = 0;
    const at = { x: 0, y: 0 };

    const draw = () => {
      const cols = Math.ceil(w / CELL), rows = Math.ceil(BAND / CELL);
      const hills: Hill[] = lift > 0.01 ? [{ x: at.x, y: at.y, r: 80, h: 0.42 * lift }] : [];
      const f = field(cols, rows, CELL, seed, hills);
      const style = getComputedStyle(el);
      const line = style.getPropertyValue("--tc-line"), index = style.getPropertyValue("--tc-index"), ground = style.getPropertyValue("--tc-ground");
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore();
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, w * reveal, BAND); ctx.clip();
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      const labels: { x: number; y: number; text: string }[] = [];
      for (const l of levels(f, STEP)) {
        const major = Math.round(l / STEP) % 5 === 0;
        const segs = march(f, cols, rows, CELL, l);
        ctx.strokeStyle = major ? index : line; ctx.lineWidth = major ? 1.4 : 0.8; ctx.globalAlpha = major ? 1 : 0.8;
        ctx.beginPath();
        for (const s of segs) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); }
        ctx.stroke();
        if (major) {
          // label a fairly level stretch, spaced well apart along the strip
          let lastX = -Infinity;
          for (const s of segs) {
            const mx = (s[0] + s[2]) / 2;
            if (mx > 40 && mx < w - 40 && Math.abs(s[3] - s[1]) < 3 && mx - lastX > 340 && s[1] > 18 && s[1] < BAND - 12) { labels.push({ x: mx, y: (s[1] + s[3]) / 2, text: metres(l) }); lastX = mx; }
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const lb of labels) {
        const tw = ctx.measureText(lb.text).width + 8;
        ctx.fillStyle = ground; ctx.fillRect(lb.x - tw / 2, lb.y - 6, tw, 12);
        ctx.fillStyle = index; ctx.fillText(lb.text, lb.x, lb.y + 0.5);
      }
      ctx.restore();
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      if (shownRef.current && reveal < 1) reveal = Math.min(1, reveal + dt / 1.4);
      lift += (liftTo - lift) * Math.min(1, dt * 4);
      draw();
      if ((shownRef.current && reveal < 1) || Math.abs(liftTo - lift) > 0.005) raf = requestAnimationFrame(tick);
    };
    const run = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };

    const size = () => {
      w = el.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.style.width = `${w}px`; cv.style.height = `${BAND}px`;
      cv.width = Math.round(w * dpr); cv.height = Math.round(BAND * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const ro = new ResizeObserver(size);
    ro.observe(el);
    const reach = () => { if (!shownRef.current) { shownRef.current = true; setShown(true); run(); } };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) reach(); }, { threshold: 0.15 });
    io.observe(el);
    // already on screen when it mounts: start straight away rather than wait for the observer's first report
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) reach();
    const move = (e: PointerEvent) => {
      if (still) return;
      const r = cv.getBoundingClientRect();
      at.x = e.clientX - r.left; at.y = e.clientY - r.top; liftTo = at.y < BAND + 40 ? 1 : 0;
      run();
    };
    const leave = () => { liftTo = 0; run(); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    size();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [seed, palette]);

  const go = (l: TopoLink) => (e: React.MouseEvent) => onNavigate?.(l.href, e);
  const vars = { ["--tc-ground" as string]: palette.ground, ["--tc-line" as string]: palette.line, ["--tc-index" as string]: palette.index, ["--tc-ink" as string]: palette.ink, ["--tc-muted" as string]: palette.muted, ["--tc-rule" as string]: palette.rule, ["--tc-accent" as string]: palette.accent, ["--tc-on-accent" as string]: palette.onAccent } as CSSProperties;

  return (
    <section ref={root} aria-labelledby={`${id}-t`} className={`topoc ${className}`} data-shown={shown ? "" : undefined} style={vars}>
      <canvas ref={canvas} className="topoc__map" aria-hidden="true" />
      <div className="topoc__body">
        {eyebrow && <p className="topoc__eyebrow">{eyebrow}</p>}
        <h2 id={`${id}-t`} className="topoc__title">{title}</h2>
        {lead && <p className="topoc__lead">{lead}</p>}
        {stats.length > 0 && (
          <dl className="topoc__stats">
            {stats.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
          </dl>
        )}
        <div className="topoc__actions">
          {secondary && <a className="topoc__btn topoc__btn--ghost" href={secondary.href} onClick={go(secondary)}>{secondary.label}</a>}
          <a className="topoc__btn topoc__btn--primary" href={primary.href} onClick={go(primary)}>{primary.label}</a>
        </div>
      </div>
    </section>
  );
}

export default TopoContours;
