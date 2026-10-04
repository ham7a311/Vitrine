"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./lightbox-compare.css";

/**
 * Lightbox Compare
 * A plan comparison laid on a light table. The grid sits dim, like film on
 * glass; point at a plan and a lamp slides beneath its column, bringing it up
 * to full strength and marking what that plan adds over the one before it.
 * Choosing a plan leaves the lamp there. On phones it becomes one plan at a
 * time, with the same "new in this plan" marks.
 */

export type ComparePlan = { id: string; name: string; price: string; note?: string };
export type CompareValue = boolean | string;
export type CompareRow = { feature: string; hint?: string; values: CompareValue[] };
export type CompareGroup = { name: string; rows: CompareRow[] };

type Props = {
  plans: ComparePlan[];
  groups: CompareGroup[];
  defaultPlan?: string;
  onChoose?: (plan: string) => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const Value = ({ v }: { v: CompareValue }) =>
  v === true ? (
    <svg className="lbc__yes" viewBox="0 0 16 16" role="img" aria-label="Included"><path d="M3.5 8.5l3 3 6-7" /></svg>
  ) : v === false ? (
    <span className="lbc__no" role="img" aria-label="Not included">—</span>
  ) : (
    <span className="lbc__val">{v}</span>
  );

/** A feature is new in a plan if that plan has it and the plan before doesn't (or has less). */
const isNew = (row: CompareRow, i: number) => i > 0 && row.values[i] !== false && row.values[i] !== row.values[i - 1];

export function LightboxCompare({ plans, groups, defaultPlan, onChoose, theme = "paper", motion = "full", className = "" }: Props) {
  const [chosen, setChosen] = useState(Math.max(0, plans.findIndex((p) => p.id === defaultPlan)));
  const [hover, setHover] = useState<number | null>(null);
  const lit = hover ?? chosen;
  const table = useRef<HTMLTableElement>(null);
  const [lamp, setLamp] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const t = table.current;
    if (!t) return;
    const measure = () => {
      const th = t.querySelectorAll<HTMLElement>("thead th")[lit + 1];
      if (th) setLamp({ left: th.offsetLeft, width: th.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    return () => ro.disconnect();
  }, [lit]);

  const choose = (i: number) => { setChosen(i); onChoose?.(plans[i].id); };

  const header = (p: ComparePlan): ReactNode => (
    <>
      <span className="lbc__plan-name">{p.name}</span>
      <span className="lbc__plan-price">{p.price}</span>
      {p.note && <span className="lbc__plan-note">{p.note}</span>}
    </>
  );

  return (
    <div className={`lbc lbc--${theme} ${className}`} data-motion={motion}>
      {/* Wide: the light table. */}
      <div className="lbc__wide">
        <table ref={table} className="lbc__table" onPointerLeave={() => setHover(null)}>
          <caption className="lbc__sr">Compare plans. {plans[chosen].name} is selected.</caption>
          <colgroup>
            <col className="lbc__col-feature" />
            {plans.map((p) => <col key={p.id} />)}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="lbc__corner"><span className="lbc__sr">Feature</span></th>
              {plans.map((p, i) => (
                <th key={p.id} scope="col" className="lbc__head" data-lit={lit === i || undefined} onPointerEnter={() => setHover(i)}>
                  {header(p)}
                  <button type="button" className="lbc__choose" aria-pressed={chosen === i} onClick={() => choose(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
                    {chosen === i ? "Selected" : "Choose"}<span className="lbc__sr"> {p.name}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.name}>
              <tr className="lbc__group">
                <th scope="colgroup" colSpan={plans.length + 1}>{g.name}</th>
              </tr>
              {g.rows.map((r) => (
                <tr key={r.feature}>
                  <th scope="row" className="lbc__feature">
                    {r.feature}
                    {r.hint && <span className="lbc__hint">{r.hint}</span>}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} data-lit={lit === i || undefined} data-new={(lit === i && isNew(r, i)) || undefined} onPointerEnter={() => setHover(i)}>
                      <Value v={v} />
                      {lit === i && isNew(r, i) && <span className="lbc__new">New in {plans[i].name}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
        {lamp && <span className="lbc__lamp" aria-hidden="true" style={{ "--l": `${lamp.left}px`, "--w": `${lamp.width}px` } as CSSProperties} />}
      </div>

      {/* Narrow: one plan at a time. */}
      <div className="lbc__narrow">
        <div className="lbc__tabs" role="radiogroup" aria-label="Plan">
          {plans.map((p, i) => (
            <button key={p.id} type="button" role="radio" aria-checked={chosen === i} className="lbc__tab" onClick={() => setChosen(i)}>
              {p.name}
            </button>
          ))}
        </div>
        <div key={chosen} className="lbc__sheet">
          <p className="lbc__sheet-head">{header(plans[chosen])}</p>
          {groups.map((g) => (
            <section key={g.name} className="lbc__sheet-group">
              <h4>{g.name}</h4>
              <ul>
                {g.rows.map((r) => (
                  <li key={r.feature} data-off={r.values[chosen] === false || undefined}>
                    <span className="lbc__sheet-feature">
                      {r.feature}
                      {isNew(r, chosen) && <span className="lbc__new">New in {plans[chosen].name}</span>}
                    </span>
                    <Value v={r.values[chosen]} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <button type="button" className="lbc__cta" onClick={() => choose(chosen)}>Choose {plans[chosen].name}</button>
        </div>
      </div>
    </div>
  );
}
