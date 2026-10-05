"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./plain-consent.css";

/**
 * Plain Consent
 * Cookie consent without the tricks. Refusing and accepting are the same size and
 * weight, side by side. Under them is a ledger of exactly what each category
 * stores, for how long and who sets it, with a switch for each optional one.
 * Once you've chosen, the card folds into a small tab, so changing your mind
 * later is one click, not a hunt through a footer.
 */

export type ConsentCategory = {
  id: string;
  name: string;
  /** What it stores and why, in a sentence a person can read. */
  what: string;
  /** "12 months" */
  lasts: string;
  /** Who sets it. */
  by: string;
  /** Essential categories are listed but cannot be switched off. */
  essential?: boolean;
};
export type Choices = Record<string, boolean>;

type Props = {
  categories: ConsentCategory[];
  /** Saved choices live here (localStorage). Omit for no memory. */
  storageKey?: string;
  onChange?: (choices: Choices) => void;
  /** Position inside the nearest positioned ancestor instead of the viewport. */
  contained?: boolean;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

const load = (key?: string): Choices | null => {
  if (!key) return null;
  try { return JSON.parse(localStorage.getItem(key) ?? "null"); } catch { return null; }
};
const save = (key: string | undefined, v: Choices) => { if (key) try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };

export function PlainConsent({ categories, storageKey, onChange, contained = false, theme = "paper", motion = "auto", className = "" }: Props) {
  const uid = useId();
  const optional = categories.filter((c) => !c.essential);
  const base = (on: boolean): Choices => Object.fromEntries(categories.map((c) => [c.id, c.essential ? true : on]));
  const [choices, setChoices] = useState<Choices>(base(false));
  const [decided, setDecided] = useState(false);
  const [ledger, setLedger] = useState(false);
  const [ready, setReady] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  const tab = useRef<HTMLButtonElement>(null);
  const moved = useRef<"tab" | "head" | null>(null);

  // Memory is read after mounting so server and client agree; nothing animates before that.
  useEffect(() => {
    const saved = load(storageKey);
    if (saved) { setChoices({ ...base(false), ...saved }); setDecided(true); }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (moved.current === "tab") tab.current?.focus();
    else if (moved.current === "head") head.current?.focus();
    moved.current = null;
  }, [decided]);

  const decide = (next: Choices) => {
    setChoices(next);
    setDecided(true);
    setLedger(false);
    save(storageKey, next);
    onChange?.(next);
    moved.current = "tab";
  };

  const on = optional.filter((c) => choices[c.id]).length;
  const summary = optional.length === 0 ? "Essential only" : on === 0 ? "Essential only" : on === optional.length ? "All on" : `${on} of ${optional.length} optional on`;

  return (
    <div
      className={`plain-consent plain-consent--${theme}${contained ? " plain-consent--contained" : ""} ${className}`}
      data-decided={decided || undefined}
      data-ready={ready || undefined}
      data-motion={motion === "reduced" ? "reduced" : undefined}
    >
      <section className="plain-consent__card" role="region" aria-label="Cookie choices" aria-hidden={decided || undefined} inert={decided || undefined}>
        <p className="plain-consent__eyebrow">Cookies</p>
        <h2 ref={head} tabIndex={-1} className="plain-consent__title">What this site keeps on your device</h2>
        <p className="plain-consent__lede">Two things it can't work without. {optional.length === 1 ? "One more" : `${["", "", "Two", "Three", "Four", "Five"][optional.length] ?? optional.length} more`} only if you say so.</p>

        <div className="plain-consent__actions">
          <button type="button" onClick={() => decide(base(false))}>Reject non-essential</button>
          <button type="button" onClick={() => decide(base(true))}>Accept all</button>
        </div>

        <button type="button" className="plain-consent__more" aria-expanded={ledger} aria-controls={`${uid}-ledger`} onClick={() => setLedger((v) => !v)}>
          {ledger ? "Hide the details" : "See exactly what each one does"}
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 6.5L8 11l4.5-4.5" /></svg>
        </button>

        <div id={`${uid}-ledger`} className="plain-consent__fold" data-open={ledger || undefined}>
          <div>
            <ul className="plain-consent__ledger">
              {categories.map((c) => (
                <li key={c.id}>
                  <div className="plain-consent__row">
                    <span className="plain-consent__name" id={`${uid}-${c.id}`}>{c.name}</span>
                    {c.essential ? (
                      <span className="plain-consent__always">Always on</span>
                    ) : (
                      <label className="plain-consent__switch">
                        <input type="checkbox" role="switch" checked={!!choices[c.id]} aria-labelledby={`${uid}-${c.id}`} aria-describedby={`${uid}-${c.id}-d`} onChange={(e) => setChoices((v) => ({ ...v, [c.id]: e.target.checked }))} />
                        <span aria-hidden="true" />
                      </label>
                    )}
                  </div>
                  <p id={`${uid}-${c.id}-d`} className="plain-consent__what">{c.what}</p>
                  <dl className="plain-consent__facts">
                    <div><dt>Lasts</dt><dd>{c.lasts}</dd></div>
                    <div><dt>Set by</dt><dd>{c.by}</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
            <div className="plain-consent__actions plain-consent__actions--single">
              <button type="button" onClick={() => decide({ ...base(false), ...Object.fromEntries(optional.map((c) => [c.id, !!choices[c.id]])) })}>Save these choices</button>
            </div>
          </div>
        </div>
      </section>

      <button ref={tab} type="button" className="plain-consent__tab" aria-hidden={!decided || undefined} tabIndex={decided ? 0 : -1} onClick={() => { setDecided(false); moved.current = "head"; }}>
        <i aria-hidden="true" />
        Cookie choices <span>· {summary}</span>
      </button>
    </div>
  );
}
