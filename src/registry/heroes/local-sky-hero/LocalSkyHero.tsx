"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import "./local-sky-hero.css";

/**
 * Local Sky Hero
 * A studio's first screen set on a sea horizon, where the sky is the
 * visitor's own: its colour and the sun (or moon) follow the time where they
 * are. On the horizon line sits the useful part: the time at the studio, how
 * far apart you are, and whether anyone is at their desk to answer.
 */

type Stop = { h: number; top: string; mid: string; low: string; sea: string };

// The sky through a day, by hour. Colours between stops are mixed.
const SKY: Stop[] = [
  { h: 0, top: "#060915", mid: "#0e1533", low: "#1f2b55", sea: "#04060d" },
  { h: 4.8, top: "#0d1230", mid: "#2b2d5c", low: "#7d5876", sea: "#0a0b1c" },
  { h: 6.1, top: "#34508f", mid: "#d99382", low: "#ffd09a", sea: "#2a3557" },
  { h: 8.5, top: "#5288d2", mid: "#97c0ea", low: "#e7f0f4", sea: "#3f6f9c" },
  { h: 13, top: "#3a7bd0", mid: "#8bbdee", low: "#d9ecf9", sea: "#2f6a9f" },
  { h: 16.6, top: "#4a76bd", mid: "#b2c4dd", low: "#f3d6ac", sea: "#3c6488" },
  { h: 18.2, top: "#2a2c60", mid: "#b65469", low: "#f7a35c", sea: "#2a2240" },
  { h: 19.4, top: "#111840", mid: "#363b75", low: "#86567a", sea: "#0e1026" },
  { h: 21, top: "#070a1a", mid: "#11183c", low: "#25325d", sea: "#05070f" },
  { h: 24, top: "#060915", mid: "#0e1533", low: "#1f2b55", sea: "#04060d" },
];

const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, t: number) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
const rgb = (h: string) => `rgb(${hex(h).join(" ")})`;
const mix = (a: string, b: string, t: number) => rgb(mixHex(a, b, t));
const lum = (h: string) => {
  const [r, g, b] = hex(h).map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

function skyAt(hour: number) {
  const i = Math.max(0, SKY.findIndex((s) => s.h > hour) - 1);
  const a = SKY[i], b = SKY[i + 1] ?? SKY[i];
  const t = b.h === a.h ? 0 : (hour - a.h) / (b.h - a.h);
  const top = mixHex(a.top, b.top, t), mid = mixHex(a.mid, b.mid, t), low = mixHex(a.low, b.low, t);
  // Words sit over the upper-middle of the sky; the status sits on the horizon. Each gets the ink that reads best there.
  return { top: rgb(top), mid: rgb(mid), low: rgb(low), sea: mix(a.sea, b.sea, t), ink: inkOn(mixHex(top, mid, 0.7)), horizonInk: inkOn(low) };
}

function inkOn(bg: string): "dark" | "light" {
  const l = lum(bg);
  return (l + 0.05) / (lum("#10141f") + 0.05) > (lum("#f4f1ea") + 0.05) / (l + 0.05) ? "dark" : "light";
}

/** Where the light sits: the sun crosses 5:45–18:45, the moon the rest. x and height are 0–1. */
const RISE = 5.75, SET = 18.75;
function bodyAt(hour: number) {
  const day = hour >= RISE && hour < SET;
  const t = day ? (hour - RISE) / (SET - RISE) : ((hour - SET + 24) % 24) / (24 - (SET - RISE));
  return { day, x: t, lift: Math.sin(Math.PI * t) };
}

// A fixed scatter of stars, the same on every render (a tiny seeded generator).
const STARS = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 90 }, () => ({ x: rnd() * 100, y: Math.pow(rnd(), 1.6) * 70, r: rnd() < 0.12 ? 1.3 : 0.7, o: 0.35 + rnd() * 0.6 }));
})();

const fmt = (d: Date, timeZone?: string) => d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone });
const hourIn = (d: Date, timeZone: string) => {
  const p = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", weekday: "short", hourCycle: "h23", timeZone }).formatToParts(d);
  const get = (k: string) => p.find((x) => x.type === k)?.value ?? "0";
  return { h: Number(get("hour")) + Number(get("minute")) / 60, day: get("weekday") };
};

type Props = {
  eyebrow?: string;
  headline: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  /** The studio's place and IANA time zone, e.g. "Muscat", "Asia/Muscat". */
  place: string;
  timeZone: string;
  /** Opening hours at the studio, 24h, and the working days (short English names). */
  hours?: [number, number];
  days?: string[];
  /** Pin the visitor's hour (0–24) instead of reading the clock. */
  at?: number;
  motion?: "full" | "reduced";
  className?: string;
};

export function LocalSkyHero({ eyebrow, headline, sub, actions, place, timeZone, hours = [9, 18], days = ["Sun", "Mon", "Tue", "Wed", "Thu"], at, motion = "full", className = "" }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Before mount (server render) the sky waits at dusk-blue with the sun below the horizon.
  const localHour = at ?? (now ? now.getHours() + now.getMinutes() / 60 : 19.6);
  const sky = skyAt(localHour);
  const body = bodyAt(localHour);

  let status: ReactNode = null;
  if (now) {
    const there = hourIn(now, timeZone);
    let diff = Math.round((there.h - (now.getHours() + now.getMinutes() / 60)) * 2) / 2;
    if (diff > 12) diff -= 24;
    if (diff < -12) diff += 24;
    const open = days.includes(there.day) && there.h >= hours[0] && there.h < hours[1];
    const apart = diff === 0 ? "same time as you" : `${Math.abs(diff)} ${Math.abs(diff) === 1 ? "hour" : "hours"} ${diff > 0 ? "ahead of" : "behind"} you`;
    status = (
      <>
        <span className="lsh__clock">{place} {fmt(now, timeZone)}</span>
        <span className="lsh__sep" aria-hidden="true">·</span>
        <span>{apart}</span>
        <span className="lsh__sep" aria-hidden="true">·</span>
        <span className="lsh__open" data-open={open || undefined}>{open ? "In the studio now" : `Back at ${hours[0]}:00 their time`}</span>
      </>
    );
  }

  return (
    <section
      className={`lsh ${className}`}
      data-ink={sky.ink}
      data-ready={now ? "" : undefined}
      data-motion={motion}
      data-night={!body.day || undefined}
      aria-label="Introduction"
      style={{ "--lsh-top": sky.top, "--lsh-mid": sky.mid, "--lsh-low": sky.low, "--lsh-sea": sky.sea, "--lsh-x": body.x, "--lsh-lift": now ? body.lift : -0.2 } as CSSProperties}
    >
      <div className="lsh__sky" aria-hidden="true">
        <svg className="lsh__stars" width="100%" height="100%">
          {STARS.map((s, i) => <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#fff" opacity={s.o} />)}
        </svg>
        <span className="lsh__body" />
      </div>

      <div className="lsh__content">
        {eyebrow && <p className="lsh__eyebrow">{eyebrow}</p>}
        <h1 className="lsh__headline">{headline}</h1>
        {sub && <p className="lsh__sub">{sub}</p>}
        {actions && <div className="lsh__actions">{actions}</div>}
      </div>

      <div className="lsh__horizon" data-ink={sky.horizonInk}>
        <p className="lsh__status" aria-live="off">{status ?? <span className="lsh__clock">{place}</span>}</p>
      </div>

      <div className="lsh__sea" aria-hidden="true">
        <span className="lsh__glint" />
      </div>
    </section>
  );
}
