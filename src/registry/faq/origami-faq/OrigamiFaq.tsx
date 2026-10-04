"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "./origami-faq.css";

/**
 * Origami FAQ
 * Every answer is a sheet folded in three. Open a question and the sheet
 * unfolds panel by panel along its creases — each fold catching the light
 * as it turns — and folds itself back up when you close it.
 */

export type Fold = { q: string; a: [string, string, string] };
type Props = { items: Fold[]; title?: string; theme?: "paper" | "night"; motion?: "full" | "reduced"; className?: string };

function Item({ item, i, open, onToggle }: { item: Fold; i: number; open: boolean; onToggle: () => void }) {
  const id = useId();
  const sheet = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  const [shut, setShut] = useState(!open); // fully folded and hidden from assistive tech

  // The wrapper grows to the unfolded sheet's natural height (transforms never change layout).
  useLayoutEffect(() => {
    const el = sheet.current;
    if (!el) return;
    const measure = () => setH(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Opening: show the sheet folded for a frame first, so the unfold has somewhere to start from.
  const [unfold, setUnfold] = useState(open);
  useEffect(() => {
    if (open) {
      setShut(false);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setUnfold(true)); });
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }
    setUnfold(false);
    const t = window.setTimeout(() => setShut(true), 760);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <li className="og__item" data-open={unfold || undefined}>
      <h3 className="og__qh">
        <button type="button" className="og__q" aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`} onClick={onToggle}>
          <span className="og__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <span className="og__qt">{item.q}</span>
          <span className="og__mark" aria-hidden="true" />
        </button>
      </h3>
      <div className="og__wrap" style={{ height: unfold ? h : 0 }} id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} hidden={shut && !open} inert={!open}>
        <div ref={sheet} className="og__sheet">
          {/* Three panels, each hinged to the bottom of the one above. */}
          <div className="og__p og__p1">
            <p><span className="og__face">{item.a[0]}</span></p>
            <div className="og__p og__p2">
              <p><span className="og__face">{item.a[1]}</span></p>
              <div className="og__p og__p3">
                <p><span className="og__face">{item.a[2]}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function OrigamiFaq({ items, title = "Questions", theme = "paper", motion = "full", className = "" }: Props) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  return (
    <section className={`og og--${theme} ${className}`} data-motion={motion} aria-label={title}>
      <ul className="og__list">
        {items.map((it, i) => (
          <Item key={it.q} item={it} i={i} open={open.has(i)} onToggle={() => setOpen((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; })} />
        ))}
      </ul>
    </section>
  );
}
