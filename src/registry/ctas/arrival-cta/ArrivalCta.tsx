"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "./arrival-cta.css";

/**
 * Arrival CTA
 * A closing call to action that feels like reaching a destination: a route
 * line descends and lands on a gold node, then the eyebrow, headline, copy,
 * actions and tags rise in one after another. A drawn horizon plate anchors
 * the bottom of the section.
 */

type Action = { label: string; href: string; external?: boolean };

type Props = {
  eyebrow: string;
  heading: ReactNode;
  lead: string;
  primary: Action;
  secondary?: Action;
  tagsLabel?: string;
  tags?: string[];
  /** Optional image for the bottom plate (top stays, base fades out). Defaults to a drawn horizon. */
  plate?: string;
};

function useInView<T extends Element>(amount = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: amount, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, inView] as const;
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" className="arrival-cta__arrow" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

const ext = (a: Action) => (a.external ? { target: "_blank", rel: "noopener noreferrer" } : {});

/** A generated line-drawing horizon: ridges that thin and fade toward the distance. */
function HorizonPlate() {
  const ridges = Array.from({ length: 9 }, (_, i) => {
    const y = 120 + i * 34;
    const amp = 18 + i * 6;
    const phase = i * 0.9;
    let d = `M -20 ${y}`;
    for (let x = -20; x <= 1360; x += 40) {
      const yy = y - Math.sin(x / 190 + phase) * amp - Math.sin(x / 83 + phase * 2) * (amp * 0.35);
      d += ` L ${x} ${yy.toFixed(1)}`;
    }
    return { d, o: 0.12 + i * 0.05 };
  });
  return (
    <svg className="arrival-cta__horizon" viewBox="0 0 1340 540" preserveAspectRatio="xMidYMin slice">
      <defs>
        <radialGradient id="arrival-sun" cx="50%" cy="22%" r="30%">
          <stop offset="0%" stopColor="#f3b45f" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f3b45f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1340" height="540" fill="url(#arrival-sun)" />
      {ridges.map((r, i) => (
        <path key={i} d={r.d} fill="none" stroke="#f4f3f1" strokeOpacity={r.o} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

export function ArrivalCta({ eyebrow, heading, lead, primary, secondary, tagsLabel, tags, plate }: Props) {
  // Observe the content column (not the tall section) so the sequence starts once the copy is on screen.
  const [ref, inView] = useInView<HTMLDivElement>(0.25);

  return (
    <section className="arrival-cta" data-in={inView || undefined}>
      <div ref={ref} className="arrival-cta__inner">
        <svg viewBox="0 0 40 96" className="arrival-cta__route" fill="none" aria-hidden="true">
          <path d="M20 2 C 34 22, 6 40, 20 62 S 20 80, 20 84" pathLength={1} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="arrival-cta__route-line" />
          <circle cx="20" cy="88" r="3.5" fill="currentColor" className="arrival-cta__route-node" />
        </svg>

        <p className="arrival-cta__eyebrow arrival-cta__reveal" style={{ ["--d" as string]: "0s" }}>
          <span aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="arrival-cta__heading arrival-cta__reveal" style={{ ["--d" as string]: "0.06s" }}>
          {heading}
        </h2>
        <p className="arrival-cta__lead arrival-cta__reveal" style={{ ["--d" as string]: "0.12s" }}>
          {lead}
        </p>

        <div className="arrival-cta__actions arrival-cta__reveal" style={{ ["--d" as string]: "0.18s" }}>
          <a href={primary.href} className="arrival-cta__btn arrival-cta__btn--primary" {...ext(primary)}>
            {primary.label}
            <ArrowUpRight />
          </a>
          {secondary && (
            <a href={secondary.href} className="arrival-cta__btn arrival-cta__btn--secondary" {...ext(secondary)}>
              {secondary.label}
            </a>
          )}
        </div>

        {tags?.length ? (
          <div className="arrival-cta__reveal" style={{ ["--d" as string]: "0.24s" }}>
            {tagsLabel && <p className="arrival-cta__tags-label">{tagsLabel}</p>}
            <ul className="arrival-cta__tags">
              {tags.map((t) => (
                <li key={t}>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="arrival-cta__plate" aria-hidden="true">
        <div className="arrival-cta__plate-art">
          {plate ? <img src={plate} alt="" className="arrival-cta__plate-img" /> : <HorizonPlate />}
        </div>
      </div>
    </section>
  );
}
