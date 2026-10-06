"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import "./docket-nav.css";

/**
 * Docket Nav
 * A product navbar that knows where you are. A hairline under the links
 * follows the section in view. When the bar is too narrow for links, they
 * become a "Menu" button that still names the current section, and opens
 * into a numbered docket with that section ticked.
 */

export type DocketLink = { label: string; href: `#${string}` };

type Props = {
  brand: { name: string; href?: string; mark?: ReactNode };
  links: DocketLink[];
  cta?: { label: string; href: string };
  /** Element that scrolls. Defaults to the window. */
  scrollRef?: RefObject<HTMLElement | null>;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

const reducedMotion = (motion: Props["motion"]) =>
  motion === "reduced" || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

export function DocketNav({ brand, links, cta, scrollRef, theme = "paper", motion = "auto", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const docketId = useId();

  // Scrollspy: the active section is the last one whose top has passed a line
  // a third of the way down the viewport, or the last one at the very bottom.
  useEffect(() => {
    const root = scrollRef?.current ?? null;
    const target: HTMLElement | Window = root ?? window;
    const header = ref.current!;
    let raf = 0;
    const read = () => {
      raf = 0;
      const top = root ? root.getBoundingClientRect().top : 0;
      const height = root ? root.clientHeight : window.innerHeight;
      const y = root ? root.scrollTop : window.scrollY;
      const max = root ? root.scrollHeight - root.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      const line = header.offsetHeight + height * 0.33;
      let next = -1;
      links.forEach((l, i) => {
        const el = (root ?? document).querySelector<HTMLElement>(l.href);
        if (el && el.getBoundingClientRect().top - top <= line) next = i;
      });
      if (max > 0 && y >= max - 2) next = links.length - 1;
      setActive(next);
      setScrolled(y > 4);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollRef, links]);

  // The marker is measured, not guessed: it takes the active link's exact box.
  const place = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const a = list.querySelectorAll<HTMLElement>(".docket-nav__link")[active];
    if (!a) return list.style.setProperty("--dn-mw", "0");
    list.style.setProperty("--dn-mx", `${a.offsetLeft}px`);
    list.style.setProperty("--dn-mw", String(a.offsetWidth));
    if (!list.hasAttribute("data-ready")) requestAnimationFrame(() => list.setAttribute("data-ready", ""));
  }, [active]);
  useLayoutEffect(place, [place]);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [place]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuRef.current?.focus();
    };
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    const root = scrollRef?.current ?? null;
    const el = (root ?? document).querySelector<HTMLElement>(href);
    if (!el) return;
    e.preventDefault();
    setOpen(false);
    const offset = (ref.current?.offsetHeight ?? 0) + 8;
    const behavior: ScrollBehavior = reducedMotion(motion) ? "auto" : "smooth";
    if (root) root.scrollTo({ top: el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - offset, behavior });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior });
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  const current = links[active];
  const pad = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <header
      ref={ref}
      className={`docket-nav docket-nav--${theme} ${className}`}
      data-scrolled={scrolled || undefined}
      data-open={open || undefined}
      data-motion={motion === "reduced" ? "reduced" : undefined}
    >
      <div className="docket-nav__bar">
        <a className="docket-nav__brand" href={brand.href ?? "#"} onClick={(e) => { if (!brand.href || brand.href === "#") { e.preventDefault(); (scrollRef?.current ?? window).scrollTo({ top: 0, behavior: reducedMotion(motion) ? "auto" : "smooth" }); } }}>
          {brand.mark && <span className="docket-nav__mark" aria-hidden="true">{brand.mark}</span>}
          <span>{brand.name}</span>
        </a>

        <nav className="docket-nav__links" aria-label="Main">
          <ul ref={listRef}>
            {links.map((l, i) => (
              <li key={l.href}>
                <a className="docket-nav__link" href={l.href} aria-current={i === active ? "location" : undefined} onClick={go(l.href)}>
                  {l.label}
                </a>
              </li>
            ))}
            <li className="docket-nav__marker" aria-hidden="true" />
          </ul>
        </nav>

        {cta && <a className="docket-nav__cta" href={cta.href}>{cta.label}</a>}

        <button
          ref={menuRef}
          type="button"
          className="docket-nav__menu"
          aria-expanded={open}
          aria-controls={docketId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="docket-nav__menu-word">{open ? "Close" : "Menu"}</span>
          {current && (
            <span className="docket-nav__menu-now" key={current.href}>
              <span className="docket-nav__num">{pad(active)}</span> {current.label}
            </span>
          )}
        </button>
      </div>

      <div id={docketId} className="docket-nav__docket">
        <nav aria-label="Main (menu)">
          <ol>
            {links.map((l, i) => (
              <li key={l.href} style={{ "--i": i } as CSSProperties}>
                <a href={l.href} aria-current={i === active ? "location" : undefined} onClick={go(l.href)}>
                  <span className="docket-nav__num">{pad(i)}</span>
                  <span className="docket-nav__label">{l.label}</span>
                  <svg className="docket-nav__tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
                </a>
              </li>
            ))}
          </ol>
          {cta && (
            <a className="docket-nav__cta docket-nav__cta--wide" href={cta.href} style={{ "--i": links.length } as CSSProperties}>
              {cta.label}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
