"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import "./pull-cord.css";

/**
 * Pull Cord
 * A theme switch that works like the light cord in an old house. Pull the
 * handle down: the cord stretches, clicks at the bottom of the pull and the
 * lights change, then it springs back up and sways until it settles. Click
 * or press Space and it pulls itself.
 */

type Props = {
  /** true = lights off (dark theme). */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  /** Cord length at rest, in px. */
  length?: number;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const CLICK = 34; // px of pull at which the switch clicks
const MAX = 64;

export function PullCord({ checked, defaultChecked = false, onChange, label = "Lights off", length = 110, theme = "paper", motion = "full", className = "" }: Props) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const [ticked, setTicked] = useState(0);
  const svg = useRef<SVGSVGElement>(null);
  const state = useRef({ y: 0, vy: 0, x: 0, vx: 0, drag: false, ox: 0, oy: 0, clicked: false, raf: 0 });
  const onRef = useRef(on);
  onRef.current = on;

  const reduce = () => motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const flip = () => {
    const next = !onRef.current;
    if (checked === undefined) setInner(next);
    onChange?.(next);
    setTicked((t) => t + 1);
  };

  const render = () => {
    const el = svg.current;
    if (!el) return;
    const { x, y } = state.current;
    const bx = 32 + x, by = length + y;
    // The cord bows slightly toward where it's being pulled.
    el.querySelector(".pcord__cord")!.setAttribute("d", `M32 6 Q ${32 + x * 0.35} ${(6 + by) / 2} ${bx} ${by}`);
    el.querySelector(".pcord__cord-hi")!.setAttribute("d", `M32 6 Q ${32 + x * 0.35} ${(6 + by) / 2} ${bx} ${by}`);
    (el.querySelector(".pcord__pull") as SVGGElement).setAttribute("transform", `translate(${bx} ${by}) rotate(${(-x * 0.9).toFixed(2)})`);
  };

  const settle = () => {
    const s = state.current;
    cancelAnimationFrame(s.raf);
    if (reduce()) { s.x = s.y = s.vx = s.vy = 0; render(); return; }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      // Two damped springs: the stretch (stiff) and the sway (loose).
      s.vy += (-320 * s.y - 11 * s.vy) * dt; s.y += s.vy * dt;
      s.vx += (-60 * s.x - 3.2 * s.vx) * dt; s.x += s.vx * dt;
      render();
      if (Math.abs(s.y) + Math.abs(s.vy) + Math.abs(s.x) + Math.abs(s.vx) > 0.05) s.raf = requestAnimationFrame(tick);
      else { s.x = s.y = 0; render(); }
    };
    s.raf = requestAnimationFrame(tick);
  };

  useEffect(() => render());
  useEffect(() => { const s = state.current; return () => cancelAnimationFrame(s.raf); }, []);

  const down = (e: RPointerEvent<SVGGElement>) => {
    const s = state.current;
    cancelAnimationFrame(s.raf);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    s.drag = true; s.clicked = false;
    s.ox = e.clientX - s.x; s.oy = e.clientY - s.y;
  };
  const move = (e: RPointerEvent<SVGGElement>) => {
    const s = state.current;
    if (!s.drag) return;
    const raw = e.clientY - s.oy;
    // Firm to the click point, then it resists like a spring at the end of its travel.
    s.y = raw <= 0 ? raw * 0.15 : raw < MAX ? raw : MAX + (raw - MAX) * 0.2;
    s.x = Math.max(-26, Math.min(26, (e.clientX - s.ox) * 0.5));
    if (!s.clicked && s.y >= CLICK) { s.clicked = true; flip(); }
    if (s.clicked && s.y < CLICK * 0.5) s.clicked = false; // let go of the click on the way up; a second pull clicks again
    render();
  };
  const up = (e: RPointerEvent<SVGGElement>) => {
    const s = state.current;
    if (!s.drag) return;
    s.drag = false;
    const moved = Math.abs(e.clientY - s.oy) > 4 || Math.abs(e.clientX - s.ox) > 4;
    if (!moved) return pullOnce();
    s.vy = 0;
    settle();
  };

  // A full pull, for clicks and the keyboard.
  const pullOnce = () => {
    const s = state.current;
    if (reduce()) { flip(); return; }
    cancelAnimationFrame(s.raf);
    const t0 = performance.now();
    let done = false;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 180);
      s.y = (1 - (1 - p) ** 3) * (CLICK + 10);
      render();
      if (!done && s.y >= CLICK) { done = true; flip(); }
      if (p < 1) s.raf = requestAnimationFrame(tick);
      else { s.vx = (Math.random() - 0.5) * 40; settle(); }
    };
    s.raf = requestAnimationFrame(tick);
  };

  const key = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); pullOnce(); }
  };

  const h = length + MAX + 40;
  return (
    <span className={`pcord pcord--${theme} ${className}`} data-on={on || undefined} data-motion={motion} style={{ height: h }}>
      <svg ref={svg} className="pcord__svg" width="64" height={h} viewBox={`0 0 64 ${h}`} overflow="visible">
        <rect className="pcord__mount" x="20" y="0" width="24" height="7" rx="2" />
        <path className="pcord__cord" d="" />
        <path className="pcord__cord-hi" d="" />
        <g
          className="pcord__pull"
          role="switch"
          aria-checked={on}
          aria-label={label}
          tabIndex={0}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onKeyDown={key}
        >
          <circle className="pcord__hit" r="26" cy="22" />
          <circle className="pcord__ring" r="19" cy="21" />
          <g transform="scale(1.4)">
            <path className="pcord__bead" d="M0 0 C -2 0 -7 6 -7 15 C -7 24 -4 30 0 30 C 4 30 7 24 7 15 C 7 6 2 0 0 0 Z" />
            <path className="pcord__bead-hi" d="M-3.5 7 C -4.6 11 -4.8 18 -3.4 23" />
          </g>
          {ticked > 0 && <circle key={ticked} className="pcord__flash" r="13" cy="21" />}
        </g>
      </svg>
    </span>
  );
}
