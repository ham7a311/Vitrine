"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./snooze-rail.css";

/**
 * Snooze Rail
 * Pick a time from now to a week away on one rail. The good answers (later
 * today, tonight, tomorrow morning, Monday, and whatever you chose last time)
 * are magnets: the thumb falls into them and their ticks lean toward it, but
 * you can still pull free and land anywhere between.
 */

type Props = {
  now: Date;
  onConfirm?: (when: Date) => void;
  storageKey?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

type Magnet = { id: string; label: string; at: number; usual?: boolean };
type Usual = { dayOffset: number; h: number; m: number };

const MIN = 60_000;
const STEP = 15;
const MAX = 7 * 24 * 60; // minutes
const CAPTURE = 12; // px
const at = (d: Date, h: number, m = 0) => {
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  return x;
};
const mins = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / MIN);
// A gentle power scale (exponent 0.4): the next few hours get room, the far days share the rest.
const toFrac = (m: number) => Math.pow(Math.min(MAX, Math.max(0, m)) / MAX, 0.4);

function whenLabel(now: Date, w: Date) {
  const days = Math.round((at(w, 0).getTime() - at(now, 0).getTime()) / (24 * 60 * MIN));
  const time = w.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const day = days === 0 ? (w.getHours() >= 18 ? "Tonight" : "Today") : days === 1 ? "Tomorrow" : w.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  return { day, time };
}
function fromNow(m: number) {
  if (m >= 48 * 60) return `in ${Math.round(m / (24 * 60))} days`;
  if (m >= 60) return `in ${Math.round(m / 60)} h`;
  return `in ${m} min`;
}

function loadUsual(key?: string): Usual | null {
  try {
    const raw = key ? window.localStorage.getItem(key) : null;
    return raw ? (JSON.parse(raw) as Usual) : null;
  } catch {
    return null;
  }
}

export function SnoozeRail({ now, onConfirm, storageKey, theme = "paper", motion = "full" }: Props) {
  const uid = useId();
  const track = useRef<HTMLDivElement>(null);
  const [usual, setUsual] = useState<Usual | null>(null);
  const [value, setValue] = useState(() => 21 * 60); // minutes from now
  const [drag, setDrag] = useState<{ raw: number } | null>(null);
  const [width, setWidth] = useState(320);
  const [done, setDone] = useState("");

  useEffect(() => setUsual(loadUsual(storageKey)), [storageKey]);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const magnets = useMemo<Magnet[]>(() => {
    const list: Magnet[] = [];
    const push = (id: string, label: string, d: Date, usualFlag = false) => {
      const m = mins(now, d);
      if (m >= STEP && m <= MAX && !list.some((x) => Math.abs(x.at - m) < 60)) list.push({ id, label, at: m, usual: usualFlag });
    };
    const later = now.getHours() < 16 ? at(now, 18) : new Date(now.getTime() + 3 * 60 * MIN);
    push("later", "Later today", later);
    if (now.getHours() < 19) push("tonight", "Tonight", at(now, 21));
    push("tomorrow", "Tomorrow", at(new Date(now.getTime() + 24 * 60 * MIN), 9));
    const mon = new Date(now);
    mon.setDate(mon.getDate() + ((8 - mon.getDay()) % 7 || 7));
    push("monday", "Monday", at(mon, 9));
    push("week", "Next week", at(new Date(now.getTime() + 7 * 24 * 60 * MIN), 9));
    if (usual) {
      const d = at(new Date(now.getTime() + usual.dayOffset * 24 * 60 * MIN), usual.h, usual.m);
      if (mins(now, d) > 0) {
        // Remove a magnet that sits within an hour so the usual one wins.
        const m = mins(now, d);
        const i = list.findIndex((x) => Math.abs(x.at - m) < 60);
        if (i >= 0) list.splice(i, 1);
        push("usual", "Your usual", d, true);
      }
    }
    return list.sort((a, b) => a.at - b.at);
  }, [now, usual]);

  // Whole quarter-hours on the clock, not on the distance from now.
  const round = (m: number) => {
    const t = Math.round((now.getTime() + m * MIN) / (STEP * MIN)) * STEP * MIN;
    return Math.min(MAX, Math.max(STEP, Math.round((t - now.getTime()) / MIN)));
  };
  const fromFrac = (f: number) => round(Math.pow(Math.min(1, Math.max(0, f)), 2.5) * MAX);
  const px = (m: number) => toFrac(m) * width;
  const rawPx = drag ? drag.raw : px(value);

  // Magnet pull: inside the capture radius the thumb falls toward the magnet, quadratically.
  let shownPx = rawPx;
  let held: Magnet | null = null;
  if (drag) {
    const near = magnets.reduce<Magnet | null>((best, m) => (Math.abs(px(m.at) - drag.raw) < (best ? Math.abs(px(best.at) - drag.raw) : Infinity) ? m : best), null);
    if (near) {
      const d = Math.abs(px(near.at) - drag.raw);
      if (d < CAPTURE) {
        held = d < CAPTURE * 0.4 ? near : null;
        shownPx = px(near.at) + (drag.raw - px(near.at)) * Math.pow(d / CAPTURE, 2);
      }
    }
  }

  const commit = (m: number) => setValue(round(m));
  const commitExact = (m: number) => setValue(Math.min(MAX, Math.max(STEP, m)));
  const pointer = (e: React.PointerEvent) => {
    const r = track.current!.getBoundingClientRect();
    return Math.min(r.width, Math.max(0, e.clientX - r.left));
  };
  const finish = (raw: number) => {
    const near = magnets.find((m) => Math.abs(px(m.at) - raw) < CAPTURE * 0.4);
    if (near) commitExact(near.at);
    else commit(fromFrac(raw / width));
    setDrag(null);
  };

  const when = new Date(now.getTime() + (held ? held.at : drag ? fromFrac(shownPx / width) : value) * MIN);
  const shownMin = held ? held.at : drag ? fromFrac(shownPx / width) : value;
  const label = whenLabel(now, when);
  const activeMagnet = held ?? magnets.find((m) => m.at === value) ?? null;

  const jump = (dir: 1 | -1) => {
    const list = magnets.map((m) => m.at);
    const next = dir > 0 ? list.find((a) => a > value) : [...list].reverse().find((a) => a < value);
    if (next !== undefined) commitExact(next);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const big = e.shiftKey ? 60 : STEP;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") commit(value + big);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") commit(value - big);
    else if (e.key === "PageUp") jump(1);
    else if (e.key === "PageDown") jump(-1);
    else if (e.key === "Home") commit(STEP);
    else if (e.key === "End") commit(MAX);
    else return;
    e.preventDefault();
  };

  const confirm = () => {
    const w = new Date(now.getTime() + value * MIN);
    onConfirm?.(w);
    const d = whenLabel(now, w);
    setDone(`Snoozed until ${d.day}, ${d.time}.`);
    const u: Usual = { dayOffset: Math.round((at(w, 0).getTime() - at(now, 0).getTime()) / (24 * 60 * MIN)), h: w.getHours(), m: w.getMinutes() };
    try {
      if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(u));
    } catch {}
    setUsual(u);
  };

  const valueText = `${label.day}, ${label.time}, ${fromNow(shownMin)}`;

  return (
    <div className={`snooze-rail snooze-rail--${theme}`} data-motion={motion} data-drag={drag ? "" : undefined}>
      <p className="snooze-rail__label" id={`${uid}-l`}>
        Snooze until
      </p>
      <div className="snooze-rail__read" aria-hidden="true">
        <span className="snooze-rail__day">{label.day}</span>
        <span className="snooze-rail__time">{label.time}</span>
        <span className="snooze-rail__rel">{fromNow(shownMin)}</span>
      </div>

      <div
        ref={track}
        className="snooze-rail__track"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDrag({ raw: pointer(e) });
          (e.currentTarget.querySelector(".snooze-rail__thumb") as HTMLElement | null)?.focus({ preventScroll: true });
        }}
        onPointerMove={(e) => drag && setDrag({ raw: pointer(e) })}
        onPointerUp={(e) => drag && finish(pointer(e))}
        onPointerCancel={() => setDrag(null)}
      >
        <span className="snooze-rail__line" />
        <span className="snooze-rail__fill" style={{ width: shownPx }} />
        {magnets.map((m) => {
          const lean = drag ? Math.max(-1, Math.min(1, (drag.raw - px(m.at)) / (CAPTURE * 2))) : 0;
          const near = Math.abs(lean) < 1;
          return <span key={m.id} className="snooze-rail__tick" data-usual={m.usual || undefined} data-held={activeMagnet?.id === m.id || undefined} style={{ left: px(m.at), transform: `translateX(-50%) rotate(${near ? lean * 26 : 0}deg)` }} />;
        })}
        <div
          className="snooze-rail__thumb"
          role="slider"
          tabIndex={0}
          aria-labelledby={`${uid}-l`}
          aria-valuemin={STEP}
          aria-valuemax={MAX}
          aria-valuenow={value}
          aria-valuetext={valueText}
          data-held={held ? "" : undefined}
          style={{ left: shownPx }}
          onKeyDown={onKey}
        />
      </div>

      <div className="snooze-rail__chips" role="group" aria-label="Suggested times">
        {magnets.map((m) => {
          const l = whenLabel(now, new Date(now.getTime() + m.at * MIN));
          return (
            <button key={m.id} type="button" className="snooze-rail__chip" data-usual={m.usual || undefined} aria-pressed={value === m.at} onClick={() => commitExact(m.at)}>
              <span>{m.label}</span>
              <span className="snooze-rail__chip-time">{m.usual ? `${l.day.split(",")[0]} ${l.time}` : l.time}</span>
            </button>
          );
        })}
      </div>

      <div className="snooze-rail__foot">
        <button type="button" className="snooze-rail__go" onClick={confirm}>
          Snooze
        </button>
        <p className="snooze-rail__done" role="status">
          {done}
        </p>
      </div>
    </div>
  );
}
