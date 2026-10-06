"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./gloss-term.css";

/**
 * Gloss Term
 * A term inside running text that explains itself. It carries a dotted underline;
 * hover, focus or a tap opens a small card beside it with the definition, and
 * the card knows where the edges are: it flips above when there's no room below
 * and slides sideways to stay on screen while its notch keeps pointing at the
 * word. Only one is open at a time, and Escape puts it away.
 */

type Props = {
  /** The word or phrase as it appears in the sentence. */
  children: ReactNode;
  /** Name shown at the head of the card. Defaults to the text of the term. */
  title?: string;
  /** The definition: one or two sentences. */
  gloss: ReactNode;
  /** Other names for the same thing. */
  also?: string;
  more?: { label: string; href: string };
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

const GAP = 10;
const MARGIN = 12;
const OPEN_EVENT = "gloss-term:open";

export function GlossTerm({ children, title, gloss, also, more, theme = "paper", motion = "auto", className = "" }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"below" | "above">("below");
  const btn = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>(undefined);
  const hovering = useRef(false);

  const show = useCallback(() => { window.clearTimeout(timer.current); setOpen(true); }, []);
  const hide = useCallback(() => { window.clearTimeout(timer.current); setOpen(false); }, []);
  const later = (fn: () => void, ms: number) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(fn, ms); };

  // Only one gloss at a time.
  useEffect(() => {
    const other = (e: Event) => (e as CustomEvent).detail !== id && setOpen(false);
    window.addEventListener(OPEN_EVENT, other);
    return () => { window.removeEventListener(OPEN_EVENT, other); window.clearTimeout(timer.current); };
  }, [id]);
  useEffect(() => { if (open) window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id })); }, [open, id]);

  const place = useCallback(() => {
    const b = btn.current, c = card.current;
    if (!b || !c) return;
    const t = b.getBoundingClientRect();
    const w = c.offsetWidth, h = c.offsetHeight;
    const vw = document.documentElement.clientWidth, vh = window.innerHeight;
    const below = t.bottom + GAP + h <= vh - MARGIN || t.top - GAP - h < MARGIN;
    const centre = t.left + t.width / 2;
    const left = Math.min(Math.max(centre - w / 2, MARGIN), Math.max(MARGIN, vw - w - MARGIN));
    c.style.left = `${left}px`;
    c.style.top = `${below ? t.bottom + GAP : t.top - GAP - h}px`;
    // The notch stays on the word even when the card has been pushed aside.
    c.style.setProperty("--gt-notch", `${Math.min(Math.max(centre - left, 16), w - 16)}px`);
    setSide(below ? "below" : "above");
  }, []);

  useLayoutEffect(() => { if (open) place(); }, [open, place]);
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; place(); }); };
    window.addEventListener("scroll", on, { passive: true, capture: true });
    window.addEventListener("resize", on);
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { hide(); btn.current?.focus(); } };
    const away = (e: PointerEvent) => { const n = e.target as Node; if (!btn.current?.contains(n) && !card.current?.contains(n)) hide(); };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", away);
    return () => {
      window.removeEventListener("scroll", on, true);
      window.removeEventListener("resize", on);
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", away);
      cancelAnimationFrame(raf);
    };
  }, [open, place, hide]);

  const name = title ?? (typeof children === "string" ? children : "");

  return (
    <span className={`gloss-term gloss-term--${theme} ${className}`} data-open={open || undefined} data-motion={motion === "reduced" ? "reduced" : undefined}>
      <button
        ref={btn}
        type="button"
        className="gloss-term__term"
        aria-expanded={open}
        aria-controls={id}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") { hovering.current = true; later(show, 140); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") { hovering.current = false; later(hide, 140); } }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) show(); }}
        onBlur={(e) => { if (!card.current?.contains(e.relatedTarget as Node)) later(hide, 60); }}
        onClick={() => (open ? hide() : show())}
      >
        {children}
      </button>
      <span
        ref={card}
        id={id}
        role="dialog"
        aria-label={name || "Definition"}
        className="gloss-term__card"
        data-side={side}
        hidden={!open}
        style={{ "--gt-notch": "50%" } as CSSProperties}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") window.clearTimeout(timer.current); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") later(hide, 140); }}
        onBlur={(e) => { if (!card.current?.contains(e.relatedTarget as Node) && e.relatedTarget !== btn.current) later(hide, 60); }}
      >
        {name && <span className="gloss-term__name">{name}</span>}
        <span className="gloss-term__body">{gloss}</span>
        {also && <span className="gloss-term__also">Also: {also}</span>}
        {more && <a className="gloss-term__more" href={more.href}>{more.label}</a>}
      </span>
    </span>
  );
}
