"use client";
import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { place } from "./peek";
import "./peek-words.css";

export type PeekCard = {
  title: string;
  caption?: string;
  /** An illustration or picture element… */
  picture?: ReactNode;
  /** …or an image URL. */
  src?: string;
  alt?: string;
};

type Ctx = { show: (id: string, el: HTMLElement, card: PeekCard) => void; hide: (id: string, now?: boolean) => void; toggle: (id: string, el: HTMLElement, card: PeekCard) => void; active: string | null; cardId: string; hover: boolean };
const PeekContext = createContext<Ctx | null>(null);

export type PeekTextProps = {
  children: ReactNode;
  theme?: "night" | "paper";
  /** Card width in pixels. */
  width?: number;
  className?: string;
};

/** A block of text whose marked words open a picture card. One card is shared and glides between words. */
export function PeekText({ children, theme = "night", width = 300, className = "" }: PeekTextProps) {
  const root = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardId = useId();
  const [state, setState] = useState<{ id: string; card: PeekCard; el: HTMLElement } | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; side: "above" | "below"; origin: number } | null>(null);
  const [hover, setHover] = useState(true);
  const timers = useRef<{ open?: number; close?: number }>({});
  const stateRef = useRef(state);
  stateRef.current = state;
  // glide between words only when a card was already showing
  const shown = useRef(false);
  const glide = shown.current && Boolean(state);
  useEffect(() => { shown.current = Boolean(state && pos); }, [state, pos]);

  useEffect(() => setHover(matchMedia("(hover: hover) and (pointer: fine)").matches), []);

  const show = useCallback((id: string, el: HTMLElement, card: PeekCard) => {
    clearTimeout(timers.current.close);
    clearTimeout(timers.current.open);
    // a short intent delay for the first card; moving between words is immediate
    timers.current.open = window.setTimeout(() => setState({ id, card, el }), stateRef.current ? 0 : 70);
  }, []);
  const hide = useCallback((id: string, now = false) => {
    clearTimeout(timers.current.open);
    clearTimeout(timers.current.close);
    const go = () => setState((s) => (s && s.id === id ? null : s));
    if (now) go(); else timers.current.close = window.setTimeout(go, 140);
  }, []);
  const toggle = useCallback((id: string, el: HTMLElement, card: PeekCard) => {
    setState((s) => (s && s.id === id ? null : { id, card, el }));
  }, []);
  // measure and place the card against the viewport, then convert to the block's coordinates
  const measure = useCallback(() => {
    const s = stateRef.current, r = root.current, c = cardRef.current;
    if (!s || !r || !c) return;
    const w = s.el.getBoundingClientRect(), b = r.getBoundingClientRect();
    const p = place({ left: w.left, top: w.top, width: w.width, height: w.height }, { width: c.offsetWidth, height: c.offsetHeight }, { width: innerWidth, height: innerHeight });
    setPos({ left: p.left - b.left, top: p.top - b.top, side: p.side, origin: p.origin });
  }, []);
  useLayoutEffect(measure, [state, measure]);
  useEffect(() => {
    if (!state) return;
    const on = () => measure();
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setState(null); };
    const outside = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setState(null); };
    addEventListener("scroll", on, true); addEventListener("resize", on); document.addEventListener("keydown", key); document.addEventListener("pointerdown", outside);
    return () => { removeEventListener("scroll", on, true); removeEventListener("resize", on); document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [state, measure]);
  useEffect(() => () => { clearTimeout(timers.current.open); clearTimeout(timers.current.close); }, []);

  const card = state?.card;
  return (
    <PeekContext.Provider value={{ show, hide, toggle, active: state?.id ?? null, cardId, hover }}>
      <div ref={root} className={`peekw peekw--${theme} ${className}`}>
        {children}
        <div
          ref={cardRef}
          id={cardId}
          role="tooltip"
          className={`peekw__card ${state && pos ? "peekw__card--on" : ""} ${glide ? "peekw__card--glide" : ""} peekw__card--${pos?.side ?? "above"}`}
          style={{ width, left: pos?.left ?? 0, top: pos?.top ?? 0, ["--peekw-origin" as string]: `${pos?.origin ?? width / 2}px` }}
        >
          {card && (
            <div key={state!.id} className="peekw__inner">
              <div className="peekw__pic">
                {card.src ? <img src={card.src} alt={card.alt ?? ""} /> : <span aria-hidden="true">{card.picture}</span>}
              </div>
              <p className="peekw__title">{card.title}</p>
              {card.caption && <p className="peekw__caption">{card.caption}</p>}
            </div>
          )}
        </div>
      </div>
    </PeekContext.Provider>
  );
}

export type PeekProps = PeekCard & { children: ReactNode };

/** A word or phrase that opens its card on hover, focus or tap. */
export function Peek({ children, ...card }: PeekProps) {
  const ctx = useContext(PeekContext);
  const id = useId();
  const el = useRef<HTMLButtonElement>(null);
  if (!ctx) return <>{children}</>;
  const on = ctx.active === id;
  return (
    <button
      ref={el}
      type="button"
      className={`peekw__term ${on ? "peekw__term--on" : ""}`}
      aria-expanded={on}
      aria-describedby={on ? ctx.cardId : undefined}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") ctx.show(id, el.current!, card); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") ctx.hide(id); }}
      onFocus={() => { if (el.current?.matches(":focus-visible")) ctx.show(id, el.current, card); }}
      onBlur={() => ctx.hide(id, true)}
      onClick={() => { if (!ctx.hover) ctx.toggle(id, el.current!, card); }}
    >
      {children}
    </button>
  );
}

export default PeekText;
