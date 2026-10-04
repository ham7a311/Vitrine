"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import "./specimen-card.css";

/**
 * Specimen Card
 * An object mounted under glass, like a museum case. On hover the glass pane
 * lifts off the mount with a sweep of reflection, the card tilts toward you,
 * and a paper catalogue tag swings out on its thread to reveal the details.
 */

type Props = {
  href: string;
  /** The mounted object — an illustration, product shot or icon. */
  specimen: ReactNode;
  catalogue: string;
  title: string;
  subtitle: string;
  /** Lines written on the tag. */
  tag: { label: string; value: string }[];
  className?: string;
};

export function SpecimenCard({ href, specimen, catalogue, title, subtitle, tag, className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    e.currentTarget.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  };

  return (
    <a ref={ref} href={href} className={`spec ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="spec__case">
        <div className="spec__mount">
          <span className="spec__pin spec__pin--tl" aria-hidden="true" />
          <span className="spec__pin spec__pin--tr" aria-hidden="true" />
          <div className="spec__object" aria-hidden="true">
            {specimen}
          </div>
          <div className="spec__caption">
            <p className="spec__catalogue">{catalogue}</p>
            <h3 className="spec__title">{title}</h3>
            <p className="spec__subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="spec__glass" aria-hidden="true">
          <span className="spec__sweep" />
        </div>
      </div>

      <div className="spec__tag-wrap">
        <svg className="spec__thread" viewBox="0 0 40 60" aria-hidden="true">
          <path d="M6 2 C 14 18, 26 28, 30 58" />
        </svg>
        <dl className="spec__tag">
          {tag.map((t) => (
            <div key={t.label}>
              <dt>{t.label}</dt>
              <dd>{t.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </a>
  );
}
