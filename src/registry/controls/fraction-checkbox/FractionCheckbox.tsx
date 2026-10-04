"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./fraction-checkbox.css";

/**
 * Fraction Checkbox
 * A standard tri-state 'select all' (checked / indeterminate / unchecked),
 * but its box is a small gauge: the fill rises to exactly the fraction of
 * children checked, and the tick only appears at 100%. Children are ordinary
 * checkboxes with a drawn tick.
 */

export type Option = { id: string; label: string; meta?: string };

type Props = { title: string; options: Option[]; initial?: string[]; accent?: string; className?: string };

export function FractionCheckbox({ title, options, initial = [], accent = "#b9cce4", className = "" }: Props) {
  const [on, setOn] = useState<Set<string>>(new Set(initial));
  const all = useRef<HTMLInputElement>(null);
  const frac = on.size / options.length;

  useEffect(() => { if (all.current) all.current.indeterminate = frac > 0 && frac < 1; }, [frac]);

  const toggle = (id: string) => setOn((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = () => setOn(frac === 1 ? new Set() : new Set(options.map((o) => o.id)));

  return (
    <fieldset className={`fraction-checkbox ${className}`} style={{ "--fc-accent": accent, "--fc-f": frac } as CSSProperties}>
      <legend className="fraction-checkbox__sr">{title}</legend>
      <label className="fraction-checkbox__all">
        <input ref={all} type="checkbox" checked={frac === 1} onChange={toggleAll} aria-describedby="fc-count" />
        <span className="fraction-checkbox__gauge" aria-hidden="true">
          <span className="fraction-checkbox__level" />
          <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
        </span>
        <span className="fraction-checkbox__title">{title}</span>
        <span id="fc-count" className="fraction-checkbox__count"><span key={on.size}>{on.size}</span> of {options.length}</span>
      </label>
      <ul>
        {options.map((o) => (
          <li key={o.id}>
            <label className="fraction-checkbox__opt">
              <input type="checkbox" checked={on.has(o.id)} onChange={() => toggle(o.id)} />
              <span className="fraction-checkbox__box" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg></span>
              <span>{o.label}</span>
              {o.meta && <span className="fraction-checkbox__meta">{o.meta}</span>}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
