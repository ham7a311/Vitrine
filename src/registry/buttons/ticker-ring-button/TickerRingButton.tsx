"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import "./ticker-ring-button.css";

/**
 * Ticker Ring Button
 * A button with its announcement written around it: a line of small capitals
 * runs along the border like a news ticker, so the button carries one short
 * message without a badge. Hover slows the ticker down so you can read it.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  /** The line that runs around the border. Keep it short; it repeats. */
  ticker: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

const BAND = 13; // px between the outer edge and the face
const FONT = 8.5;

/** A pill-shaped loop through the middle of the band, starting at the top-left of the straight edge, clockwise. */
function loop(w: number, h: number) {
  const i = BAND / 2, r = h / 2 - i;
  const x0 = i + r, x1 = w - i - r;
  return { d: `M ${x0} ${i} H ${x1} A ${r} ${r} 0 0 1 ${x1} ${h - i} H ${x0} A ${r} ${r} 0 0 1 ${x0} ${i} Z`, length: 2 * (x1 - x0) + 2 * Math.PI * r };
}

export function TickerRingButton({ label, ticker, theme = "night", motion = "full", className = "", ...rest }: Props) {
  const uid = useId().replace(/:/g, "");
  const btn = useRef<HTMLButtonElement>(null);
  const a = useRef<SVGTextPathElement>(null);
  const b = useRef<SVGTextPathElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const slow = useRef(false);

  useLayoutEffect(() => {
    const el = btn.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { d, length } = box.w ? loop(box.w, box.h) : { d: "", length: 0 };
  // Mono capitals advance 0.6em plus letter spacing; repeat the line to go round exactly once.
  const unit = `${ticker.trim()} · `;
  const copies = length ? Math.max(1, Math.round(length / (unit.length * FONT * (0.6 + 0.18)))) : 1;
  const text = unit.repeat(copies);

  useEffect(() => {
    if (!length || motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let o = 0, raf = 0, last = performance.now(), speed = 26;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed += ((slow.current ? 7 : 26) - speed) * Math.min(1, dt * 4);
      o = (o + speed * dt) % length;
      // Two copies of the line, one lap apart, so the ticker never shows a seam.
      a.current?.setAttribute("startOffset", String(o));
      b.current?.setAttribute("startOffset", String(o - length));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [length, motion]);

  return (
    <button
      ref={btn}
      type="button"
      className={`trb trb--${theme} ${className}`}
      data-motion={motion}
      onPointerEnter={() => (slow.current = true)}
      onPointerLeave={() => (slow.current = false)}
      onFocus={() => (slow.current = true)}
      onBlur={() => (slow.current = false)}
      aria-describedby={`${uid}-t`}
      {...rest}
    >
      <span className="trb__face">{label}</span>
      <span id={`${uid}-t`} className="trb__sr">{ticker}</span>
      {d && (
        <svg className="trb__ring" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
          <path id={`${uid}-p`} d={d} fill="none" />
          <text className="trb__text" fontSize={FONT} dy="0.34em">
            <textPath ref={a} href={`#${uid}-p`} startOffset="0" textLength={length} lengthAdjust="spacing">{text}</textPath>
          </text>
          <text className="trb__text" fontSize={FONT} dy="0.34em">
            <textPath ref={b} href={`#${uid}-p`} startOffset={-length} textLength={length} lengthAdjust="spacing">{text}</textPath>
          </text>
        </svg>
      )}
    </button>
  );
}
