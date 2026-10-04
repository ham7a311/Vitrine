"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import "./glass-tab-bar.css";

/**
 * Glass Tab Bar
 * The bar is frosted glass over the content. The selection is a second, clearer
 * piece of glass — a droplet — riding inside it. Moving between tabs, the
 * droplet's leading edge goes first and its trailing edge follows, so it
 * stretches like a drop of water, then it settles and the icon under it swells
 * as if seen through a lens. A separate round glass button sits beside the bar.
 */

export type GlassTab = { id: string; label: string; icon: ReactNode };

type Props = { tabs: GlassTab[]; value?: string; onChange?: (id: string) => void; side?: ReactNode; className?: string };

export function GlassTabBar({ tabs, value, onChange, side, className = "" }: Props) {
  const [active, setActive] = useState(value ?? tabs[0].id);
  const [box, setBox] = useState<{ l: number; w: number } | null>(null);
  const [dir, setDir] = useState(1);
  const bar = useRef<HTMLDivElement>(null);
  const btns = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => {
    const measure = () => {
      const b = btns.current[active], p = bar.current;
      if (!b || !p) return;
      setBox({ l: b.offsetLeft, w: b.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (bar.current) ro.observe(bar.current);
    return () => ro.disconnect();
  }, [active]);

  const pick = (id: string) => {
    const ids = tabs.map((t) => t.id);
    setDir(ids.indexOf(id) > ids.indexOf(active) ? 1 : -1);
    setActive(id);
    onChange?.(id);
  };
  const onKey = (e: KeyboardEvent) => {
    const ids = tabs.map((t) => t.id), i = ids.indexOf(active);
    const j = e.key === "ArrowRight" ? (i + 1) % ids.length : e.key === "ArrowLeft" ? (i - 1 + ids.length) % ids.length : -1;
    if (j < 0) return;
    e.preventDefault();
    pick(ids[j]);
    btns.current[ids[j]]?.focus();
  };

  const style = {
    "--gt-l": `${box?.l ?? 0}px`,
    "--gt-w": `${box?.w ?? 0}px`,
    "--gt-lead": dir > 0 ? "0ms" : "90ms",
    "--gt-trail": dir > 0 ? "90ms" : "0ms",
  } as CSSProperties;

  return (
    <div className={`glass-tab-bar ${className}`}>
      <div ref={bar} className="glass-tab-bar__bar" role="tablist" aria-label="Sections" style={style} onKeyDown={onKey}>
        {box && <span className="glass-tab-bar__drop" aria-hidden="true" />}
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => void (btns.current[t.id] = el)}
            type="button"
            role="tab"
            aria-selected={t.id === active}
            tabIndex={t.id === active ? 0 : -1}
            className="glass-tab-bar__tab"
            onClick={() => pick(t.id)}
          >
            <span className="glass-tab-bar__icon" aria-hidden="true">{t.icon}</span>
            <span className="glass-tab-bar__label">{t.label}</span>
          </button>
        ))}
      </div>
      {side && <div className="glass-tab-bar__side">{side}</div>}
    </div>
  );
}
