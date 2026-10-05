"use client";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import "./notification-dial.css";

export type DialLevel = { id: string; label: string; description: string };
export type DialSample = { id: string; title: string; source: string; /** Lowest level index that delivers it (1 = the first level above Off). */ minLevel: number; /** 0 = Monday … 6 = Sunday. */ day: number };
export type NotificationDialProps = {
  levels: DialLevel[];
  samples: DialSample[];
  defaultValue?: number;
  onChange?: (level: number) => void;
  /** Shown when nothing would be delivered. */
  emptyText?: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const START = -225, SWEEP = 270, R = 74, C = 100;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const polar = (deg: number, r = R) => { const a = (deg * Math.PI) / 180; return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) }; };
const arc = (from: number, to: number, r = R) => {
  const a = polar(from, r), b = polar(to, r);
  return `M${a.x} ${a.y}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
};

/**
 * Notification Dial
 * One dial instead of a wall of checkboxes, and beside it the consequence: a
 * sample week of what would actually reach you at that setting.
 */
export function NotificationDial({ levels, samples, defaultValue = 2, onChange, emptyText = "Nothing will reach you. You can still check in yourself.", theme = "light", motion = true, className = "" }: NotificationDialProps) {
  const id = useId();
  const [level, setLevel] = useState(defaultValue);
  const [drag, setDrag] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const rects = useRef(new Map<string, DOMRect>());
  const reduced = useRef(false);
  useEffect(() => { reduced.current = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches; }, [motion]);

  const n = levels.length;
  const angleOf = (i: number) => START + (SWEEP * i) / Math.max(1, n - 1);
  const shownAngle = drag ?? angleOf(level);
  const delivered = useMemo(() => samples.filter((s) => level > 0 && s.minLevel <= level), [samples, level]);
  const count = useCount(delivered.length, motion);
  const sources = useMemo(() => [...new Set(samples.map((s) => s.source))], [samples]);

  const set = (i: number) => {
    const v = Math.max(0, Math.min(n - 1, i));
    if (v === level) return;
    rects.current = new Map([...rows.current].map(([k, el]) => [k, el.getBoundingClientRect()]));
    setLevel(v);
    onChange?.(v);
  };
  useLayoutEffect(() => {
    if (reduced.current || !rects.current.size) { rects.current = new Map(); return; }
    for (const [k, el] of rows.current) {
      const a = rects.current.get(k), b = el.getBoundingClientRect();
      if (!a) el.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" });
      else if (Math.abs(a.top - b.top) > 1) el.animate([{ transform: `translateY(${a.top - b.top}px)` }, { transform: "none" }], { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    rects.current = new Map();
  }, [level]);

  const angleFrom = (e: { clientX: number; clientY: number }) => {
    const r = svg.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 200 - C, y = ((e.clientY - r.top) / r.height) * 200 - C;
    let a = (Math.atan2(y, x) * 180) / Math.PI;
    if (a > 45 + 45) a -= 360; // put the dead zone at the bottom
    return Math.max(START, Math.min(START + SWEEP, a));
  };
  const nearest = (a: number) => Math.round(((a - START) / SWEEP) * (n - 1));
  const onDown = (e: ReactPointerEvent<SVGSVGElement>) => { e.currentTarget.setPointerCapture(e.pointerId); const a = angleFrom(e); setDrag(a); set(nearest(a)); };
  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => { if (drag === null) return; const a = angleFrom(e); setDrag(a); set(nearest(a)); };
  const onUp = () => setDrag(null);
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (step) { e.preventDefault(); set(level + step); }
    if (e.key === "Home") { e.preventDefault(); set(0); }
    if (e.key === "End") { e.preventDefault(); set(n - 1); }
  };

  const knob = polar(shownAngle, R - 22);
  const perDay = DAYS.map((_, d) => delivered.filter((s) => s.day === d));

  return (
    <section className={`ndial ndial--${theme} ${className}`} data-motion={motion ? undefined : "off"} data-off={level === 0 || undefined} aria-labelledby={`${id}-h`}>
      <div className="ndial__body">
        <div className="ndial__control">
          <h3 id={`${id}-h`} className="ndial__title">Notifications</h3>
          <svg
            ref={svg}
            className="ndial__dial"
            viewBox="0 0 200 200"
            role="slider"
            tabIndex={0}
            aria-labelledby={`${id}-h`}
            aria-valuemin={0}
            aria-valuemax={n - 1}
            aria-valuenow={level}
            aria-valuetext={`${levels[level].label}: ${levels[level].description.replace(/\.$/, "")}. About ${delivered.length} a week.`}
            data-drag={drag !== null || undefined}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
          >
            <path d={arc(START, START + SWEEP)} className="ndial__track" />
            {level > 0 && <path d={arc(START, angleOf(level))} className="ndial__fill" />}
            {levels.map((l, i) => { const a = polar(angleOf(i), R + 12), b = polar(angleOf(i), R + 4); return <line key={l.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="ndial__tick" data-on={i <= level || undefined} />; })}
            <circle cx={C} cy={C} r={R - 12} className="ndial__face" />
            <line x1={C} y1={C} x2={knob.x} y2={knob.y} className="ndial__pointer" style={{ transition: drag === null ? undefined : "none" }} />
            <circle cx={knob.x} cy={knob.y} r="6" className="ndial__dot" />
            <text x={C} y={C + 6} className="ndial__value">{levels[level].label}</text>
          </svg>
          <ol className="ndial__labels" aria-hidden="true">
            {levels.map((l, i) => (
              <li key={l.id} data-on={i === level || undefined}><button type="button" tabIndex={-1} onClick={() => set(i)}>{l.label}</button></li>
            ))}
          </ol>
          <p className="ndial__desc">{levels[level].description}</p>
        </div>

        <div className="ndial__preview">
          <p className="ndial__count"><span>A typical week at this setting</span><strong>{count}</strong></p>
          <div className="ndial__week" aria-hidden="true">
            {perDay.map((items, d) => (
              <div key={DAYS[d]} className="ndial__day">
                <span className="ndial__stack">{items.map((s) => <i key={s.id} data-src={sources.indexOf(s.source) % 4} />)}</span>
                <span>{DAYS[d]}</span>
              </div>
            ))}
          </div>
          {level === 0 ? (
            <p className="ndial__empty">{emptyText}</p>
          ) : (
            <ul className="ndial__list" aria-label="Examples of what you'd get">
              {delivered.slice(0, 6).map((s) => (
                <li key={s.id} ref={(el) => { if (el) rows.current.set(s.id, el); else rows.current.delete(s.id); }}>
                  <i data-src={sources.indexOf(s.source) % 4} aria-hidden="true" />
                  <span className="ndial__item">{s.title}</span>
                  <span className="ndial__src">{s.source} · {DAYS[s.day]}</span>
                </li>
              ))}
              {delivered.length > 6 && <li className="ndial__more">and {delivered.length - 6} more</li>}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function useCount(value: number, motion: boolean) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (!motion || matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(value); from.current = value; return; }
    const a = from.current, t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / 360); const v = Math.round(a + (value - a) * (1 - (1 - k) ** 3)); setShown(v); from.current = v; if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, motion]);
  return shown;
}
