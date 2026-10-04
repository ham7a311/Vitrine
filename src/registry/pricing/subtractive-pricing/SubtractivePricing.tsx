"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./subtractive-pricing.css";

/**
 * Subtractive Pricing
 * Every plan shares one list — the full feature set of the top tier. A plan is
 * the same list with some lines struck out. Changing plan animates only the
 * difference: lost lines are struck top-down, regained lines unstrike
 * bottom-up and glow once. The comparison is the motion.
 */

export type Tier = { id: string; name: string; price: number; blurb: string };
export type Feature = { label: string; group: string; /** how many plans down from the top it still appears in (0 = top plan only) */ tier: number };

type Props = { tiers: Tier[]; features: Feature[]; initial?: number; currency?: string; period?: string; accent?: string; className?: string };

function Digits({ value }: { value: string }) {
  return (
    <span className="subtractive-pricing__digits" aria-hidden="true">
      {Array.from(value).map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={`${value.length}-${i}`} className="subtractive-pricing__slot">
            <span style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>
              {"0123456789".split("").map((d) => <span key={d}>{d}</span>)}
            </span>
          </span>
        ) : (
          <span key={`${value.length}-${i}`}>{ch}</span>
        ),
      )}
    </span>
  );
}

export function SubtractivePricing({ tiers, features, initial = 1, currency = "$", period = "/ month", accent = "#b9cce4", className = "" }: Props) {
  const [at, setAt] = useState(initial);
  const prev = useRef(initial);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const tier = tiers[at];
  const top = tiers.length - 1;

  // tiers are listed most generous first; a feature is in plan `at` if it reaches that far down
  const included = (f: Feature) => at <= f.tier;
  const count = features.filter(included).length;
  const lost = features.length - count;

  const pick = (i: number) => { prev.current = at; setAt(i); };
  const onKey = (e: KeyboardEvent) => {
    const j = e.key === "ArrowDown" ? Math.min(top, at + 1) : e.key === "ArrowUp" ? Math.max(0, at - 1) : e.key === "Home" ? 0 : e.key === "End" ? top : -1;
    if (j < 0) return;
    e.preventDefault(); pick(j); btns.current[j]?.focus();
  };

  // stagger: losing runs top-down, regaining runs bottom-up
  const changed = features.map((f, i) => ({ f, i })).filter(({ f }) => (prev.current <= f.tier) !== included(f));
  const order = new Map(changed.map(({ i }, k) => [i, at > prev.current ? k : changed.length - 1 - k]));
  const groups = Array.from(new Set(features.map((f) => f.group)));

  return (
    <section className={`subtractive-pricing ${className}`} style={{ "--sp-accent": accent } as CSSProperties}>
      <div className="subtractive-pricing__layout">
      <div className="subtractive-pricing__plans" role="radiogroup" aria-label="Plan" onKeyDown={onKey}>
        {tiers.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => void (btns.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={i === at}
            tabIndex={i === at ? 0 : -1}
            className="subtractive-pricing__plan"
            onClick={() => pick(i)}
          >
            <span className="subtractive-pricing__plan-name">{t.name}</span>
            <span className="subtractive-pricing__plan-blurb">{t.blurb}</span>
            <span className="subtractive-pricing__plan-price">{t.price ? `${currency}${t.price}` : "Free"}</span>
          </button>
        ))}
      </div>

      <div className="subtractive-pricing__sheet">
        <div className="subtractive-pricing__head">
          <p className="subtractive-pricing__price">
            {tier.price ? <><span className="subtractive-pricing__cur">{currency}</span><Digits value={String(tier.price)} /></> : <span>Free</span>}
            <span className="sr-only">{tier.price ? `${currency}${tier.price} ${period}` : "Free"}</span>
            {tier.price > 0 && <span className="subtractive-pricing__per">{period}</span>}
          </p>
          <p className="subtractive-pricing__tally" aria-live="polite">
            <b>{count}</b> of {features.length} included{lost > 0 && <span> · {lost} left out</span>}
          </p>
        </div>

        {groups.map((g) => (
          <div key={g} className="subtractive-pricing__group">
            <p className="subtractive-pricing__group-name">{g}</p>
            <ul>
              {features.map((f, i) =>
                f.group !== g ? null : (
                  <li key={f.label} data-in={included(f) || undefined} style={{ "--k": order.get(i) ?? 0 } as CSSProperties}>
                    <span className="subtractive-pricing__mark" aria-hidden="true">
                      <svg viewBox="0 0 16 16"><path className="subtractive-pricing__tick" d="M3.5 8.5l3 3 6-7" /><path className="subtractive-pricing__dash" d="M4 8h8" /></svg>
                    </span>
                    <span className="subtractive-pricing__label">
                      {f.label}
                      <span className="sr-only">{included(f) ? " — included" : " — not included"}</span>
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}

        <div className="subtractive-pricing__foot">
          <a href="#" className="subtractive-pricing__cta" onClick={(e) => e.preventDefault()}>
            {tier.price ? `Choose ${tier.name}` : "Start for free"}
          </a>
          <span>Cancel anytime · prices exclude VAT</span>
        </div>
      </div>
      </div>
    </section>
  );
}
