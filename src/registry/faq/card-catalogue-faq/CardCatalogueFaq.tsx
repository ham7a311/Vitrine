"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import "./card-catalogue-faq.css";

/**
 * Card Catalogue FAQ
 * Questions filed like a library's card catalogue. Each topic is a drawer
 * with a brass label and a count; pull one and its index cards rise out of
 * it, standing edge-up so you read only their headings. Lift a card and it
 * comes up out of the row to show the answer on its ruled face.
 */

export type CatalogueCard = { q: string; a: ReactNode };
export type Drawer = { id: string; label: string; cards: CatalogueCard[] };

type Props = {
  drawers: Drawer[];
  defaultDrawer?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

export function CardCatalogueFaq({ drawers, defaultDrawer, theme = "paper", motion = "full", className = "" }: Props) {
  const uid = useId();
  const [drawer, setDrawer] = useState(defaultDrawer ?? drawers[0].id);
  const [card, setCard] = useState<number | null>(null);
  const [pulls, setPulls] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = drawers.find((d) => d.id === drawer) ?? drawers[0];

  // Deep links: #billing opens a drawer, #billing-2 also lifts its second card.
  useEffect(() => {
    const read = () => {
      const m = window.location.hash.slice(1).match(/^(.+?)(?:-(\d+))?$/);
      const d = m && drawers.find((x) => x.id === m[1]);
      if (!d) return;
      setDrawer(d.id);
      setCard(m![2] ? Number(m![2]) - 1 : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [drawers]);

  const pull = (id: string) => {
    if (id === drawer) return;
    setDrawer(id);
    setCard(null);
    setPulls((p) => p + 1);
  };

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const to = e.key === "ArrowRight" ? (i + 1) % drawers.length : e.key === "ArrowLeft" ? (i - 1 + drawers.length) % drawers.length : e.key === "Home" ? 0 : e.key === "End" ? drawers.length - 1 : null;
    if (to === null) return;
    e.preventDefault();
    pull(drawers[to].id);
    tabs.current[to]?.focus();
  };

  return (
    <div className={`ccf ccf--${theme} ${className}`} data-motion={motion}>
      <div className="ccf__cabinet" role="tablist" aria-label="Topics">
        {drawers.map((d, i) => (
          <button
            key={d.id}
            ref={(el) => void (tabs.current[i] = el)}
            type="button"
            role="tab"
            id={`${uid}-tab-${d.id}`}
            aria-selected={d.id === drawer}
            aria-controls={`${uid}-panel`}
            tabIndex={d.id === drawer ? 0 : -1}
            className="ccf__drawer"
            onClick={() => pull(d.id)}
            onKeyDown={(e) => onTabKey(e, i)}
          >
            <span className="ccf__plate">
              <span className="ccf__label">{d.label}</span>
              <span className="ccf__count">{d.cards.length}</span>
            </span>
            <span className="ccf__handle" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${current.id}`} className="ccf__tray">
        <ol key={`${current.id}-${pulls}`} className="ccf__cards">
          {current.cards.map((c, i) => {
            const open = card === i;
            return (
              <li key={c.q} className="ccf__card" data-open={open || undefined} style={{ "--i": i } as CSSProperties}>
                <h3 className="ccf__h">
                  <button type="button" className="ccf__q" aria-expanded={open} aria-controls={`${uid}-a-${i}`} onClick={() => setCard(open ? null : i)}>
                    <span className="ccf__call" aria-hidden="true">{current.label.slice(0, 3).toUpperCase()} {String(i + 1).padStart(2, "0")}</span>
                    <span className="ccf__qtext">{c.q}</span>
                  </button>
                </h3>
                <div id={`${uid}-a-${i}`} className="ccf__face" inert={!open}>
                  <div className="ccf__face-inner">
                    <div className="ccf__a">{c.a}</div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
