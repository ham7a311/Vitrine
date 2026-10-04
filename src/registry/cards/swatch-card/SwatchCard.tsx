"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./swatch-card.css";

/**
 * Swatch Card
 * A product card for a glazed cup where choosing a colour glazes it the way
 * a potter does: the new glaze runs down from the rim over the old one and
 * stops short of the foot, which stays bare clay. Name, price and stock
 * follow the glaze.
 */

export type Glaze = { id: string; name: string; color: string; price: number; stock: number };

type Props = {
  maker: string;
  title: string;
  detail: string;
  glazes: Glaze[];
  defaultGlaze?: string;
  currency?: string;
  /** Unglazed clay colour, shown at the foot. */
  clay?: string;
  onAdd?: (glaze: string) => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const fmt = (n: number, c: string) => `${c} ${n.toFixed(3)}`;

function Cup({ glaze, clay, uid, part }: { glaze: string; clay: string; uid: string; part: "base" | "glaze" }) {
  // The bowl, and the line the glaze stops at (a little uneven, as dipping leaves it).
  const body = "M30 62 C 32 112, 54 154, 72 163 L 128 163 C 146 154, 168 112, 170 62 Z";
  const dip = "M20 50 L 180 50 L 180 140 C 166 143, 156 139, 142 144 C 128 148, 116 143, 100 147 C 86 150, 72 144, 58 146 C 44 148, 34 142, 20 145 Z";
  return (
    <svg viewBox="0 0 200 200" className={`swc__cup swc__cup--${part}`} aria-hidden="true">
      <defs>
        <clipPath id={`${uid}-${part}-dip`}><path d={dip} /></clipPath>
        <radialGradient id={`${uid}-${part}-inside`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#000" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      {part === "base" && (
        <>
          <ellipse cx="100" cy="178" rx="58" ry="7" fill="#000" opacity="0.18" />
          {/* Foot ring and body in bare clay. */}
          <path d="M76 160 L124 160 L122 172 C 112 175, 88 175, 78 172 Z" fill={clay} />
          <path d={body} fill={clay} />
        </>
      )}
      <g clipPath={`url(#${uid}-${part}-dip)`}>
        <path d={body} fill={glaze} />
        <ellipse cx="100" cy="62" rx="70" ry="13" fill={glaze} />
        <ellipse cx="100" cy="62" rx="64" ry="10" fill={glaze} />
        <ellipse cx="100" cy="62" rx="64" ry="10" fill={`url(#${uid}-${part}-inside)`} />
      </g>
    </svg>
  );
}

export function SwatchCard({ maker, title, detail, glazes, defaultGlaze, currency = "OMR", clay = "#c98a5e", onAdd, theme = "paper", motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const [id, setId] = useState(defaultGlaze ?? glazes[0].id);
  const [under, setUnder] = useState(id);
  const [pour, setPour] = useState(0);
  const [added, setAdded] = useState<"bag" | "notify" | null>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const g = glazes.find((x) => x.id === id) ?? glazes[0];
  const below = glazes.find((x) => x.id === under) ?? g;

  // When a pour finishes, the new glaze becomes the coat underneath.
  useEffect(() => {
    if (under === id) return;
    const reduce = motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setUnder(id), reduce ? 0 : 1100);
    return () => clearTimeout(t);
  }, [id, under, motion]);

  const choose = (next: string) => {
    if (next === id) return;
    setUnder(id);
    setId(next);
    setPour((p) => p + 1);
    setAdded(null);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % glazes.length : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + glazes.length) % glazes.length : null;
    if (to === null) return;
    e.preventDefault();
    choose(glazes[to].id);
    chips.current[to]?.focus();
  };

  const sold = g.stock === 0;
  return (
    <article className={`swc swc--${theme} ${className}`} data-motion={motion} style={{ "--swc-glaze": g.color } as CSSProperties}>
      <div className="swc__inner">
      <div className="swc__stage">
        <Cup glaze={below.color} clay={clay} uid={uid} part="base" />
        {pour > 0 && (
          <div key={pour} className="swc__pour">
            <Cup glaze={g.color} clay={clay} uid={`${uid}p${pour}`} part="glaze" />
          </div>
        )}
        {/* Shading sits over both coats so the new glaze is lit the same way. */}
        <svg viewBox="0 0 200 200" className="swc__cup swc__cup--light" aria-hidden="true">
          <defs>
            <linearGradient id={`${uid}-l`} x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.72" stopColor="#000" stopOpacity="0.08" />
              <stop offset="1" stopColor="#000" stopOpacity="0.32" />
            </linearGradient>
          </defs>
          <path d="M30 62 C 32 112, 54 154, 72 163 L 128 163 C 146 154, 168 112, 170 62 Z" fill={`url(#${uid}-l)`} />
          <path d="M48 76 C 52 104, 62 128, 74 146" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="100" cy="62" rx="70" ry="13" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="swc__info">
        <p className="swc__kicker">{maker}</p>
        <h3 className="swc__title">{title}</h3>
        <p className="swc__glaze" aria-live="polite">
          <span key={g.id} className="swc__glaze-name">{g.name}</span>
        </p>
        <p className="swc__detail">{detail}</p>

        <div className="swc__swatches" role="radiogroup" aria-label="Glaze">
          {glazes.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => void (chips.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={x.id === id}
              aria-label={`${x.name}${x.stock === 0 ? ", sold out" : ""}`}
              tabIndex={x.id === id ? 0 : -1}
              className="swc__chip"
              data-sold={x.stock === 0 || undefined}
              style={{ "--c": x.color } as CSSProperties}
              onClick={() => choose(x.id)}
              onKeyDown={(e) => onKey(e, i)}
            />
          ))}
        </div>

        <div className="swc__buy">
          <p className="swc__price">
            <span key={`${g.id}-p`} className="swc__amount">{fmt(g.price, currency)}</span>
            <span className="swc__stock" data-low={(g.stock > 0 && g.stock <= 3) || undefined}>
              {sold ? "Sold out in this glaze" : g.stock <= 3 ? `Only ${g.stock} left` : `${g.stock} in stock`}
            </span>
          </p>
          <button type="button" className="swc__add" data-quiet={sold || undefined} data-added={added || undefined} onClick={() => { setAdded(sold ? "notify" : "bag"); if (!sold) onAdd?.(g.id); }}>
            {added === "bag" ? "Added to bag" : added === "notify" ? "We'll email you" : sold ? "Tell me when it's back" : "Add to bag"}
          </button>
        </div>
      </div>
      </div>
    </article>
  );
}
