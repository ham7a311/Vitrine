"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import "./masthead-nav.css";

/**
 * Masthead Nav
 * One value, --p (0 at the top of the page → 1 after `range` px of scroll),
 * interpolates the whole header: frame width, height, radius and glass; the
 * wordmark's scale and position; the meta row fading out; the CTA arriving.
 * The header itself is only as tall as the compact bar — the masthead hangs
 * below it over the page's top padding, so the layout never jumps.
 */

export type NavLink = { label: string; href: string };

type Props = {
  name: string;
  links: NavLink[];
  cta?: NavLink;
  meta?: [string, string];
  /** Element that scrolls. Defaults to the window. */
  scrollRef?: RefObject<HTMLElement | null>;
  /** Scroll distance over which the masthead condenses. */
  range?: number;
  accent?: string;
  className?: string;
};

export function MastheadNav({ name, links, cta, meta, scrollRef, range = 110, accent = "#b9cce4", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(links[0]?.href);

  // scale that turns the masthead wordmark into a 1.2rem logo
  useLayoutEffect(() => {
    const el = ref.current!, w = word.current!;
    const fit = () => {
      const big = parseFloat(getComputedStyle(w).fontSize) || 64;
      el.style.setProperty("--ms", String(19 / big));
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current!;
    const root = scrollRef?.current ?? null;
    const target: HTMLElement | Window = root ?? window;
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = root ? root.scrollTop : window.scrollY;
      const p = Math.min(1, Math.max(0, y / range));
      el.style.setProperty("--p", p.toFixed(4));
      el.toggleAttribute("data-compact", p > 0.98);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => { target.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [scrollRef, range]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header ref={ref} className={`masthead-nav ${className}`} data-open={open || undefined} style={{ "--p": 0, "--mn-accent": accent } as CSSProperties}>
      <div className="masthead-nav__frame">
        {meta && (
          <p className="masthead-nav__meta" aria-hidden="true">
            <span>{meta[0]}</span>
            <span><i className="masthead-nav__dot" />{meta[1]}</span>
          </p>
        )}
        <a href={links[0]?.href ?? "#"} className="masthead-nav__word" aria-label={`${name} — home`} onClick={(e) => e.preventDefault()}>
          <span ref={word}>{name}</span>
        </a>
        <nav className="masthead-nav__links" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} aria-current={current === l.href ? "page" : undefined} onClick={(e) => { e.preventDefault(); setCurrent(l.href); }}>
              {l.label}
            </a>
          ))}
        </nav>
        {cta && <a className="masthead-nav__cta" href={cta.href} onClick={(e) => e.preventDefault()}>{cta.label}</a>}
        <button type="button" className="masthead-nav__menu" aria-expanded={open} aria-controls="masthead-nav-sheet" onClick={() => setOpen((o) => !o)}>
          <span className="masthead-nav__menu-label">{open ? "Close" : "Menu"}</span>
          <span className="masthead-nav__burger" aria-hidden="true"><i /><i /></span>
        </button>
      </div>

      <div id="masthead-nav-sheet" className="masthead-nav__sheet" hidden={!open}>
        <nav aria-label="Main (mobile)">
          {links.concat(cta ? [cta] : []).map((l, i) => (
            <a key={l.href} href={l.href} style={{ "--i": i } as CSSProperties} onClick={(e) => { e.preventDefault(); setCurrent(l.href); setOpen(false); }}>
              <span>{String(i + 1).padStart(2, "0")}</span>{l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
