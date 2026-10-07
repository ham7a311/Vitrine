"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { badges, CLEARED, DAYS, DEFAULTS, MAX_KM, matches, parseMoney, seedEvents, type Filters } from "./filter";
import "./filter-step-card.css";

/**
 * Filter Step Card
 * A numbered feature card that shows the feature working: a stack of dark sheets holds a real
 * filter panel (place, price and date tabs with live counts), and below a dashed line and a
 * step number, the title and copy sit over a field of drifting characters lit by a warm glow.
 */

export type FilterTone = { glow: string; badge: string; page: string };

type Props = {
  step?: string;
  title?: ReactNode;
  children?: ReactNode;
  tone?: FilterTone;
  onApply?: (filters: Filters, count: number) => void;
  className?: string;
  style?: CSSProperties;
};

const COPPER: FilterTone = { glow: "#e07a3f", badge: "#ff8a4c", page: "#070b14" };

type Tab = "place" | "price" | "date";
const TABS: { id: Tab; label: string }[] = [
  { id: "place", label: "Place" },
  { id: "price", label: "Price" },
  { id: "date", label: "Date" },
];

function TabIcon({ id }: { id: Tab }) {
  return (
    <svg className="fstc__tab-icon" viewBox="0 0 24 24" aria-hidden="true">
      {id === "place" && <path className="fstc__fill" d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7Zm0 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" />}
      {id === "price" && (
        <>
          <circle className="fstc__fill" cx="12" cy="12" r="9.5" />
          <path className="fstc__cut" d="M14.8 9.1c-.5-.9-1.6-1.4-2.8-1.4-1.6 0-2.8.8-2.8 2.1 0 2.9 5.8 1.5 5.8 4.4 0 1.3-1.3 2.2-3 2.2-1.3 0-2.5-.6-3-1.6M12 6.2v1.5M12 16.6v1.4" />
        </>
      )}
      {id === "date" && (
        <>
          <rect className="fstc__line" x="4" y="5.5" width="16" height="15" rx="2.5" />
          <path className="fstc__line" d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
        </>
      )}
    </svg>
  );
}

// Deterministic glyph rows so server and client render the same field.
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789";
function glyphRows(rows = 11, seed = 13) {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: 5 }, (_, i) => {
      const len = 4 + Math.floor(rnd() * 6);
      return { x: (i * 21 + (r % 2 ? 10 : 0) + rnd() * 4 - 2).toFixed(1), w: Array.from({ length: len }, () => CHARS[Math.floor(rnd() * CHARS.length)]).join("") };
    }),
  );
}

function money(n: number | null) {
  return n == null ? "" : `$${n.toLocaleString("en-US")}`;
}

export function FilterStepCard({
  step = "04",
  title = (
    <>
      <span className="fstc__dim">Filter</span> your search
    </>
  ),
  children = (
    <>
      Adjust distance, <b>price, and</b> category filters to <b>discover items</b> much faster
    </>
  ),
  tone = COPPER,
  onApply,
  className = "",
  style,
}: Props) {
  const events = useMemo(() => seedEvents(), []);
  const [f, setF] = useState<Filters>(DEFAULTS);
  const [tab, setTab] = useState<Tab>("price");
  const [rows, setRows] = useState(() => glyphRows());
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = matches(events, f);
  const b = badges(f);

  // A few characters re-roll every so often, so the field feels alive.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setRows((all) =>
        all.map((row) =>
          row.map((w) => {
            if (Math.random() > 0.06) return w;
            const i = Math.floor(Math.random() * w.w.length);
            return { ...w, w: w.w.slice(0, i) + CHARS[Math.floor(Math.random() * CHARS.length)] + w.w.slice(i + 1) };
          }),
        ),
      );
    }, 160);
    return () => clearInterval(id);
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const next = e.key === "ArrowRight" ? (i + 1) % 3 : e.key === "ArrowLeft" ? (i + 2) % 3 : e.key === "Home" ? 0 : e.key === "End" ? 2 : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const counts = { place: b.place, price: b.price, date: b.date };

  return (
    <article className={`fstc ${className}`} style={{ ["--fstc-glow" as string]: tone.glow, ["--fstc-badge" as string]: tone.badge, ...style }}>
      <span className="fstc__light" aria-hidden="true" />
      <div className="fstc__glyphs" aria-hidden="true">
        {rows.map((row, r) => (
          <div key={r} className="fstc__row" style={{ top: `${44 + r * 5.2}%` }}>
            {row.map((w, i) => (
              <span key={i} style={{ left: `${w.x}%` }}>
                {w.w}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="fstc__sheet fstc__sheet--back" aria-hidden="true" />
      <div className="fstc__sheet fstc__sheet--front">
        <div className="fstc__tabs" role="tablist" aria-label="Filter by" onKeyDown={onTabKey}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`${uid}-panel`}
              tabIndex={tab === t.id ? 0 : -1}
              className="fstc__tab"
              onClick={() => setTab(t.id)}
            >
              <TabIcon id={t.id} />
              <span className="fstc__tab-label">
                {t.label}
                <span className="fstc__count" data-zero={counts[t.id] === 0 || undefined} aria-label={`, ${counts[t.id]} active`}>
                  {counts[t.id]}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="fstc__panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${tab}`}>
          {tab === "price" && (
            <div className="fstc__pair">
              <label className="fstc__field">
                <span>From</span>
                <input inputMode="numeric" value={money(f.from)} placeholder="Any" onChange={(e) => setF({ ...f, from: parseMoney(e.target.value) })} />
              </label>
              <label className="fstc__field">
                <span>To</span>
                <input inputMode="numeric" value={money(f.to)} placeholder="Any" onChange={(e) => setF({ ...f, to: parseMoney(e.target.value) })} />
              </label>
            </div>
          )}
          {tab === "place" && (
            <label className="fstc__field fstc__range">
              <span>
                Within <output>{f.radius >= MAX_KM ? "any distance" : `${f.radius} km`}</output>
              </span>
              <input type="range" min={1} max={MAX_KM} value={f.radius} onChange={(e) => setF({ ...f, radius: Number(e.target.value) })} />
            </label>
          )}
          {tab === "date" && (
            <fieldset className="fstc__days">
              <legend>Days</legend>
              <div>
                {DAYS.map((d, i) => {
                  const on = f.days.includes(i);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      className="fstc__day"
                      onClick={() => setF({ ...f, days: on ? f.days.filter((x) => x !== i) : [...f.days, i].sort() })}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        </div>

        <div className="fstc__actions">
          <button type="button" className="fstc__clear" aria-label="Clear all filters" onClick={() => setF(CLEARED)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <button type="button" className="fstc__apply" onClick={() => onApply?.(f, count)}>
            See <span className="fstc__num">{count}</span> matching events
          </button>
        </div>
        <p className="fstc__sr" aria-live="polite">
          {count} matching events
        </p>
      </div>

      <div className="fstc__divider" aria-hidden="true">
        <span className="fstc__step">{step}</span>
      </div>
      <div className="fstc__copy">
        <h3 className="fstc__title">
          <span className="fstc__sr">Step {step}: </span>
          {title}
        </h3>
        <p className="fstc__text">{children}</p>
      </div>
    </article>
  );
}
