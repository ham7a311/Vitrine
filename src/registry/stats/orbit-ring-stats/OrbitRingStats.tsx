"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./orbit-ring-stats.css";

/**
 * Orbit Ring Stats
 * Ring gauges whose arc is a slowly turning gradient. On scroll-in each arc
 * sweeps to its value and the number rolls in. The metric's name and goal
 * orbit the ring as a line of small caps, slowing right down when you look at
 * it; hover floods the centre with the ring's colour and the number inverts
 * exactly where the flood has reached.
 */

export type Orbit = {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  /** Short line under the ring, e.g. "+6 pts on Q2". */
  note?: string;
  /** Words that orbit the ring. Defaults to the label. */
  orbit?: string;
};

type Props = {
  rings: Orbit[];
  label?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const R = 93; // orbit radius in the 200-unit viewBox
const LAP = 2 * Math.PI * R;
const FAST = 7; // deg/s at rest
const SLOW = 0.8; // deg/s while hovered

function Reels({ text, on }: { text: string; on: boolean }) {
  const chars = text.split("");
  return (
    <>
      {chars.map((c, i) => {
        const key = chars.length - i;
        return /\d/.test(c) ? (
          <span key={key} className="ors__reel" style={{ "--d": on ? Number(c) : 0, "--k": key } as CSSProperties}>
            <span className="ors__strip">{Array.from({ length: 10 }, (_, k) => <span key={k}>{k}</span>)}</span>
          </span>
        ) : (
          <span key={`s${key}`}>{c}</span>
        );
      })}
    </>
  );
}

export function OrbitRingStats({ rings, label = "Key figures", theme = "night", motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<HTMLElement>(null);
  const spins = useRef<(SVGGElement | null)[]>([]);
  const hot = useRef<number>(-1);
  const raf = useRef(0);
  const [on, setOn] = useState(false);

  // Start once, when a third of the row is visible.
  useEffect(() => {
    const el = root.current!;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The orbiting words: one loop for every ring, each easing toward its own speed. Paused offscreen.
  useEffect(() => {
    const reduce = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ang = rings.map((_, i) => i * 47);
    const vel = rings.map(() => FAST);
    let last = 0;
    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      for (let i = 0; i < rings.length; i++) {
        const want = hot.current === i ? SLOW : FAST;
        vel[i] += (want - vel[i]) * Math.min(1, dt * 4);
        ang[i] = (ang[i] + vel[i] * dt) % 360;
        spins.current[i]?.setAttribute("transform", `rotate(${ang[i].toFixed(2)} 100 100)`);
      }
      raf.current = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf.current) { last = 0; raf.current = requestAnimationFrame(tick); }
      if (!e.isIntersecting && raf.current) { cancelAnimationFrame(raf.current); raf.current = 0; }
    });
    io.observe(root.current!);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); raf.current = 0; };
  }, [rings, motion]);

  return (
    <section ref={root} className={`ors ors--${theme} ${className}`} data-motion={motion} data-on={on || undefined} aria-label={label}>
      <ul className="ors__row">
        {rings.map((g, i) => {
          const max = g.max ?? 100;
          const p = Math.max(0, Math.min(1, g.value / max));
          const words = (g.orbit ?? g.label).toUpperCase();
          // Repeat the words until they go round once, then spread them to exactly one lap.
          const reps = Math.max(1, Math.round(LAP / ((words.length + 3) * 5.4)));
          const lap = Array.from({ length: reps }, () => `${words} · `).join("");
          const centre: ReactNode = (
            <span className="ors__num">
              <Reels text={String(g.value)} on={on} />
              {g.unit && <span className="ors__unit">{g.unit}</span>}
            </span>
          );
          return (
            <li key={g.label} className="ors__item" onPointerEnter={() => (hot.current = i)} onPointerLeave={() => (hot.current = -1)}>
              <div
                className="ors__dial"
                role="meter"
                aria-label={g.label}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={g.value}
                aria-valuetext={`${g.value}${g.unit ?? ""}`}
                style={{ "--ors-v": on ? p : 0, "--i": i } as CSSProperties}
              >
                <svg className="ors__orbit" viewBox="0 0 200 200" aria-hidden="true">
                  <defs><path id={`${uid}-o${i}`} d={`M100 ${100 - R} a${R} ${R} 0 1 1 0 ${2 * R} a${R} ${R} 0 1 1 0 ${-2 * R}`} /></defs>
                  <g ref={(el) => void (spins.current[i] = el)} transform={`rotate(${i * 47} 100 100)`}>
                    <text>
                      <textPath href={`#${uid}-o${i}`} textLength={LAP - 1} lengthAdjust="spacing">{lap}</textPath>
                    </text>
                  </g>
                </svg>
                <span className="ors__track" aria-hidden="true" />
                <span className="ors__arc" aria-hidden="true" />
                <span className="ors__head" aria-hidden="true" />
                <span className="ors__face" aria-hidden="true">{centre}</span>
                <span className="ors__face ors__flood" aria-hidden="true">{centre}</span>
              </div>
              <p className="ors__label">{g.label}</p>
              {g.note && <p className="ors__note">{g.note}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
