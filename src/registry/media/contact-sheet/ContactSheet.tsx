"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import "./contact-sheet.css";

export type SheetFrame = { id: string; src: string; alt: string; title: string };
export type FrameMark = { circle?: boolean; reject?: boolean; stars?: number };
export type ContactSheetProps = {
  frames: SheetFrame[];
  defaultMarks?: Record<string, FrameMark>;
  onChange?: (marks: Record<string, FrameMark>) => void;
  /** Printed on the film edge, e.g. "12" gives frames 12A, 12B… */
  roll?: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

type Filter = "all" | "circled" | "unmarked";
const ZOOM = 2.5;

// An uneven grease-pencil loop: an ellipse with a wobble and an overshoot past where it started.
function loop(seed: number) {
  let a = seed * 9301 + 49297;
  const r = () => ((a = (a * 233280 + 49297) % 233280) / 233280);
  const pts: string[] = [];
  const turns = 1.12, n = 28, start = r() * Math.PI * 2;
  for (let i = 0; i <= n; i++) {
    const t = start + (i / n) * Math.PI * 2 * turns;
    const rx = 46 + (r() - 0.5) * 4 + i * 0.12, ry = 40 + (r() - 0.5) * 4;
    pts.push(`${(50 + Math.cos(t) * rx).toFixed(1)} ${(50 + Math.sin(t) * ry).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

/**
 * Contact Sheet
 * Choosing pictures the way photographers did on a light table: frames on a
 * strip of film, a loupe to look closely, and a red grease pencil to circle
 * the keepers, cross out the rest and rate the best.
 */
export function ContactSheet({ frames, defaultMarks = {}, onChange, roll = "12", theme = "light", motion = true, className = "" }: ContactSheetProps) {
  const id = useId();
  const [marks, setMarks] = useState<Record<string, FrameMark>>(defaultMarks);
  const [filter, setFilter] = useState<Filter>("all");
  const [focus, setFocus] = useState(frames[0]?.id);
  const [loupe, setLoupe] = useState(false);
  const [lens, setLens] = useState<{ id: string; x: number; y: number; w: number; h: number } | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const cells = useRef(new Map<string, HTMLButtonElement>());
  const grid = useRef<HTMLUListElement>(null);

  const code = (i: number) => `${roll}${String.fromCharCode(65 + (i % 26))}${i >= 26 ? Math.floor(i / 26) : ""}`;
  const isMarked = (m?: FrameMark) => !!m && (m.circle || m.reject || !!m.stars);
  const shown = useMemo(() => frames.filter((f) => filter === "all" || (filter === "circled" ? marks[f.id]?.circle : !isMarked(marks[f.id]))), [frames, filter, marks]);
  const counts = { all: frames.length, circled: frames.filter((f) => marks[f.id]?.circle).length, unmarked: frames.filter((f) => !isMarked(marks[f.id])).length };

  const update = (fid: string, patch: Partial<FrameMark> | null) => {
    const next = { ...marks, [fid]: patch === null ? {} : { ...marks[fid], ...patch } };
    setMarks(next);
    onChange?.(next);
    setFresh(`${fid}:${Date.now()}`);
    const f = frames.findIndex((x) => x.id === fid), m = next[fid];
    setMessage(`${code(f)}: ${[m.circle && "circled", m.reject && "crossed out", m.stars && `${m.stars} star${m.stars > 1 ? "s" : ""}`].filter(Boolean).join(", ") || "marks cleared"}.`);
  };

  const moveFocus = (fid: string) => { setFocus(fid); cells.current.get(fid)?.focus(); };
  const columns = () => {
    const els = shown.map((f) => cells.current.get(f.id)).filter(Boolean) as HTMLElement[];
    const top = els[0]?.getBoundingClientRect().top;
    return Math.max(1, els.filter((e) => Math.abs(e.getBoundingClientRect().top - (top ?? 0)) < 4).length);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, fid: string) => {
    const i = shown.findIndex((f) => f.id === fid);
    const cols = columns();
    const go = (j: number) => { const f = shown[Math.max(0, Math.min(shown.length - 1, j))]; if (f) { e.preventDefault(); moveFocus(f.id); if (loupe) centreLens(f.id); } };
    const k = e.key.toLowerCase();
    if (e.key === "ArrowRight") go(i + 1);
    else if (e.key === "ArrowLeft") go(i - 1);
    else if (e.key === "ArrowDown") go(i + cols);
    else if (e.key === "ArrowUp") go(i - cols);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(shown.length - 1);
    else if (k === "c") { e.preventDefault(); update(fid, { circle: !marks[fid]?.circle, reject: false }); }
    else if (k === "x") { e.preventDefault(); update(fid, { reject: !marks[fid]?.reject, circle: false }); }
    else if (/^[1-5]$/.test(e.key)) { e.preventDefault(); const n = Number(e.key); update(fid, { stars: marks[fid]?.stars === n ? 0 : n }); }
    else if (e.key === "0") { e.preventDefault(); update(fid, null); }
    else if (e.key === " ") { e.preventDefault(); toggleLoupe(fid); }
  };

  const centreLens = (fid: string) => {
    const el = cells.current.get(fid)?.querySelector("img");
    const box = grid.current?.getBoundingClientRect();
    if (!el || !box) return;
    const r = el.getBoundingClientRect();
    setLens({ id: fid, x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, w: r.width, h: r.height });
  };
  const toggleLoupe = (fid?: string) => {
    const next = !loupe;
    setLoupe(next);
    if (next && fid) requestAnimationFrame(() => centreLens(fid)); else if (!next) setLens(null);
  };
  const onPointer = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (!loupe || !grid.current) return;
    const img = (e.target as Element).closest("[data-frame]")?.querySelector("img");
    if (!img) return setLens(null);
    const box = grid.current.getBoundingClientRect(), r = img.getBoundingClientRect();
    const fid = (img.closest("[data-frame]") as HTMLElement).dataset.frame!;
    setLens({ id: fid, x: Math.max(r.left, Math.min(r.right, e.clientX)) - box.left, y: Math.max(r.top, Math.min(r.bottom, e.clientY)) - box.top, w: r.width, h: r.height });
  };
  useEffect(() => { if (!loupe) setLens(null); }, [loupe]);

  const lensFrame = lens ? frames.find((f) => f.id === lens.id) : null;
  const lensImg = lens ? cells.current.get(lens.id)?.querySelector("img")?.getBoundingClientRect() : null;
  const gridBox = grid.current?.getBoundingClientRect();

  return (
    <section className={`csheet csheet--${theme} ${className}`} data-motion={motion ? undefined : "off"} data-loupe={loupe || undefined} aria-label="Contact sheet">
      <header className="csheet__bar">
        <div className="csheet__filters" role="group" aria-label="Show">
          {(["all", "circled", "unmarked"] as Filter[]).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === "all" ? "All" : f === "circled" ? "Circled" : "Unmarked"} <span>{counts[f]}</span></button>
          ))}
        </div>
        <button type="button" className="csheet__loupe-btn" aria-pressed={loupe} onClick={() => toggleLoupe(focus)}>Loupe <kbd aria-hidden="true">Space</kbd></button>
      </header>

      <ul ref={grid} className="csheet__grid" onPointerMove={onPointer} onPointerLeave={() => loupe && setLens(null)} aria-describedby={`${id}-keys`}>
        {shown.map((f) => {
          const i = frames.indexOf(f), m = marks[f.id] ?? {};
          const anim = fresh?.startsWith(`${f.id}:`) ? fresh : undefined;
          return (
            <li key={f.id} className="csheet__cell">
              <button
                ref={(el) => { if (el) cells.current.set(f.id, el); else cells.current.delete(f.id); }}
                type="button"
                className="csheet__frame"
                data-frame={f.id}
                data-reject={m.reject || undefined}
                tabIndex={f.id === focus || (!shown.some((s) => s.id === focus) && f === shown[0]) ? 0 : -1}
                aria-label={`${code(i)}, ${f.title}${m.circle ? ", circled" : ""}${m.reject ? ", crossed out" : ""}${m.stars ? `, ${m.stars} stars` : ""}`}
                onFocus={() => setFocus(f.id)}
                onClick={() => setFocus(f.id)}
                onKeyDown={(e) => onKey(e, f.id)}
              >
                <span className="csheet__edge" aria-hidden="true"><span>{code(i)}</span><span>▸ {i + 1}</span></span>
                <img src={f.src} alt={f.alt} draggable={false} />
                <svg className="csheet__marks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {m.circle && <path key={`c${anim}`} d={loop(i + 1)} pathLength={1} className="csheet__pencil" />}
                  {m.reject && <g key={`x${anim}`}><path d="M18 20 L82 82" pathLength={1} className="csheet__pencil" /><path d="M80 18 L22 84" pathLength={1} className="csheet__pencil csheet__pencil--late" /></g>}
                </svg>
              </button>
              <div className="csheet__under">
                <span className="csheet__title">{f.title}</span>
                <span className="csheet__stars" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" tabIndex={-1} data-on={(m.stars ?? 0) >= n || undefined} onClick={() => update(f.id, { stars: m.stars === n ? 0 : n })}>★</button>
                  ))}
                </span>
              </div>
            </li>
          );
        })}
        {shown.length === 0 && <li className="csheet__none">{filter === "circled" ? "Nothing circled yet. Press C on a frame you want to keep." : "Every frame has a mark."}</li>}
        {lens && lensFrame && lensImg && gridBox && (
          <li
            className="csheet__lens"
            aria-hidden="true"
            style={{
              left: lens.x, top: lens.y,
              backgroundImage: `url("${lensFrame.src}")`,
              backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
              backgroundPosition: `${-((lens.x - (lensImg.left - gridBox.left)) * ZOOM - 90)}px ${-((lens.y - (lensImg.top - gridBox.top)) * ZOOM - 90)}px`,
            } as CSSProperties}
          />
        )}
      </ul>
      <p id={`${id}-keys`} className="csheet__keys">Arrows move · <kbd>C</kbd> circle · <kbd>X</kbd> cross out · <kbd>1</kbd>–<kbd>5</kbd> stars · <kbd>0</kbd> clear · <kbd>Space</kbd> loupe</p>
      <p className="csheet__sr" aria-live="polite">{message}</p>
    </section>
  );
}
