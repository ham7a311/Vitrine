"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import "./slide-tabs.css";

/**
 * Slide Tabs
 * Tabs with one shared indicator. When you change tab the indicator doesn't
 * jump — its trailing edge lags behind its leading edge, so it stretches
 * across the gap like elastic and then snaps to size. Arrow keys, Home and End
 * work as in the ARIA tabs pattern.
 */

export type Tab = { id: string; label: string; panel: ReactNode };

export function SlideTabs({ tabs, label = "Sections" }: { tabs: Tab[]; label?: string }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const [box, setBox] = useState<{ l: number; r: number } | null>(null);
  const prev = useRef(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const measure = () => {
    const el = btns.current[active];
    const list = listRef.current;
    if (!el || !list) return;
    const lr = list.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setBox({ l: r.left - lr.left, r: lr.right - r.right });
  };

  useLayoutEffect(measure, [active]);
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const go = (i: number) => {
    setDir(i > prev.current ? 1 : -1);
    prev.current = i;
    setActive(i);
  };

  const onKey = (e: KeyboardEvent) => {
    const n = tabs.length;
    let i = active;
    if (e.key === "ArrowRight") i = (active + 1) % n;
    else if (e.key === "ArrowLeft") i = (active - 1 + n) % n;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    else return;
    e.preventDefault();
    go(i);
    btns.current[i]?.focus();
  };

  return (
    <div className="stabs">
      <div ref={listRef} className="stabs__list" role="tablist" aria-label={label} onKeyDown={onKey}>
        {box && (
          <span
            className="stabs__ink"
            aria-hidden="true"
            style={{
              left: box.l,
              right: box.r,
              // leading edge moves first, trailing edge follows a beat later
              transitionDelay: dir === 1 ? "0ms, 90ms" : "90ms, 0ms",
            }}
          />
        )}
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => void (btns.current[i] = el)}
            role="tab"
            id={`${uid}-t-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${uid}-p-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            className="stabs__tab"
            onClick={() => go(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`${uid}-p-${t.id}`} aria-labelledby={`${uid}-t-${t.id}`} hidden={i !== active} tabIndex={0} className="stabs__panel">
          {t.panel}
        </div>
      ))}
    </div>
  );
}
