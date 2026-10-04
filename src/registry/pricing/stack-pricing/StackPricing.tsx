"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./stack-pricing.css";

/**
 * Stack Pricing
 * Build your plan and watch it stack up. The base plan is the foundation;
 * every add-on you switch on drops onto the pile as a block whose height is
 * its share of the price, landing with a little give. Switch one off and
 * its block slides out while everything above settles down into the gap.
 * Yearly billing shrinks every block by the discount.
 */

export type Addon = { id: string; name: string; note: string; price: number };
type Props = {
  base: { name: string; note: string; price: number };
  addons: Addon[];
  /** Add-ons switched on at first. */
  initial?: string[];
  /** Yearly discount, e.g. 0.2. */
  yearlyOff?: number;
  currency?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const PX = 7.2; // px of stack per unit of currency (monthly)
const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1));

/** A number that eases to its new value. */
function useTween(value: number, reduced: boolean) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reduced) { setV(value); from.current = value; return; }
    const a = from.current, t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 420);
      const e = 1 - Math.pow(1 - t, 3);
      const x = a + (value - a) * e;
      setV(x);
      from.current = x;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);
  return v;
}

export function StackPricing({ base, addons, initial = [], yearlyOff = 0.2, currency = "OMR", theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId();
  const [on, setOn] = useState<string[]>(initial);
  const [yearly, setYearly] = useState(false);
  const [leaving, setLeaving] = useState<string[]>([]);
  const [reduced, setReduced] = useState(motion === "reduced");
  useEffect(() => { setReduced(motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches); }, [motion]);

  const k = yearly ? 1 - yearlyOff : 1;
  const chosen = addons.filter((a) => on.includes(a.id));
  const monthly = base.price + chosen.reduce((s, a) => s + a.price, 0);
  const total = useTween(monthly * k, reduced);
  const saved = monthly * 12 * yearlyOff;

  const toggle = (a: Addon) => {
    if (on.includes(a.id)) {
      // Slide it out first; then take it off the stack so the blocks above settle.
      setLeaving((l) => [...l, a.id]);
      window.setTimeout(() => {
        setOn((o) => o.filter((x) => x !== a.id));
        setLeaving((l) => l.filter((x) => x !== a.id));
      }, reduced ? 0 : 260);
    } else setOn((o) => [...o, a.id]);
  };

  // The stack, bottom-up: base first, then add-ons in the order they were switched on.
  const order = on.map((x) => addons.find((a) => a.id === x)!).filter(Boolean);
  let y = base.price * PX * k + 3;
  const blocks = order.map((a) => {
    const h = a.price * PX * k;
    const b = { a, bottom: y, h, slot: addons.indexOf(a) };
    y += h + 3;
    return b;
  });
  // Room above the stack for blocks to fall through; the pile clips them until they're in it.
  const stackH = Math.max(y + 88, 180);

  return (
    <section className={`stk stk--${theme} ${className}`} data-motion={motion} aria-labelledby={`${id}-h`}>
      <div className="stk__pick">
        <div className="stk__top">
          <h2 id={`${id}-h`} className="stk__h">Build your plan</h2>
          <div className="stk__bill" role="radiogroup" aria-label="Billing">
            <button type="button" role="radio" aria-checked={!yearly} onClick={() => setYearly(false)}>Monthly</button>
            <button type="button" role="radio" aria-checked={yearly} onClick={() => setYearly(true)}>Yearly <span>−{Math.round(yearlyOff * 100)}%</span></button>
          </div>
        </div>

        <div className="stk__base">
          <span className="stk__sw stk__sw--base" aria-hidden="true" />
          <span className="stk__txt">
            <span className="stk__name">{base.name}</span>
            <span className="stk__note">{base.note}</span>
          </span>
          <span className="stk__price">{currency} {fmt(base.price * k)}</span>
        </div>

        <ul className="stk__list" aria-label="Add-ons">
          {addons.map((a, i) => {
            const checked = on.includes(a.id) && !leaving.includes(a.id);
            return (
              <li key={a.id}>
                <label className="stk__addon" data-on={checked || undefined}>
                  <span className="stk__sw" data-slot={i} aria-hidden="true" />
                  <span className="stk__txt">
                    <span className="stk__name">{a.name}</span>
                    <span className="stk__note">{a.note}</span>
                  </span>
                  <span className="stk__price">+{fmt(a.price * k)}</span>
                  <input type="checkbox" role="switch" className="stk__switch" checked={checked} onChange={() => toggle(a)} aria-label={`${a.name}, ${currency} ${fmt(a.price * k)} a month`} />
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="stk__tower">
        <p className="stk__total" aria-live="polite">
          <span className="stk__cur">{currency}</span>
          <span className="stk__num">{total.toFixed(total % 1 && Math.abs(total - Math.round(total)) > 0.05 ? 1 : 0)}</span>
          <span className="stk__per">/ month</span>
        </p>
        <p className="stk__save">{yearly ? `Billed yearly · you save ${currency} ${fmt(saved)}` : `${currency} ${fmt(monthly * 12 * (1 - yearlyOff))} a year if billed yearly`}</p>

        <div className="stk__pile" style={{ height: stackH }} aria-hidden="true">
          <div className="stk__block stk__block--base" style={{ bottom: 0, height: base.price * PX * k }}>
            <span>{base.name}</span>
          </div>
          {blocks.map((b) => (
            <div
              key={b.a.id}
              className="stk__block"
              data-slot={b.slot}
              data-leaving={leaving.includes(b.a.id) || undefined}
              data-small={b.h < 26 || undefined}
              style={{ bottom: b.bottom, height: b.h }}
            >
              <span>{b.a.name}</span>
              <b>+{fmt(b.a.price * k)}</b>
            </div>
          ))}
        </div>
        <button type="button" className="stk__cta">Start with {1 + chosen.length - leaving.length} {1 + chosen.length - leaving.length === 1 ? "piece" : "pieces"}</button>
      </div>
    </section>
  );
}
