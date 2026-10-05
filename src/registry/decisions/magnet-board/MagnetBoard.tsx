"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { closest, layout, pull, ranges, type Magnet, type MagnetItem } from "./layout";
import "./magnet-board.css";

export type { Magnet, MagnetItem } from "./layout";
export type MagnetAttribute = { key: string; label: string; code?: string; format?: (v: number) => string };
export type MagnetBoardProps = {
  items: MagnetItem[];
  attributes: MagnetAttribute[];
  /** Magnets on the board at the start; x and y run 0..1 across the board. */
  initialMagnets?: Magnet[];
  noun?: string;
  onSelect?: (item: MagnetItem) => void;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const SPOTS: [number, number][] = [[0.14, 0.18], [0.86, 0.82], [0.86, 0.18], [0.14, 0.82], [0.5, 0.12], [0.5, 0.88]];
const DOT = 7;

/**
 * Magnet Board
 * Explore things with several qualities at once. Each magnet is one quality;
 * drop it on the board and every item drifts toward it in proportion to how
 * much of that quality it has, so the clusters show the trade-offs.
 */
export function MagnetBoard({ items, attributes, initialMagnets = [], noun = "items", onSelect, theme = "light", motion = true, className = "" }: MagnetBoardProps) {
  const id = useId();
  const board = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 460 });
  const [magnets, setMagnets] = useState<Magnet[]>(initialMagnets);
  const [view, setView] = useState<"board" | "list">("board");
  const [hover, setHover] = useState<string | null>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const pucks = useRef(new Map<string, HTMLButtonElement>());

  const attr = useMemo(() => new Map(attributes.map((a) => [a.key, a])), [attributes]);
  const R = useMemo(() => ranges(items, attributes.map((a) => a.key)), [items, attributes]);
  const pos = useMemo(() => layout(items, magnets, R, size.w, size.h, DOT), [items, magnets, R, size]);

  useEffect(() => {
    const el = board.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.round(e.contentRect.width), h: Math.round(e.contentRect.height) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [view]);

  const code = (k: string) => attr.get(k)?.code ?? attr.get(k)!.label.slice(0, 2);
  const fmt = (k: string, v: number) => attr.get(k)?.format?.(v) ?? String(v);
  const announce = (m: Magnet) => {
    const top = closest(items, m, R).slice(0, 3).map((i) => i.label);
    setMessage(`${attr.get(m.key)?.label}${m.invert ? " (low)" : ""} pulls hardest on ${top.join(", ")}.`);
  };
  const update = (key: string, patch: Partial<Magnet>, say = false) => setMagnets((ms) => ms.map((m) => {
    if (m.key !== key) return m;
    const next = { ...m, ...patch, x: Math.max(0.04, Math.min(0.96, patch.x ?? m.x)), y: Math.max(0.06, Math.min(0.94, patch.y ?? m.y)) };
    if (say) announce(next);
    return next;
  }));
  const add = (key: string) => {
    const used = new Set(magnets.map((m) => `${m.x},${m.y}`));
    const [x, y] = SPOTS.find(([a, b]) => !used.has(`${a},${b}`)) ?? [0.5, 0.5];
    const m = { key, x, y };
    setMagnets((ms) => [...ms, m]);
    announce(m);
    requestAnimationFrame(() => pucks.current.get(key)?.focus());
  };
  const remove = (key: string) => { setMagnets((ms) => ms.filter((m) => m.key !== key)); setMessage(`${attr.get(key)?.label} removed.`); };

  const onPuckDown = (e: ReactPointerEvent<HTMLButtonElement>, key: string) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag(key);
  };
  const onPuckMove = (e: ReactPointerEvent<HTMLButtonElement>, key: string) => {
    if (drag !== key || !board.current) return;
    const r = board.current.getBoundingClientRect();
    update(key, { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };
  const onPuckUp = (key: string) => {
    if (drag !== key) return;
    setDrag(null);
    const m = magnets.find((x) => x.key === key);
    if (m) announce(m);
  };
  const onPuckKey = (e: KeyboardEvent<HTMLButtonElement>, m: Magnet) => {
    const step = e.shiftKey ? 64 : 16;
    const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
    const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
    if (dx || dy) { e.preventDefault(); update(m.key, { x: m.x + dx / size.w, y: m.y + dy / size.h }, true); }
    else if (e.key === "i" || e.key === "I") { e.preventDefault(); update(m.key, { invert: !m.invert }, true); }
    else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); remove(m.key); }
  };

  // Each magnet's strongest item keeps its label visible.
  const leaders = new Set(magnets.flatMap((m) => closest(items, m, R).slice(0, 1).map((i) => i.id)));
  const hovered = items.find((i) => i.id === hover);
  const scored = [...items].map((i) => ({ item: i, pulls: magnets.map((m) => pull(i, m, R)) })).sort((a, b) => b.pulls.reduce((s, x) => s + x, 0) - a.pulls.reduce((s, x) => s + x, 0));

  return (
    <section className={`mgb mgb--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-labelledby={`${id}-h`}>
      <header className="mgb__bar">
        <h3 id={`${id}-h`} className="mgb__title">{items.length} {noun}</h3>
        <div className="mgb__tray" role="group" aria-label="Magnets">
          {attributes.map((a, i) => {
            const m = magnets.find((x) => x.key === a.key);
            return m ? (
              <span key={a.key} className="mgb__chip" data-on style={{ "--mc": `var(--mgb-m${(i % 4) + 1})` } as CSSProperties}>
                <span className="mgb__chip-dot" aria-hidden="true" />{a.label}
                <button type="button" aria-pressed={!!m.invert} onClick={() => update(a.key, { invert: !m.invert }, true)} aria-label={`${a.label}: pull ${m.invert ? "low" : "high"} values. Switch`}>{m.invert ? "Low" : "High"}</button>
                <button type="button" onClick={() => remove(a.key)} aria-label={`Remove ${a.label} magnet`}>×</button>
              </span>
            ) : (
              <button key={a.key} type="button" className="mgb__chip mgb__chip--add" onClick={() => add(a.key)} style={{ "--mc": `var(--mgb-m${(i % 4) + 1})` } as CSSProperties}>+ {a.label}</button>
            );
          })}
        </div>
        <div className="mgb__views" role="group" aria-label="View">
          <button type="button" aria-pressed={view === "board"} onClick={() => setView("board")}>Board</button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>List</button>
        </div>
      </header>

      {view === "board" ? (
        <div className="mgb__board" ref={board} data-dragging={drag ? true : undefined}>
          {magnets.length === 0 && <p className="mgb__empty">Add a magnet above. Each one pulls the {noun} that have the most of it.</p>}
          <ul className="mgb__dots" aria-hidden="true">
            {items.map((item, i) => (
              <li
                key={item.id}
                className="mgb__dot"
                data-lead={leaders.has(item.id) || undefined}
                data-hover={hover === item.id || undefined}
                style={{ transform: `translate(${pos[i].x}px, ${pos[i].y}px)` }}
                onPointerEnter={() => setHover(item.id)}
                onPointerLeave={() => setHover((h) => (h === item.id ? null : h))}
                onClick={() => { setHover(item.id); onSelect?.(item); }}
              >
                <span className="mgb__dot-mark" />
                <span className="mgb__dot-label">{item.label}</span>
              </li>
            ))}
          </ul>
          {magnets.map((m) => {
            const i = attributes.findIndex((a) => a.key === m.key);
            return (
              <button
                key={m.key}
                ref={(el) => { if (el) pucks.current.set(m.key, el); else pucks.current.delete(m.key); }}
                type="button"
                className="mgb__puck"
                data-invert={m.invert || undefined}
                data-drag={drag === m.key || undefined}
                style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%`, "--mc": `var(--mgb-m${(i % 4) + 1})` } as CSSProperties}
                aria-label={`${attr.get(m.key)?.label} magnet, pulling ${m.invert ? "low" : "high"} values. Arrow keys move it, I flips it, Delete removes it.`}
                onPointerDown={(e) => onPuckDown(e, m.key)}
                onPointerMove={(e) => onPuckMove(e, m.key)}
                onPointerUp={() => onPuckUp(m.key)}
                onPointerCancel={() => onPuckUp(m.key)}
                onKeyDown={(e) => onPuckKey(e, m)}
              >
                <span className="mgb__puck-code" aria-hidden="true">{code(m.key)}</span>
                <span className="mgb__puck-name" aria-hidden="true">{attr.get(m.key)?.label}{m.invert ? " · low" : ""}</span>
              </button>
            );
          })}
          {hovered && (() => {
            const p = pos[items.indexOf(hovered)];
            const flip = p.x > size.w - 220;
            return (
              <div className="mgb__card" style={{ left: p.x, top: p.y, "--fx": flip ? "-100%" : "0%" } as CSSProperties} aria-hidden="true">
                <strong>{hovered.label}</strong>
                {attributes.map((a) => <span key={a.key}><em>{a.label}</em>{fmt(a.key, hovered.values[a.key])}</span>)}
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="mgb__list" tabIndex={0} role="region" aria-label={`${noun} ranked by magnet pull`}>
          <table>
            <thead>
              <tr>
                <th scope="col">{noun[0].toUpperCase() + noun.slice(1)}</th>
                {magnets.map((m) => <th key={m.key} scope="col">{attr.get(m.key)?.label}{m.invert ? " (low)" : ""}</th>)}
                {attributes.filter((a) => !magnets.some((m) => m.key === a.key)).map((a) => <th key={a.key} scope="col" className="mgb__muted">{a.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {scored.map(({ item, pulls }) => (
                <tr key={item.id}>
                  <th scope="row">{item.label}</th>
                  {magnets.map((m, k) => (
                    <td key={m.key}>
                      <span className="mgb__pull" style={{ "--p": pulls[k] } as CSSProperties} aria-hidden="true" />
                      {fmt(m.key, item.values[m.key])}
                    </td>
                  ))}
                  {attributes.filter((a) => !magnets.some((m) => m.key === a.key)).map((a) => <td key={a.key} className="mgb__muted">{fmt(a.key, item.values[a.key])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mgb__sr" aria-live="polite">{message}</p>
    </section>
  );
}
