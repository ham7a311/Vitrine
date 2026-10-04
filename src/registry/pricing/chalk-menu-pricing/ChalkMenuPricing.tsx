"use client";

import { useId, useState } from "react";
import "./chalk-menu-pricing.css";

/**
 * Chalk Menu Pricing
 * Plans written up like the board in a good café: names in a loose serif,
 * what's in them underneath, prices at the end of a dotted line. Switch to
 * yearly and a hand strikes through each monthly price in chalk and writes
 * the new one beside it, a little dust falling off the stick. A note in the
 * margin points at the one most people order.
 */

export type MenuPlan = { name: string; blurb: string; monthly: number; yearly: number; items: string[]; pick?: boolean };
type Props = {
  plans: MenuPlan[];
  title?: string;
  subtitle?: string;
  currency?: string;
  theme?: "chalk" | "whiteboard";
  motion?: "full" | "reduced";
  className?: string;
};

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
/** A wobbly hand-drawn line across a price, slightly different for each item. */
const strike = (i: number) => `M2 ${13 + (i % 2)} C 20 ${9 + i}, 46 ${17 - i}, 68 ${11 + (i % 3)} S 92 ${12 - (i % 2)}, 98 ${10 + i}`;

export function ChalkMenuPricing({ plans, title = "Vitrine", subtitle = "Plans · served daily", currency = "OMR", theme = "chalk", motion = "full", className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  const [yearly, setYearly] = useState(false);
  const [round, setRound] = useState(0); // re-keys the writing so it replays each switch

  const set = (y: boolean) => {
    if (y === yearly) return;
    setYearly(y);
    setRound((r) => r + 1);
  };

  return (
    <section className={`cm cm--${theme} ${className}`} data-motion={motion} data-yearly={yearly || undefined} aria-labelledby={`${id}-h`}>
      {/* Chalk: grainy, slightly broken edges on everything written on the board. */}
      <svg className="cm__defs" aria-hidden="true" focusable="false">
        <filter id={`${id}-chalk`} x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={theme === "chalk" ? 2.2 : 0.8} xChannelSelector="R" yChannelSelector="G" result="d" />
          {/* Chalk leaves gaps where the stick skips; a marker doesn't. */}
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="3" result="g" />
          <feColorMatrix in="g" values={theme === "chalk" ? "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 1.2" : "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1"} result="mask" />
          <feComposite in="d" in2="mask" operator="in" />
        </filter>
      </svg>

      <div className="cm__board" style={{ ["--chalk" as string]: `url(#${id}-chalk)` }}>
        <header className="cm__head">
          <h2 id={`${id}-h`} className="cm__title">{title}</h2>
          <p className="cm__sub">{subtitle}</p>
          <div className="cm__bill" role="radiogroup" aria-label="Billing">
            {[false, true].map((y) => (
              <button key={String(y)} type="button" role="radio" aria-checked={yearly === y} className="cm__opt" onClick={() => set(y)}>
                <span>{y ? "Yearly" : "Monthly"}</span>
                {/* The circle drawn round the chosen one */}
                <svg viewBox="0 0 120 44" className="cm__ring" aria-hidden="true" key={`${y}-${round}`}>
                  <path d="M14 26 C 10 8, 64 2, 104 10 C 122 16, 114 38, 66 40 C 26 42, 6 34, 18 18" pathLength={1} />
                </svg>
              </button>
            ))}
          </div>
        </header>

        <ul className="cm__menu">
          {plans.map((p, i) => (
            <li key={p.name} className="cm__item" data-pick={p.pick || undefined}>
              <div className="cm__row">
                <h3 className="cm__name">{p.name}</h3>
                <span className="cm__dots" aria-hidden="true" />
                <span className="cm__prices">
                  <span className="cm__price cm__price--m">
                    <span className="cm__sr">{yearly ? `Was ${currency} ${fmt(p.monthly)} a month; ` : ""}</span>
                    <span aria-hidden={yearly || undefined}>{fmt(p.monthly)}</span>
                    <svg viewBox="0 0 100 24" className="cm__strike" aria-hidden="true" key={`s-${round}`}>
                      <path d={strike(i)} pathLength={1} style={{ animationDelay: `${i * 260}ms` }} />
                    </svg>
                  </span>
                  {yearly && (
                    <span className="cm__price cm__price--y" key={`y-${round}`} style={{ ["--d" as string]: `${i * 260 + 340}ms` }}>
                      <span className="cm__sr">now {currency} {fmt(p.yearly)} a month, billed yearly</span>
                      <span aria-hidden="true">{fmt(p.yearly)}</span>
                      <span className="cm__dust" aria-hidden="true">
                        {[0, 1, 2, 3, 4, 5].map((k) => <i key={k} style={{ ["--k" as string]: k }} />)}
                      </span>
                    </span>
                  )}
                </span>
              </div>
              <p className="cm__blurb">{p.blurb}</p>
              <p className="cm__items">{p.items.join(" · ")}</p>
              <button type="button" className="cm__order">Order {p.name}<span className="cm__sr">, {currency} {fmt(yearly ? p.yearly : p.monthly)} a month</span></button>
              {p.pick && (
                <p className="cm__note" aria-hidden="true">
                  <span>most teams<br />order this</span>
                  <svg viewBox="0 0 70 40"><path d="M66 6 C 46 4, 22 10, 10 30 M10 30 L 9 18 M10 30 L 21 27" /></svg>
                </p>
              )}
            </li>
          ))}
        </ul>
        <p className="cm__foot">Prices in {currency} a month{yearly ? ", billed yearly" : ""} · per workspace · no service charge</p>
      </div>
    </section>
  );
}
