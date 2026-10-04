"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./image-compare.css";

/**
 * Image Compare
 * Two pictures of the same scene in one frame, split by a line you drag. The line is jelly:
 * its ends chase the knob on a soft spring, and the picture is cut along the same curve,
 * so a quick drag bows the seam and it wobbles back straight.
 */

type Props = {
  /** Shown on the left of the line. */
  before: ReactNode;
  /** Shown on the right of the line. */
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  /** Start position, 0–100. */
  initial?: number;
  accent?: string;
  motion?: "full" | "reduced";
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export function ImageCompare({ before, after, beforeLabel = "Before", afterLabel = "After", initial = 50, accent = "#ffffff", motion = "full", label = "Image comparison", className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const seam = useRef<SVGPathElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(initial);
  const api = useRef<{ set: (p: number, instant?: boolean) => void } | null>(null);

  useEffect(() => {
    const el = host.current, c = clip.current, s = seam.current, kn = knob.current;
    if (!el || !c || !s || !kn) return;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = el.offsetWidth, h = el.offsetHeight;
    const st = { x: (initial / 100) * w, e: (initial / 100) * w, v: 0, raf: 0, last: 0 };

    const paint = () => {
      const { x, e } = st;
      // A quadratic whose middle passes through the knob: control = 2x − ends.
      const cx = 2 * x - e;
      c.style.clipPath = `path("M0 0 L${e.toFixed(1)} 0 Q${cx.toFixed(1)} ${(h / 2).toFixed(1)} ${e.toFixed(1)} ${h.toFixed(1)} L0 ${h.toFixed(1)} Z")`;
      s.setAttribute("d", `M${e} 0 Q${cx} ${h / 2} ${e} ${h}`);
      kn.style.translate = `${x}px ${h / 2}px`;
    };
    const tick = (t: number) => {
      const dt = Math.min(0.033, (t - (st.last || t)) / 1000 || 0.016);
      st.last = t;
      st.v += ((st.x - st.e) * 620 - st.v * 44) * dt;
      st.e += st.v * dt;
      paint();
      if (Math.abs(st.x - st.e) < 0.05 && Math.abs(st.v) < 0.5) {
        st.e = st.x;
        st.v = 0;
        st.last = 0;
        st.raf = 0;
        paint();
        return;
      }
      st.raf = requestAnimationFrame(tick);
    };
    const set = (p: number, instant = false) => {
      const q = Math.max(0, Math.min(100, p));
      st.x = (q / 100) * w;
      if (reduced || instant) st.e = st.x;
      setPct(Math.round(q));
      if (reduced || instant) paint();
      else if (!st.raf) st.raf = requestAnimationFrame(tick);
    };
    api.current = { set };

    const at = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    };
    const onDown = (e: PointerEvent) => {
      if (e.button > 0) return;
      el.setPointerCapture(e.pointerId);
      el.dataset.dragging = "";
      set(at(e));
    };
    const onMove = (e: PointerEvent) => el.hasPointerCapture(e.pointerId) && set(at(e));
    const onUp = (e: PointerEvent) => {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      delete el.dataset.dragging;
    };
    const ro = new ResizeObserver(() => {
      const p = st.x / Math.max(1, w);
      w = el.offsetWidth;
      h = el.offsetHeight;
      st.x = st.e = p * w;
      paint();
    });
    ro.observe(el);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    paint();
    return () => {
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
    // initial is a starting point only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion]);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const map: Record<string, number> = { ArrowLeft: pct - step, ArrowDown: pct - step, ArrowRight: pct + step, ArrowUp: pct + step, PageDown: pct - 10, PageUp: pct + 10, Home: 0, End: 100 };
    if (!(e.key in map)) return;
    e.preventDefault();
    api.current?.set(map[e.key]);
  };

  return (
    <div ref={host} className={`ic ${className}`} style={{ ["--ic-accent" as string]: accent, ...style }} role="group" aria-label={label}>
      <div className="ic__layer">{after}</div>
      <div ref={clip} className="ic__layer ic__clip">
        {before}
      </div>
      <span className="ic__tag ic__tag--l">{beforeLabel}</span>
      <span className="ic__tag ic__tag--r">{afterLabel}</span>
      <svg className="ic__seam" aria-hidden="true">
        <path ref={seam} />
      </svg>
      <div
        ref={knob}
        className="ic__knob"
        role="slider"
        tabIndex={0}
        aria-label={`Divider: ${beforeLabel} on the left, ${afterLabel} on the right`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${pct}% ${beforeLabel}`}
        onKeyDown={onKey}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
        </svg>
      </div>
    </div>
  );
}
