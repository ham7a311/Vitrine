"use client";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import "./reactive-prose.css";

type Values = Record<string, number>;
type Outputs = Record<string, number | string | number[]>;
type Ctx = {
  values: Values;
  outputs: Outputs;
  changed: Set<string>;
  lit: Set<string>;
  invalid: string | null;
  set: (name: string, v: number, settle?: boolean) => void;
  light: (name: string | null) => void;
  label: (name: string, label: string) => void;
};
const ProseContext = createContext<Ctx | null>(null);
const useProse = () => { const c = useContext(ProseContext); if (!c) throw new Error("Use inside <ReactiveProse>"); return c; };

export type ReactiveProseProps = {
  initial: Values;
  /** Derive every output from the inputs. Throwing keeps the last good outputs. */
  compute: (values: Values) => Outputs;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Reactive Prose
 * A paragraph that is also the calculator. Drag or type any underlined number
 * and every figure that depends on it is recalculated in the sentence; hover a
 * number first to see which ones those are.
 */
export function ReactiveProse({ initial, compute, theme = "light", motion = true, className = "", children }: ReactiveProseProps) {
  const [values, setValues] = useState(initial);
  const [outputs, setOutputs] = useState<Outputs>(() => compute(initial));
  const [changed, setChanged] = useState<Set<string>>(() => new Set());
  const [lit, setLit] = useState<Set<string>>(() => new Set());
  const [invalid, setInvalid] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const labels = useRef(new Map<string, string>());
  const settled = useRef(outputs);
  const run = useRef(compute);
  run.current = compute;

  const show = (v: number | string | number[] | undefined) => (Array.isArray(v) ? "" : String(v ?? ""));
  const current = useRef({ values, outputs });
  const set = useCallback((name: string, v: number, settle = true) => {
    const next = { ...current.current.values, [name]: v };
    current.current.values = next;
    setValues(next);
    try {
      const out = run.current(next), old = current.current.outputs;
      current.current.outputs = out;
      setOutputs(out);
      setChanged(new Set(Object.keys(out).filter((k) => JSON.stringify(out[k]) !== JSON.stringify(old[k]))));
      setInvalid(null);
      if (settle) {
        const was = settled.current;
        settled.current = out;
        const said = [...labels.current].filter(([k]) => JSON.stringify(out[k]) !== JSON.stringify(was[k])).map(([k, l]) => `${l} ${show(out[k])}`);
        setMessage(said.length ? `${said.join(", ")}.` : "No change.");
      }
    } catch {
      setInvalid(name);
    }
  }, []);

  // Which outputs move when one input moves: nudge it and compare.
  const light = useCallback((name: string | null) => {
    if (!name) return setLit(new Set());
    try {
      const base = run.current(values), bumped = run.current({ ...values, [name]: values[name] * 1.25 + 1 });
      setLit(new Set(Object.keys(base).filter((k) => JSON.stringify(base[k]) !== JSON.stringify(bumped[k]))));
    } catch { setLit(new Set()); }
  }, [values]);
  const label = useCallback((name: string, l: string) => { labels.current.set(name, l); }, []);

  const ctx = useMemo(() => ({ values, outputs, changed, lit, invalid, set, light, label }), [values, outputs, changed, lit, invalid, set, light, label]);
  return (
    <ProseContext.Provider value={ctx}>
      <div className={`rprose rprose--${theme} ${className}`} data-motion={motion ? undefined : "off"}>
        {children}
        <p className="rprose__sr" aria-live="polite">{message}</p>
      </div>
    </ProseContext.Provider>
  );
}

export type ScrubProps = {
  name: string;
  /** Spoken and shown as a tooltip, e.g. "new readers per week". */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
  /** Pixels of drag per step. */
  pixels?: number;
};

/** An inline number you can drag sideways, nudge with the arrow keys, or type. */
export function Scrub({ name, label, min = -Infinity, max = Infinity, step = 1, format = (v) => String(v), pixels = 6 }: ScrubProps) {
  const id = useId();
  const { values, set, light, invalid } = useProse();
  const value = values[name];
  const [draft, setDraft] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const start = useRef<{ x: number; v: number; moved: boolean } | null>(null);
  const clamp = (v: number) => {
    const n = Math.round((Math.max(min, Math.min(max, v)) - (Number.isFinite(min) ? min : 0)) / step) * step + (Number.isFinite(min) ? min : 0);
    return Number(n.toFixed(6));
  };

  const onDown = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (document.activeElement === input.current) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, v: value, moved: false };
  };
  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (!s.moved && Math.abs(dx) < 3) return;
    if (!s.moved) { s.moved = true; setDrag(true); light(name); }
    const next = clamp(s.v + Math.round(dx / pixels) * step);
    if (next !== values[name]) set(name, next, false);
  };
  const onUp = () => {
    const s = start.current;
    start.current = null;
    setDrag(false);
    if (!s) return;
    if (s.moved) set(name, values[name], true);
    else { input.current?.focus(); input.current?.select(); }
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      setDraft(null);
      set(name, clamp(value + (e.key === "ArrowUp" ? 1 : -1) * step * (e.shiftKey ? 10 : 1)), true);
    } else if (e.key === "Enter") { e.preventDefault(); commit(); input.current?.select(); }
    else if (e.key === "Escape") { e.preventDefault(); setDraft(null); input.current?.blur(); }
  };
  const commit = () => {
    if (draft === null) return;
    const n = Number(draft.replace(/[^\d.-]/g, ""));
    setDraft(null);
    if (Number.isFinite(n) && draft.trim() !== "") set(name, clamp(n), true);
  };
  const text = draft ?? format(value);

  return (
    <span className="rprose__scrub" data-drag={drag || undefined} data-invalid={invalid === name || undefined}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      onPointerEnter={() => !start.current && light(name)} onPointerLeave={() => !start.current && light(null)}>
      <span className="rprose__ruler" aria-hidden="true" style={{ backgroundPositionX: `${-(value / step) * pixels}px` }} />
      <input
        ref={input}
        id={id}
        className="rprose__input"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        aria-label={label}
        aria-describedby={`${id}-hint`}
        aria-invalid={invalid === name || undefined}
        value={text}
        size={Math.max(2, text.length)}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => light(name)}
        onBlur={() => { commit(); light(null); }}
        onKeyDown={onKey}
      />
      <span id={`${id}-hint`} hidden>Drag sideways or use the arrow keys to change; type a number and press Enter.</span>
    </span>
  );
}

/** A value computed from the inputs, shown in the sentence. */
export function Out({ name, label, format }: { name: string; label?: string; format?: (v: number | string) => string }) {
  const { outputs, changed, lit, label: register } = useProse();
  useEffect(() => { if (label) register(name, label); }, [name, label, register]);
  const v = outputs[name];
  const text = Array.isArray(v) ? "" : format ? format(v) : String(v);
  return (
    <output className="rprose__out" data-lit={lit.has(name) || undefined}>
      <span key={text} className="rprose__out-text" data-changed={changed.has(name) || undefined}>{text}</span>
    </output>
  );
}

/** A small line chart of a computed series, with an optional horizontal target (a number or an output's name). */
export function Trend({ name, target: goal, caption, height = 64 }: { name: string; target?: number | string; caption?: ReactNode; height?: number }) {
  const { outputs, lit } = useProse();
  const target = typeof goal === "string" ? Number(outputs[goal]) : goal;
  const data = (outputs[name] as number[] | undefined) ?? [];
  const W = 320, H = height, pad = 4;
  const hi = Math.max(...data, target ?? 0, 1), lo = Math.min(...data, 0);
  const px = (i: number) => pad + (i / Math.max(1, data.length - 1)) * (W - pad * 2);
  const py = (v: number) => H - pad - ((v - lo) / (hi - lo || 1)) * (H - pad * 2);
  const d = data.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join("");
  return (
    <figure className="rprose__trend" data-lit={lit.has(name) || undefined}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        {target !== undefined && <line x1={pad} x2={W - pad} y1={py(target)} y2={py(target)} className="rprose__target" />}
        <path d={d} className="rprose__line" />
        {data.length > 0 && <circle cx={px(data.length - 1)} cy={py(data[data.length - 1])} r="3" className="rprose__end" />}
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
