"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./tideline-cta.css";

/**
 * Tideline CTA
 * A closing section that shows how full the event is. As it scrolls into
 * view a tide rises to the real share of seats taken, rolling at the surface,
 * and every word inverts exactly along the wave. The button floats on the
 * waterline like a buoy, so the way in sits right where the room runs out.
 */

type Props = {
  eyebrow?: string;
  headline: ReactNode;
  sub?: ReactNode;
  /** 0–1: how full it is. */
  taken: number;
  action: string;
  href?: string;
  details?: string[];
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

export function TidelineCta({ eyebrow, headline, sub, taken, action, href = "#", details = [], theme = "night", motion = "full", className = "" }: Props) {
  const root = useRef<HTMLElement>(null);
  const [h, setH] = useState(0);
  const [seen, setSeen] = useState(false);
  const pct = Math.round(taken * 100);

  useLayoutEffect(() => {
    const el = root.current!;
    const read = () => setH(el.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rise once, when most of the section is on screen.
  useEffect(() => {
    const el = root.current!;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const face = (
    <div className="tlc__inner">
      {eyebrow && <p className="tlc__eyebrow">{eyebrow}</p>}
      <h2 className="tlc__headline">{headline}</h2>
      {sub && <p className="tlc__sub">{sub}</p>}
      <p className="tlc__level">{pct}% of seats taken</p>
      {details.length > 0 && (
        <ul className="tlc__details">
          {details.map((d) => <li key={d}>{d}</li>)}
        </ul>
      )}
    </div>
  );

  return (
    <section
      ref={root}
      className={`tlc tlc--${theme} ${className}`}
      data-motion={motion}
      data-seen={seen || undefined}
      style={{ "--tlc-target": taken, "--tlc-h": `${h}px` } as CSSProperties}
    >
      <div className="tlc__layer tlc__layer--dry">{face}</div>
      <div className="tlc__water tlc__water--back" aria-hidden="true" />
      <div className="tlc__water tlc__layer" aria-hidden="true" inert>{face}</div>

      <a href={href} className="tlc__buoy">
        {action}
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
      </a>
    </section>
  );
}
