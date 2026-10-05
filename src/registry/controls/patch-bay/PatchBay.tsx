"use client";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { catenary, check, connect, unplug, type Cable, type Input, type Jack } from "./patch";
import "./patch-bay.css";

export type { Cable, Input, Jack } from "./patch";
export type PatchBayProps = {
  outputs: Jack[];
  inputs: Input[];
  defaultCables?: Cable[];
  onChange?: (cables: Cable[]) => void;
  /** Cable colour per signal type. */
  colors?: Record<string, string>;
  title?: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const PALETTE = ["#e0a23a", "#8b6cf0", "#1fa39a", "#3f7fe0", "#e05a8a", "#6aa84f"];
type Pt = [number, number];

/**
 * Patch Bay
 * Routing as cables: sources on the left, destinations on the right. Drag a
 * cable from a jack and it hangs with real slack; a destination that can't
 * take the signal refuses the plug and says why. Click a plug to pull it.
 */
export function PatchBay({ outputs, inputs, defaultCables = [], onChange, colors = {}, title = "Routing", theme = "light", motion = true, className = "" }: PatchBayProps) {
  const id = useId();
  const [cables, setCables] = useState<Cable[]>(defaultCables);
  const [armed, setArmed] = useState<string | null>(null);
  const [drag, setDrag] = useState<Pt | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [refused, setRefused] = useState<{ to: string; reason: string } | null>(null);
  const [message, setMessage] = useState("");
  const [pos, setPos] = useState<Record<string, Pt>>({});
  const [settle, setSettle] = useState<{ to: string; t: number } | null>(null);
  const rack = useRef<HTMLDivElement>(null);
  const jacks = useRef(new Map<string, HTMLButtonElement>());
  const moved = useRef(false);

  const types = [...new Set(outputs.map((o) => o.type))];
  const color = (t: string) => colors[t] ?? PALETTE[types.indexOf(t) % PALETTE.length];
  const out = (oid: string) => outputs.find((o) => o.id === oid)!;
  const inp = (iid: string) => inputs.find((i) => i.id === iid)!;
  const plugged = (iid: string) => cables.find((c) => c.to === iid);

  // Jack centres in rack coordinates, kept fresh as the layout changes.
  const measure = useCallback(() => {
    const box = rack.current?.getBoundingClientRect();
    if (!box) return;
    const next: Record<string, Pt> = {};
    jacks.current.forEach((el, k) => { const r = el.getBoundingClientRect(); next[k] = [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2]; });
    setPos(next);
  }, []);
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (rack.current) ro.observe(rack.current);
    return () => ro.disconnect();
  }, [measure]);

  // A freshly plugged cable swings once and settles.
  useEffect(() => {
    if (!settle) return;
    let raf = 0;
    const tick = () => { if (performance.now() - settle.t < 1100) { setPos((p) => ({ ...p })); raf = requestAnimationFrame(tick); } else setSettle(null); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [settle]);
  const slackFor = (to: string) => {
    if (!settle || settle.to !== to) return 0.22;
    const s = (performance.now() - settle.t) / 1000;
    return 0.22 + 0.28 * Math.exp(-s * 4.5) * Math.cos(s * 13);
  };

  const commit = (next: Cable[], msg: string) => { setCables(next); onChange?.(next); setMessage(msg); };
  const tryPlug = (from: string, to: string) => {
    const r = check(out(from), inp(to));
    if (!r.ok) {
      setRefused({ to, reason: r.reason });
      setMessage(`Refused. ${r.reason}.`);
      return false;
    }
    const prev = plugged(to);
    commit(connect(cables, { from, to }), `${out(from).name} connected to ${inp(to).name}${prev && prev.from !== from ? `, replacing ${out(prev.from).name}` : ""}.`);
    setRefused(null);
    const still = !motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still) setSettle({ to, t: performance.now() });
    return true;
  };
  const pull = (to: string) => {
    const c = plugged(to);
    if (!c) return;
    commit(unplug(cables, to), `${out(c.from).name} unplugged from ${inp(to).name}.`);
  };
  useEffect(() => { if (!refused) return; const t = setTimeout(() => setRefused(null), 2600); return () => clearTimeout(t); }, [refused]);

  // Pointer: press a source jack and drag to a destination, or click one then the other.
  const local = (e: { clientX: number; clientY: number }): Pt => { const b = rack.current!.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const targetAt = (e: { clientX: number; clientY: number }) => {
    for (const el of document.elementsFromPoint(e.clientX, e.clientY)) { const t = (el.closest("[data-in]") as HTMLElement | null)?.dataset.in; if (t) return t; }
    return null;
  };
  const onOutDown = (e: ReactPointerEvent<HTMLButtonElement>, oid: string) => {
    if (e.button !== 0) return;
    moved.current = false;
    setArmed(oid);
    setMessage(`Carrying a ${out(oid).type} cable from ${out(oid).name}. Choose a destination.`);
    const startX = e.clientX, startY = e.clientY;
    const move = (ev: PointerEvent) => {
      if (!moved.current && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 6) return;
      moved.current = true;
      setDrag(local(ev));
      setOver(targetAt(ev));
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setDrag(null); setOver(null);
      // The click that follows this release must not read as a keyboard press.
      setTimeout(() => { moved.current = false; }, 0);
      if (!moved.current) return; // a click: stay armed until a destination is clicked
      const t = targetAt(ev);
      if (t) tryPlug(oid, t);
      setArmed(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  useEffect(() => {
    if (!armed) return;
    const away = (e: PointerEvent) => { if (!(e.target as Element).closest?.("[data-in], .pbay__jack")) { setArmed(null); setMessage("Cable put down."); } };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [armed]);
  const onInClick = (iid: string) => {
    if (armed) { if (tryPlug(armed, iid)) setArmed(null); return; }
    pull(iid);
  };

  // Keyboard: Enter on a source picks up a cable; arrows walk the destinations; Enter plugs; Escape drops it.
  const inIds = inputs.map((i) => i.id), outIds = outputs.map((o) => o.id);
  const focusJack = (k: string) => jacks.current.get(k)?.focus();
  const walk = (e: KeyboardEvent, list: string[], cur: string) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return false;
    e.preventDefault();
    const i = list.indexOf(cur);
    focusJack(list[(i + (e.key === "ArrowDown" ? 1 : list.length - 1)) % list.length]);
    return true;
  };
  const onOutKey = (e: KeyboardEvent<HTMLButtonElement>, oid: string) => {
    if (walk(e, outIds, oid)) return;
    if (e.key === "Escape" && armed) { e.preventDefault(); setArmed(null); setMessage("Cable put down."); }
  };
  const onOutClick = (oid: string) => {
    // Pointer presses arm in onOutDown; this handles Enter and Space.
    if (moved.current) return;
    if (armed === oid && !drag) return;
    setArmed(oid);
    setMessage(`Carrying a ${out(oid).type} cable from ${out(oid).name}. Choose a destination.`);
    const first = inputs.find((i) => check(out(oid), i).ok) ?? inputs[0];
    requestAnimationFrame(() => focusJack(first.id));
  };
  const onInKey = (e: KeyboardEvent<HTMLButtonElement>, iid: string) => {
    if (walk(e, inIds, iid)) return;
    if (e.key === "Escape" && armed) { e.preventDefault(); const a = armed; setArmed(null); setMessage("Cable put down."); focusJack(a); }
    if ((e.key === "Delete" || e.key === "Backspace") && !armed) { e.preventDefault(); pull(iid); }
  };

  const describeOut = (o: Jack) => {
    const to = cables.filter((c) => c.from === o.id).map((c) => inp(c.to).name);
    return `${o.name} output, ${o.type}${to.length ? `, feeding ${to.join(" and ")}` : ""}${armed === o.id ? ", cable picked up" : ""}`;
  };
  const describeIn = (i: Input) => {
    const c = plugged(i.id);
    const base = `${i.name} input, takes ${i.accepts.join(", ")}${c ? `, plugged from ${out(c.from).name}` : ""}`;
    if (!armed) return `${base}${c ? ". Press to unplug" : ""}`;
    const r = check(out(armed), i);
    return `${base}. ${r.ok ? `Press Enter to connect ${out(armed).name}` : `Refuses ${out(armed).type}`}`;
  };

  const armedPos = armed ? pos[armed] : undefined;

  return (
    <section className={`pbay pbay--${theme} ${className}`} data-armed={armed ? true : undefined} aria-labelledby={`${id}-t`}>
      <header className="pbay__head">
        <h3 id={`${id}-t`} className="pbay__title">{title}</h3>
        <p className="pbay__status">{armed ? `Carrying ${out(armed).name} (${out(armed).type})` : `${cables.length} ${cables.length === 1 ? "cable" : "cables"} patched`}</p>
      </header>

      <div ref={rack} className="pbay__rack">
        <ul className="pbay__col pbay__col--out" aria-label="Sources">
          {outputs.map((o) => (
            <li key={o.id} className="pbay__row" style={{ "--c": color(o.type) } as CSSProperties}>
              <span className="pbay__name">{o.name}<small>{o.type}</small></span>
              <button
                ref={(el) => { if (el) jacks.current.set(o.id, el); else jacks.current.delete(o.id); }}
                type="button"
                className="pbay__jack"
                data-live={cables.some((c) => c.from === o.id) || undefined}
                aria-pressed={armed === o.id}
                aria-label={describeOut(o)}
                onPointerDown={(e) => onOutDown(e, o.id)}
                onClick={() => onOutClick(o.id)}
                onKeyDown={(e) => onOutKey(e, o.id)}
              />
            </li>
          ))}
        </ul>

        <ul className="pbay__col pbay__col--in" aria-label="Destinations">
          {inputs.map((i) => {
            const c = plugged(i.id);
            const verdict = armed ? check(out(armed), i) : null;
            return (
              <li key={i.id} className="pbay__row" data-ok={verdict?.ok || undefined} data-no={(verdict && !verdict.ok) || undefined} data-over={over === i.id || undefined} data-refused={refused?.to === i.id || undefined} style={{ "--c": c ? color(out(c.from).type) : "var(--pbay-muted)" } as CSSProperties}>
                <button
                  ref={(el) => { if (el) jacks.current.set(i.id, el); else jacks.current.delete(i.id); }}
                  type="button"
                  className="pbay__jack"
                  data-in={i.id}
                  data-live={c ? true : undefined}
                  aria-label={describeIn(i)}
                  aria-describedby={refused?.to === i.id ? `${id}-r` : undefined}
                  onClick={() => onInClick(i.id)}
                  onKeyDown={(e) => onInKey(e, i.id)}
                />
                <span className="pbay__name" data-in={i.id} onClick={() => armed && onInClick(i.id)}>{i.name}<small>{i.accepts.join(" · ")}</small></span>
                {refused?.to === i.id && <span id={`${id}-r`} className="pbay__refuse" role="note">{refused.reason}</span>}
              </li>
            );
          })}
        </ul>

        <svg className="pbay__cables" aria-hidden="true">
          {cables.map((c) => {
            const a = pos[c.from], b = pos[c.to];
            if (!a || !b) return null;
            const d = catenary(a[0], a[1], b[0], b[1], slackFor(c.to));
            return (
              <g key={c.to} style={{ "--c": color(out(c.from).type) } as CSSProperties} className="pbay__cable">
                <path d={d} className="pbay__cable-shadow" />
                <path d={d} className="pbay__cable-line" />
                <path d={d} className="pbay__cable-hit" onClick={() => pull(c.to)}><title>Unplug {out(c.from).name} → {inp(c.to).name}</title></path>
              </g>
            );
          })}
          {armed && drag && armedPos && (
            <g style={{ "--c": color(out(armed).type) } as CSSProperties} className="pbay__cable pbay__cable--held">
              <path d={catenary(armedPos[0], armedPos[1], drag[0], drag[1], 0.18)} className="pbay__cable-line" />
              <circle cx={drag[0]} cy={drag[1]} r={6} className="pbay__plug" />
            </g>
          )}
        </svg>
      </div>

      <details className="pbay__table">
        <summary>Connections as a table</summary>
        <table>
          <thead><tr><th scope="col">From</th><th scope="col">Signal</th><th scope="col">To</th><th scope="col"><span className="pbay__sr">Action</span></th></tr></thead>
          <tbody>
            {cables.length ? cables.map((c) => (
              <tr key={c.to}>
                <td>{out(c.from).name}</td>
                <td><span className="pbay__tag" style={{ "--c": color(out(c.from).type) } as CSSProperties}>{out(c.from).type}</span></td>
                <td>{inp(c.to).name}</td>
                <td><button type="button" onClick={() => pull(c.to)}>Unplug</button></td>
              </tr>
            )) : <tr><td colSpan={4}>Nothing patched yet.</td></tr>}
          </tbody>
        </table>
      </details>
      <p className="pbay__keys" aria-hidden="true">Drag from a source jack, or Enter on it then ↑ ↓ and Enter on a destination · Esc puts the cable down · click a cable or plugged jack to pull it</p>
      <p className="pbay__sr" aria-live="polite">{message}</p>
    </section>
  );
}
