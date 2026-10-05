"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "./blueprint-card.css";

/**
 * Blueprint Card
 * A spec card drawn like a technical drawing. When it enters view, the frame,
 * dimension lines and callouts draw themselves in sequence; hovering a spec
 * row highlights its callout leader on the drawing.
 */

export type Spec = { key: string; value: string; note?: string };

type Props = { title: string; code: string; drawing: ReactNode; specs: Spec[] };

export function BlueprintCard({ title, code, drawing, specs }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDrawn(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className="blueprint-card" data-drawn={drawn || undefined}>
      <svg className="blueprint-card__frame" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
        <rect x="1" y="1" width="398" height="298" pathLength={1} />
        <path d="M1 236 H399" pathLength={1} />
        <path d="M300 236 V299" pathLength={1} />
      </svg>

      <header className="blueprint-card__head">
        <h3>{title}</h3>
        <span>{code}</span>
      </header>

      <div className="blueprint-card__drawing" aria-hidden="true">
        {drawing}
        {specs.map((_, i) => (
          <span key={i} className="blueprint-card__leader" data-on={active === i || undefined} style={{ ["--i" as string]: i, top: `${22 + i * 20}%` }}>
            <i>{i + 1}</i>
          </span>
        ))}
      </div>

      <dl className="blueprint-card__specs">
        {specs.map((s, i) => (
          <div key={s.key} className="blueprint-card__row" tabIndex={0} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} data-on={active === i || undefined}>
            <dt><i>{i + 1}</i>{s.key}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
