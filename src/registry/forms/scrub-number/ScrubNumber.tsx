"use client";
import { createContext, useContext, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { evaluate } from "./expr";
import "./scrub-number.css";

type GroupCtx = { theme: "light" | "dark"; motion: boolean } | null;
const Group = createContext<GroupCtx>(null);

export type ScrubGroupProps = { title?: string; columns?: number; theme?: "light" | "dark"; motion?: boolean; className?: string; children: ReactNode };

/** A panel of scrub fields, like a design tool's inspector. */
export function ScrubGroup({ title, columns = 2, theme = "light", motion = true, className = "", children }: ScrubGroupProps) {
  return (
    <Group.Provider value={{ theme, motion }}>
      <section className={`scrubn scrubn--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-label={title}>
        {title && <h3 className="scrubn__title">{title}</h3>}
        <div className="scrubn__grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>{children}</div>
      </section>
    </Group.Provider>
  );
}

export type ScrubNumberProps = {
  label: string;
  /** A short handle shown in the field ("X", "W", "↻"); the full label is still spoken. */
  short?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places kept. */
  precision?: number;
  unit?: string;
  /** Pixels of drag per step. */
  pixels?: number;
  theme?: "light" | "dark";
  motion?: boolean;
};

/**
 * Scrub Number
 * The number field from design tools: drag the label to scrub (Shift ×10,
 * Alt ×0.1), arrow keys to nudge, and arithmetic in the box: 12*4, (100-8)/2, +=8.
 */
export function ScrubNumber(props: ScrubNumberProps) {
  const group = useContext(Group);
  if (group) return <Field {...props} />;
  const { theme = "light", motion = true } = props;
  return (
    <div className={`scrubn scrubn--${theme} scrubn--solo`} data-motion={motion ? undefined : "off"}>
      <Field {...props} />
    </div>
  );
}

function Field({ label, short, value, onChange, min = -Infinity, max = Infinity, step = 1, precision = 0, unit, pixels = 3 }: ScrubNumberProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [scrub, setScrub] = useState(false);
  const [edge, setEdge] = useState<"min" | "max" | null>(null);
  const [bad, setBad] = useState(false);
  const acc = useRef(0);
  const lastX = useRef(0);
  const live = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const badTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);
  live.current = value;
  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(badTimer.current); }, []);

  const round = (v: number) => Number(v.toFixed(precision));
  const fmt = (v: number) => v.toFixed(precision);
  const put = (raw: number) => {
    const v = round(Math.max(min, Math.min(max, raw)));
    if (raw < min || raw > max) {
      setEdge(raw < min ? "min" : "max");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setEdge(null), 320);
    }
    live.current = v;
    if (v !== value) onChange(v);
  };
  const mult = (e: { shiftKey: boolean; altKey: boolean }) => (e.shiftKey ? 10 : e.altKey ? 0.1 : 1);

  const onDown = (e: ReactPointerEvent<HTMLLabelElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    acc.current = 0;
    lastX.current = e.clientX;
    setScrub(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    // Pointer lock lets a scrub keep going past the screen edge; without it, capture still works.
    if (e.pointerType === "mouse") {
      try { const r = (e.currentTarget.requestPointerLock as () => unknown).call(e.currentTarget); if (r instanceof Promise) r.catch(() => {}); } catch { /* not allowed here; capture is enough */ }
    }
  };
  const onMove = (e: ReactPointerEvent<HTMLLabelElement>) => {
    if (!scrub) return;
    // Locked pointers only report movement; otherwise the position is the more reliable source.
    const locked = document.pointerLockElement === e.currentTarget;
    const dx = locked ? (Math.abs(e.movementX) < 300 ? e.movementX : 0) : e.clientX - lastX.current;
    lastX.current = e.clientX;
    acc.current += dx;
    const steps = Math.trunc(acc.current / pixels);
    if (!steps) return;
    acc.current -= steps * pixels;
    put(live.current + steps * step * mult(e));
  };
  const onUp = () => {
    if (!scrub) return;
    setScrub(false);
    if (document.pointerLockElement) document.exitPointerLock();
  };

  const commit = () => {
    if (draft === null) return;
    const v = evaluate(draft, value);
    setDraft(null);
    if (v === null) {
      if (draft.trim() !== fmt(value)) { setBad(true); clearTimeout(badTimer.current); badTimer.current = setTimeout(() => setBad(false), 900); }
      return;
    }
    put(v);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      setDraft(null);
      put(value + (e.key === "ArrowUp" ? 1 : -1) * step * mult(e));
    } else if (e.key === "Enter") { e.preventDefault(); commit(); requestAnimationFrame(() => input.current?.select()); }
    else if (e.key === "Escape") { e.preventDefault(); setDraft(null); }
  };

  return (
    <div className="scrubn__field" data-scrub={scrub || undefined} data-edge={edge ?? undefined} data-bad={bad || undefined}>
      <label
        htmlFor={id}
        className="scrubn__handle"
        title={`${label}: drag to change`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onLostPointerCapture={onUp}
      >
        <span aria-hidden="true">{short ?? label}</span>
        <span className="scrubn__sr">{short ? label : ""}</span>
      </label>
      <input
        ref={input}
        id={id}
        className="scrubn__input"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        value={draft ?? fmt(value)}
        aria-invalid={bad || undefined}
        aria-describedby={`${id}-h`}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={commit}
        onKeyDown={onKey}
      />
      {unit && <span className="scrubn__unit" aria-hidden="true">{unit}</span>}
      <span className="scrubn__ticks" aria-hidden="true" style={{ backgroundPositionX: `${(-value / step) * pixels}px` }} />
      <span id={`${id}-h`} className="scrubn__sr">{bad ? "Couldn't read that; the value is unchanged. " : ""}Use arrow keys to change by {step}{unit ? ` ${unit}` : ""}, Shift for ten times that. You can type arithmetic such as +=8.{Number.isFinite(min) || Number.isFinite(max) ? ` Range ${Number.isFinite(min) ? min : "any"} to ${Number.isFinite(max) ? max : "any"}.` : ""}</span>
    </div>
  );
}
