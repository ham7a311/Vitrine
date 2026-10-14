"use client";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { answered, judge, release, start, type Card, type Verdict } from "./deck";
import "./deck-faq.css";

export type DeckFaqProps = {
  title?: string;
  cards: Card[];
  /** Where unanswered questions go. */
  support?: { label: string; href: string };
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  theme?: "paper" | "night";
  className?: string;
};

/**
 * Deck FAQ
 * Questions as a deck of cards. Turn the top card over to read its answer, then send it right if it
 * helped or left if it didn't — by dragging, with the arrow keys or the buttons — or skip it to the
 * back of the deck. The last card gathers anything that wasn't answered and points to support.
 */
export function DeckFaq({ title = "Questions, one at a time", cards, support, onNavigate, theme = "paper", className = "" }: DeckFaqProps) {
  const uid = useId();
  const [deck, setDeck] = useState(() => start(cards));
  const [flipped, setFlipped] = useState(false);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [leaving, setLeaving] = useState<{ id: string; v: Verdict } | null>(null);
  const [said, setSaid] = useState("");
  const origin = useRef<{ x: number; y: number } | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const byId = (id: string) => cards.find((c) => c.id === id)!;
  const total = cards.length, done = answered(deck);

  const commit = (v: Verdict) => {
    const id = deck.queue[0];
    if (!id || leaving) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSaid(v === "helpful" ? "Marked as helpful." : v === "unclear" ? "Kept for support." : "Moved to the back.");
    const finish = () => { setDeck((d) => judge(d, v)); setLeaving(null); setFlipped(false); setDrag(null); requestAnimationFrame(() => top.current?.focus()); };
    if (still) { finish(); return; }
    setLeaving({ id, v });
    window.setTimeout(finish, 360);
  };

  const keys = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped((f) => !f); }
    else if (e.key === "ArrowRight") { e.preventDefault(); commit("helpful"); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); commit("unclear"); }
    else if (e.key === "ArrowDown") { e.preventDefault(); commit("skip"); }
  };
  const down = (e: PointerEvent<HTMLDivElement>) => { origin.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent<HTMLDivElement>) => { if (origin.current) setDrag({ x: e.clientX - origin.current.x, y: (e.clientY - origin.current.y) * 0.3 }); };
  const up = () => {
    const d = drag;
    origin.current = null;
    if (!d || Math.hypot(d.x, d.y) < 6) { setDrag(null); setFlipped((f) => !f); return; }
    const v = release(d.x);
    if (v) commit(v); else setDrag(null);
  };

  const shown = deck.queue.slice(0, 3);
  const lean = drag ? Math.max(-1, Math.min(1, drag.x / 140)) : 0;
  return (
    <section className={`dfaq dfaq--${theme} ${className}`} aria-labelledby={`${uid}-t`}>
      <header className="dfaq__head">
        <h3 id={`${uid}-t`} className="dfaq__title">{title}</h3>
        <p className="dfaq__progress"><span>{done} of {total} answered</span><i aria-hidden="true"><b style={{ width: `${(done / total) * 100}%` }} /></i></p>
      </header>

      <div className="dfaq__table">
        {shown.length ? [...shown].reverse().map((id) => {
          const c = byId(id), depth = shown.indexOf(id), isTop = depth === 0;
          const out = leaving?.id === id ? leaving.v : null;
          const style = (isTop && drag && !out
            ? { transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 18}deg)`, transition: "none" }
            : { ["--depth" as string]: depth }) as CSSProperties;
          return (
            <div key={id} ref={isTop ? top : undefined} className="dfaq__card" data-depth={depth} data-out={out ?? undefined} data-flipped={isTop && flipped ? "" : undefined} style={style}
              tabIndex={isTop ? 0 : -1} aria-hidden={isTop ? undefined : true} role={isTop ? "group" : undefined}
              aria-label={isTop ? `Question ${cards.findIndex((k) => k.id === id) + 1} of ${total}: ${c.q}${flipped ? `. Answer: ${c.a}` : ". Press Space to see the answer."}` : undefined}
              onKeyDown={isTop ? keys : undefined} onPointerDown={isTop ? down : undefined} onPointerMove={isTop ? move : undefined} onPointerUp={isTop ? up : undefined} onPointerCancel={isTop ? () => { origin.current = null; setDrag(null); } : undefined}>
              <div className="dfaq__inner">
                <div className="dfaq__side dfaq__side--q">
                  <span className="dfaq__topic">{c.topic}</span>
                  <p className="dfaq__q">{c.q}</p>
                  <span className="dfaq__turn">Tap to turn over</span>
                </div>
                <div className="dfaq__side dfaq__side--a">
                  <span className="dfaq__topic">{c.topic}</span>
                  <p className="dfaq__a">{c.a}</p>
                </div>
              </div>
              {isTop && <span className="dfaq__stamp dfaq__stamp--yes" style={{ opacity: Math.max(0, lean) } as CSSProperties} aria-hidden="true">Helpful</span>}
              {isTop && <span className="dfaq__stamp dfaq__stamp--no" style={{ opacity: Math.max(0, -lean) } as CSSProperties} aria-hidden="true">Not quite</span>}
            </div>
          );
        }) : (
          <div className="dfaq__end">
            <p className="dfaq__end-title">That&rsquo;s the whole deck.</p>
            {deck.unclear.length ? (
              <>
                <p className="dfaq__end-text">{deck.unclear.length === 1 ? "One answer" : `${deck.unclear.length} answers`} didn&rsquo;t quite help:</p>
                <ul>{deck.unclear.map((id) => <li key={id}>{byId(id).q}</li>)}</ul>
                {support && <a className="dfaq__support" href={support.href} onClick={(e) => onNavigate?.(support.href, e)}>{support.label}</a>}
              </>
            ) : <p className="dfaq__end-text">Glad everything was covered.</p>}
            <button type="button" className="dfaq__again" onClick={() => { setDeck(start(cards)); setFlipped(false); }}>Start over</button>
          </div>
        )}
      </div>

      {shown.length > 0 && (
        <div className="dfaq__controls">
          <button type="button" className="dfaq__btn dfaq__btn--no" onClick={() => commit("unclear")}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" /></svg>Not quite</button>
          <button type="button" className="dfaq__btn" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}>{flipped ? "Question" : "Answer"}</button>
          <button type="button" className="dfaq__btn" onClick={() => commit("skip")} disabled={deck.queue.length < 2}>Skip</button>
          <button type="button" className="dfaq__btn dfaq__btn--yes" onClick={() => commit("helpful")}>Helpful<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" /></svg></button>
        </div>
      )}
      <p className="dfaq__sr" aria-live="polite">{said}</p>
      <p className="dfaq__hint" aria-hidden="true">Space turns · ← not quite · → helpful · ↓ skip</p>
    </section>
  );
}

export default DeckFaq;
