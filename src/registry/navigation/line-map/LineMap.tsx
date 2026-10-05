"use client";
import { useId, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./line-map.css";

export type LineStation = { id: string; title: string };
export type Line = { id: string; name: string; color: string; stops: string[] };
type Side = "n" | "s" | "e" | "w" | "ne" | "se" | "sw" | "nw";
export type LineMapProps = {
  stations: LineStation[];
  lines: Line[];
  /** Where each station sits on the grid, laid out by hand as transit maps are, and which side its label goes. */
  grid: Record<string, [number, number] | [number, number, Side]>;
  visited?: string[];
  current?: string;
  onNavigate?: (id: string) => void;
  title?: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const COL = 112, ROW = 72, PAD = 56;
const OFF: Record<Side, [number, number, "start" | "middle" | "end"]> = { n: [0, -18, "middle"], s: [0, 28, "middle"], e: [16, 5, "start"], w: [-16, 5, "end"], ne: [10, -14, "start"], se: [12, 24, "start"], sw: [-12, 24, "end"], nw: [-10, -14, "end"] };

/** Horizontal first, then a 45° run, the way schematic transit maps bend. */
function route(a: [number, number], b: [number, number]) {
  const [x1, y1] = a, [x2, y2] = b;
  const dx = x2 - x1, dy = y2 - y1;
  if (!dx || !dy || Math.abs(dx) === Math.abs(dy)) return `M${x1} ${y1}L${x2} ${y2}`;
  if (Math.abs(dx) > Math.abs(dy)) { const mx = x2 - Math.sign(dx) * Math.abs(dy); return `M${x1} ${y1}L${mx} ${y1}L${x2} ${y2}`; }
  const my = y2 - Math.sign(dy) * Math.abs(dx);
  return `M${x1} ${y1}L${x1} ${my}L${x2} ${y2}`;
}

/**
 * Line Map
 * A course or a set of docs drawn as a transit map: tracks are lines,
 * lessons are stations, shared lessons are interchanges, and the part of
 * each line you've travelled is drawn in full colour.
 */
export function LineMap({ stations, lines, grid, visited = [], current, onNavigate, title = "Map", theme = "light", motion = true, className = "" }: LineMapProps) {
  const id = useId();
  const byId = useMemo(() => new Map(stations.map((s) => [s.id, s])), [stations]);
  const seen = useMemo(() => new Set(visited), [visited]);
  const linesAt = useMemo(() => new Map(stations.map((s) => [s.id, lines.filter((l) => l.stops.includes(s.id))])), [stations, lines]);
  const [cursor, setCursor] = useState<{ line: number; stop: number }>(() => {
    const li = Math.max(0, lines.findIndex((l) => current && l.stops.includes(current)));
    return { line: li, stop: Math.max(0, current ? lines[li].stops.indexOf(current) : 0) };
  });
  const [peek, setPeek] = useState<string | null>(null);

  const cols = Math.max(...Object.values(grid).map((g) => g[0])), rows = Math.max(...Object.values(grid).map((g) => g[1]));
  const W = PAD * 2 + cols * COL, H = PAD * 2 + rows * ROW;
  const at = (sid: string): [number, number] => [PAD + grid[sid][0] * COL, PAD + grid[sid][1] * ROW];
  const done = (sid: string) => seen.has(sid) || sid === current;
  const focusId = lines[cursor.line]?.stops[cursor.stop];

  const describe = (sid: string) => {
    const ls = linesAt.get(sid) ?? [];
    const state = sid === current ? "you are here" : seen.has(sid) ? "visited" : "not visited yet";
    return `${byId.get(sid)?.title}, ${ls.length > 1 ? `interchange for ${ls.map((l) => l.name).join(" and ")}` : `${ls[0]?.name} line`}, ${state}`;
  };
  const go = (line: number, stop: number) => {
    setCursor({ line, stop });
    const sid = lines[line].stops[stop];
    setPeek(sid);
    requestAnimationFrame(() => document.getElementById(`${id}-${sid}`)?.focus());
  };
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const l = lines[cursor.line];
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(cursor.line, Math.max(0, Math.min(l.stops.length - 1, cursor.stop + (e.key === "ArrowRight" ? 1 : -1))));
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      // Change line only where lines meet.
      const sid = l.stops[cursor.stop];
      const options = lines.map((x, i) => (x.stops.includes(sid) ? i : -1)).filter((i) => i >= 0);
      if (options.length < 2) return;
      const next = options[(options.indexOf(cursor.line) + (e.key === "ArrowDown" ? 1 : options.length - 1)) % options.length];
      go(next, lines[next].stops.indexOf(sid));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusId) onNavigate?.(focusId);
    }
  };

  const card = peek ? { sid: peek, pos: at(peek) } : null;

  return (
    <section className={`lmap lmap--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-labelledby={`${id}-t`}>
      <header className="lmap__head">
        <h3 id={`${id}-t`} className="lmap__title">{title}</h3>
        <ul className="lmap__legend">
          {lines.map((l) => {
            const n = l.stops.filter(done).length;
            return <li key={l.id} style={{ "--c": l.color } as CSSProperties}><span className="lmap__swatch" aria-hidden="true" />{l.name}<span className="lmap__progress">{n}/{l.stops.length}</span></li>;
          })}
        </ul>
      </header>

      <div className="lmap__map" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg className="lmap__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {lines.map((l) => l.stops.slice(1).map((sid, i) => {
            const a = l.stops[i];
            return <path key={`${l.id}-${sid}`} d={route(at(a), at(sid))} className="lmap__track" data-done={(done(a) && done(sid)) || undefined} style={{ "--c": l.color } as CSSProperties} />;
          }))}
          {stations.map((s) => {
            const [x, y] = at(s.id), ls = linesAt.get(s.id) ?? [], inter = ls.length > 1;
            const [ox, oy, anchor] = OFF[grid[s.id][2] ?? "n"];
            return (
              <g key={s.id} className="lmap__station" data-inter={inter || undefined} data-done={done(s.id) || undefined} data-current={s.id === current || undefined} data-focus={s.id === focusId && peek === s.id ? true : undefined} style={{ "--c": ls[0]?.color } as CSSProperties}>
                {s.id === current && <circle cx={x} cy={y} r="16" className="lmap__pulse" />}
                <circle cx={x} cy={y} r={inter ? 10 : 7} className="lmap__dot" />
                <text x={x + ox} y={y + oy} textAnchor={anchor} className="lmap__label">{s.title}</text>
                {s.id === current && <text x={x} y={y - (grid[s.id][2] === "n" || !grid[s.id][2] ? 40 : 22)} textAnchor="middle" className="lmap__here">You are here</text>}
              </g>
            );
          })}
        </svg>
        <div className="lmap__hits" onKeyDown={onKey}>
          {lines.map((l, li) => l.stops.map((sid, si) => {
            // One focusable hit per station, owned by the first line through it.
            if ((linesAt.get(sid)?.[0]?.id ?? l.id) !== l.id) return null;
            const [x, y] = at(sid);
            return (
              <button
                key={sid}
                id={`${id}-${sid}`}
                type="button"
                className="lmap__hit"
                style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
                tabIndex={sid === focusId ? 0 : -1}
                aria-label={describe(sid)}
                aria-current={sid === current ? "location" : undefined}
                onFocus={() => { setPeek(sid); if (lines[cursor.line].stops[cursor.stop] !== sid) setCursor({ line: li, stop: si }); }}
                onBlur={() => setPeek((p) => (p === sid ? null : p))}
                onPointerEnter={() => setPeek(sid)}
                onPointerLeave={() => setPeek((p) => (p === sid ? null : p))}
                onClick={() => onNavigate?.(sid)}
              />
            );
          }))}
        </div>
        {card && (
          <div className="lmap__card" style={{ left: `${(card.pos[0] / W) * 100}%`, top: `${(card.pos[1] / H) * 100}%` }} aria-hidden="true">
            <strong>{byId.get(card.sid)?.title}</strong>
            <span>{(linesAt.get(card.sid) ?? []).map((l) => <i key={l.id} style={{ "--c": l.color } as CSSProperties}>{l.name}</i>)}</span>
            <em>{card.sid === current ? "You are here" : seen.has(card.sid) ? "Visited" : "Not visited yet"}</em>
          </div>
        )}
      </div>

      <div className="lmap__strips">
        {lines.map((l) => (
          <section key={l.id} className="lmap__strip" style={{ "--c": l.color } as CSSProperties} aria-label={`${l.name} line`}>
            <h4>{l.name}<span>{l.stops.filter(done).length}/{l.stops.length}</span></h4>
            <ol>
              {l.stops.map((sid) => (
                <li key={sid} data-done={done(sid) || undefined} data-current={sid === current || undefined}>
                  <button type="button" onClick={() => onNavigate?.(sid)} aria-current={sid === current ? "location" : undefined}>
                    {byId.get(sid)?.title}
                    {(linesAt.get(sid)?.length ?? 0) > 1 && <span className="lmap__change">change for {(linesAt.get(sid) ?? []).filter((x) => x.id !== l.id).map((x) => x.name).join(", ")}</span>}
                    {sid === current && <span className="lmap__change">you are here</span>}
                  </button>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <p className="lmap__keys" aria-hidden="true">← → along a line · ↑ ↓ change line at an interchange · Enter opens</p>
    </section>
  );
}
