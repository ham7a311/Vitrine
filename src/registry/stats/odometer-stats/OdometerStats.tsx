"use client";

import { useEffect, useRef, useState } from "react";
import "./odometer-stats.css";

/**
 * Odometer Stats
 * Big numbers that read like a mechanical counter. Each digit is a vertical
 * reel of 0–9 that spins to its value when the section scrolls into view,
 * with the rightmost reels arriving last. Separators and suffixes stay still.
 */

export type OdometerStat = { value: string; label: string };

function Reel({ ch, delay, run }: { ch: string; delay: number; run: boolean }) {
  const isDigit = /\d/.test(ch);
  if (!isDigit) return <span className="odo__sym" aria-hidden="true">{ch}</span>;
  const n = Number(ch);
  return (
    <span className="odo__reel" aria-hidden="true">
      <span
        className="odo__strip"
        style={{ transform: run ? `translateY(${-n * 10}%)` : "translateY(0)", transitionDelay: `${delay}ms`, transitionDuration: `${900 + n * 90}ms` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

export function OdometerStats({ stats }: { stats: OdometerStat[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setRun(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <dl ref={ref} className="odo">
      {stats.map((s, si) => {
        const chars = Array.from(s.value);
        return (
          <div key={s.label} className="odo__stat">
            <dt className="odo__label">{s.label}</dt>
            <dd className="odo__value">
              <span className="odo__sr">{s.value}</span>
              <span className="odo__row" aria-hidden="true">
                {chars.map((c, i) => (
                  <Reel key={i} ch={c} run={run} delay={si * 140 + i * 90} />
                ))}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
