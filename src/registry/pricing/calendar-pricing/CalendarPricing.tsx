"use client";

import { useEffect, useId, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./calendar-pricing.css";

/**
 * Calendar Pricing
 * "Two months free" made literal. Below the price sits the next twelve
 * months as calendar pages, each with what that month costs. Switch to
 * yearly and the last two pages flip over to read Free; the price, the
 * monthly equivalent and the renewal date follow.
 */

export type CalendarPlan = { id: string; name: string; monthly: number; blurb: string; features: string[] };

type Props = {
  plans: CalendarPlan[];
  defaultPlan?: string;
  /** Months free when paying yearly. */
  freeMonths?: number;
  currency?: string;
  onChoose?: (plan: string, billing: "monthly" | "yearly") => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const money = (n: number, c: string) => `${c}${n.toLocaleString("en-US", { maximumFractionDigits: n % 1 ? 2 : 0, minimumFractionDigits: n % 1 ? 2 : 0 })}`;

export function CalendarPricing({ plans, defaultPlan, freeMonths = 2, currency = "$", onChoose, theme = "paper", motion = "full", className = "" }: Props) {
  const uid = useId();
  const [planId, setPlanId] = useState(defaultPlan ?? plans[0].id);
  const [yearly, setYearly] = useState(false);
  const [start, setStart] = useState<Date | null>(null);
  useEffect(() => setStart(new Date()), []);

  const plan = plans.find((p) => p.id === planId) ?? plans[0];
  const total = yearly ? plan.monthly * (12 - freeMonths) : plan.monthly;
  const perMonth = yearly ? total / 12 : plan.monthly;
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date((start ?? new Date(2026, 9, 1)).getFullYear(), (start ?? new Date(2026, 9, 1)).getMonth() + i, 1);
    return { key: i, label: d.toLocaleString("en-US", { month: "short" }), year: d.getFullYear() };
  });
  const renew = start ? new Date(start.getFullYear() + (yearly ? 1 : 0), start.getMonth() + (yearly ? 0 : 1), start.getDate()) : null;
  const renewText = renew?.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const planKey = (e: KeyboardEvent, i: number) => {
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % plans.length : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + plans.length) % plans.length : null;
    if (to === null) return;
    e.preventDefault();
    setPlanId(plans[to].id);
    (e.currentTarget.parentElement?.children[to] as HTMLElement | undefined)?.focus();
  };

  return (
    <section className={`calp calp--${theme} ${className}`} data-yearly={yearly || undefined} data-motion={motion} aria-labelledby={`${uid}-h`}>
      <h2 id={`${uid}-h`} className="calp__sr">Pricing</h2>
      <div className="calp__top">
        <div className="calp__plans" role="radiogroup" aria-label="Plan">
          {plans.map((p, i) => (
            <button key={p.id} type="button" role="radio" aria-checked={p.id === planId} tabIndex={p.id === planId ? 0 : -1} className="calp__plan" onClick={() => setPlanId(p.id)} onKeyDown={(e) => planKey(e, i)}>
              {p.name}
            </button>
          ))}
        </div>
        <button type="button" role="switch" aria-checked={yearly} className="calp__billing" onClick={() => setYearly((y) => !y)}>
          <span className="calp__billing-opt" data-on={!yearly || undefined}>Monthly</span>
          <span className="calp__billing-opt" data-on={yearly || undefined}>Yearly <em>{freeMonths} months free</em></span>
          <span className="calp__sr">Bill yearly</span>
        </button>
      </div>

      <div className="calp__body">
        <div className="calp__price-col">
          <p className="calp__name">{plan.name}</p>
          <p className="calp__price" aria-live="polite">
            <span key={`${planId}-${yearly}`} className="calp__amount">{money(total, currency)}</span>
            <span className="calp__per">{yearly ? "/ year" : "/ month"}</span>
          </p>
          <p className="calp__equiv">
            {yearly ? <>That&rsquo;s {money(Math.round(perMonth * 100) / 100, currency)} a month, paid once.</> : <>Billed every month. Cancel any time.</>}
          </p>
          <p className="calp__blurb">{plan.blurb}</p>
        </div>
        <ul className="calp__features">
          {plan.features.map((f) => (
            <li key={f}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>{f}</li>
          ))}
        </ul>
      </div>

      <div className="calp__calendar">
        <p className="calp__cal-head">
          <span>The next 12 months</span>
          <span>{yearly ? `${12 - freeMonths} paid · ${freeMonths} free` : `12 × ${money(plan.monthly, currency)}`}</span>
        </p>
        <ol className="calp__months" aria-label={yearly ? `Twelve months for ${money(total, currency)}; the last ${freeMonths} are free` : `Twelve months at ${money(plan.monthly, currency)} each`}>
          {months.map((m, i) => {
            const free = yearly && i >= 12 - freeMonths;
            return (
              <li key={m.key} className="calp__month" data-free={free || undefined} style={{ "--i": i - (12 - freeMonths) } as CSSProperties} aria-hidden="true">
                {/* The free page waits underneath; the paid page flips up over the binding to show it. */}
                <span className="calp__page calp__page--under">
                  <span className="calp__m">{m.label}{m.label === "Jan" && i > 0 && <span className="calp__yr"> ’{String(m.year).slice(2)}</span>}</span>
                  <span className="calp__mp">Free</span>
                </span>
                <span className="calp__page calp__page--top">
                  <span className="calp__m">{m.label}{m.label === "Jan" && i > 0 && <span className="calp__yr"> ’{String(m.year).slice(2)}</span>}</span>
                  <span className="calp__mp">{money(plan.monthly, currency)}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="calp__foot">
        <button type="button" className="calp__cta" onClick={() => onChoose?.(plan.id, yearly ? "yearly" : "monthly")}>
          Start {plan.name} {yearly ? "yearly" : "monthly"}
        </button>
        <p className="calp__renew">{renewText ? <>Renews {renewText}{yearly ? ", with a reminder a week before." : "."}</> : " "}</p>
      </div>
    </section>
  );
}
