"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { cycle, notchSize } from "./notch";
import "./notch-menu.css";

export type NotchLink = { title: string; sub?: string; href: string };

export type NotchMenuProps = {
  links: NotchLink[];
  cta: { label: string; href: string };
  /** Accessible name for the menu. */
  label?: string;
  /** Colour of the glow behind the notch. */
  glow?: string;
  /** Hint under the notch while it's closed. */
  hint?: string;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

/**
 * Notch Menu
 * A dark notch hangs from the top of the page, with a camera lens in it. Point at it and it grows
 * into a panel — the same black, the same curved shoulders — holding a few destinations and a
 * Get started button; leave and it shrinks back.
 */
export function NotchMenu({ links, cta, label = "Menu", glow = "#2f5fd6", hint, onNavigate, className = "" }: NotchMenuProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const notch = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [space, setSpace] = useState(1200);
  const timers = useRef<{ open?: number; close?: number }>({});
  const fine = useRef(true);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    setSpace(el.getBoundingClientRect().width || 1200);
    const ro = new ResizeObserver(([e]) => setSpace(e.contentRect.width));
    ro.observe(el);
    fine.current = matchMedia("(hover: hover) and (pointer: fine)").matches;
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    const outside = (e: PointerEvent) => { if (!notch.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", key); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  useEffect(() => () => { clearTimeout(timers.current.open); clearTimeout(timers.current.close); }, []);

  const enter = () => { clearTimeout(timers.current.close); timers.current.open = window.setTimeout(() => setOpen(true), 90); };
  const leave = () => { clearTimeout(timers.current.open); timers.current.close = window.setTimeout(() => setOpen(false), 220); };

  const size = notchSize(open, space);
  const count = links.length + 1;
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = cycle(i, count, e.key);
    if (n !== i) { e.preventDefault(); items.current[n]?.focus(); }
  };

  return (
    <div ref={root} className={`notch ${open ? "notch--open" : ""} ${className}`} style={{ ["--notch-glow" as string]: glow } as CSSProperties}>
      <div className="notch__glow" aria-hidden="true" />
      <nav aria-label={label} className="notch__nav">
        <div
          ref={notch}
          className="notch__shape"
          style={{ width: size.width }}
          onPointerEnter={(e) => { if (e.pointerType === "mouse") enter(); }}
          onPointerLeave={(e) => { if (e.pointerType === "mouse") leave(); }}
          onBlur={(e) => { if (!notch.current?.contains(e.relatedTarget as Node)) setOpen(false); }}
        >
          <i className="notch__ear notch__ear--l" aria-hidden="true" />
          <i className="notch__ear notch__ear--r" aria-hidden="true" />
          <button
            ref={toggle}
            type="button"
            className="notch__lens-btn"
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            aria-label={open ? `Close ${label.toLowerCase()}` : `Open ${label.toLowerCase()}`}
            onClick={() => setOpen((o) => !o)}
            onKeyDown={(e) => { if (e.key === "ArrowDown" && open) { e.preventDefault(); items.current[0]?.focus(); } }}
          >
            <span className="notch__lens" aria-hidden="true" />
          </button>
          <div id={`${id}-panel`} className="notch__panel" aria-hidden={!open}>
            <div className="notch__inner">
              <ul className="notch__links">
                {links.map((l, i) => (
                  <li key={l.href} style={{ ["--notch-i" as string]: i } as CSSProperties}>
                    <a ref={(n) => { items.current[i] = n; }} href={l.href} tabIndex={open ? 0 : -1} onClick={(e) => onNavigate?.(l.href, e)} onKeyDown={(e) => onKey(e, i)}>
                      <span className="notch__text"><b>{l.title}</b>{l.sub && <small>{l.sub}</small>}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                  </li>
                ))}
              </ul>
              <a ref={(n) => { items.current[links.length] = n; }} className="notch__cta" href={cta.href} tabIndex={open ? 0 : -1} style={{ ["--notch-i" as string]: links.length } as CSSProperties}
                onClick={(e) => onNavigate?.(cta.href, e)} onKeyDown={(e) => onKey(e, links.length)}>{cta.label}</a>
            </div>
          </div>
        </div>
      </nav>
      {hint && <p className="notch__hint" aria-hidden="true">{hint}</p>}
    </div>
  );
}

export default NotchMenu;
