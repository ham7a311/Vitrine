"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./ticker-ring-cta.css";

/**
 * Ticker Ring CTA
 * A closing banner with its small print written round the edge: the dates,
 * the seats left, where it happens, running continuously along a band like a
 * news ticker. The middle stays calm for the pitch. Point at the button and
 * the ticker slows right down so you can read it.
 */

type Props = {
  eyebrow?: string;
  headline: ReactNode;
  sub?: ReactNode;
  action: string;
  href?: string;
  secondary?: { label: string; href: string };
  /** Facts that run round the border, joined with dots. */
  ticker: string[];
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const BAND = 34; // px between the outer edge and the face
const FONT = 11;
const R = 30; // outer corner radius

/** A rounded-rect loop through the middle of the band, clockwise from the top-left. */
function loop(w: number, h: number) {
  const i = BAND / 2, r = R - i;
  const x0 = i, y0 = i, x1 = w - i, y1 = h - i;
  const d = `M ${x0 + r} ${y0} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} V ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} V ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
  return { d, length: 2 * (x1 - x0 - 2 * r) + 2 * (y1 - y0 - 2 * r) + 2 * Math.PI * r };
}

export function TickerRingCta({ eyebrow, headline, sub, action, href = "#", secondary, ticker, theme = "night", motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const box = useRef<HTMLDivElement>(null);
  const a = useRef<SVGTextPathElement>(null);
  const b = useRef<SVGTextPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const slow = useRef(false);

  useLayoutEffect(() => {
    const el = box.current!;
    const read = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { d, length } = size.w ? loop(size.w, size.h) : { d: "", length: 0 };
  // Mono capitals advance about 0.6em plus tracking; repeat the line to go round exactly once.
  const unit = ticker.map((t) => t.trim()).join("  ·  ") + "  ·  ";
  const copies = length ? Math.max(1, Math.round(length / (unit.length * FONT * (0.6 + 0.2)))) : 1;
  const text = unit.repeat(copies);

  useEffect(() => {
    if (!length || motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let o = 0, raf = 0, last = performance.now(), speed = 34;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed += ((slow.current ? 6 : 34) - speed) * Math.min(1, dt * 3);
      o = (o + speed * dt) % length;
      // Two copies one lap apart, so the ticker never shows a seam.
      a.current?.setAttribute("startOffset", String(o));
      b.current?.setAttribute("startOffset", String(o - length));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [length, motion]);

  const hold = { onPointerEnter: () => (slow.current = true), onPointerLeave: () => (slow.current = false), onFocus: () => (slow.current = true), onBlur: () => (slow.current = false) };

  return (
    <section className={`trcta trcta--${theme} ${className}`} data-motion={motion}>
      <div ref={box} className="trcta__band">
        {d && (
          <svg className="trcta__ring" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
            <path id={`${uid}-p`} d={d} fill="none" />
            <text className="trcta__text" fontSize={FONT} dy="0.35em">
              <textPath ref={a} href={`#${uid}-p`} startOffset="0" textLength={length} lengthAdjust="spacing">{text}</textPath>
            </text>
            <text className="trcta__text" fontSize={FONT} dy="0.35em">
              <textPath ref={b} href={`#${uid}-p`} startOffset={-length} textLength={length} lengthAdjust="spacing">{text}</textPath>
            </text>
          </svg>
        )}
        <div className="trcta__face">
          {eyebrow && <p className="trcta__eyebrow">{eyebrow}</p>}
          <h2 className="trcta__headline">{headline}</h2>
          {sub && <p className="trcta__sub">{sub}</p>}
          <ul id={`${uid}-facts`} className="trcta__sr">{ticker.map((t) => <li key={t}>{t}</li>)}</ul>
          <div className="trcta__actions">
            <a href={href} className="trcta__primary" aria-describedby={`${uid}-facts`} {...hold}>
              {action}
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </a>
            {secondary && <a href={secondary.href} className="trcta__secondary" {...hold}>{secondary.label}</a>}
          </div>
        </div>
      </div>
    </section>
  );
}
