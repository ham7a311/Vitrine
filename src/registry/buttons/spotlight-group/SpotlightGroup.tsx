"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import "./spotlight-group.css";

/**
 * Spotlight Group
 * A toolbar of buttons that share one light. A soft glow follows the pointer
 * across the whole group and catches the edges of whichever buttons are near
 * it, spilling over their neighbours, so you can see where you are before
 * you reach anything. Pressed toggles keep a soft wash of the light's colour.
 */

export type SpotlightItem = { id: string; label: string; icon: ReactNode; toggle?: boolean; group?: number };

type Props = {
  items: SpotlightItem[];
  label: string;
  pressed?: string[];
  defaultPressed?: string[];
  onToggle?: (id: string, on: boolean) => void;
  onAction?: (id: string) => void;
  theme?: "paper" | "night";
  className?: string;
};

export function SpotlightGroup({ items, label, pressed, defaultPressed = [], onToggle, onAction, theme = "night", className = "" }: Props) {
  const [inner, setInner] = useState<string[]>(defaultPressed);
  const on = pressed ?? inner;
  const bar = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const [focus, setFocus] = useState(0);

  // Each button needs its own offset in the group, so its light lines up with everyone else's.
  useLayoutEffect(() => {
    const place = () => btns.current.forEach((b) => { if (b) { b.style.setProperty("--bx", `${b.offsetLeft}px`); b.style.setProperty("--by", `${b.offsetTop}px`); } });
    place();
    const ro = new ResizeObserver(place);
    ro.observe(bar.current!);
    return () => ro.disconnect();
  }, [items.length]);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = bar.current!, r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
    el.dataset.lit = "";
  };

  const press = (it: SpotlightItem) => {
    if (!it.toggle) return onAction?.(it.id);
    const next = !on.includes(it.id);
    if (pressed === undefined) setInner((cur) => (next ? [...cur, it.id] : cur.filter((x) => x !== it.id)));
    onToggle?.(it.id, next);
  };

  // A toolbar is one tab stop; the arrow keys move between its buttons.
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = items.length;
    const to = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault();
    setFocus(to);
    btns.current[to]?.focus();
  };

  return (
    <div
      ref={bar}
      className={`spg spg--${theme} ${className}`}
      role="toolbar"
      aria-label={label}
      onPointerMove={move}
      onPointerLeave={() => delete bar.current!.dataset.lit}
    >
      <span className="spg__edge" aria-hidden="true" />
      {items.map((it, i) => (
        <span key={it.id} className="spg__slot" data-gap={(items[i - 1] && items[i - 1].group !== it.group) || undefined}>
          <button
            ref={(el) => void (btns.current[i] = el)}
            type="button"
            className="spg__btn"
            aria-label={it.label}
            title={it.label}
            aria-pressed={it.toggle ? on.includes(it.id) : undefined}
            tabIndex={i === focus ? 0 : -1}
            onFocus={() => setFocus(i)}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => press(it)}
          >
            <span className="spg__icon" aria-hidden="true">{it.icon}</span>
          </button>
        </span>
      ))}
    </div>
  );
}
