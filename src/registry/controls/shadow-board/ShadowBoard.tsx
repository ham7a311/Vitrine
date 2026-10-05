"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import "./shadow-board.css";

export type ShadowTool = { id: string; label: string; icon: ReactNode };
export type ShadowBoardProps = {
  tools: ShadowTool[];
  /** Tools on the toolbar at the start and after "Restore default", in order. */
  defaultValue: string[];
  /** Most tools the toolbar can hold. */
  max?: number;
  onChange?: (ids: string[]) => void;
  /** A toolbar button was used outside customize mode. */
  onAction?: (id: string) => void;
  label?: string;
  /** Start with the board open. */
  defaultOpen?: boolean;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Shadow Board
 * Toolbar customisation as a workshop pegboard. Every tool has a painted
 * outline where it hangs; take one up to the toolbar and its outline stays
 * behind, so what's in use and where things go back are always visible.
 */
export function ShadowBoard({ tools, defaultValue, max = 8, onChange, onAction, label = "Toolbar", defaultOpen = false, theme = "light", motion = true, className = "" }: ShadowBoardProps) {
  const id = useId();
  const [inUse, setInUse] = useState(defaultValue);
  const [editing, setEditing] = useState(defaultOpen);
  const [focus, setFocus] = useState(defaultValue[0]);
  const [message, setMessage] = useState("");
  const els = useRef(new Map<string, HTMLElement>());
  const rects = useRef(new Map<string, DOMRect>());
  const reduced = useRef(false);
  useEffect(() => { reduced.current = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches; }, [motion]);

  const byId = new Map(tools.map((t) => [t.id, t]));
  const name = (t: string) => byId.get(t)?.label ?? t;
  const reg = (t: string) => (el: HTMLElement | null) => { if (el) els.current.set(t, el); else els.current.delete(t); };

  // FLIP: each tool exists in one place at a time, so its old box is where it flies from.
  const capture = () => { rects.current = new Map([...els.current].map(([k, el]) => [k, el.getBoundingClientRect()])); };
  useLayoutEffect(() => {
    if (reduced.current || !rects.current.size) return;
    for (const [k, el] of els.current) {
      const a = rects.current.get(k), b = el.getBoundingClientRect();
      if (!a || (Math.abs(a.left - b.left) < 1 && Math.abs(a.top - b.top) < 1)) continue;
      el.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    rects.current = new Map();
  }, [inUse]);

  const set = (next: string[], say: string) => { capture(); setInUse(next); onChange?.(next); setMessage(say); };
  const add = (t: string) => {
    if (inUse.includes(t)) return;
    if (inUse.length >= max) { setMessage(`The toolbar holds ${max} tools. Put one back first.`); return; }
    set([...inUse, t], `${name(t)} added to the toolbar, position ${inUse.length + 1}.`);
  };
  const remove = (t: string) => {
    const i = inUse.indexOf(t);
    const next = inUse.filter((x) => x !== t);
    set(next, `${name(t)} put back on the board.`);
    const after = next[Math.min(i, next.length - 1)];
    if (after) { setFocus(after); requestAnimationFrame(() => els.current.get(after)?.focus()); }
  };
  const shift = (t: string, by: number) => {
    const i = inUse.indexOf(t), j = i + by;
    if (j < 0 || j >= inUse.length) return;
    const next = [...inUse];
    [next[i], next[j]] = [next[j], next[i]];
    set(next, `${name(t)} moved to position ${j + 1}.`);
    requestAnimationFrame(() => els.current.get(t)?.focus());
  };

  const onBarKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = inUse.indexOf(focus);
    if (editing && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) { e.preventDefault(); shift(focus, e.key === "ArrowLeft" ? -1 : 1); return; }
    if (editing && (e.key === "Delete" || e.key === "Backspace")) { e.preventDefault(); remove(focus); return; }
    let j = -1;
    if (e.key === "ArrowRight") j = (i + 1) % inUse.length;
    else if (e.key === "ArrowLeft") j = (i - 1 + inUse.length) % inUse.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = inUse.length - 1;
    if (j >= 0) { e.preventDefault(); setFocus(inUse[j]); els.current.get(inUse[j])?.focus(); }
  };

  const changed = inUse.join() !== defaultValue.join();

  return (
    <div className={`shboard shboard--${theme} ${className}`} data-editing={editing || undefined} data-motion={motion ? undefined : "off"}>
      <div className="shboard__top">
        <div className="shboard__bar" role="toolbar" aria-label={label} aria-describedby={editing ? `${id}-keys` : undefined} onKeyDown={onBarKey}>
          {inUse.map((t) => (
            <button
              key={t}
              ref={reg(t)}
              type="button"
              className="shboard__tool"
              tabIndex={t === focus || (!inUse.includes(focus) && t === inUse[0]) ? 0 : -1}
              aria-label={editing ? `${name(t)}, put back on the board` : name(t)}
              title={name(t)}
              onFocus={() => setFocus(t)}
              onClick={() => (editing ? remove(t) : onAction?.(t))}
            >
              <span className="shboard__icon" aria-hidden="true">{byId.get(t)?.icon}</span>
              {editing && <span className="shboard__x" aria-hidden="true">×</span>}
            </button>
          ))}
          {editing && Array.from({ length: Math.max(0, max - inUse.length) }, (_, i) => <span key={i} className="shboard__empty" aria-hidden="true" />)}
        </div>
        <button type="button" className="shboard__toggle" aria-expanded={editing} aria-controls={`${id}-board`} onClick={() => { setEditing((e) => !e); setMessage(editing ? "Done customising." : "Customising. Choose a tool on the board to add it, or a toolbar tool to put it back."); }}>
          {editing ? "Done" : "Customize"}
        </button>
      </div>

      <div id={`${id}-board`} className="shboard__board" hidden={!editing}>
        <div className="shboard__board-head">
          <p id={`${id}-keys`} className="shboard__hint">{inUse.length} of {max} on the toolbar · Delete puts a tool back, Alt + ← / → reorders.</p>
          <button type="button" className="shboard__restore" disabled={!changed} onClick={() => { set(defaultValue, "Toolbar restored to its default tools."); setFocus(defaultValue[0]); }}>Restore default</button>
        </div>
        <ul className="shboard__pegs" aria-label="Tool board">
          {tools.map((t) => {
            const out = inUse.includes(t.id);
            return (
              <li key={t.id} className="shboard__spot" data-out={out || undefined}>
                <span className="shboard__shadow" aria-hidden="true"><span className="shboard__icon">{t.icon}</span></span>
                <span className="shboard__hook" aria-hidden="true" />
                {!out && (
                  <button ref={reg(t.id)} type="button" className="shboard__hanging" onClick={() => add(t.id)} aria-label={`Add ${t.label} to the toolbar`}>
                    <span className="shboard__icon" aria-hidden="true">{t.icon}</span>
                  </button>
                )}
                <span className="shboard__name">{out ? <><span className="shboard__sr">{t.label}, </span><span aria-hidden="true">{t.label}</span><span className="shboard__sr"> is on the toolbar</span></> : t.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="shboard__sr" aria-live="polite">{message}</p>
    </div>
  );
}
