"use client";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { current, scrollFor, search, ticks, view, type Turn } from "./map";
import "./thread-map.css";

export type ThreadMapProps = {
  title: string;
  turns: Turn[];
  /** Names for the two sides. */
  names?: { user: string; assistant: string };
  theme?: "paper" | "night";
  className?: string;
};

type Geom = { tops: number[]; heights: number[]; total: number; clientH: number };

function lit(text: string, q: string): ReactNode {
  const s = q.trim();
  if (!s) return text;
  const parts = text.split(new RegExp(`(${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p));
}

/**
 * Thread Map
 * A long conversation with a map of itself down the side: one tick per turn, sized from the real
 * message and coloured by who spoke, with marks where there's code or a tool was used. The window
 * on the map shows where you are — drag it or click anywhere on the map to jump — search lights up
 * the matching turns, and J and K step from turn to turn.
 */
export function ThreadMap({ title, turns, names = { user: "You", assistant: "Assistant" }, theme = "paper", className = "" }: ThreadMapProps) {
  const uid = useId();
  const thread = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [geom, setGeom] = useState<Geom>({ tops: [], heights: [], total: 0, clientH: 0 });
  const [top, setTop] = useState(0);
  const [railH, setRailH] = useState(400);
  const [q, setQ] = useState("");
  const [hit, setHit] = useState(0);
  const dragging = useRef(false);

  const measure = useCallback(() => {
    const el = thread.current;
    if (!el) return;
    const base = el.getBoundingClientRect().top - el.scrollTop;
    setGeom({
      tops: items.current.map((n) => (n ? n.getBoundingClientRect().top - base : 0)),
      heights: items.current.map((n) => (n ? n.offsetHeight : 0)),
      total: el.scrollHeight, clientH: el.clientHeight,
    });
    if (rail.current) setRailH(rail.current.clientHeight);
  }, []);

  useLayoutEffect(() => {
    const el = thread.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [measure, turns]);

  const matches = search(turns, q);
  const at = current(geom.tops, top, geom.clientH);
  const tk = ticks(geom.tops, geom.heights, geom.total, railH);
  const win = view(top, geom.clientH, geom.total, railH);

  const goTo = (i: number) => {
    const el = thread.current, t = geom.tops[i];
    if (!el || t === undefined) return;
    el.scrollTo({ top: Math.max(0, t - 12), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const railTo = (clientY: number) => {
    const r = rail.current!.getBoundingClientRect(), el = thread.current!;
    el.scrollTop = scrollFor(clientY - r.top, railH, geom.clientH, geom.total);
  };
  useEffect(() => { if (matches.length) goTo(matches[Math.min(hit, matches.length - 1)]); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [q, hit]);

  const keys = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === "j") { e.preventDefault(); goTo(Math.min(turns.length - 1, at + 1)); }
    if (e.key === "k") { e.preventDefault(); goTo(Math.max(0, at - 1)); }
  };
  const step = (d: 1 | -1) => setHit((h) => (matches.length ? (h + d + matches.length) % matches.length : 0));

  return (
    <section className={`tmap tmap--${theme} ${className}`} aria-labelledby={`${uid}-t`} onKeyDown={keys}>
      <header className="tmap__head">
        <h3 id={`${uid}-t`} className="tmap__title">{title}</h3>
        <div className="tmap__find">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
          <input type="search" value={q} placeholder="Search this chat" aria-label="Search this chat"
            onChange={(e) => { setQ(e.target.value); setHit(0); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); step(e.shiftKey ? -1 : 1); } if (e.key === "Escape") setQ(""); }} />
          {q.trim() && <span className="tmap__count" role="status">{matches.length ? `${Math.min(hit, matches.length - 1) + 1} of ${matches.length}` : "No matches"}</span>}
          {matches.length > 1 && (
            <>
              <button type="button" aria-label="Previous match" onClick={() => step(-1)}><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 7.5 3-3 3 3" /></svg></button>
              <button type="button" aria-label="Next match" onClick={() => step(1)}><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg></button>
            </>
          )}
        </div>
      </header>

      <div className="tmap__frame">
        <div ref={thread} className="tmap__thread" tabIndex={0} role="log" aria-label={`${title}. Press J and K to move between messages.`}
          onScroll={(e) => setTop(e.currentTarget.scrollTop)}>
          <div className="tmap__turns">
            {turns.map((t, i) => (
              <article key={t.id} ref={(n) => { items.current[i] = n; }} className={`tmap__turn tmap__turn--${t.role}`} data-current={i === at ? "" : undefined} data-hit={matches.includes(i) ? "" : undefined} aria-label={`${t.role === "user" ? names.user : names.assistant}, message ${i + 1}`}>
                <p className="tmap__who">{t.role === "user" ? names.user : names.assistant}</p>
                <div className="tmap__bubble">
                  <p>{lit(t.text, q)}</p>
                  {t.tool && <p className="tmap__tool"><i aria-hidden="true" />{lit(t.tool, q)}</p>}
                  {t.code && <pre><code>{lit(t.code, q)}</code></pre>}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div ref={rail} className="tmap__rail" aria-hidden="true"
          onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); railTo(e.clientY); }}
          onPointerMove={(e) => { if (dragging.current) railTo(e.clientY); }}
          onPointerUp={() => { dragging.current = false; }}>
          {tk.map((k, i) => (
            <span key={turns[i].id} className={`tmap__tick tmap__tick--${turns[i].role}`} data-hit={matches.includes(i) ? "" : undefined} data-current={i === at ? "" : undefined} style={{ top: k.y, height: k.h }}>
              {turns[i].code && <b className="tmap__mark-code" />}
              {turns[i].tool && <b className="tmap__mark-tool" />}
            </span>
          ))}
          <span className="tmap__window" style={{ top: win.y, height: win.h }} />
        </div>
      </div>
      <p className="tmap__hint" aria-hidden="true"><kbd>J</kbd><kbd>K</kbd> to step through · drag the map to scrub</p>
    </section>
  );
}

export default ThreadMap;
