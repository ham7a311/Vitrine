"use client";
import { useId, useState, type CSSProperties } from "react";
import { bill, money, type Addon, type Plan } from "./bill";
import "./till-receipt.css";

export type TillReceiptProps = {
  shop: string;
  plans: Plan[];
  addons: Addon[];
  /** Share off for paying yearly (0.2 = 20%). */
  annualOff?: number;
  cta?: string;
  onCheckout?: (summary: ReturnType<typeof bill>) => void;
  theme?: "paper" | "night";
  className?: string;
};

/** A figure whose digits roll to their new values. */
function Roll({ value }: { value: string }) {
  return (
    <span className="till__roll" aria-hidden="true">
      {value.split("").map((ch, i) => /\d/.test(ch)
        ? <span key={`${value.length}-${i}`} className="till__digit"><span style={{ ["--d" as string]: Number(ch) } as CSSProperties}>{"0123456789".split("").map((d) => <span key={d}>{d}</span>)}</span></span>
        : <span key={`${value.length}-${i}`} className="till__sym">{ch}</span>)}
    </span>
  );
}

/**
 * Till Receipt
 * Build a plan on the left and the receipt prints on the right: every choice feeds a new line out
 * of the till, totals roll to their new figures, and switching to yearly billing prints a fresh
 * receipt with the saving on it — tear-off edge and all.
 */
export function TillReceipt({ shop, plans, addons, annualOff = 0.2, cta = "Start free trial", onCheckout, theme = "paper", className = "" }: TillReceiptProps) {
  const uid = useId();
  const [plan, setPlan] = useState(plans[Math.min(1, plans.length - 1)].id);
  const [seats, setSeats] = useState(3);
  const [chosen, setChosen] = useState<string[]>([addons[0]?.id].filter(Boolean) as string[]);
  const [annual, setAnnual] = useState(true);
  const sum = bill({ plan, seats, addons: chosen, annual }, plans, addons, annualOff);
  const current = plans.find((p) => p.id === plan)!;
  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <section className={`till till--${theme} ${className}`} aria-labelledby={`${uid}-t`}>
      <div className="till__build">
        <h3 id={`${uid}-t`} className="till__title">Build your plan</h3>
        <fieldset className="till__plans">
          <legend>Plan</legend>
          {plans.map((p) => (
            <label key={p.id} className="till__plan">
              <input type="radio" name={`${uid}-plan`} value={p.id} checked={plan === p.id} onChange={() => setPlan(p.id)} />
              <span className="till__plan-name">{p.name}</span>
              <span className="till__plan-price">{money(p.seat)}<small> / seat</small></span>
              <span className="till__plan-blurb">{p.blurb}</span>
            </label>
          ))}
        </fieldset>

        <div className="till__row">
          <span id={`${uid}-s`} className="till__label">Seats</span>
          <div className="till__stepper" role="group" aria-labelledby={`${uid}-s`}>
            <button type="button" aria-label="One seat fewer" disabled={sum.seats <= current.included} onClick={() => setSeats((s) => Math.max(current.included, s - 1))}>−</button>
            <output aria-live="polite">{sum.seats}</output>
            <button type="button" aria-label="One seat more" disabled={seats >= 50} onClick={() => setSeats((s) => Math.min(50, s + 1))}>+</button>
          </div>
        </div>

        <fieldset className="till__addons">
          <legend>Add-ons</legend>
          {addons.map((a) => (
            <label key={a.id} className="till__addon">
              <input type="checkbox" checked={chosen.includes(a.id)} onChange={() => toggle(a.id)} />
              <span>{a.name}</span>
              <span className="till__addon-price">+{money(a.price)}{a.perSeat ? " / seat" : ""}</span>
            </label>
          ))}
        </fieldset>

        <div className="till__billing" role="radiogroup" aria-label="Billing">
          <button type="button" role="radio" aria-checked={!annual} onClick={() => setAnnual(false)}>Monthly</button>
          <button type="button" role="radio" aria-checked={annual} onClick={() => setAnnual(true)}>Yearly <span>−{Math.round(annualOff * 100)}%</span></button>
        </div>
      </div>

      <div className="till__till">
        <div className="till__slot" aria-hidden="true" />
        <div className="till__feed">
          <div className="till__paper" key={annual ? "y" : "m"} role="region" aria-label="Receipt">
            <p className="till__shop">{shop}</p>
            <p className="till__meta">Quote · {annual ? "billed yearly" : "billed monthly"}</p>
            <hr />
            <ul className="till__lines">
              {sum.lines.map((l, i) => (
                <li key={l.id} style={{ ["--i" as string]: i } as CSSProperties}>
                  <span className="till__item">{l.label}{l.detail && <small>{l.detail}</small>}</span>
                  <span className="till__dots" aria-hidden="true" />
                  <span className="till__amt">{money(l.amount)}</span>
                </li>
              ))}
            </ul>
            <hr />
            <p className="till__sub"><span>Subtotal</span><span>{money(sum.subtotal)}</span></p>
            {sum.discount > 0 && <p className="till__sub till__save"><span>Yearly saving</span><span>{money(-sum.discount)}</span></p>}
            <p className="till__total">
              <span>Total</span>
              <span><Roll value={money(sum.total)} /><span className="till__sr">{money(sum.total)}</span><small> / month</small></span>
            </p>
            {sum.yearly !== null && <p className="till__yearly">{money(sum.yearly)} charged once a year</p>}
            <div className="till__code" aria-hidden="true">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ width: [1, 2, 1, 3, 1, 2, 2, 1][(i * 5 + sum.total) % 8] }} />)}</div>
            <p className="till__thanks">Prices exclude VAT · cancel any time</p>
          </div>
        </div>
        <p className="till__sr" aria-live="polite">{`Total ${money(sum.total)} a month${sum.yearly !== null ? `, ${money(sum.yearly)} a year` : ""}.`}</p>
        <button type="button" className="till__cta" onClick={() => onCheckout?.(sum)}>{cta}</button>
      </div>
    </section>
  );
}

export default TillReceipt;
