"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { fills, marks, progress, spy } from "./spy";
import "./chapter-rail.css";

export type RailSection = { id: string; title: string };
export type RailChapter = { id: string; title: string; icon: ReactNode; sections: RailSection[] };

export type ChapterRailProps = {
  name: string;
  version?: string;
  chapters: RailChapter[];
  /** The scrolling element holding the sections (by id). Defaults to the window. */
  scrollRoot?: RefObject<HTMLElement | null>;
  /** How far down the viewport counts as "reading" (0–1). */
  line?: number;
  defaultCollapsed?: boolean;
  theme?: "night" | "paper";
  className?: string;
};

/**
 * Chapter Rail
 * A docs sidebar that knows where you are. The page you're reading lights up and a rail beside the
 * pages fills as you scroll, so each chapter shows how far through it you are; a filter narrows the
 * pages and highlights matches; and the whole thing folds into an icon rail with progress rings.
 */
export function ChapterRail({ name, version, chapters, scrollRoot, line = 0.28, defaultCollapsed = false, theme = "night", className = "" }: ChapterRailProps) {
  const uid = useId();
  const all = useMemo(() => chapters.flatMap((c) => c.sections), [chapters]);
  const [at, setAt] = useState({ index: 0, frac: 0 });
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(chapters.map((c, i) => [c.id, i === 0])));
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const filter = useRef<HTMLInputElement>(null);

  // scroll-spy over the sections' real positions
  useEffect(() => {
    const root = scrollRoot?.current ?? null;
    const target: HTMLElement | Window = root ?? window;
    let raf = 0;
    const read = () => {
      raf = 0;
      const box = root ? root.getBoundingClientRect() : { top: 0, height: window.innerHeight };
      const scroll = root ? root.scrollTop : window.scrollY;
      const tops = all.map((s) => { const el = document.getElementById(s.id); return el ? el.getBoundingClientRect().top - box.top + scroll : Infinity; });
      const end = root ? root.scrollHeight : document.documentElement.scrollHeight;
      const atEnd = scroll + box.height >= end - 2;
      const now = atEnd ? { index: all.length - 1, frac: 1 } : spy(tops, scroll + box.height * line, end);
      setAt((p) => (p.index === now.index && Math.abs(p.frac - now.frac) < 0.01 ? p : now));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    target.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => { cancelAnimationFrame(raf); target.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); };
  }, [all, scrollRoot, line]);

  // follow the reader into the chapter they've reached
  const current = all[at.index]?.id;
  const currentChapter = chapters.find((c) => c.sections.some((s) => s.id === current))?.id;
  useEffect(() => { if (currentChapter) setOpen((o) => (o[currentChapter] ? o : { ...o, [currentChapter]: true })); }, [currentChapter]);

  // "/" focuses the filter
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || (e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]"))) return;
      e.preventDefault(); setCollapsed(false); requestAnimationFrame(() => filter.current?.focus());
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const f = fills(all.length, at);
  const q = query.trim().toLowerCase();
  const go = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  let offset = 0;
  const rows = chapters.map((c) => {
    const start = offset; offset += c.sections.length;
    const mine = f.slice(start, start + c.sections.length);
    const shown = q ? c.sections.filter((s) => s.title.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)) : c.sections;
    return { c, start, mine, shown, done: progress(mine) };
  });
  const any = rows.some((r) => r.shown.length);

  return (
    <nav className={`crail crail--${theme} ${collapsed ? "is-collapsed" : ""} ${className}`} aria-label={`${name} documentation`}>
      <div className="crail__top">
        <span className="crail__brand"><span className="crail__mark" aria-hidden="true">{name.slice(0, 1)}</span><span className="crail__name">{name}</span>{version && <span className="crail__ver">{version}</span>}</span>
        <button type="button" className="crail__fold" aria-expanded={!collapsed} aria-controls={`${uid}-list`} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed((v) => !v)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2.5" width="12" height="11" rx="2.5" /><path d="M6 2.5v11" /></svg>
        </button>
      </div>

      {!collapsed && (
        <label className="crail__filter">
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
          <span className="crail__sr">Filter pages</span>
          <input ref={filter} type="search" value={query} placeholder="Filter pages" onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") setQuery(""); }} />
          <kbd aria-hidden="true">/</kbd>
        </label>
      )}

      <ul id={`${uid}-list`} className="crail__list">
        {rows.map(({ c, start, mine, shown, done }) => {
          if (q && !shown.length) return null;
          const expanded = q ? true : open[c.id];
          const ring = 2 * Math.PI * 9;
          return (
            <li key={c.id} className={`crail__chapter ${c.id === currentChapter ? "is-here" : ""}`}>
              <button type="button" className="crail__head" aria-expanded={collapsed ? undefined : expanded} aria-controls={collapsed ? undefined : `${uid}-${c.id}`} title={collapsed ? `${c.title} · ${Math.round(done * 100)}% read` : undefined}
                aria-label={collapsed ? `${c.title}, ${Math.round(done * 100)}% read` : undefined}
                onClick={() => {
                  if (collapsed) { document.getElementById(c.sections[0].id)?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
                  setOpen((o) => ({ ...o, [c.id]: !expanded }));
                }}>
                <span className="crail__icon" aria-hidden="true">
                  <svg className="crail__ring" viewBox="0 0 22 22"><circle className="crail__ring-track" cx="11" cy="11" r="9" /><circle className="crail__ring-fill" cx="11" cy="11" r="9" style={{ strokeDasharray: ring, strokeDashoffset: ring * (1 - done) } as CSSProperties} /></svg>
                  <span className="crail__glyph">{c.icon}</span>
                </span>
                <span className="crail__chapter-title">{c.title}</span>
                <span className="crail__pct" aria-hidden="true">{done >= 0.999 ? "✓" : done > 0 ? `${Math.round(done * 100)}%` : ""}</span>
                <svg className="crail__chev" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m4 2.5 3.5 3.5L4 9.5" /></svg>
              </button>
              {!collapsed && (
                <div id={`${uid}-${c.id}`} className="crail__pages" data-open={expanded ? "" : undefined}>
                  <ul>
                    {c.sections.map((s, k) => {
                      if (q && !shown.includes(s)) return null;
                      const here = start + k === at.index;
                      return (
                        <li key={s.id} style={{ ["--fill" as string]: mine[k] } as CSSProperties}>
                          <a href={`#${s.id}`} className={here ? "is-here" : mine[k] >= 1 ? "is-read" : ""} aria-current={here ? "location" : undefined} onClick={go(s.id)} tabIndex={expanded ? undefined : -1}>
                            {marks(s.title, query).map((m, i) => (m.hit ? <mark key={i}>{m.text}</mark> : <span key={i}>{m.text}</span>))}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {!any && <p className="crail__none" role="status">No pages match &ldquo;{query}&rdquo;.</p>}
    </nav>
  );
}

export default ChapterRail;
