"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import "./folio-pager.css";

/**
 * Folio Pager
 * Pagination set the way a book numbers its leaves. The range you are looking at
 * ("21–40 of 212") is the headline and its numerals roll in the direction you
 * moved; a compressed run of folios sits beside it, and a small field lets you go
 * straight to a page. On a narrow screen the run gives way to "6 of 11".
 */

type Props = {
  total: number;
  pageSize: number;
  /** Controlled page, 1-based. Omit for uncontrolled. */
  page?: number;
  defaultPage?: number;
  onPage?: (page: number) => void;
  /** What is being counted: "projects". */
  noun?: string;
  /** Called after each change with the focus target, so a list can pull focus to its top. */
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

/** The run of folios: first, last, the current page and its neighbours, with gaps marked. */
export function run(page: number, last: number, around = 1): (number | "gap")[] {
  const keep = new Set([1, last]);
  for (let i = page - around; i <= page + around; i++) if (i >= 1 && i <= last) keep.add(i);
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && n - prev === 2) out.push(prev + 1); // a gap of one page is shown, not hidden
    else if (prev !== undefined && n - prev > 2) out.push("gap");
    out.push(n);
  });
  return out;
}

/** A number that rolls to its new value: the old one leaves one way, the new one arrives from the other. */
function Roll({ value }: { value: string }) {
  const [state, setState] = useState({ cur: value, prev: "", dir: 1, tick: 0 });
  useEffect(() => {
    setState((s) => {
      if (s.cur === value) return s;
      const dir = Number(value.replace(/\D/g, "")) >= Number(s.cur.replace(/\D/g, "")) ? 1 : -1;
      return { cur: value, prev: s.cur, dir, tick: s.tick + 1 };
    });
  }, [value]);
  useEffect(() => {
    if (!state.prev) return;
    const t = window.setTimeout(() => setState((s) => ({ ...s, prev: "" })), 360);
    return () => window.clearTimeout(t);
  }, [state.tick, state.prev]);
  return (
    <span className="folio-pager__roll" data-dir={state.dir}>
      <span key={state.tick} className="folio-pager__roll-in" data-moving={state.tick > 0 || undefined}>{state.cur}</span>
      {state.prev && <span key={`o${state.tick}`} className="folio-pager__roll-out" aria-hidden="true">{state.prev}</span>}
    </span>
  );
}

export function FolioPager({ total, pageSize, page: controlled, defaultPage = 1, onPage, noun = "items", theme = "paper", motion = "auto", className = "" }: Props) {
  const uid = useId();
  const last = Math.max(1, Math.ceil(total / pageSize));
  const [inner, setInner] = useState(defaultPage);
  const page = Math.min(last, Math.max(1, controlled ?? inner));
  const [jump, setJump] = useState("");
  const [note, setNote] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const go = (n: number) => {
    const next = Math.min(last, Math.max(1, n));
    if (next === page) return;
    setInner(next);
    onPage?.(next);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = parseInt(jump, 10);
    if (Number.isNaN(n)) return setNote(`Enter a page from 1 to ${last}`);
    setNote(n > last ? `There are ${last} pages; went to the last` : n < 1 ? "Went to the first page" : "");
    go(n);
    setJump("");
  };

  return (
    <nav
      className={`folio-pager folio-pager--${theme} ${className}`}
      aria-label="Pagination"
      data-motion={motion === "reduced" ? "reduced" : undefined}
    >
      <div className="folio-pager__inner">
      <p className="folio-pager__range">
        <Roll value={String(from)} />–<Roll value={String(to)} />
        <span className="folio-pager__of"> of {total.toLocaleString("en-GB")} {noun}</span>
      </p>

      <div className="folio-pager__controls">
        <button type="button" className="folio-pager__step" onClick={() => go(page - 1)} disabled={page === 1} aria-label="Previous page">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5L5.5 8l4.5 4.5" /></svg>
        </button>

        <ol className="folio-pager__run">
          {run(page, last).map((n, i) =>
            n === "gap" ? (
              <li key={`g${i}`} className="folio-pager__gap" aria-hidden="true">…</li>
            ) : (
              <li key={n}>
                <button type="button" onClick={() => go(n)} aria-current={n === page ? "page" : undefined} aria-label={`Page ${n}`}>{n}</button>
              </li>
            ),
          )}
        </ol>
        <p className="folio-pager__compact" aria-hidden="true">{page} of {last}</p>

        <button type="button" className="folio-pager__step" onClick={() => go(page + 1)} disabled={page === last} aria-label="Next page">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" /></svg>
        </button>
      </div>

      <form className="folio-pager__jump" onSubmit={submit} noValidate>
        <label htmlFor={`${uid}-j`}>Go to</label>
        <input ref={input} id={`${uid}-j`} inputMode="numeric" pattern="[0-9]*" autoComplete="off" placeholder={String(last)} value={jump} onChange={(e) => { setJump(e.target.value.replace(/\D/g, "")); setNote(""); }} aria-describedby={`${uid}-s`} />
        <button type="submit" aria-label="Go to that page"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" /></svg></button>
      </form>
      </div>

      <p id={`${uid}-s`} className="folio-pager__sr" role="status">{`Showing ${from} to ${to} of ${total} ${noun}, page ${page} of ${last}. ${note}`}</p>
      {note && <p className="folio-pager__note" aria-hidden="true">{note}</p>}
    </nav>
  );
}
