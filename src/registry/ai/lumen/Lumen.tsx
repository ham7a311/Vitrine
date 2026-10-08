"use client";
import { useEffect, useId, useRef, type RefObject } from "react";
import { HUES, ORBITS, REACH, STATE_TEXT, eyeShape, form as formOf, idleGlance, lookAt, orbitDots, seeded, spring, stateGaze, type DotKind, type Form, type Hue, type LumenState } from "./drop";
import "./lumen.css";

/**
 * Lumen
 * An agent's identity as one soft drop with two eyes. The colour says which agent it is; the eyes say
 * where its attention is: on the field you're typing into while it has focus, on your pointer when it
 * comes near, and otherwise on small idle glances of its own. It blinks now and then, each avatar on
 * its own clock, and rests completely when nothing is happening.
 */

export type LumenProps = {
  /** The agent's name; also the accessible label unless `label` is given. */
  name: string;
  hue?: Hue;
  /** The silhouette; give each agent its own so they differ by shape as well as colour. */
  form?: Form;
  /** What the agent is doing. Busy states take over the gaze; the state is also added to the label. */
  state?: LumenState;
  /** Rendered size in pixels (20–200 works well). */
  size?: number;
  /** An element to look at while it has focus, such as the message field. */
  focusTarget?: RefObject<HTMLElement | null>;
  /** Overrides the accessible label. */
  label?: string;
  /** Hide from assistive technology when the name is already written beside it. */
  decorative?: boolean;
  className?: string;
};

/* ---------- one shared pointer listener for every Lumen on the page ---------- */
let pointer: { x: number; y: number } | null = null;
const listeners = new Set<() => void>();
const onMove = (e: PointerEvent) => {
  if (e.pointerType === "touch") return;
  pointer = { x: e.clientX, y: e.clientY };
  listeners.forEach((f) => f());
};
const onOut = (e: PointerEvent) => {
  if (e.relatedTarget) return;
  pointer = null;
  listeners.forEach((f) => f());
};
function followPointer(f: () => void) {
  if (!listeners.size) {
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
  }
  listeners.add(f);
  return () => {
    listeners.delete(f);
    if (!listeners.size) {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    }
  };
}

const LEAN = 3; // degrees at full glance
const NEAR = 4; // pointer must come within this many avatar widths

const BUSY: LumenState[] = ["thinking", "searching", "working"];

export function Lumen({ name, hue = "rose", form = "bean", state = "idle", size = 40, focusTarget, label, decorative = false, className = "" }: LumenProps) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<HTMLSpanElement>(null);
  const body = useRef<SVGGElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const c = HUES[hue];
  const eye = eyeShape(size);
  const shape = formOf(form);
  const back = useRef<SVGGElement>(null);
  const front = useRef<SVGGElement>(null);
  const small = size < 28;
  // The dots of the current busy state; on "done" the last state's dots stay to gather into the body.
  const lastKind = useRef<DotKind | null>(null);
  if (BUSY.includes(state)) lastKind.current = state as DotKind;
  const kind: DotKind | null = BUSY.includes(state) ? (state as DotKind) : state === "done" ? lastKind.current : null;
  const kindRef = useRef(kind);
  kindRef.current = kind;
  const smallRef = useRef(small);
  smallRef.current = small;
  const EYES = shape.eyes;
  const mirrored = EYES.cx < 50;
  const stateRef = useRef(state);
  stateRef.current = state;
  const wakeRef = useRef<() => void>(() => {});
  useEffect(() => wakeRef.current(), [state]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rand = seeded(`${name}-${uid}`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const g = { x: 0, y: 0, vx: 0, vy: 0 };
    let idle = { x: 0, y: 0 };
    let raf = 0;
    let last = 0;
    let onScreen = true;
    let timers: number[] = [];

    const focused = () => {
      const t = focusTarget?.current;
      return !!t && (document.activeElement === t || t.contains(document.activeElement));
    };
    const target = () => {
      const busy = stateGaze(stateRef.current, performance.now());
      if (busy) return busy;
      const box = el.getBoundingClientRect();
      const me = { x: box.left + box.width / 2, y: box.top + box.height / 2, size: box.width };
      if (focused()) {
        const r = focusTarget!.current!.getBoundingClientRect();
        return lookAt(me, { x: r.left + Math.min(r.width / 2, 160), y: r.top + r.height / 2 });
      }
      if (pointer && Math.hypot(pointer.x - me.x, pointer.y - me.y) < me.size * NEAR + 40) return lookAt(me, pointer);
      return reduce ? { x: 0, y: 0 } : idle;
    };
    const paint = () => {
      const { x: mx, y: my } = REACH;
      eyes.current?.setAttribute("transform", `translate(${(g.x * mx).toFixed(2)} ${(g.y * my).toFixed(2)})`);
      body.current?.setAttribute(
        "transform",
        reduce ? "" : `rotate(${(g.x * LEAN).toFixed(2)} 50 90) translate(${(g.x * 1.2).toFixed(2)} ${(g.y * 0.6).toFixed(2)})`,
      );
    };
    /* place each state dot on its orbit; the far half is drawn behind the body, the near half in front */
    const paintDots = (t: number) => {
      const k = kindRef.current;
      if (!k || stateRef.current === "done") return;
      const dots = orbitDots(k, reduce ? ORBITS[k].period * 0.3 : t, smallRef.current);
      dots.forEach((d, i) => {
        const tf = `translate(${d.x.toFixed(2)} ${d.y.toFixed(2)}) rotate(${(k === "working" ? d.rot : 0).toFixed(1)}) scale(${d.r.toFixed(2)})`;
        for (const [g, show] of [[back.current, !d.front], [front.current, d.front]] as const) {
          const el = g?.children[i] as SVGElement | undefined;
          if (!el) continue;
          el.setAttribute("transform", tf);
          el.setAttribute("opacity", show ? d.alpha.toFixed(2) : "0");
        }
      });
    };
    const tick = (t: number) => {
      paintDots(t);
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 1 / 60;
      last = t;
      el.dataset.frames = String(Number(el.dataset.frames ?? 0) + 1); // a frame counter, for checking that it rests
      const goal = target();
      if (reduce) {
        g.x = goal.x;
        g.y = goal.y;
        paint();
        raf = 0;
        return;
      }
      [g.x, g.vx] = spring(g.x, g.vx, goal.x, dt);
      [g.y, g.vy] = spring(g.y, g.vy, goal.y, dt);
      paint();
      const settled = Math.abs(goal.x - g.x) < 0.002 && Math.abs(goal.y - g.y) < 0.002 && Math.abs(g.vx) < 0.01 && Math.abs(g.vy) < 0.01;
      if (settled && !BUSY.includes(stateRef.current)) {
        raf = 0;
        last = 0;
      } else raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    /* idle glances and blinks, each on this avatar's own clock */
    const later = (ms: number, f: () => void) => timers.push(window.setTimeout(f, ms));
    const glance = () => {
      later(4000 + rand() * 5000, () => {
        if (onScreen && !document.hidden) {
          idle = idleGlance(rand);
          wake();
        }
        glance();
      });
    };
    const blink = () => {
      later(3000 + rand() * 4000, () => {
        if (onScreen && !document.hidden) {
          const twice = rand() < 0.15;
          el.dataset.blink = "";
          later(150, () => {
            delete el.dataset.blink;
            if (twice) later(140, () => { el.dataset.blink = ""; later(150, () => delete el.dataset.blink); });
          });
        }
        blink();
      });
    };
    if (!reduce) {
      glance();
      blink();
    }

    const off = followPointer(wake);
    const t = focusTarget?.current;
    t?.addEventListener("focusin", wake);
    t?.addEventListener("focusout", wake);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    const vis = () => {
      if (!document.hidden) return wake();
      cancelAnimationFrame(raf);
      raf = 0;
    };
    document.addEventListener("visibilitychange", vis);
    const io = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (!onScreen) { cancelAnimationFrame(raf); raf = 0; } else wake();
    });
    io?.observe(el);
    wake();

    return () => {
      off();
      t?.removeEventListener("focusin", wake);
      t?.removeEventListener("focusout", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", vis);
      io?.disconnect();
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
    };
  }, [name, uid, focusTarget]);

  const lx = EYES.cx - EYES.gap / 2;
  const rx = EYES.cx + EYES.gap / 2;
  // The eye nearer the crown sits a little higher; mirrored forms swap that and the slant.
  const [ly, ry, tilt] = mirrored ? [-1.5, 1, -10] : [1, -1.5, 10];

  const dotLayer = (side: "back" | "front") => {
    if (!kind) return null;
    const n = small ? 3 : ORBITS[kind].n;
    return (
      <g ref={side === "back" ? back : front} className="lmen__dots" data-kind={kind} data-gather={state === "done" || undefined} fill={c.ring}>
        {Array.from({ length: n }, (_, i) =>
          ORBITS[kind].shape === "square" ? <rect key={i} x="-1" y="-1" width="2" height="2" rx="0.55" opacity="0" /> : <circle key={i} r="1" opacity="0" />,
        )}
      </g>
    );
  };

  return (
    <span
      ref={root}
      className={`lmen ${className}`}
      style={{ width: size, height: size }}
      data-small={size < 32 || undefined}
      data-state={state}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": `${label ?? name}${STATE_TEXT[state] ? `, ${STATE_TEXT[state]}` : ""}` })}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={`${uid}-b`} cx="38%" cy="30%" r="78%">
            <stop offset="0" stopColor={c.light} />
            <stop offset="0.62" stopColor={c.body} />
            <stop offset="1" stopColor={c.body} />
          </radialGradient>
          <radialGradient id={`${uid}-r`} cx="72%" cy="96%" r="62%">
            <stop offset="0" stopColor={c.deep} stopOpacity="0.5" />
            <stop offset="1" stopColor={c.deep} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-s`}>
            <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-c`}>
            <path d={shape.path} />
          </clipPath>
        </defs>
        {dotLayer("back")}
        <g ref={body} className="lmen__body">
          <g className="lmen__breath">
          <path d={shape.path} fill={`url(#${uid}-b)`} />
          <g clipPath={`url(#${uid}-c)`}>
            <rect width="100" height="100" fill={`url(#${uid}-r)`} />
            <ellipse cx="30" cy="30" rx="15" ry="9" transform="rotate(-38 30 30)" fill={`url(#${uid}-s)`} />
          </g>
          <path d={shape.path} className="lmen__edge" />
          <g ref={eyes}>
            <g className="lmen__eyes" fill={c.eye}>
              <ellipse cx={lx} cy={EYES.cy + ly} rx={eye.rx} ry={eye.ry} transform={`rotate(${tilt} ${lx} ${EYES.cy + ly})`} />
              <ellipse cx={rx} cy={EYES.cy + ry} rx={eye.rx} ry={eye.ry} transform={`rotate(${tilt} ${rx} ${EYES.cy + ry})`} />
            </g>
          </g>
          </g>
        </g>
        {dotLayer("front")}
        {state === "error" && (
          <g className="lmen__alert">
            <circle cx="84" cy="84" r="13" />
            <path d="M84 77.5v8M84 90.2v.3" />
          </g>
        )}
      </svg>
    </span>
  );
}
