"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import "./fan-deck-card.css";

/**
 * Fan Deck
 * A stack of cards that behaves like a hand of them. Rest, and it's a tidy
 * pile with the top card showing. Reach for it and the cards fan out in an
 * arc so you can see them all; the one you're over lifts. Pick one and it
 * comes up out of the hand and tucks in on top, while the old top card
 * slides to the back. Swipe or use the arrow keys to deal through them.
 */

export type DeckCard = { id: string; title: string; meta: string; blurb: string; art: ReactNode; tint: string };
type Props = { cards: DeckCard[]; label?: string; theme?: "paper" | "night"; motion?: "full" | "reduced"; className?: string };

export function FanDeckCard({ cards, label = "Weekend itineraries", theme = "paper", motion = "full", className = "" }: Props) {
  const [order, setOrder] = useState(cards.map((c) => c.id)); // order[0] is on top
  const [open, setOpen] = useState(false);
  const [over, setOver] = useState<string | null>(null);
  const [lifting, setLifting] = useState<string | null>(null);
  const swipe = useRef<{ x: number; t: number } | null>(null);
  const timers = useRef<number[]>([]);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const n = cards.length;
  const reduced = () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Bring a card to the top: it lifts clear of the hand first, then tucks in. */
  const toTop = (id: string) => {
    if (order[0] === id || lifting) return;
    if (reduced()) { setOrder((o) => [id, ...o.filter((x) => x !== id)]); return; }
    setLifting(id);
    timers.current.push(window.setTimeout(() => setOrder((o) => [id, ...o.filter((x) => x !== id)]), 230));
    timers.current.push(window.setTimeout(() => setLifting(null), 560));
  };
  const deal = (dir: 1 | -1) => toTop(dir === 1 ? order[1] : order[n - 1]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); deal(1); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); deal(-1); }
  };

  return (
    <section
      className={`fd fd--${theme} ${className}`}
      data-motion={motion}
      data-open={open || undefined}
      aria-label={label}
      onPointerEnter={(e) => { if (e.pointerType !== "touch") setOpen(true); }}
      onPointerLeave={() => { setOpen(false); setOver(null); }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
      onKeyDown={onKey}
    >
      <div
        className="fd__hand"
        onPointerDown={(e) => { swipe.current = { x: e.clientX, t: e.timeStamp }; }}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 40 && e.timeStamp - s.t < 600) deal(dx < 0 ? 1 : -1);
        }}
      >
        {cards.map((c) => {
          const i = order.indexOf(c.id);
          // In the fan, cards spread on an arc by their place in the pile; at rest they sit in a loose stack.
          // Top card on the right, deeper cards fanning to the left, so each one's left corner and title show.
          const f = n > 1 ? 0.5 - i / (n - 1) : 0;
          const lift = lifting === c.id;
          const style = {
            ["--i" as string]: i,
            ["--f" as string]: f,
            ["--r" as string]: `${(i % 2 ? -1 : 1) * i * 1.5}deg`,
            zIndex: lift ? 100 : n - i,
          } as CSSProperties;
          const top = i === 0;
          return (
            <button
              key={c.id}
              type="button"
              className="fd__card"
              data-top={top || undefined}
              data-over={over === c.id || undefined}
              data-lift={lift || undefined}
              style={{ ...style, ["--tint" as string]: c.tint }}
              onPointerEnter={() => setOver(c.id)}
              onPointerLeave={() => setOver((o) => (o === c.id ? null : o))}
              onClick={() => toTop(c.id)}
              aria-current={top || undefined}
              aria-label={top ? `${c.title}, ${c.meta}. On top.` : `Bring ${c.title} to the top`}
              tabIndex={top ? 0 : -1}
            >
              <div className="fd__art" aria-hidden="true">{c.art}</div>
              <div className="fd__body">
                <span className="fd__meta">{c.meta}</span>
                <span className="fd__title">{c.title}</span>
                <span className="fd__blurb">{c.blurb}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="fd__ctl">
        <button type="button" onClick={() => deal(-1)} aria-label="Previous card">←</button>
        <span aria-live="polite">{byId.get(order[0])?.title} · {cards.findIndex((c) => c.id === order[0]) + 1} of {n}</span>
        <button type="button" onClick={() => deal(1)} aria-label="Next card">→</button>
      </div>
    </section>
  );
}
