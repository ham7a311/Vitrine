"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import "./ring-flood-card.css";

/**
 * Ring Flood Card
 * Plan cards with a gradient looping slowly round each border. Hover and the
 * colour creeps a little way in from the edge; choose a plan and the face
 * dissolves inward from every side, a soft tide line closing on the centre,
 * until the gradient has flooded the whole card. The plan you leave fills
 * back in to a ring.
 */

export type Plan = {
  id: string;
  name: string;
  price: string;
  per?: string;
  blurb: string;
  features: string[];
  /** A short note in the corner, e.g. "Most chosen". */
  badge?: string;
};

type Props = {
  plans: Plan[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  label?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

export function RingFloodCard({ plans, value, defaultValue, onChange, label = "Plan", theme = "night", motion = "full", className = "" }: Props) {
  const [inner, setInner] = useState(defaultValue ?? plans[0].id);
  const current = value ?? inner;
  const uid = useId().replace(/:/g, "");
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  const choose = (id: string) => {
    if (value === undefined) setInner(id);
    onChange?.(id);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = plans.length;
    const to =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n :
      e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n :
      e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); choose(plans[i].id); return; }
    if (to === null) return;
    e.preventDefault();
    choose(plans[to].id);
    cards.current[to]?.focus();
  };

  return (
    <div className={`rfc rfc--${theme} ${className}`} data-motion={motion} role="radiogroup" aria-label={label}>
      {plans.map((p, i) => {
        const on = p.id === current;
        return (
          <div
            key={p.id}
            ref={(el) => void (cards.current[i] = el)}
            role="radio"
            aria-checked={on}
            aria-labelledby={`${uid}-${p.id}-n`}
            aria-describedby={`${uid}-${p.id}-d`}
            tabIndex={on ? 0 : -1}
            className="rfc__card"
            data-on={on || undefined}
            onClick={() => choose(p.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="rfc__bloom" aria-hidden="true" />
            <span className="rfc__body">
              <span className="rfc__top">
                <span id={`${uid}-${p.id}-n`} className="rfc__name">{p.name}</span>
                {p.badge && <span className="rfc__badge">{p.badge}</span>}
              </span>
              <span className="rfc__price">
                <span className="rfc__amount">{p.price}</span>
                {p.per && <span className="rfc__per">{p.per}</span>}
              </span>
              <span id={`${uid}-${p.id}-d`} className="rfc__blurb">{p.blurb}</span>
              <span className="rfc__features" role="list">
                {p.features.map((f) => (
                  <span key={f} role="listitem" className="rfc__feature">
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
                    {f}
                  </span>
                ))}
              </span>
              <span className="rfc__pick" aria-hidden="true">
                <span className="rfc__dot" />
                {on ? "Your plan" : "Choose"}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
