"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { aiming, type Pt } from "./aim";
import { Schematic, type PreviewKind } from "./previews";
import "./mega-nav.css";

/**
 * Mega Nav
 * One panel, three levels of intent: a top item, a category rail, the links — and a preview column
 * that shows what's behind the link you're pointing at before you commit. The panel is a single
 * surface that changes height between menus and slides its content the way you moved.
 */

export type MegaLink = { id: string; title: string; blurb: string; href: string; tag?: string; preview: { kind: PreviewKind; note: string; finds: string[] } };
export type MegaGroup = { id: string; label: string; links: MegaLink[]; all?: { label: string; href: string } };
export type MegaSection = { id: string; label: string; groups: MegaGroup[]; aside?: { eyebrow: string; title: string; body: string; href: string; cta: string } };

export type MegaNavProps = {
  brand: string;
  brandHref?: string;
  sections: MegaSection[];
  links?: { label: string; href: string }[];
  signIn?: { label: string; href: string };
  primary?: { label: string; href: string };
  theme?: "light" | "dark";
  className?: string;
};

const OPEN_DELAY = 90, CLOSE_GRACE = 260, AIM_WAIT = 180;

const Chevron = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" className="mgnv__chev"><path d="m3 4.75 3 3 3-3" /></svg>
);
const Arrow = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" className="mgnv__arrow"><path d="M2.5 6h7M6.5 3l3 3-3 3" /></svg>
);

export function MegaNav({ brand, brandHref = "#", sections, links = [], signIn, primary, theme = "light", className = "" }: MegaNavProps) {
  const uid = useId();
  const [open, setOpen] = useState<string | null>(null);
  const [dir, setDir] = useState(0);
  const [group, setGroup] = useState<Record<string, string>>(() => Object.fromEntries(sections.map((s) => [s.id, s.groups[0].id])));
  const [peek, setPeek] = useState<string | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [marker, setMarker] = useState<{ x: number; w: number } | null>(null);
  const [sheet, setSheet] = useState(false);
  const [level, setLevel] = useState<string | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const tops = useRef<Record<string, HTMLButtonElement | null>>({});
  const sheetEl = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const timers = useRef<{ open?: number; close?: number; aim?: number; peek?: number }>({});
  const openedAt = useRef(0);
  const last = useRef<Pt | null>(null);
  const over = useRef<string | null>(null);

  const S = sections.find((s) => s.id === open);
  const G = S?.groups.find((g) => g.id === group[S.id]) ?? S?.groups[0];
  const hasRail = !!S && S.groups.length > 1;
  const P = G?.links.find((l) => l.id === peek) ?? G?.links[0];

  const clear = (k: keyof typeof timers.current) => {
    window.clearTimeout(timers.current[k]);
    timers.current[k] = undefined;
  };
  useEffect(() => () => Object.values(timers.current).forEach((t) => window.clearTimeout(t)), []);

  const show = (id: string | null) => {
    setOpen((cur) => {
      if (id && cur && id !== cur) setDir(sections.findIndex((s) => s.id === id) > sections.findIndex((s) => s.id === cur) ? 1 : -1);
      else setDir(0);
      if (id && id !== cur) openedAt.current = performance.now();
      return id;
    });
    setPeek(null);
  };
  const close = (focusTop = false) => {
    const was = open;
    clear("open");
    clear("close");
    show(null);
    if (focusTop && was) tops.current[was]?.focus();
  };

  /* Height follows the content, so the one surface grows and shrinks between menus. */
  useLayoutEffect(() => {
    if (!open || !inner.current) return setHeight(null);
    const el = inner.current;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, G?.id]);

  /* The hairline under the open top item travels between items. */
  useLayoutEffect(() => {
    const b = open ? tops.current[open] : null;
    setMarker(b ? { x: b.offsetLeft + 12, w: b.offsetWidth - 24 } : null);
  }, [open]);

  /* Outside clicks and focus leaving the nav close the panel. */
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => !root.current?.contains(e.target as Node) && close();
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  });

  /* ---------------- pointer intent ---------------- */
  const enterTop = (id: string, e: RPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clear("close");
    clear("open");
    if (open) show(id);
    else timers.current.open = window.setTimeout(() => show(id), OPEN_DELAY);
  };
  const leaveRoot = (e: RPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clear("open");
    clear("close");
    if (open) timers.current.close = window.setTimeout(() => show(null), CLOSE_GRACE);
  };
  const clickTop = (id: string) => {
    clear("open");
    // A click right after hover opened the menu means "yes, this one", not "close it".
    if (open === id && performance.now() - openedAt.current > 400) close();
    else show(id);
  };

  const pickGroup = (id: string) => {
    if (!S) return;
    setGroup((g) => ({ ...g, [S.id]: id }));
    setPeek(null);
  };
  const track = (e: RPointerEvent) => {
    last.current = { x: e.clientX, y: e.clientY };
  };
  const enterRail = (id: string, e: RPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    over.current = id;
    clear("aim");
    const from = last.current;
    const to = { x: e.clientX, y: e.clientY };
    const box = pane.current?.getBoundingClientRect();
    if (from && box && aiming(from, to, box)) {
      // Heading for the links: wait, and only switch if the pointer settled here instead.
      timers.current.aim = window.setTimeout(() => over.current === id && pickGroup(id), AIM_WAIT);
    } else pickGroup(id);
  };
  const hoverLink = (id: string) => {
    clear("peek");
    timers.current.peek = window.setTimeout(() => setPeek(id), 70);
  };

  /* ---------------- keyboard ---------------- */
  const order = sections.map((s) => s.id);
  const focusables = (sel: string) => [...(root.current?.querySelectorAll<HTMLElement>(sel) ?? [])];
  const enterPanel = (id: string) => {
    show(id);
    requestAnimationFrame(() => {
      const s = sections.find((x) => x.id === id)!;
      const first = s.groups.length > 1 ? root.current?.querySelector<HTMLElement>(`[role="tab"][aria-selected="true"]`) : root.current?.querySelector<HTMLElement>(".mgnv__link");
      first?.focus();
    });
  };
  const topKey = (e: KeyboardEvent, id: string) => {
    const i = order.indexOf(id);
    if (e.key === "ArrowDown" || ((e.key === "Enter" || e.key === " ") && open !== id)) {
      e.preventDefault();
      enterPanel(id);
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const to = order[(i + (e.key === "ArrowRight" ? 1 : order.length - 1)) % order.length];
      tops.current[to]?.focus();
      if (open) show(to);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      close(true);
    }
  };
  const railKey = (e: KeyboardEvent) => {
    if (!S) return;
    const tabs = focusables(`[role="tab"]`);
    const k = tabs.indexOf(document.activeElement as HTMLElement);
    let to: number | null = null;
    if (e.key === "ArrowDown") to = (k + 1) % tabs.length;
    else if (e.key === "ArrowUp") to = k <= 0 ? -1 : k - 1;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = tabs.length - 1;
    else if (e.key === "ArrowRight") {
      e.preventDefault();
      pane.current?.querySelector<HTMLElement>(".mgnv__link")?.focus();
      return;
    }
    if (to === null) return;
    e.preventDefault();
    if (to === -1) return open && tops.current[open]?.focus();
    tabs[to].focus();
    pickGroup(S.groups[to].id);
  };
  const linkKey = (e: KeyboardEvent) => {
    const ls = focusables(".mgnv__link");
    const k = ls.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (e.key === "ArrowUp" && k === 0 && !hasRail && open) return tops.current[open]?.focus();
      ls[Math.max(0, Math.min(ls.length - 1, k + (e.key === "ArrowDown" ? 1 : -1)))]?.focus();
    } else if (e.key === "ArrowLeft" && hasRail) {
      e.preventDefault();
      root.current?.querySelector<HTMLElement>(`[role="tab"][aria-selected="true"]`)?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      ls[e.key === "Home" ? 0 : ls.length - 1]?.focus();
    }
  };
  const panelKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    }
  };

  /* ---------------- mobile sheet ---------------- */
  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => sheetEl.current?.querySelector<HTMLElement>("[data-first]")?.focus());
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheet]);
  useEffect(() => {
    if (sheet) requestAnimationFrame(() => sheetEl.current?.querySelector<HTMLElement>(level ? "[data-back]" : `[data-sec="${prevLevel.current}"]`)?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);
  const prevLevel = useRef<string | null>(null);
  const closeSheet = () => {
    setSheet(false);
    setLevel(null);
    menuBtn.current?.focus();
  };
  const sheetKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSheet();
    } else if (e.key === "Tab") {
      const f = [...(sheetEl.current?.querySelectorAll<HTMLElement>("button:not([tabindex='-1']), a:not([tabindex='-1'])") ?? [])].filter((x) => !x.closest("[inert]"));
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z?.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a?.focus(); }
    }
  };
  const L = sections.find((s) => s.id === level);

  return (
    <div
      ref={root}
      className={`mgnv mgnv--${theme} ${className}`}
      data-open={open ? "" : undefined}
      onPointerLeave={leaveRoot}
      onPointerEnter={(e) => e.pointerType === "mouse" && clear("close")}
      onBlur={(e) => !root.current?.contains(e.relatedTarget as Node) && !sheet && open && close()}
    >
      <nav className="mgnv__bar" aria-label={`${brand} site`}>
        <a href={brandHref} className="mgnv__brand">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="mgnv__logo">
            <path d="M3 15.5c3-3 6-3 9 0s6 3 9 0" />
            <path d="M3 10.5c3-3 6-3 9 0s6 3 9 0" />
            <path d="M3 20.5c3-3 6-3 9 0s6 3 9 0" opacity="0.45" />
          </svg>
          {brand}
        </a>

        <ul className="mgnv__tops">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                ref={(el) => {
                  tops.current[s.id] = el;
                }}
                type="button"
                className="mgnv__top"
                aria-expanded={open === s.id}
                aria-controls={`${uid}-panel`}
                onPointerEnter={(e) => enterTop(s.id, e)}
                onClick={() => clickTop(s.id)}
                onKeyDown={(e) => topKey(e, s.id)}
              >
                {s.label}
                <Chevron />
              </button>
            </li>
          ))}
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="mgnv__top" onPointerEnter={(e) => e.pointerType === "mouse" && open && show(null)}>
                {l.label}
              </a>
            </li>
          ))}
          <li aria-hidden="true" className="mgnv__marker" style={marker ? { transform: `translateX(${marker.x}px)`, width: marker.w } : undefined} data-on={marker ? "" : undefined} />
        </ul>

        <div className="mgnv__acts">
          {signIn && <a href={signIn.href} className="mgnv__signin">{signIn.label}</a>}
          {primary && <a href={primary.href} className="mgnv__primary">{primary.label}</a>}
          <button ref={menuBtn} type="button" className="mgnv__menu" aria-expanded={sheet} aria-controls={`${uid}-sheet`} onClick={() => setSheet(true)}>
            Menu
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 5.5h11M2.5 10.5h11" /></svg>
          </button>
        </div>
      </nav>

      {/* ---------------- desktop panel ---------------- */}
      <div
        id={`${uid}-panel`}
        className="mgnv__panel"
        style={{ height: open ? (height ?? undefined) : 0 }}
        inert={!open}
        onPointerMove={track}
        onKeyDown={panelKey}
      >
        {S && G && (
          <div ref={inner} key={S.id} className="mgnv__inner" data-dir={dir || undefined} data-rail={hasRail || undefined}>
            {hasRail && (
              <div className="mgnv__rail" role="tablist" aria-orientation="vertical" aria-label={S.label} onKeyDown={railKey}>
                {S.groups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    role="tab"
                    id={`${uid}-tab-${g.id}`}
                    aria-selected={g.id === G.id}
                    aria-controls={`${uid}-pane`}
                    tabIndex={g.id === G.id ? 0 : -1}
                    className="mgnv__tab"
                    onPointerEnter={(e) => enterRail(g.id, e)}
                    onPointerLeave={() => (over.current = null)}
                    onClick={() => pickGroup(g.id)}
                  >
                    <span>{g.label}</span>
                    <span className="mgnv__count">{g.links.length}</span>
                  </button>
                ))}
              </div>
            )}

            <div
              ref={pane}
              id={`${uid}-pane`}
              className="mgnv__pane"
              role={hasRail ? "tabpanel" : undefined}
              aria-labelledby={hasRail ? `${uid}-tab-${G.id}` : undefined}
              onKeyDown={linkKey}
            >
              <ul key={G.id} className="mgnv__links">
                {G.links.map((l, i) => (
                  <li key={l.id} style={{ ["--i" as string]: i }}>
                    <a
                      href={l.href}
                      className="mgnv__link"
                      data-peek={(!S.aside || hasRail) && P?.id === l.id ? "" : undefined}
                      onPointerEnter={() => hoverLink(l.id)}
                      onFocus={() => {
                        clear("peek");
                        setPeek(l.id);
                      }}
                    >
                      <span className="mgnv__ltitle">
                        {l.title}
                        {l.tag && <em>{l.tag}</em>}
                      </span>
                      <span className="mgnv__lblurb">{l.blurb}</span>
                    </a>
                  </li>
                ))}
              </ul>
              {G.all && (
                <a href={G.all.href} className="mgnv__all mgnv__link">
                  {G.all.label}
                  <Arrow />
                </a>
              )}
            </div>

            {S.aside && !hasRail ? (
              <a href={S.aside.href} className="mgnv__aside">
                <span className="mgnv__eyebrow">{S.aside.eyebrow}</span>
                <span className="mgnv__atitle">{S.aside.title}</span>
                <span className="mgnv__abody">{S.aside.body}</span>
                <span className="mgnv__acta">{S.aside.cta} <Arrow /></span>
              </a>
            ) : (
              P && (
                <aside className="mgnv__peek" aria-live="polite" aria-label="Preview">
                  <div key={P.id} className="mgnv__peekin">
                    <Schematic kind={P.preview.kind} />
                    <p className="mgnv__ptitle">{P.title}</p>
                    <p className="mgnv__pnote">{P.preview.note}</p>
                    <ul className="mgnv__finds">
                      {P.preview.finds.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </aside>
              )
            )}
          </div>
        )}
      </div>
      <div className="mgnv__scrim" aria-hidden="true" onClick={() => close()} />

      {/* ---------------- mobile sheet ---------------- */}
      {sheet && (
        <div ref={sheetEl} id={`${uid}-sheet`} className="mgnv__sheet" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={sheetKey}>
          <div className="mgnv__shead">
            {L ? (
              <button type="button" className="mgnv__back" data-back onClick={() => { prevLevel.current = L.id; setLevel(null); }}>
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2.5 4 6l3.5 3.5" /></svg>
                Menu
              </button>
            ) : (
              <span className="mgnv__brand">{brand}</span>
            )}
            <button type="button" className="mgnv__close" data-first onClick={closeSheet} aria-label="Close menu">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8" /></svg>
            </button>
          </div>

          <div className="mgnv__track" data-level={L ? 1 : 0}>
            <div className="mgnv__lvl" inert={!!L}>
              <ul className="mgnv__secs">
                {sections.map((s) => (
                  <li key={s.id}>
                    <button type="button" data-sec={s.id} onClick={() => setLevel(s.id)}>
                      <span>{s.label}</span>
                      <span className="mgnv__smeta">{s.groups.length > 1 ? s.groups.map((g) => g.label).join(" · ") : `${s.groups[0].links.length} pages`}</span>
                      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 8 6 4.5 9.5" /></svg>
                    </button>
                  </li>
                ))}
                {links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}><span>{l.label}</span></a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mgnv__lvl" inert={!L}>
              {L && (
                <>
                  <h2 className="mgnv__stitle">{L.label}</h2>
                  {L.groups.map((g) => (
                    <section key={g.id} className="mgnv__sgroup" aria-label={g.label}>
                      {L.groups.length > 1 && <h3>{g.label}</h3>}
                      <ul>
                        {g.links.map((l) => (
                          <li key={l.id}>
                            <a href={l.href}>
                              <span className="mgnv__ltitle">{l.title}{l.tag && <em>{l.tag}</em>}</span>
                              <span className="mgnv__lblurb">{l.blurb}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mgnv__sfoot">
            {signIn && <a href={signIn.href} className="mgnv__signin">{signIn.label}</a>}
            {primary && <a href={primary.href} className="mgnv__primary">{primary.label}</a>}
          </div>
        </div>
      )}
    </div>
  );
}
