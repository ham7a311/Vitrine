"use client";
import { useEffect, useId, useRef, type CSSProperties } from "react";
import { lengthAt, step, strand, type Strand } from "./beads";
import "./bead-curtain.css";

export type CurtainPalette = { ground: string; beads: string[]; cord: string; ink: string; muted: string; accent: string; onAccent: string; glass?: boolean };
export type CurtainLink = { label: string; href: string };

export type BeadCurtainProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  action: CurtainLink;
  palette?: CurtainPalette;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const DEFAULT: CurtainPalette = { ground: "#1d140c", beads: ["#e8a33d", "#c9772a", "#f3c46b", "#8d4f1f"], cord: "rgba(243, 196, 107, 0.35)", ink: "#f7ead6", muted: "#d4bf9f", accent: "#f3c46b", onAccent: "#2a1b0b" };
const BAND = 230, GAP = 15, SEG = 13, R = 4.6;

/**
 * Bead Curtain
 * A section you step into through a curtain of beads: strings hang across its top, longer at the
 * sides and parted in the middle like a doorway. Move the pointer through them and they swing aside
 * and clack back, each string a chain of beads on its own. The copy waits beneath, centred, with a
 * single invitation.
 */
export function BeadCurtain({ eyebrow, title, lead, action, palette = DEFAULT, onNavigate, className = "" }: BeadCurtainProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current, cv = canvas.current, ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, strands: Strand[] = [], raf = 0, last = 0, pointer: { x: number; y: number; r: number } | null = null, visible = true;

    const build = () => {
      w = el.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.style.width = `${w}px`; cv.style.height = `${BAND}px`;
      cv.width = Math.round(w * dpr); cv.height = Math.round(BAND * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.floor(w / GAP);
      strands = Array.from({ length: n }, (_, i) => strand((i + 0.5) * (w / n), lengthAt((i + 0.5) * (w / n), w), SEG));
      // they arrive with a little sway
      if (!still) strands.forEach((s, i) => s.beads.forEach((b, k) => { b.px = b.x - Math.sin(i * 0.5) * k * 0.35; }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, BAND);
      // the rail they hang from
      ctx.fillStyle = palette.cord; ctx.fillRect(0, 0, w, 3);
      for (const [i, s] of strands.entries()) {
        const b = s.beads;
        ctx.strokeStyle = palette.cord; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(b[0].x, 0);
        for (const p of b) ctx.lineTo(p.x, p.y);
        ctx.stroke();
        for (const [k, p] of b.entries()) {
          if (!k) continue;
          const c = palette.beads[(i * 3 + k) % palette.beads.length];
          const g = ctx.createRadialGradient(p.x - R * 0.4, p.y - R * 0.45, R * 0.15, p.x, p.y, R);
          if (palette.glass) { g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(0.35, c); g.addColorStop(1, "rgba(255,255,255,0.08)"); }
          else { g.addColorStop(0, "rgba(255,255,255,0.75)"); g.addColorStop(0.3, c); g.addColorStop(1, c); }
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill();
        }
      }
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60; last = now;
      let energy = 0;
      for (const s of strands) energy += step(s, dt, 900, 0.982, pointer);
      draw();
      if (visible && (pointer || energy > 0.4)) raf = requestAnimationFrame(tick);
    };
    const run = () => { if (!raf && !still) { last = 0; raf = requestAnimationFrame(tick); } };

    const ro = new ResizeObserver(() => { build(); draw(); run(); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) run(); });
    io.observe(el);
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const y = e.clientY - r.top;
      pointer = y < BAND + 20 ? { x: e.clientX - r.left, y, r: 30 } : null;
      run();
    };
    const leave = () => { pointer = null; run(); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    build(); draw(); run();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [palette]);

  const vars = { ["--bc-ground" as string]: palette.ground, ["--bc-ink" as string]: palette.ink, ["--bc-muted" as string]: palette.muted, ["--bc-accent" as string]: palette.accent, ["--bc-on-accent" as string]: palette.onAccent } as CSSProperties;
  return (
    <section ref={root} aria-labelledby={`${id}-t`} className={`beadc ${className}`} style={vars}>
      <canvas ref={canvas} className="beadc__curtain" aria-hidden="true" />
      <div className="beadc__body">
        {eyebrow && <p className="beadc__eyebrow">{eyebrow}</p>}
        <h2 id={`${id}-t`} className="beadc__title">{title}</h2>
        {lead && <p className="beadc__lead">{lead}</p>}
        <a className="beadc__btn" href={action.href} onClick={(e) => onNavigate?.(action.href, e)}>
          {action.label}
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3.5 9h10.5M9.5 4.5 14 9l-4.5 4.5" /></svg>
        </a>
      </div>
    </section>
  );
}

export default BeadCurtain;
