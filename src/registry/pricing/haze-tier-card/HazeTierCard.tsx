"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { billingLine, splitPrice } from "./tier";
import "./haze-tier-card.css";

/**
 * Haze Tier Card
 * A single pricing tier in a dark card whose edges glow with a soft, smoky haze: blurred light
 * hugs the border and drifts slowly, leaving the middle dark for the price and the list. A bright
 * highlight runs along the top edge. Info buttons open small tooltips; the pointer pulls the haze
 * a little toward it.
 */

export type HazeFeature = { label: string; info?: string };

export type HazeTone = { glow: string; hi: string; from: string; to: string; ink: string };

type Props = {
  name?: string;
  /** Price per month when billed yearly. */
  price?: number;
  /** Price when billed monthly, for the line under the price. */
  monthly?: number;
  currency?: string;
  features?: HazeFeature[];
  cta?: string;
  href?: string;
  tone?: HazeTone;
  className?: string;
  style?: CSSProperties;
};

const LAVENDER: HazeTone = { glow: "#7a6fc4", hi: "#c3b8f5", from: "#957cf0", to: "#6b4fd6", ink: "#ece8fb" };

const FEATURES: HazeFeature[] = [
  { label: "Everything in Starter" },
  { label: "Unlimited exports, no watermark", info: "Remove the small badge from every page you publish." },
  { label: "Commercial use", info: "Use your work in client and paid projects." },
  { label: "Assistant (300 prompts / mo)", info: "Prompts reset on the first day of each month." },
  { label: "API for automations", info: "Trigger renders and exports from your own scripts." },
  { label: "SVG and Lottie export", info: "Vector files stay crisp at any size." },
  { label: "4K video renders and hosting", info: "Up to ten minutes per render, streamed from our edge." },
  { label: "Custom fonts and 3D models", info: "Upload OTF, WOFF2, GLB and USDZ files." },
  { label: "CDN and image compression", info: "Assets are resized and served close to each visitor." },
  { label: "Version history and backups", info: "Roll back any project to any day in the last 90." },
  { label: "Early access to new features" },
];

export function HazeTierCard({
  name = "Studio",
  price = 18,
  monthly = 24,
  currency = "$",
  features = FEATURES,
  cta,
  href = "#",
  tone = LAVENDER,
  className = "",
  style,
}: Props) {
  const card = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();
  const [whole, cents] = splitPrice(price);

  // The haze leans toward a fine pointer; the CSS eases it with a transition.
  useEffect(() => {
    const el = card.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--hztc-px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty("--hztc-py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    const leave = () => {
      el.style.setProperty("--hztc-px", "0");
      el.style.setProperty("--hztc-py", "0");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  useEffect(() => {
    if (open == null) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <article
      ref={card}
      className={`hztc ${className}`}
      aria-label={`${name} plan`}
      style={{
        ["--hztc-glow" as string]: tone.glow,
        ["--hztc-hi" as string]: tone.hi,
        ["--hztc-from" as string]: tone.from,
        ["--hztc-to" as string]: tone.to,
        ["--hztc-ink" as string]: tone.ink,
        ...style,
      }}
    >
      <div className="hztc__haze" aria-hidden="true">
        <span className="hztc__puff hztc__puff--1" />
        <span className="hztc__puff hztc__puff--2" />
        <span className="hztc__puff hztc__puff--3" />
        <span className="hztc__puff hztc__puff--4" />
        <span className="hztc__puff hztc__puff--5" />
        <span className="hztc__puff hztc__puff--6" />
        <span className="hztc__puff hztc__puff--7" />
        <span className="hztc__hole" />
      </div>
      <div className="hztc__edge" aria-hidden="true" />

      <div className="hztc__body">
        <h3 className="hztc__name">{name}</h3>
        <p className="hztc__price">
          <span className="hztc__cur">{currency}</span>
          <span className="hztc__amt">
            {whole}
            {cents && <small>{cents}</small>}
          </span>
          <span className="hztc__per">/mo</span>
        </p>
        <p className="hztc__bill">{billingLine(monthly, currency)}</p>

        <ul className="hztc__list">
          {features.map((f, i) => {
            const tip = `${uid}-tip-${i}`;
            return (
              <li key={f.label} className="hztc__item">
                <svg className="hztc__check" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="8" />
                  <path d="M4.6 8.3 7 10.6l4.4-4.9" />
                </svg>
                <span>{f.label}</span>
                {f.info && (
                  <span className="hztc__info-wrap" onMouseLeave={() => setOpen((o) => (o === i ? null : o))}>
                    <button
                      type="button"
                      className="hztc__info"
                      aria-label={`About ${f.label}`}
                      aria-describedby={open === i ? tip : undefined}
                      aria-expanded={open === i}
                      onMouseEnter={() => setOpen(i)}
                      onFocus={() => setOpen(i)}
                      onBlur={() => setOpen((o) => (o === i ? null : o))}
                      onClick={() => setOpen(i)}
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="7.25" />
                        <path d="M8 7.2v4" />
                        <circle cx="8" cy="4.9" r="0.9" className="hztc__dot" />
                      </svg>
                    </button>
                    <span id={tip} role="tooltip" className="hztc__tip" data-open={open === i || undefined}>
                      {f.info}
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <a className="hztc__cta" href={href}>
          {cta ?? `Start with ${name}`}
        </a>
      </div>
    </article>
  );
}
