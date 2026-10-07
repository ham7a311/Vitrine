"use client";

import { useId, useState, type CSSProperties } from "react";
import { saveLabel, shown, type Plan } from "./prices";
import "./glow-base-pricing.css";

/**
 * Glow Base Pricing
 * A three-plan pricing section on black: each card is a dark panel whose base glows in its own
 * colour, so the button sits in a pool of light, with a hairline rim tinted to match. A small
 * switch flips between monthly and yearly billing.
 */

type Props = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  plans?: Plan[];
  currency?: string;
  defaultYearly?: boolean;
  onChoose?: (plan: Plan, yearly: boolean) => void;
  className?: string;
  style?: CSSProperties;
};

export const SUNSET: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    blurb: "For solo builders and early ideas finding their first users.",
    monthly: 19,
    features: ["Up to 3 projects", "5 GB storage", "Core analytics dashboard", "Email and chat support", "API access (1,000 calls/mo)"],
    cta: "Get started",
    glow: "#ff6a1f",
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "For growing teams that need more room, speed and teamwork.",
    monthly: 49,
    features: ["Unlimited projects", "50 GB storage", "Advanced analytics and reports", "Team collaboration (up to 10)", "Priority support (24h reply)", "API access (50,000 calls/mo)"],
    cta: "Start free trial",
    glow: "#d62ee0",
  },
  {
    id: "scale",
    name: "Scale",
    blurb: "For organisations that need enterprise-grade control.",
    monthly: 129,
    features: ["Everything in Pro", "500 GB storage", "Custom roles and permissions", "Unlimited team members", "A dedicated account manager", "API access (unlimited)", "SSO and audit logs"],
    cta: "Talk to sales",
    glow: "#1f7bff",
  },
];

export function GlowBasePricing({
  eyebrow = "PRICING",
  title = "Plans that grow with your team",
  intro = "Start free, scale when ready. No hidden fees, no surprise bills — just the tools you need to build, ship and grow.",
  plans = SUNSET,
  currency = "$",
  defaultYearly = false,
  onChoose,
  className = "",
  style,
}: Props) {
  const [yearly, setYearly] = useState(defaultYearly);
  const id = useId();
  return (
    <section className={`gbpr ${className}`} style={style} aria-labelledby={`${id}-t`}>
      <p className="gbpr__eyebrow">{eyebrow}</p>
      <h2 className="gbpr__title" id={`${id}-t`}>
        {title}
      </h2>
      <p className="gbpr__intro">{intro}</p>
      <div className="gbpr__billing">
        <span id={`${id}-m`} className={yearly ? undefined : "gbpr__on"} aria-hidden="true">
          Monthly
        </span>
        <button type="button" role="switch" aria-checked={yearly} aria-label="Yearly billing" className="gbpr__switch" onClick={() => setYearly((v) => !v)}>
          <span className="gbpr__knob" />
        </button>
        <span className={yearly ? "gbpr__on" : undefined} aria-hidden="true">
          Yearly
        </span>
        <span className="gbpr__save">{saveLabel()}</span>
      </div>
      <p className="gbpr__sr" aria-live="polite">
        {yearly ? "Showing yearly prices, per month." : "Showing monthly prices."}
      </p>

      <div className="gbpr__grid">
        {plans.map((p) => (
          <article key={p.id} className="gbpr__card" style={{ ["--gbpr-c" as string]: p.glow }}>
            <h3 className="gbpr__name">{p.name}</h3>
            <p className="gbpr__blurb">{p.blurb}</p>
            <p className="gbpr__price">
              <span className="gbpr__amount" key={String(yearly)}>
                {currency}
                {shown(p.monthly, yearly)}
              </span>
              <span className="gbpr__per">/ mo</span>
            </p>
            <ul className="gbpr__list">
              {p.features.map((f) => (
                <li key={f}>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m3 8.4 3.2 3.1L13 4.6" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button type="button" className="gbpr__cta" onClick={() => onChoose?.(p, yearly)}>
              {p.cta}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
