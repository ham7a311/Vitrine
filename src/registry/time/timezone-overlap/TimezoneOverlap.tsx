"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { localAt, overlap, windows, type Person } from "./overlap";
import "./timezone-overlap.css";

export type { Person } from "./overlap";
export type TimezoneOverlapProps = {
  people: Person[];
  /** The zone the hour axis is drawn in, usually the viewer's. */
  reference: string;
  /** The day to compare, YYYY-MM-DD in the reference zone; defaults to today there. */
  date?: string;
  title?: string;
  theme?: "light" | "dark";
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const hm = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(Math.round(m % 60))}`;
const HOURS = [0, 3, 6, 9, 12, 15, 18, 21, 24];

/**
 * Timezone Overlap
 * Everyone's working hours on one axis. Drag the cursor to see each person's
 * local time at that moment; the hours everyone shares are lit across all rows.
 */
export function TimezoneOverlap({ people, reference, date, title = "When can we meet?", theme = "light", className = "" }: TimezoneOverlapProps) {
  const id = useId();
  const [ymd, setYmd] = useState<[number, number, number] | null>(() => (date ? (date.split("-").map(Number) as [number, number, number]) : null));
  const [cursor, setCursor] = useState(12 * 60);
  const [drag, setDrag] = useState(false);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ymd) return;
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: reference, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(Date.now()).map((x) => [x.type, x.value]));
    setYmd([+p.year, +p.month, +p.day]);
    setCursor(+p.hour * 60 + +p.minute);
  }, [ymd, reference]);

  const day = ymd ?? [2026, 1, 1];
  const rows = useMemo(() => people.map((p) => ({ p, w: windows(p, reference, day) })), [people, reference, day]);
  const o = useMemo(() => overlap(people, reference, day), [people, reference, day]);
  const shiftDay = (n: number) => { const d = new Date(Date.UTC(day[0], day[1] - 1, day[2] + n)); setYmd([d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()]); };
  const dayLabel = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(Date.UTC(day[0], day[1] - 1, day[2]));
  const city = (tz: string) => tz.split("/").pop()!.replace(/_/g, " ");
  const working = (w: [number, number][]) => w.some(([a, b]) => cursor >= a && cursor < b);
  const locals = rows.map(({ p }) => ({ p, l: localAt(p, reference, day, cursor) }));
  const total = (s: [number, number][]) => s.reduce((a, [x, y]) => a + y - x, 0);

  const toMinute = (e: { clientX: number }) => {
    const r = track.current!.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1439, ((e.clientX - r.left) / r.width) * 1440)) / 15) * 15;
  };
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); setCursor(toMinute(e)); };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => { if (drag) setCursor(toMinute(e)); };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 60 : 15;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); setCursor((c) => Math.max(0, Math.min(1439, c + (e.key === "ArrowRight" ? step : -step)))); }
    if (e.key === "Home") { e.preventDefault(); setCursor(0); }
    if (e.key === "End") { e.preventDefault(); setCursor(1425); }
    const go = o.all[0] ?? o.best[0];
    if (e.key === "Enter" && go) { e.preventDefault(); setCursor(go[0]); }
  };
  const valueText = locals.map(({ p, l }) => `${p.name} ${pad(l.hh)}:${pad(l.mm)}${l.dayShift ? ` ${l.weekday}` : ""}`).join(", ");

  return (
    <section className={`tzo tzo--${theme} ${className}`} aria-labelledby={`${id}-t`}>
      <header className="tzo__head">
        <div>
          <h3 id={`${id}-t`} className="tzo__title">{title}</h3>
          <p className="tzo__summary" aria-live="polite">
            {o.all.length
              ? <>Everyone is working {o.all.map(([a, b]) => `${hm(a)}–${hm(b)}`).join(" and ")} <span>({city(reference)} time, {Math.round(total(o.all) / 6) / 10} h)</span></>
              : o.best.length
                ? <>No hour suits everyone. Best: {o.best.map(([a, b]) => `${hm(a)}–${hm(b)}`).join(", ")} <span>without {o.missing.join(", ")}</span></>
                : <>No working hours overlap on this day.</>}
          </p>
        </div>
        <div className="tzo__day">
          <button type="button" onClick={() => shiftDay(-1)} aria-label="Previous day">‹</button>
          <span>{ymd ? dayLabel : "Today"}</span>
          <button type="button" onClick={() => shiftDay(1)} aria-label="Next day">›</button>
        </div>
      </header>

      <div className="tzo__grid">
        <div className="tzo__axis-pad" aria-hidden="true" />
        <div className="tzo__axis" aria-hidden="true">
          {HOURS.map((h) => <span key={h} style={{ left: `${(h / 24) * 100}%` }}>{pad(h % 24)}</span>)}
        </div>

        {rows.map(({ p, w }, i) => {
          const l = locals[i].l;
          return (
            <div key={p.id} className="tzo__row" data-on={working(w) || undefined}>
              <div className="tzo__who" style={{ gridRow: i + 2 }}>
                <strong>{p.name}</strong>
                <span>{city(p.tz)}</span>
                <time>{pad(l.hh)}:{pad(l.mm)}{l.dayShift ? <em> {l.dayShift > 0 ? "+1" : "−1"}</em> : null}</time>
              </div>
              <div className="tzo__lane" aria-hidden="true" style={{ gridRow: i + 2 }}>
                {w.map(([a, b]) => <i key={a} style={{ left: `${(a / 1440) * 100}%`, width: `${((b - a) / 1440) * 100}%` }} />)}
              </div>
            </div>
          );
        })}

        <div
          ref={track}
          className="tzo__track"
          role="slider"
          tabIndex={0}
          aria-label={`Time in ${city(reference)}`}
          aria-valuemin={0}
          aria-valuemax={1439}
          aria-valuenow={cursor}
          aria-valuetext={`${hm(cursor)} in ${city(reference)}: ${valueText}`}
          data-drag={drag || undefined}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={() => setDrag(false)}
          onPointerCancel={() => setDrag(false)}
          onKeyDown={onKey}
          style={{ gridRow: `2 / span ${rows.length}` } as CSSProperties}
        >
          {o.all.map(([a, b]) => <span key={a} className="tzo__shared" style={{ left: `${(a / 1440) * 100}%`, width: `${((b - a) / 1440) * 100}%` }} />)}
          <span className="tzo__cursor" style={{ left: `${(cursor / 1440) * 100}%` }}><b>{hm(cursor)}</b></span>
        </div>
      </div>
      <p className="tzo__keys" aria-hidden="true">Drag the line, or use ← → (Shift for an hour) · Enter jumps to the best hours</p>
    </section>
  );
}
