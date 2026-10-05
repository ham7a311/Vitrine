"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { layout, project, route, slotAt, RAIL, type Point, type Slot } from "./gate";
import "./gate-selector.css";

export type { Slot } from "./gate";
export type GateState = { id: string; label: string; description?: string };
export type GateSelectorProps = {
  states: GateState[];
  /** Where each state's slot is cut: its column on the rail and which side. */
  slots: Record<string, Slot>;
  /** For each state, the states you may move to from it. */
  transitions: Record<string, string[]>;
  /** Why a move is not allowed, shown on the stop plate's state. */
  reason?: (from: string, to: string) => string | undefined;
  defaultValue: string;
  /** Persist the move; reject to send the knob back with the error message. */
  onChange?: (next: string, prev: string) => Promise<void> | void;
  label?: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Gate Selector
 * A status control cut like a gear-shift gate. From the current state, the
 * slots you can't reach are closed by a stop plate, so the shape of the gate
 * is the set of allowed moves.
 */
export function GateSelector({ states, slots, transitions, reason, defaultValue, onChange, label = "Status", theme = "light", motion = true, className = "" }: GateSelectorProps) {
  const id = useId();
  const L = useMemo(() => layout(slots), [slots]);
  const ids = useMemo(() => states.map((s) => s.id), [states]);
  const byId = useMemo(() => new Map(states.map((s) => [s.id, s])), [states]);
  const [value, setValue] = useState(defaultValue);
  const [pending, setPending] = useState<string | null>(null);
  const [focus, setFocus] = useState(defaultValue);
  const [note, setNote] = useState<{ kind: "info" | "blocked" | "error" | "done"; text: string } | null>(null);
  const [knob, setKnob] = useState<Point>(() => ({ x: L.at(defaultValue).cx, y: L.at(defaultValue).end }));
  const [dragging, setDragging] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const knobEl = useRef<SVGGElement>(null);
  const radios = useRef(new Map<string, HTMLButtonElement>());
  const busy = useRef(false);
  const reduced = useRef(false);
  useEffect(() => { reduced.current = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches; }, [motion]);

  const allowed = (to: string, from = value) => to !== from && (transitions[from] ?? []).includes(to);
  const whyNot = (to: string) => reason?.(value, to) ?? `Not reachable from ${byId.get(value)?.label}.`;
  const open = (sid: string) => sid === value || allowed(sid);
  const end = (sid: string): Point => ({ x: L.at(sid).cx, y: L.at(sid).end });
  const mouth = (sid: string): Point => ({ x: L.at(sid).cx, y: L.at(sid).mouth });

  // Travel along the cut, rail first, at a steady speed.
  const travel = async (to: Point, from = knob) => {
    const pts = route(L, from, to);
    const el = knobEl.current;
    if (!reduced.current && el && pts.length > 1) {
      const lens = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
      const total = lens.reduce((a, b) => a + b, 0) || 1;
      let acc = 0;
      const frames = pts.map((p, i) => { if (i) acc += lens[i - 1]; return { transform: `translate(${p.x}px, ${p.y}px)`, offset: acc / total }; });
      await el.animate(frames, { duration: 140 + total * 1.1, easing: "cubic-bezier(.2,.8,.2,1)" }).finished.catch(() => {});
    }
    setKnob(to);
  };
  const bump = async (to: string) => {
    if (busy.current) return;
    busy.current = true;
    setNote({ kind: "blocked", text: `${byId.get(to)?.label}: ${whyNot(to)}` });
    const home = end(value);
    await travel(mouth(to), home);
    await travel(home, mouth(to));
    busy.current = false;
  };
  const commit = async (to: string, from = knob) => {
    if (busy.current || to === value) { if (to === value) await travel(end(value), from); return; }
    if (!allowed(to)) return bump(to);
    busy.current = true;
    const prev = value;
    setPending(to);
    setNote({ kind: "info", text: `Moving to ${byId.get(to)?.label}…` });
    await travel(mouth(to), from);
    try {
      await onChange?.(to, prev);
      await travel(end(to), mouth(to));
      setValue(to);
      setFocus(to);
      setNote({ kind: "done", text: `Now ${byId.get(to)?.label}.` });
    } catch (e) {
      await travel(end(prev), mouth(to));
      setNote({ kind: "error", text: (e as Error)?.message || `Couldn't move to ${byId.get(to)?.label}. Still ${byId.get(prev)?.label}.` });
    } finally {
      setPending(null);
      busy.current = false;
    }
  };

  const toLocal = (e: { clientX: number; clientY: number }): Point => {
    const r = svg.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * L.width, y: ((e.clientY - r.top) / r.height) * L.height };
  };
  const onDown = (e: ReactPointerEvent<SVGGElement>) => {
    if (busy.current) return;
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
  };
  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const p = project(L, ids, open, toLocal(e));
    setKnob(p);
    const s = slotAt(L, ids, p);
    if (s && !open(s.id)) setNote({ kind: "blocked", text: `${byId.get(s.id)?.label}: ${whyNot(s.id)}` });
  };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    const s = slotAt(L, ids, knob);
    if (s && s.depth > 0.55 && open(s.id)) commit(s.id, knob);
    else travel(end(value));
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const order = ids;
    const i = order.indexOf(focus);
    let next: string | undefined;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = order[(i + 1) % order.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = order[(i - 1 + order.length) % order.length];
    else if (e.key === "Home") next = order[0];
    else if (e.key === "End") next = order[order.length - 1];
    if (next) { e.preventDefault(); setFocus(next); radios.current.get(next)?.focus(); }
  };

  const reachable = (transitions[value] ?? []).filter((t) => t !== value).map((t) => byId.get(t)?.label).filter(Boolean);

  return (
    <div className={`gsel gsel--${theme} ${className}`} data-motion={motion ? undefined : "off"} data-dragging={dragging || undefined}>
      <p id={`${id}-l`} className="gsel__label">{label}<span>{byId.get(value)?.label}</span></p>
      <div className="gsel__plate" style={{ aspectRatio: `${L.width} / ${L.height}` }}>
        <svg ref={svg} className="gsel__svg" viewBox={`0 0 ${L.width} ${L.height}`} aria-hidden="true" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <rect className="gsel__face" x="2" y="2" width={L.width - 4} height={L.height - 4} rx="18" />
          {[[16, 16], [L.width - 16, 16], [16, L.height - 16], [L.width - 16, L.height - 16]].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`} className="gsel__screw"><circle cx={cx} cy={cy} r="5" /><path d={`M${cx - 3} ${cy + 1}L${cx + 3} ${cy - 1}`} /></g>
          ))}
          <g className="gsel__cut">
            <path d={`M${L.railFrom} ${RAIL}H${L.railTo}`} />
            {ids.map((sid) => { const s = L.at(sid); return <path key={sid} d={`M${s.cx} ${RAIL}V${s.end}`} />; })}
          </g>
          <g className="gsel__cut-inner">
            <path d={`M${L.railFrom} ${RAIL}H${L.railTo}`} />
            {ids.map((sid) => { const s = L.at(sid); return <path key={sid} d={`M${s.cx} ${RAIL}V${s.end}`} />; })}
          </g>
          {ids.filter((sid) => !open(sid)).map((sid) => {
            const s = L.at(sid), y = s.mouth + s.dir * 13;
            return (
              <g key={sid} className="gsel__stop" data-pending={pending === sid || undefined}>
                <rect x={s.cx - 21} y={y - 5} width="42" height="10" rx="2" />
                <circle cx={s.cx - 14} cy={y} r="1.8" /><circle cx={s.cx + 14} cy={y} r="1.8" />
              </g>
            );
          })}
          <g ref={knobEl} className="gsel__knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} onPointerDown={onDown} data-pending={pending ? true : undefined}>
            <circle className="gsel__knob-hit" r="26" />
            <circle className="gsel__knob-ball" r="17" />
            <circle className="gsel__knob-ring" r="10" />
          </g>
        </svg>

        <div className="gsel__states" role="radiogroup" aria-labelledby={`${id}-l`} aria-describedby={`${id}-n`} onKeyDown={onKey}>
          {states.map((st) => {
            const s = L.at(st.id);
            const blocked = !open(st.id);
            return (
              <button
                key={st.id}
                ref={(el) => { if (el) radios.current.set(st.id, el); else radios.current.delete(st.id); }}
                type="button"
                role="radio"
                aria-checked={st.id === value}
                aria-disabled={blocked || undefined}
                aria-describedby={blocked ? `${id}-r-${st.id}` : st.description ? `${id}-d-${st.id}` : undefined}
                tabIndex={st.id === focus ? 0 : -1}
                className="gsel__state"
                data-side={s.dir < 0 ? "up" : "down"}
                data-current={st.id === value || undefined}
                data-blocked={blocked || undefined}
                data-pending={pending === st.id || undefined}
                style={{ left: `${(s.cx / L.width) * 100}%`, top: `${((s.dir < 0 ? s.end - 34 : s.end + 34) / L.height) * 100}%` }}
                onFocus={() => setFocus(st.id)}
                onClick={() => commit(st.id, knob)}
              >
                {st.label}
                <span id={`${id}-r-${st.id}`} hidden>{blocked ? whyNot(st.id) : ""}</span>
                {st.description && <span id={`${id}-d-${st.id}`} hidden>{st.description}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <p id={`${id}-n`} className="gsel__note" data-kind={note?.kind} aria-live="polite">
        {note?.text ?? (reachable.length ? `From ${byId.get(value)?.label} you can go to ${reachable.join(", ")}.` : "No moves from here.")}
      </p>
    </div>
  );
}
