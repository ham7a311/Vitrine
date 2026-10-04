"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type PointerEvent } from "react";
import "./slosh-button.css";

/**
 * Slosh Button
 * A glass capsule partly full of liquid. Move across it and the liquid
 * sloshes the other way, tipping and rocking back and forth before it
 * settles. Hover tops it up a little; press it and it fills to the brim and
 * says "Saved". The label inverts exactly at the waterline.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onChange"> & {
  label: string;
  doneLabel?: string;
  pressed?: boolean;
  defaultPressed?: boolean;
  onChange?: (pressed: boolean) => void;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

const REST = 0.3, HOVER = 0.5, FULL = 1.12;

export function SloshButton({ label, doneLabel = "Saved", pressed, defaultPressed = false, onChange, theme = "night", motion = "full", className = "", ...rest }: Props) {
  const [inner, setInner] = useState(defaultPressed);
  const on = pressed ?? inner;
  const btn = useRef<HTMLButtonElement>(null);
  const liquid = useRef<SVGPathElement>(null);
  const meniscus = useRef<SVGPathElement>(null);
  const ink = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const size = useRef(box);
  size.current = box; // the animation loop reads the latest size, not the one it started with
  const sim = useRef({ level: on ? FULL : REST, target: on ? FULL : REST, lv: 0, tilt: 0, tv: 0, phase: 0, hover: false, lastX: 0, lastT: 0, raf: 0 });

  const reduced = () => motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    const el = btn.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = () => {
    const { w, h } = size.current;
    if (!w || !liquid.current) return;
    const s = sim.current;
    const base = h * (1 - Math.min(1.2, s.level));
    const amp = 0.8 + Math.min(3, Math.abs(s.tv) * 6);
    const n = 24;
    let top = "";
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * w;
      const y = base + s.tilt * (x - w / 2) + amp * Math.sin((x / w) * Math.PI * 3 + s.phase);
      top += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    const d = `${top}L${w} ${h + 2}L0 ${h + 2}Z`;
    liquid.current.setAttribute("d", d);
    meniscus.current?.setAttribute("d", top);
    if (ink.current) ink.current.style.clipPath = `path("${d}")`;
  };

  const kick = () => {
    const s = sim.current;
    if (s.raf) return;
    if (reduced()) { s.level = s.target; s.tilt = s.tv = 0; draw(); return; }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      // Level: a soft spring. Tilt: an underdamped spring, so it rocks a few times before settling.
      s.lv += (-(s.level - s.target) * 40 - s.lv * 9) * dt;
      s.level += s.lv * dt;
      s.tv += (-s.tilt * 70 - s.tv * 3.2) * dt;
      s.tilt = Math.max(-0.32, Math.min(0.32, s.tilt + s.tv * dt));
      s.phase += dt * (s.hover ? 3.2 : 1.6);
      draw();
      const settled = Math.abs(s.level - s.target) < 0.002 && Math.abs(s.lv) < 0.01 && Math.abs(s.tilt) < 0.002 && Math.abs(s.tv) < 0.01;
      if (settled && !s.hover) { s.raf = 0; return; }
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  };

  useEffect(() => { draw(); }, [box.w, box.h]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { cancelAnimationFrame(sim.current.raf); sim.current.raf = 0; }, []);
  useEffect(() => {
    const s = sim.current;
    s.target = on ? FULL : s.hover ? HOVER : REST;
    kick();
  }, [on]); // eslint-disable-line react-hooks/exhaustive-deps

  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const s = sim.current, t = performance.now();
    if (s.lastT) {
      const vx = (e.clientX - s.lastX) / Math.max(8, t - s.lastT); // px per ms
      s.tv += Math.max(-1.2, Math.min(1.2, vx)) * 0.6; // the liquid lags: it piles up on the side you came from
    }
    s.lastX = e.clientX; s.lastT = t;
    kick();
  };
  const enter = (e: PointerEvent<HTMLButtonElement>) => {
    const s = sim.current;
    s.hover = true; s.lastX = e.clientX; s.lastT = performance.now();
    if (!on) s.target = HOVER;
    kick();
  };
  const leave = () => {
    const s = sim.current;
    s.hover = false; s.lastT = 0;
    if (!on) s.target = REST;
    kick();
  };
  const toggle = () => {
    const next = !on;
    if (pressed === undefined) setInner(next);
    onChange?.(next);
    sim.current.tv += next ? -0.5 : 0.35; // a pour rocks the surface
  };

  const text = on ? doneLabel : label;
  return (
    <button
      ref={btn}
      type="button"
      className={`slb slb--${theme} ${className}`}
      data-motion={motion}
      aria-pressed={on}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
      onClick={toggle}
      {...rest}
    >
      {box.w > 0 && (
        <svg className="slb__tank" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
          <path ref={liquid} className="slb__liquid" />
          <path ref={meniscus} className="slb__meniscus" />
        </svg>
      )}
      <span className="slb__label">{on && <Check />}{text}</span>
      <span ref={ink} className="slb__ink" aria-hidden="true">
        <span className="slb__label">{on && <Check />}{text}</span>
      </span>
    </button>
  );
}

function Check() {
  return <svg viewBox="0 0 16 16" className="slb__check" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>;
}
