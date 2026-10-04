"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./model-picker.css";

/**
 * Model Picker
 * A listbox in a popover. Every option carries the same two meters, so the
 * choice reads as a trade-off rather than a list of names. One selection mark
 * glides between rows (top/height), and the trigger's label rolls vertically
 * in the direction you moved.
 */

export type Model = { id: string; name: string; note: string; speed: number; depth: number; badge?: string };

type Props = { models: Model[]; value?: string; onChange?: (id: string) => void; theme?: "paper" | "night"; className?: string };

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <span className="model-picker__meter" aria-hidden="true">
      <span>{label}</span>
      <span className="model-picker__pips">{Array.from({ length: 5 }, (_, i) => <i key={i} data-on={i < value || undefined} />)}</span>
    </span>
  );
}

export function ModelPicker({ models, value, onChange, theme = "paper", className = "" }: Props) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(value ?? models[0].id);
  const [act, setAct] = useState(0);
  const [dir, setDir] = useState(1);
  const [mark, setMark] = useState<{ t: number; h: number } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const idx = models.findIndex((m) => m.id === sel);

  useEffect(() => { if (value) setSel(value); }, [value]);
  useEffect(() => {
    if (!open) return;
    setAct(idx);
    requestAnimationFrame(() => list.current?.focus());
    const close = (e: MouseEvent) => { if (!list.current?.parentElement?.contains(e.target as Node) && e.target !== trigger.current) setOpen(false); };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useLayoutEffect(() => {
    const r = rows.current[idx];
    if (open && r) setMark({ t: r.offsetTop, h: r.offsetHeight });
  }, [open, idx]);

  const choose = (i: number) => {
    setDir(i > idx ? 1 : -1);
    setSel(models[i].id); onChange?.(models[i].id);
    setTimeout(() => { setOpen(false); trigger.current?.focus(); }, 260);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setAct((a) => Math.min(models.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAct((a) => Math.max(0, a - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setAct(0); }
    else if (e.key === "End") { e.preventDefault(); setAct(models.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(act); }
    else if (e.key === "Escape" || e.key === "Tab") { setOpen(false); trigger.current?.focus(); }
  };

  const cur = models[idx];
  return (
    <div className={`model-picker model-picker--${theme} ${className}`} style={{ "--mp-dir": dir } as CSSProperties}>
      <button
        ref={trigger}
        type="button"
        className="model-picker__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true); } }}
      >
        <span className="model-picker__window">
          <span key={cur.id} className="model-picker__current">{cur.name}</span>
        </span>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 6.5l3 3 3-3" /></svg>
      </button>

      {open && (
        <div className="model-picker__pop">
          <ul
            ref={list}
            id={`${uid}-list`}
            role="listbox"
            tabIndex={-1}
            aria-label="Model"
            aria-activedescendant={`${uid}-o-${models[act].id}`}
            className="model-picker__list"
            onKeyDown={onKey}
          >
            {mark && <span className="model-picker__mark" aria-hidden="true" style={{ top: mark.t, height: mark.h }} />}
            {models.map((m, i) => (
              <li
                key={m.id}
                ref={(el) => void (rows.current[i] = el)}
                id={`${uid}-o-${m.id}`}
                role="option"
                aria-selected={m.id === sel}
                data-active={i === act || undefined}
                className="model-picker__opt"
                onMouseEnter={() => setAct(i)}
                onClick={() => choose(i)}
              >
                <span className="model-picker__name">
                  {m.name}
                  {m.badge && <em>{m.badge}</em>}
                </span>
                <span className="model-picker__note">{m.note}</span>
                <span className="model-picker__meters">
                  <Meter label="Speed" value={m.speed} />
                  <Meter label="Depth" value={m.depth} />
                </span>
                <svg className="model-picker__tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
                <span className="model-picker__sr">{`Speed ${m.speed} of 5, depth ${m.depth} of 5`}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
