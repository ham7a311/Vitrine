"use client";

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import "./availability-painter.css";

/**
 * Availability Painter
 * Find a time for several people. Paint the hours you are free across the week; everyone else's free time
 * is already there as depth, darker where more of them overlap. The best time everyone shares is named as
 * soon as it exists, so the answer appears while you paint.
 */

export type Person = { name: string; free: { day: number; from: number; to: number }[] };
export type Meeting = { day: number; from: number; to: number; count: number };
export type AvailabilityPainterProps = {
  /** Column headings, one per day. */
  days: string[];
  /** Everyone else. Times are minutes from midnight. */
  people: Person[];
  /** What you have painted, as "day:row" cells. */
  defaultValue?: string[];
  start?: number;
  end?: number;
  /** The shortest meeting worth naming, in minutes. */
  minutes?: number;
  theme?: "light" | "dark";
  onChange?: (cells: string[]) => void;
  className?: string;
};

const STEP = 30;
const clock = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** The longest run of cells where `count` reaches `need`, earliest first on a tie. `counts[day][row]`. */
export function bestRun(counts: number[][], need: number, minRows: number): { day: number; row: number; rows: number } | null {
  let best: { day: number; row: number; rows: number } | null = null;
  counts.forEach((col, day) => {
    for (let row = 0; row < col.length; row++) {
      let rows = 0;
      while (row + rows < col.length && col[row + rows] >= need) rows++;
      if (rows >= minRows && (!best || rows > best.rows)) best = { day, row, rows };
      row += rows;
    }
  });
  return best;
}

export function AvailabilityPainter({ days, people, defaultValue = [], start = 540, end = 1080, minutes = 60, theme = "light", onChange, className = "" }: AvailabilityPainterProps) {
  const rows = (end - start) / STEP;
  const [mine, setMine] = useState(() => new Set(defaultValue));
  const [cursor, setCursor] = useState("0:0");
  const grid = useRef<HTMLDivElement>(null);
  const brush = useRef<boolean | null>(null);

  // How many of the others are free in each cell.
  const others = useMemo(() => days.map((_, d) => Array.from({ length: rows }, (_, r) => {
    const at = start + r * STEP;
    return people.filter((p) => p.free.some((f) => f.day === d && f.from <= at && f.to >= at + STEP)).length;
  })), [days, people, rows, start]);

  const everyone = others.map((col, d) => col.map((n, r) => n + (mine.has(`${d}:${r}`) ? 1 : 0)));
  const shared = bestRun(everyone, people.length + 1, minutes / STEP);
  const possible = shared ? null : bestRun(others, people.length, minutes / STEP);
  const label = (run: { day: number; row: number; rows: number }) => `${days[run.day]}, ${clock(start + run.row * STEP)}–${clock(start + (run.row + run.rows) * STEP)}`;

  const update = (next: Set<string>) => { setMine(next); onChange?.([...next]); };
  const set = (cell: string, on: boolean) => {
    if (mine.has(cell) === on) return;
    const next = new Set(mine);
    if (on) next.add(cell); else next.delete(cell);
    update(next);
  };
  const paintRun = (run: { day: number; row: number; rows: number }) => {
    const next = new Set(mine);
    for (let i = 0; i < run.rows; i++) next.add(`${run.day}:${run.row + i}`);
    update(next);
  };

  const cellAt = (e: PointerEvent) => (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>("[data-cell]")?.dataset.cell;
  const onDown = (e: PointerEvent) => {
    const cell = cellAt(e);
    if (!cell || e.button !== 0) return;
    brush.current = !mine.has(cell);
    set(cell, brush.current);
    setCursor(cell);
  };
  const onMove = (e: PointerEvent) => {
    if (brush.current === null) return;
    const cell = cellAt(e);
    if (cell) set(cell, brush.current);
  };
  const onKey = (e: KeyboardEvent) => {
    const [d, r] = cursor.split(":").map(Number);
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); return set(cursor, !mine.has(cursor)); }
    const step = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
    if (!step) return;
    e.preventDefault();
    const to = `${Math.max(0, Math.min(days.length - 1, d + step[0]))}:${Math.max(0, Math.min(rows - 1, r + step[1]))}`;
    // Holding Shift carries the cell you left across to the one you land on.
    if (e.shiftKey) set(to, mine.has(cursor));
    setCursor(to);
    grid.current?.querySelector<HTMLElement>(`[data-cell="${to}"]`)?.focus();
  };

  const hours = (cells: number) => { const m = cells * STEP; return `${Math.floor(m / 60)}h${m % 60 ? " 30m" : ""}`; };
  return (
    <section className={`availp availp--${theme} ${className}`} style={{ ["--availp-days" as string]: days.length, ["--availp-people" as string]: people.length } as CSSProperties} aria-label="Paint the times you are free">
      <header className="availp__head" data-found={shared ? "" : undefined}>
        <div aria-live="polite">
          <p className="availp__eyebrow">{shared ? `Everyone is free · ${people.length + 1} of ${people.length + 1}` : possible ? "The others all share" : "No shared time yet"}</p>
          <h3 className="availp__answer">{shared ? label(shared) : possible ? label(possible) : "Paint the hours you could meet"}</h3>
        </div>
        {possible && <button type="button" className="availp__take" onClick={() => paintRun(possible)}>I’m free then</button>}
        {!shared && !possible && mine.size > 0 && <button type="button" className="availp__take" onClick={() => update(new Set())}>Clear mine</button>}
      </header>

      <div className="availp__body">
        <div className="availp__cols" aria-hidden="true"><span />{days.map((d) => <span key={d}>{d}</span>)}</div>
        <div className="availp__sheet">
          <div className="availp__times" aria-hidden="true">{Array.from({ length: rows / 2 + 1 }, (_, i) => <span key={i} style={{ top: `${(i * 2 * 100) / rows}%` }}>{clock(start + i * 60)}</span>)}</div>
          <div ref={grid} className="availp__grid" role="group" aria-label="Arrow keys move, Space paints, Shift with an arrow paints as you go." onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => { brush.current = null; }} onPointerLeave={() => { brush.current = null; }} onKeyDown={onKey}>
            {days.map((dayName, d) => (
              <div key={dayName} className="availp__col">
                {Array.from({ length: rows }, (_, r) => {
                  const cell = `${d}:${r}`, n = others[d][r], on = mine.has(cell), at = start + r * STEP;
                  return (
                    <div
                      key={cell}
                      role="checkbox"
                      aria-checked={on}
                      aria-label={`${dayName} ${clock(at)}, ${n} of ${people.length} others free`}
                      tabIndex={cell === cursor ? 0 : -1}
                      data-cell={cell}
                      data-depth={n}
                      data-mine={on ? "" : undefined}
                      data-all={on && n === people.length ? "" : undefined}
                      data-best={shared && shared.day === d && r >= shared.row && r < shared.row + shared.rows ? "" : undefined}
                      data-hour={r % 2 === 0 ? "" : undefined}
                      className="availp__cell"
                      style={{ ["--n" as string]: n } as CSSProperties}
                      onFocus={() => setCursor(cell)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="availp__foot">
        <ul className="availp__people">
          <li data-you><i />You <span>{hours(mine.size)}</span></li>
          {people.map((p) => <li key={p.name}><i />{p.name} <span>{hours(p.free.reduce((n, f) => n + (f.to - f.from) / STEP, 0))}</span></li>)}
        </ul>
        <p className="availp__scale" aria-hidden="true">Others free <span>{Array.from({ length: people.length + 1 }, (_, n) => <i key={n} data-depth={n} style={{ ["--n" as string]: n } as CSSProperties} />)}</span> {people.length}</p>
      </footer>
    </section>
  );
}

export default AvailabilityPainter;
