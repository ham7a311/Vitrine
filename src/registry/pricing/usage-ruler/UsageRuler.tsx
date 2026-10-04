"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import "./usage-ruler.css";

/**
 * Usage Ruler
 * One continuous control instead of plan cards. The ruler runs from 1 to
 * `max` seats on a log-ish scale; tier regions are drawn along it; the marker
 * is a range input you can drag, click or arrow. Crossing a boundary swaps
 * the plan name with a small vertical roll and nudges the tier band.
 */

export type RulerTier = { name: string; upTo: number; perSeat: number; note: string };

type Props = { tiers: RulerTier[]; max?: number; initial?: number; accent?: string; className?: string };

const toPos = (v: number, max: number) => Math.log(v) / Math.log(max);
const fromPos = (p: number, max: number) => Math.max(1, Math.round(Math.exp(p * Math.log(max))));

export function UsageRuler({ tiers, max = 500, initial = 18, accent = "#b9cce4", className = "" }: Props) {
  const [seats, setSeats] = useState(initial);
  const track = useRef<HTMLDivElement>(null);
  const tierIndex = tiers.findIndex((t) => seats <= t.upTo);
  const tier = tiers[tierIndex === -1 ? tiers.length - 1 : tierIndex];
  const monthly = seats * tier.perSeat;
  const p = toPos(seats, max);

  const setFromX = (x: number) => {
    const r = track.current!.getBoundingClientRect();
    setSeats(fromPos(Math.max(0, Math.min(1, (x - r.left) / r.width)), max));
  };
  const down = (e: PointerEvent<HTMLDivElement>) => { e.currentTarget.setPointerCapture(e.pointerId); setFromX(e.clientX); };
  const move = (e: PointerEvent<HTMLDivElement>) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromX(e.clientX); };
  const key = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    const map: Record<string, number> = { ArrowRight: seats + step, ArrowUp: seats + step, ArrowLeft: seats - step, ArrowDown: seats - step, Home: 1, End: max, PageUp: seats + 25, PageDown: seats - 25 };
    if (e.key in map) { e.preventDefault(); setSeats(Math.max(1, Math.min(max, map[e.key]))); }
  };

  const ticks = [1, 2, 5, 10, 20, 50, 100, 200, 500].filter((t) => t <= max);
  const price = monthly.toLocaleString("en-US");

  return (
    <section className={`usage-ruler ${className}`} style={{ "--ur-accent": accent, "--ur-p": p } as CSSProperties}>
      <div className="usage-ruler__head">
        <div>
          <p className="usage-ruler__eyebrow">Your plan</p>
          <p className="usage-ruler__plan"><span key={tier.name}>{tier.name}</span></p>
          <p className="usage-ruler__note">{tier.note}</p>
        </div>
        <div className="usage-ruler__price">
          <p aria-live="polite"><span className="usage-ruler__cur">$</span>{price}<span className="usage-ruler__per">/ mo</span></p>
          <p className="usage-ruler__calc">{seats} seats × ${tier.perSeat}</p>
        </div>
      </div>

      <div
        ref={track}
        className="usage-ruler__track"
        role="slider"
        tabIndex={0}
        aria-label="Seats"
        aria-valuemin={1}
        aria-valuemax={max}
        aria-valuenow={seats}
        aria-valuetext={`${seats} seats, ${tier.name} plan, $${price} per month`}
        onPointerDown={down}
        onPointerMove={move}
        onKeyDown={key}
      >
        <div className="usage-ruler__bands" aria-hidden="true">
          {tiers.map((t, i) => {
            const from = i === 0 ? 0 : toPos(tiers[i - 1].upTo, max);
            const to = i === tiers.length - 1 ? 1 : toPos(t.upTo, max);
            return (
              <span key={t.name} className="usage-ruler__band" data-on={t === tier || undefined} style={{ left: `${from * 100}%`, width: `${(to - from) * 100}%` }}>
                <i>{t.name}</i>
              </span>
            );
          })}
        </div>
        <div className="usage-ruler__fill" aria-hidden="true" />
        <div className="usage-ruler__ticks" aria-hidden="true">
          {Array.from({ length: 61 }, (_, i) => <span key={i} style={{ left: `${(i / 60) * 100}%` }} data-major={i % 10 === 0 || undefined} />)}
        </div>
        <div className="usage-ruler__marker" aria-hidden="true"><b>{seats}</b></div>
      </div>
      <div className="usage-ruler__scale" aria-hidden="true">
        {ticks.map((t) => <span key={t} style={{ left: `${toPos(t, max) * 100}%` }}>{t}</span>)}
      </div>
    </section>
  );
}
