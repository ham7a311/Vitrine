"use client";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { answer, done, pair, remaining, start, undo, type RankState } from "./rank";
import "./pairwise-ranker.css";

export type RankItem = { id: string; title: string; detail?: string };
export type PairwiseRankerProps = {
  items: RankItem[];
  question?: string;
  /** Called with ids best-first when the person confirms the finished ranking. */
  onComplete?: (ranked: string[]) => void;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Pairwise Ranker
 * Rank a list by answering "this or that?". Each answer narrows where one item
 * belongs; the ranking builds beside the cards and is yours to adjust at the end.
 */
export function PairwiseRanker({ items, question = "Which matters more?", onComplete, theme = "light", motion = true, className = "" }: PairwiseRankerProps) {
  const id = useId();
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const [state, setState] = useState<RankState>(() => start(items.map((i) => i.id)));
  const [order, setOrder] = useState<string[] | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const rects = useRef(new Map<string, DOMRect>());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduced = useRef(false);
  const primary = useRef<HTMLButtonElement>(null);

  useEffect(() => { reduced.current = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches; }, [motion]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const finished = done(state);
  const list = order ?? state.ranked;
  const current = pair(state);
  const left = remaining(state);
  const asked = state.answers.length;
  const total = asked + left;

  // FLIP: remember where rows were, then animate from there after the list changes.
  const capture = () => { rects.current = new Map([...rows.current].map(([k, el]) => [k, el.getBoundingClientRect()])); };
  useLayoutEffect(() => {
    if (reduced.current || !rects.current.size) return;
    for (const [k, el] of rows.current) {
      const before = rects.current.get(k), now = el.getBoundingClientRect();
      if (!before) { el.animate([{ opacity: 0, transform: "translateX(-12px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" }); continue; }
      const dy = before.top - now.top;
      if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    rects.current = new Map();
  }, [list]);

  const choose = (winner: string) => {
    if (!current || picked) return;
    const apply = () => {
      capture();
      setPicked(null);
      const next = answer(state, winner);
      setState(next);
      if (done(next)) requestAnimationFrame(() => primary.current?.focus());
      if (next.placed) {
        const pos = next.ranked.indexOf(next.placed) + 1;
        setMessage(`${byId.get(next.placed)?.title} placed ${ordinal(pos)} of ${next.ranked.length} so far.${done(next) ? " Ranking complete." : ""}`);
      }
    };
    if (reduced.current) return apply();
    setPicked(winner);
    timer.current = setTimeout(apply, 220);
  };
  const back = () => {
    if (!asked || picked) return;
    capture();
    setOrder(null);
    setConfirmed(false);
    setState((s) => undo(s));
    setMessage("Last answer undone.");
  };
  const shift = (k: string, by: number) => {
    const arr = [...list], i = arr.indexOf(k), j = i + by;
    if (j < 0 || j >= arr.length) return;
    capture();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setOrder(arr);
    setConfirmed(false);
    setMessage(`${byId.get(k)?.title} moved to ${ordinal(j + 1)}.`);
    requestAnimationFrame(() => rows.current.get(k)?.focus());
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if ((e.key === "z" || e.key === "Backspace") && asked) { e.preventDefault(); back(); return; }
    if (!current) return;
    if (e.key === "ArrowLeft" || e.key === "1") { e.preventDefault(); choose(current[0]); }
    else if (e.key === "ArrowRight" || e.key === "2") { e.preventDefault(); choose(current[1]); }
    else if (e.key === "t") { e.preventDefault(); choose("tie"); }
  };

  return (
    <section className={`prank prank--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-labelledby={`${id}-q`}>
      <div className="prank__body">
        <div className="prank__ask" onKeyDown={onKey}>
          <header className="prank__head">
            <h3 id={`${id}-q`} className="prank__q">{finished ? "Your ranking" : question}</h3>
            <p className="prank__count">
              {finished ? `${items.length} items, ${asked} answers` : left <= 1 ? "Last question" : `Question ${asked + 1} · up to ${left - 1} more`}
            </p>
            <div className="prank__meter" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={total || 1} aria-valuenow={asked}>
              <span style={{ width: `${total ? (asked / total) * 100 : 100}%` }} />
            </div>
          </header>

          {current ? (
            <div className="prank__pair" data-picked={picked ? "true" : undefined}>
              {current.map((k, side) => {
                const item = byId.get(k)!;
                return (
                  <button key={side} type="button" className="prank__card" data-state={picked === k ? "won" : picked ? "lost" : undefined} onClick={() => choose(k)} aria-keyshortcuts={side ? "ArrowRight 2" : "ArrowLeft 1"}>
                    <span className="prank__key" aria-hidden="true">{side ? "→" : "←"}</span>
                    {/* Keyed by item so a new question deals a fresh face onto the same button. */}
                    <span key={k} className="prank__face">
                      <span className="prank__title">{item.title}</span>
                      {item.detail && <span className="prank__detail">{item.detail}</span>}
                    </span>
                  </button>
                );
              })}
              <span className="prank__or" aria-hidden="true">or</span>
            </div>
          ) : (
            <div className="prank__done">
              <p>Move anything that feels wrong, then confirm.</p>
              <button ref={primary} type="button" className="prank__primary" onClick={() => { setConfirmed(true); onComplete?.(list); setMessage("Ranking confirmed."); }}>
                {confirmed ? "Confirmed" : "Use this ranking"}
              </button>
            </div>
          )}

          <div className="prank__actions">
            {current && <button type="button" className="prank__ghost" onClick={() => choose("tie")} aria-keyshortcuts="t">About the same</button>}
            <button type="button" className="prank__ghost" onClick={back} disabled={!asked} aria-keyshortcuts="z">Undo</button>
            <button type="button" className="prank__ghost" onClick={() => { capture(); setState(start(items.map((i) => i.id))); setOrder(null); setConfirmed(false); setMessage("Started over."); }} disabled={!asked}>Start over</button>
          </div>
          <p className="prank__keys" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> choose · <kbd>T</kbd> same · <kbd>Z</kbd> undo</p>
        </div>

        <div className="prank__list-wrap">
          <h4 className="prank__list-head">{finished ? "Final order" : "Ranking so far"}</h4>
          <ol className="prank__list">
            {list.map((k, i) => (
              <li
                key={k}
                ref={(el) => { if (el) rows.current.set(k, el); else rows.current.delete(k); }}
                className="prank__row"
                data-new={state.placed === k || undefined}
                tabIndex={finished ? 0 : -1}
                aria-label={`${ordinal(i + 1)}: ${byId.get(k)?.title}`}
                onKeyDown={(e) => { if (finished && e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); shift(k, e.key === "ArrowUp" ? -1 : 1); } }}
              >
                <span className="prank__n" aria-hidden="true">{i + 1}</span>
                <span className="prank__row-title" aria-hidden="true">{byId.get(k)?.title}</span>
                {finished && (
                  <span className="prank__move">
                    <button type="button" tabIndex={-1} aria-label={`Move ${byId.get(k)?.title} up`} disabled={i === 0} onClick={() => shift(k, -1)}>↑</button>
                    <button type="button" tabIndex={-1} aria-label={`Move ${byId.get(k)?.title} down`} disabled={i === list.length - 1} onClick={() => shift(k, 1)}>↓</button>
                  </span>
                )}
              </li>
            ))}
          </ol>
          {!finished && <p className="prank__pending">{state.queue.length + (state.current ? 1 : 0)} still to place</p>}
          {finished && <p className="prank__pending">Alt + ↑/↓ moves the focused item.</p>}
        </div>
      </div>
      <p className="prank__sr" aria-live="polite">{message}</p>
    </section>
  );
}
