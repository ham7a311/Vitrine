"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import "./approach-card.css";

/**
 * Approach Card
 * One continuous value, --p (0 far → 1 close), drives the whole layout.
 * It's computed from the pointer's distance to the card's edge, not from
 * hover, so the card starts responding before you touch it — and two cards
 * side by side both half-open when you're between them.
 */

type Props = {
  index: string;
  year: string;
  title: string;
  summary: string;
  stack: string[];
  href?: string;
  cta?: string;
  accent?: string;
  /** Distance in px at which the card starts to respond. */
  reach?: number;
  className?: string;
};

export function ApproachCard({ index, year, title, summary, stack, href = "#", cta = "Read the case study", accent = "#b9cce4", reach = 220, className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // how far the title travels from its resting place (bottom) to the top slot
  useLayoutEffect(() => {
    const el = ref.current!, t = titleRef.current!;
    const place = () => {
      const top = t.offsetTop;
      el.style.setProperty("--ty", `${-(top - 52)}px`);
      // the summary tucks in right under the title's shrunken size
      el.style.setProperty("--sy", `${52 + t.offsetHeight * 0.55 + 16}px`);
    };
    place();
    const ro = new ResizeObserver(place); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.matchMedia("(hover: none)").matches) { el.style.setProperty("--p", "1"); return; }
    let p = 0, target = 0, focus = false, raf = 0, dir = 1;
    const set = () => el.style.setProperty("--p", p.toFixed(4));
    const tick = () => {
      p += (target - p) * (reduce ? 1 : 0.11);
      if (Math.abs(target - p) < 0.001) p = target;
      set();
      raf = p === target ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const onMove = (e: PointerEvent) => {
      if (focus) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      const d = Math.hypot(dx, dy);
      const k = Math.max(0, 1 - d / reach);
      const next = k * k * (3 - 2 * k); // smoothstep: nothing happens until you mean it
      if (p < 0.04 && next > 0.04) {
        // remember which side we came from; details enter from there
        dir = e.clientX < r.left + r.width / 2 ? -1 : 1;
        el.style.setProperty("--dir", String(dir));
      }
      if (Math.abs(next - target) > 0.002) { target = next; kick(); }
    };
    const onFocus = () => { focus = true; target = 1; kick(); };
    const onBlur = () => { focus = false; target = 0; kick(); };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("focus", onFocus); el.addEventListener("blur", onBlur);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); el.removeEventListener("focus", onFocus); el.removeEventListener("blur", onBlur); };
  }, [reach]);

  return (
    <a ref={ref} href={href} onClick={(e) => href === "#" && e.preventDefault()} className={`approach-card ${className}`} style={{ "--p": 0, "--dir": 1, "--ac-accent": accent } as CSSProperties}>
      <span className="approach-card__light" aria-hidden="true" />
      <span className="approach-card__meta">
        <span>{index}</span>
        <span>{year}</span>
      </span>
      <span className="approach-card__summary" style={{ "--k": 0 } as CSSProperties}>{summary}</span>
      <span className="approach-card__body">
        <span className="approach-card__stack" style={{ "--k": 1 } as CSSProperties}>
          {stack.map((s) => <span key={s}>{s}</span>)}
        </span>
        <span className="approach-card__cta" style={{ "--k": 2 } as CSSProperties}>
          {cta}
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8.5 4l4 4-4 4" /></svg>
        </span>
      </span>
      <h3 ref={titleRef} className="approach-card__title">{title}</h3>
      <span className="approach-card__rule" aria-hidden="true" />
    </a>
  );
}
