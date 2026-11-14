"use client";

import { useId, useState, type CSSProperties } from "react";
import "./glass-arc-pricing.css";

/**
 * Glass Arc Pricing
 * Three plans as dark glass cards on black, standing in front of one enormous word and a twisting ribbon of
 * blue light. The light rises behind the word, folds into a white streak behind the cards, and falls away
 * below them; through the glass it shows as a soft blur. The plan to choose has a glowing teal rim.
 */

export type ArcPlan = {
  id: string;
  name: string;
  /** Price per month when billed monthly; 0 for a free plan. */
  monthly: number;
  /** Price per month when billed yearly. Defaults to the monthly price. */
  yearly?: number;
  blurb: string;
  features: string[];
  /** The plan to steer people to: it gets the glowing rim. */
  featured?: boolean;
  cta?: string;
};

type Props = {
  plans: ArcPlan[];
  /** The word behind the cards. */
  word?: string;
  /** How a price is written. Defaults to "$12,99". */
  formatPrice?: (amount: number) => string;
  /** How a free plan's price is written, before "/m". Defaults to "$0". */
  zero?: string;
  defaultYearly?: boolean;
  onChoose?: (plan: ArcPlan, billing: "monthly" | "yearly") => void;
  className?: string;
  style?: CSSProperties;
};

const comma = (n: number) => `$${n.toFixed(2).replace(".", ",")}`;
const TICK = <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" /><path d="m6 10.4 2.7 2.6 5.4-5.6" /></svg>;

/** The light, drawn in the reference's own pixel space (735 × 523); the stylesheet scales it with the cards. */
function Light() {
  return (
    <svg className="garc__light" viewBox="0 0 735 600" aria-hidden="true" focusable="false">
      <defs>
        <filter id="garc-b3" filterUnits="userSpaceOnUse" x="-100" y="-100" width="935" height="800"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id="garc-b6" filterUnits="userSpaceOnUse" x="-100" y="-100" width="935" height="800"><feGaussianBlur stdDeviation="6" /></filter>
        <filter id="garc-b11" filterUnits="userSpaceOnUse" x="-100" y="-100" width="935" height="800"><feGaussianBlur stdDeviation="11" /></filter>
        <filter id="garc-b20" filterUnits="userSpaceOnUse" x="-100" y="-100" width="935" height="800"><feGaussianBlur stdDeviation="20" /></filter>
        <radialGradient id="garc-glow">
          <stop offset="0" stopColor="#0a3f9a" />
          <stop offset=".6" stopColor="#05286f" stopOpacity=".7" />
          <stop offset="1" stopColor="#05286f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="garc__sway">
        {/* A dark royal glow behind the right of the word. */}
        <ellipse cx="478" cy="62" rx="112" ry="110" fill="url(#garc-glow)" filter="url(#garc-b20)" />
        {/* The ribbon's upper reach: wide and bright where it rises behind the word, narrowing as it falls. */}
        <path d="M408 98C440 70 548 70 564 112C566 172 526 232 516 302L474 312C466 232 434 160 408 98Z" fill="#0e64b4" filter="url(#garc-b20)" opacity=".95" />
        <path d="M450 108C480 92 528 100 536 130C532 182 512 240 504 300L484 304C482 240 470 170 450 108Z" fill="#3a9fd2" filter="url(#garc-b11)" />
        <path d="M478 112C504 106 520 120 518 142C514 192 504 240 500 296L492 298C492 240 488 170 478 112Z" fill="#a8dcee" filter="url(#garc-b6)" opacity=".95" />
        {/* The fold: a warm white streak running down to the left, behind the cards. */}
        <path d="M506 306C470 326 330 362 228 420" stroke="#d9dacf" strokeWidth="24" fill="none" strokeLinecap="round" filter="url(#garc-b11)" opacity=".4" />
        <path d="M502 309C468 327 330 362 230 418" stroke="#f1f0e4" strokeWidth="5" fill="none" strokeLinecap="round" filter="url(#garc-b3)" />
        {/* The lower reach, falling away below the cards: a bright cyan edge with deep blue to its right. */}
        <path d="M200 440C194 480 192 520 194 600" stroke="#0d3f7a" strokeWidth="30" fill="none" filter="url(#garc-b11)" opacity=".8" />
        <path d="M296 410C294 460 294 520 298 600" stroke="#062a6a" strokeWidth="52" fill="none" filter="url(#garc-b11)" opacity=".9" />
        <path d="M262 404C256 452 256 512 260 600" stroke="#1a8fc6" strokeWidth="64" fill="none" filter="url(#garc-b11)" />
        <path d="M240 410C230 454 228 512 230 600" stroke="#92d0e3" strokeWidth="26" fill="none" strokeLinecap="round" filter="url(#garc-b6)" />
      </g>
    </svg>
  );
}

export function GlassArcPricing({ plans, word = "Pricing", formatPrice = comma, zero = "$0", defaultYearly = true, onChoose, className = "", style }: Props) {
  const [yearly, setYearly] = useState(defaultYearly);
  const id = useId();
  return (
    <section className={`garc ${className}`} style={style} aria-labelledby={`${id}-word`}>
      <div className="garc__stage">
        <Light />
        <div className="garc__grain" aria-hidden="true" />
        <h2 id={`${id}-word`} className="garc__word">{word}</h2>
        <ul className="garc__plans">
          {plans.map((plan) => {
            const price = yearly ? plan.yearly ?? plan.monthly : plan.monthly;
            return (
              <li key={plan.id} className="garc__card" data-featured={plan.featured ? "" : undefined}>
                <h3 className="garc__name">{plan.name}</h3>
                <p className="garc__price">{price === 0 ? zero : formatPrice(price)}/m</p>
                <p className="garc__blurb">{plan.blurb}</p>
                <ul className="garc__list">{plan.features.map((f) => <li key={f}>{TICK}<span>{f}</span></li>)}</ul>
                <button type="button" className="garc__choose" onClick={() => onChoose?.(plan, yearly ? "yearly" : "monthly")} aria-label={`${plan.cta ?? "Choose Plan"}: ${plan.name}`}>{plan.cta ?? "Choose Plan"}</button>
              </li>
            );
          })}
        </ul>
        <div className="garc__billing">
          <button type="button" role="switch" aria-checked={yearly} className="garc__switch" onClick={() => setYearly((y) => !y)} aria-labelledby={`${id}-yearly`}><i /></button>
          <span id={`${id}-yearly`}>Yearly</span>
        </div>
        <p className="garc__said" role="status">{yearly ? "Showing yearly prices, per month" : "Showing monthly prices"}</p>
      </div>
    </section>
  );
}

export default GlassArcPricing;
