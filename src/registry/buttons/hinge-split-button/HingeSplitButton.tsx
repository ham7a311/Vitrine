"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import "./hinge-split-button.css";

/**
 * Hinge Split Button
 * A main action with its alternatives folded away beneath it. The caret
 * lowers a leaf hinged on the button's bottom edge, like a drop-leaf table;
 * choosing an alternative makes it the main action and the leaf folds back
 * up, so the button always says what it will do.
 */

export type SplitOption = { id: string; label: string; detail?: string; icon?: ReactNode };

type Props = {
  options: SplitOption[];
  /** The option the main button starts with. */
  defaultValue?: string;
  onAction?: (id: string) => void;
  onChange?: (id: string) => void;
  /** Name of the thing being acted on, used in accessible labels ("vitrine-web"). */
  subject?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

export function HingeSplitButton({ options, defaultValue, onAction, onChange, subject, theme = "night", motion = "full", className = "" }: Props) {
  const uid = useId();
  const [value, setValue] = useState(defaultValue ?? options[0].id);
  const [open, setOpen] = useState(false);
  const [turn, setTurn] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const caret = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const current = options.find((o) => o.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const openAt = (i: number) => {
    setOpen(true);
    requestAnimationFrame(() => items.current[i]?.focus());
  };

  const choose = (id: string) => {
    if (id !== value) { setValue(id); setTurn((t) => t + 1); onChange?.(id); }
    setOpen(false);
    caret.current?.focus();
  };

  const onCaretKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openAt(e.key === "ArrowUp" ? options.length - 1 : Math.max(0, options.findIndex((o) => o.id === value)));
    }
  };

  const onMenuKey = (e: KeyboardEvent) => {
    const i = items.current.indexOf(document.activeElement as HTMLButtonElement);
    const to = e.key === "ArrowDown" ? (i + 1) % options.length : e.key === "ArrowUp" ? (i - 1 + options.length) % options.length : e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : null;
    if (to !== null) { e.preventDefault(); items.current[to]?.focus(); return; }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); caret.current?.focus(); }
    if (e.key === "Tab") setOpen(false);
  };

  return (
    <div ref={root} className={`hsb hsb--${theme} ${className}`} data-open={open || undefined} data-motion={motion}>
      <div className="hsb__bar">
        <button type="button" className="hsb__main" onClick={() => onAction?.(current.id)}>
          <span className="hsb__reel" key={turn} data-turned={turn > 0 || undefined}>
            {current.icon && <span className="hsb__icon" aria-hidden="true">{current.icon}</span>}
            {current.label}
          </span>
        </button>
        <span className="hsb__seam" aria-hidden="true" />
        <button
          ref={caret}
          type="button"
          className="hsb__caret"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={`${uid}-menu`}
          aria-label={`More ways to ${subject ? `act on ${subject}` : "do this"}`}
          onClick={() => (open ? setOpen(false) : openAt(Math.max(0, options.findIndex((o) => o.id === value))))}
          onKeyDown={onCaretKey}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6.5l4 4 4-4" /></svg>
        </button>
      </div>

      <div className="hsb__hinge">
        <div id={`${uid}-menu`} role="menu" aria-label="Choose the main action" className="hsb__leaf" onKeyDown={onMenuKey} inert={!open}>
          {options.map((o, i) => (
            <button
              key={o.id}
              ref={(el) => void (items.current[i] = el)}
              type="button"
              role="menuitemradio"
              aria-checked={o.id === value}
              tabIndex={-1}
              className="hsb__item"
              style={{ "--i": i } as CSSProperties}
              onClick={() => choose(o.id)}
            >
              <span className="hsb__check" aria-hidden="true">
                <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
              </span>
              <span className="hsb__text">
                <span className="hsb__label">{o.label}</span>
                {o.detail && <span className="hsb__detail">{o.detail}</span>}
              </span>
            </button>
          ))}
          <span className="hsb__shade" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
