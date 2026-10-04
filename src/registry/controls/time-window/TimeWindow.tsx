"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import "./time-window.css";

/**
 * Time Window
 * A range picker over one day. The window you're choosing is the only clear
 * thing on the timeline; the rest of the day stays visible but recedes, so the
 * context — busy blocks, night, the current time — informs the choice without
 * competing with it. Horizontal when there's room; a vertical day column on a
 * phone, dragged the way a calendar is.
 */

export type Range = { start: number; end: number };
export type Busy = { start: number; end: number; label: string };

type Props = {
  value: Range;
  onChange: (r: Range) => void;
  busy?: Busy[];
  /** Minutes since midnight; draws the current-time marker. */
  now?: number;
  step?: number;
  minDuration?: number;
  maxDuration?: number;
  /** Hours treated as night (shaded). */
  night?: [number, number];
  label?: string;
  theme?: "paper" | "night";
};

const DAY = 1440;
export const fmtTime = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const fmtDur = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}`);

type Drag = { mode: "move" | "start" | "end"; offset: number } | null;

export function TimeWindow({ value, onChange, busy = [], now, step = 15, minDuration = 30, maxDuration = 480, night = [19, 6], label = "Meeting time", theme = "paper" }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [vertical, setVertical] = useState(false);
  const [drag, setDrag] = useState<Drag>(null);
  const [hint, setHint] = useState<string | null>(null);
  const hintId = useId();

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setVertical(e.contentRect.width < 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!hint) return;
    const t = window.setTimeout(() => setHint(null), 1800);
    return () => window.clearTimeout(t);
  }, [hint]);

  const snap = (m: number) => Math.round(m / step) * step;
  const dur = value.end - value.start;

  /** Apply a change, enforcing the day, the step and the duration limits. */
  const commit = (next: Range, edge: "start" | "end" | "move") => {
    let { start, end } = next;
    if (edge === "move") {
      const d = value.end - value.start;
      start = Math.max(0, Math.min(DAY - d, snap(start)));
      end = start + d;
    } else {
      start = Math.max(0, Math.min(DAY, snap(start)));
      end = Math.max(0, Math.min(DAY, snap(end)));
      const d = end - start;
      if (d < minDuration || d > maxDuration) {
        setHint(d < minDuration ? `At least ${fmtDur(minDuration)}` : `At most ${fmtDur(maxDuration)}`);
        const clamped = Math.max(minDuration, Math.min(maxDuration, d));
        if (edge === "start") start = end - clamped;
        else end = start + clamped;
        if (start < 0) (start = 0), (end = clamped);
        if (end > DAY) (end = DAY), (start = DAY - clamped);
      }
    }
    if (start !== value.start || end !== value.end) onChange({ start, end });
  };

  const minuteAt = (e: { clientX: number; clientY: number }) => {
    const r = trackRef.current!.getBoundingClientRect();
    const f = vertical ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
    return Math.max(0, Math.min(DAY, f * DAY));
  };

  const startDrag = (mode: "move" | "start" | "end") => (e: ReactPointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* the pointer may already be gone */
    }
    (e.currentTarget as HTMLElement).focus({ preventScroll: true });
    setDrag({ mode, offset: minuteAt(e) - value.start });
  };
  const onMove = (e: ReactPointerEvent) => {
    if (!drag) return;
    const m = minuteAt(e);
    if (drag.mode === "move") commit({ start: m - drag.offset, end: 0 }, "move");
    else if (drag.mode === "start") commit({ start: m, end: value.end }, "start");
    else commit({ start: value.start, end: m }, "end");
  };
  const endDrag = () => setDrag(null);

  // Clicking empty day moves the window there, centred on the click.
  const onTrackClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".time-window__window")) return;
    commit({ start: minuteAt(e) - dur / 2, end: 0 }, "move");
  };

  const keys = (mode: "move" | "start" | "end") => (e: ReactKeyboardEvent) => {
    const big = e.shiftKey ? 60 : step;
    const fwd = vertical ? ["ArrowDown", "ArrowRight"] : ["ArrowRight", "ArrowUp"];
    const back = vertical ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowDown"];
    let d = 0;
    if (fwd.includes(e.key)) d = big;
    else if (back.includes(e.key)) d = -big;
    else if (e.key === "PageUp") d = 60;
    else if (e.key === "PageDown") d = -60;
    else if (e.key === "Home" && mode === "move") return e.preventDefault(), commit({ start: 0, end: 0 }, "move");
    else if (e.key === "End" && mode === "move") return e.preventDefault(), commit({ start: DAY, end: 0 }, "move");
    else return;
    e.preventDefault();
    if (mode === "move") commit({ start: value.start + d, end: 0 }, "move");
    else if (mode === "start") commit({ start: value.start + d, end: value.end }, "start");
    else commit({ start: value.start, end: value.end + d }, "end");
  };

  const clashes = busy.filter((b) => b.start < value.end && b.end > value.start);
  const pct = (m: number) => `${(m / DAY) * 100}%`;
  const vars = { "--tw-a": pct(value.start), "--tw-b": pct(value.end) } as CSSProperties;
  const [nightFrom, nightTo] = night;

  const status = clashes.length ? `Overlaps ${clashes.map((c) => `${c.label} (${fmtTime(c.start)}–${fmtTime(c.end)})`).join(", ")}` : null;
  const valueText = `${fmtTime(value.start)} to ${fmtTime(value.end)}, ${fmtDur(dur)}`;

  return (
    <div
      ref={rootRef}
      className={`time-window time-window--${theme}`}
      data-orientation={vertical ? "vertical" : "horizontal"}
      data-dragging={drag?.mode}
      data-invalid={clashes.length ? "" : undefined}
      style={vars}
    >
      <div className="time-window__head">
        <p className="time-window__range" aria-live="polite">
          <span className="time-window__times">
            {fmtTime(value.start)} <span aria-hidden="true">–</span>
            <span className="time-window__sr"> to </span> {fmtTime(value.end)}
          </span>
          <span className="time-window__dur">{fmtDur(dur)}</span>
        </p>
        <p id={hintId} className="time-window__status" data-kind={status ? "error" : hint ? "hint" : undefined}>
          {status ?? hint ?? `Snaps to ${step} min · ${fmtDur(minDuration)} to ${fmtDur(maxDuration)}`}
        </p>
      </div>

      <div className="time-window__scroll">
        <div className="time-window__day">
          <div className="time-window__hours" aria-hidden="true">
            {Array.from({ length: 25 }, (_, h) => (
              <span key={h} className="time-window__hour" data-major={h % 6 === 0 || undefined} style={{ "--tw-p": pct(h * 60) } as CSSProperties}>
                <b>{h === 24 ? "" : String(h).padStart(2, "0")}</b>
              </span>
            ))}
          </div>

          <div ref={trackRef} className="time-window__track" onClick={onTrackClick} onPointerMove={onMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
            {/* Context: night, busy time and now. */}
            <span className="time-window__night" style={{ "--tw-s": pct(0), "--tw-e": pct(nightTo * 60) } as CSSProperties} aria-hidden="true" />
            <span className="time-window__night" style={{ "--tw-s": pct(nightFrom * 60), "--tw-e": pct(DAY) } as CSSProperties} aria-hidden="true" />
            {busy.map((b) => (
              <span key={b.label + b.start} title={`${b.label} · ${fmtTime(b.start)}–${fmtTime(b.end)}`} className="time-window__busy" data-clash={clashes.includes(b) || undefined} style={{ "--tw-s": pct(b.start), "--tw-e": pct(b.end) } as CSSProperties}>
                <span>{b.label}</span>
              </span>
            ))}
            {now !== undefined && (
              <span className="time-window__now" style={{ "--tw-p": pct(now) } as CSSProperties}>
                <span>Now {fmtTime(now)}</span>
              </span>
            )}

            {/* Everything outside the window recedes. */}
            <span className="time-window__shade time-window__shade--before" aria-hidden="true" />
            <span className="time-window__shade time-window__shade--after" aria-hidden="true" />

            <div
              className="time-window__window"
              role="group"
              aria-label={label}
              aria-describedby={hintId}
            >
              <div
                className="time-window__body"
                role="slider"
                tabIndex={0}
                aria-label={`Move ${label.toLowerCase()}`}
                aria-valuemin={0}
                aria-valuemax={DAY - dur}
                aria-valuenow={value.start}
                aria-valuetext={valueText}
                aria-invalid={clashes.length ? true : undefined}
                onPointerDown={startDrag("move")}
                onKeyDown={keys("move")}
              >
                {clashes.map((c) => (
                  <span
                    key={c.label}
                    className="time-window__conflict"
                    style={{ "--tw-s": `${((Math.max(c.start, value.start) - value.start) / dur) * 100}%`, "--tw-e": `${((Math.min(c.end, value.end) - value.start) / dur) * 100}%` } as CSSProperties}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div
                className="time-window__handle time-window__handle--start"
                role="slider"
                tabIndex={0}
                aria-label="Start time"
                aria-valuemin={0}
                aria-valuemax={value.end - minDuration}
                aria-valuenow={value.start}
                aria-valuetext={fmtTime(value.start)}
                onPointerDown={startDrag("start")}
                onKeyDown={keys("start")}
              />
              <div
                className="time-window__handle time-window__handle--end"
                role="slider"
                tabIndex={0}
                aria-label="End time"
                aria-valuemin={value.start + minDuration}
                aria-valuemax={DAY}
                aria-valuenow={value.end}
                aria-valuetext={fmtTime(value.end)}
                onPointerDown={startDrag("end")}
                onKeyDown={keys("end")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
