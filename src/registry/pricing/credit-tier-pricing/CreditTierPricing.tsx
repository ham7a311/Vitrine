"use client";

import { useEffect, useId, useState, type CSSProperties, type KeyboardEvent } from "react";
import { flip, per100, price, type Feature, type Period, type Tier } from "./tiers";
import "./credit-tier-pricing.css";

/**
 * Credit Tier Pricing
 * A three-plan pricing section in black glass: a rating pill, a heavy two-line headline, a
 * Month/Year switch whose thumb slides, and three cards whose corners are lit by dot-matrix
 * glows. The middle plan is drenched in colour, and a glowing dome of dots rises under them all.
 */

type Props = {
  badge?: string;
  title?: [string, string];
  tiers?: Tier[];
  features?: Feature[];
  trial?: string;
  cta?: string;
  currency?: string;
  /** Accent colour; drives the badge, switch, featured plan, checks and dome. */
  accent?: string;
  defaultPeriod?: Period;
  onChoose?: (tier: Tier, period: Period) => void;
  className?: string;
  style?: CSSProperties;
};

const TIERS: Tier[] = [
  { id: "basic", name: "Basic", tagline: "Ideal for getting started", monthly: 14, credits: 1000 },
  { id: "studio", name: "Studio", tagline: "Best for solo creators", monthly: 29, credits: 3200, featured: true },
  { id: "team", name: "Team", tagline: "Best for studios and teams", monthly: 190, credits: 22000 },
];

const FEATURES: Feature[] = [
  { label: "3,200 credits every month", accent: true, info: "Unused credits roll over for one month." },
  { label: "Up to 120 3D models monthly", accent: true },
  { label: "Up to 600 AI images monthly", accent: true },
  { label: "5 jobs running at once", info: "Extra jobs wait in line and start automatically." },
  { label: "Standard queue priority" },
  { label: "Private assets you own" },
  { label: "Image studio" },
  { label: "Unlimited texture passes" },
  { label: "Download community models" },
  { label: "Retopology, LODs and every tool" },
];

function Check({ accent }: { accent?: boolean }) {
  return (
    <svg className={`crtp__check${accent ? " crtp__check--accent" : ""}`} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" />
      <path d="m4.8 8.3 2.1 2.1 4.3-4.6" />
    </svg>
  );
}

function Info({ text, id }: { text: string; id: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const esc = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);
  return (
    <span className="crtp__info-wrap" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="crtp__info"
        aria-label="More about this"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
      >
        i
      </button>
      <span role="tooltip" id={id} className="crtp__tip" data-open={open || undefined}>
        {text}
      </span>
    </span>
  );
}

export function CreditTierPricing({
  badge = "Rated 4.9 by 2,000 studios",
  title = ["BUILD 3D WORLDS", "IN MINUTES"],
  tiers = TIERS,
  features = FEATURES,
  trial = "14 days free trial",
  cta = "Get started for free",
  currency = "$",
  accent = "#7b4dff",
  defaultPeriod = "month",
  onChoose,
  className = "",
  style,
}: Props) {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const uid = useId();
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const next = flip(period, e.key);
    if (!next) return;
    e.preventDefault();
    setPeriod(next);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-period="${next}"]`)?.focus();
  };
  return (
    <section className={`crtp ${className}`} style={{ ["--crtp-a" as string]: accent, ...style }} aria-labelledby={`${uid}-h`}>
      <span className="crtp__dome" aria-hidden="true" />
      <p className="crtp__badge">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.8 14.6 8l5.7.8-4.1 4 1 5.7L12 15.8l-5.1 2.7 1-5.7-4.2-4 5.8-.8Z" />
        </svg>
        {badge}
      </p>
      <h2 className="crtp__title" id={`${uid}-h`}>
        <span>{title[0]}</span>
        <span>{title[1]}</span>
      </h2>
      <div className="crtp__switch" role="radiogroup" aria-label="Billing period" data-period={period} onKeyDown={onKey}>
        <span className="crtp__thumb" aria-hidden="true" />
        {(["month", "year"] as const).map((p) => (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={period === p}
            tabIndex={period === p ? 0 : -1}
            data-period={p}
            onClick={() => setPeriod(p)}
          >
            {p === "month" ? "Month" : "Year"}
          </button>
        ))}
      </div>
      <p className="crtp__sr" aria-live="polite">
        {period === "year" ? "Showing yearly billing, prices per month." : "Showing monthly billing."}
      </p>

      <div className="crtp__grid">
        {tiers.map((t, ti) => (
          <article key={t.id} className={`crtp__card${t.featured ? " crtp__card--featured" : ""} crtp__card--${ti % 3}`} aria-label={t.featured ? `${t.name}, most popular` : t.name}>
            <span className="crtp__dots" aria-hidden="true" />
            <h3 className="crtp__name">{t.name}</h3>
            <p className="crtp__tag">{t.tagline}</p>
            <p className="crtp__price">
              <span className="crtp__amount" key={`${t.id}-${period}`}>
                {currency}
                {price(t, period)}
              </span>
              <span className="crtp__per">/month</span>
            </p>
            <p className="crtp__credit">
              {per100(t, period, currency)} / 100 credits{period === "year" ? " · billed yearly" : ""}
            </p>
            <button type="button" className="crtp__cta" onClick={() => onChoose?.(t, period)}>
              {cta}
            </button>
            <ul className="crtp__list">
              {features.map((f, fi) => (
                <li key={f.label} className={f.accent ? "crtp__accent" : undefined}>
                  <Check accent={f.accent} />
                  <span>{f.label}</span>
                  {f.info && <Info text={f.info} id={`${uid}-${ti}-${fi}`} />}
                </li>
              ))}
            </ul>
            <p className="crtp__trial">{trial}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
