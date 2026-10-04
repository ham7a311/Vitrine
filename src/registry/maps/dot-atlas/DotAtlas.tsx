"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { CONTINENTS, landAt } from "../route-globe/land";
import "./dot-atlas.css";

/**
 * Dot Atlas
 * A flat world map made of dots, shaded by a value per region on a single-hue ramp. Point at a
 * region (or arrow through the legend) and its dots lift out of the map while the rest step back.
 */

export type RegionValue = { id: number; value: number };

const DEFAULT: RegionValue[] = [
  { id: 2, value: 4820 },
  { id: 3, value: 3110 },
  { id: 4, value: 2140 },
  { id: 1, value: 1260 },
  { id: 5, value: 610 },
  { id: 6, value: 380 },
];

export type AtlasTheme = { ground: string; text: string; muted: string; line: string; empty: string; ramp: string[] };

type Props = { data?: RegionValue[]; metric?: string; unit?: string; theme: AtlasTheme; step?: number; className?: string; style?: CSSProperties };

const LAT_TOP = 82, LAT_BOTTOM = -56;

export function DotAtlas({ data = DEFAULT, metric = "Bookings, Q3", unit = "bookings", theme, step = 1.6, className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const total = data.reduce((a, d) => a + d.value, 0);
  const max = Math.max(...data.map((d) => d.value));
  const rampOf = (v: number) => theme.ramp[Math.min(theme.ramp.length - 1, Math.floor((v / max) * (theme.ramp.length - 1) + 0.0001))];
  const valueOf = useMemo(() => new Map(data.map((d) => [d.id, d.value])), [data]);

  // Land dots on a lon/lat grid, each tagged with its continent.
  const dots = useMemo(() => {
    const out: { lon: number; lat: number; c: number }[] = [];
    for (let lat = LAT_TOP; lat >= LAT_BOTTOM; lat -= step)
      for (let lon = -180; lon < 180; lon += step) {
        const c = landAt(lon + step / 2, lat - step / 2);
        if (c && c !== 7) out.push({ lon: lon + step / 2, lat: lat - step / 2, c });
      }
    return out;
  }, [step]);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d")!;
    let W = 0, H = 0, dpr = 1;
    const draw = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const sx = W / 360, sy = H / (LAT_TOP - LAT_BOTTOM);
      const r = Math.max(0.9, Math.min(sx, sy) * step * 0.34);
      for (const d of dots) {
        const v = valueOf.get(d.c);
        const on = active === null || active === d.c;
        ctx.globalAlpha = on ? 1 : 0.22;
        ctx.fillStyle = v ? rampOf(v) : theme.empty;
        const x = (d.lon + 180) * sx, y = (LAT_TOP - d.lat) * sy;
        ctx.beginPath();
        ctx.arc(x, y, active === d.c ? r * 1.25 : r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(cv);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dots, active, theme, valueOf]);

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const lon = (x / r.width) * 360 - 180, lat = LAT_TOP - (y / r.height) * (LAT_TOP - LAT_BOTTOM);
    // Look a little around the pointer too, so small coasts are easy to hit.
    let c = landAt(lon, lat);
    if (!c) for (const [dx, dy] of [[1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5]]) if ((c = landAt(lon + dx, lat + dy))) break;
    if (c && valueOf.has(c)) {
      setActive(c);
      setTip({ x, y });
    } else {
      setActive(null);
      setTip(null);
    }
  };

  const order = [...data].sort((a, b) => b.value - a.value);
  const onKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const i = order.findIndex((d) => d.id === active);
    const n = e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : null;
    if (n === null) return;
    e.preventDefault();
    const next = order[(n + order.length) % order.length];
    setActive(next.id);
    setTip(null);
    (e.currentTarget.querySelector(`[data-id="${next.id}"]`) as HTMLElement | null)?.focus();
  };
  const cur = active !== null ? data.find((d) => d.id === active) : null;

  return (
    <div ref={host} className={`da ${className}`} style={{ background: theme.ground, color: theme.text, ["--da-muted" as string]: theme.muted, ["--da-line" as string]: theme.line, ...style }}>
      <header className="da__head">
        <div>
          <p className="da__eyebrow">{metric}</p>
          <p className="da__headline">
            {cur ? (
              <>
                {CONTINENTS[cur.id]} · <strong>{cur.value.toLocaleString("en-GB")}</strong> <span>{Math.round((cur.value / total) * 100)}% of total</span>
              </>
            ) : (
              <>
                {CONTINENTS[order[0].id]} leads with <strong>{Math.round((order[0].value / total) * 100)}%</strong> of {total.toLocaleString("en-GB")} {unit}
              </>
            )}
          </p>
        </div>
      </header>
      <div className="da__map">
        <canvas
          ref={canvas}
          className="da__canvas"
          role="img"
          aria-label={`World map of ${metric.toLowerCase()} by region. ${order.map((d) => `${CONTINENTS[d.id]} ${d.value}`).join(", ")}.`}
          onPointerMove={onMove}
          onPointerLeave={() => {
            setActive(null);
            setTip(null);
          }}
        />
        {tip && cur && (
          <div className="da__tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
            <strong>{CONTINENTS[cur.id]}</strong>
            <span>
              {cur.value.toLocaleString("en-GB")} {unit} · {Math.round((cur.value / total) * 100)}%
            </span>
          </div>
        )}
      </div>
      <ul className="da__legend" aria-label="Regions" onKeyDown={onKey}>
        {order.map((d, i) => (
          <li key={d.id}>
            <button
              type="button"
              data-id={d.id}
              tabIndex={i === 0 || active === d.id ? 0 : -1}
              aria-pressed={active === d.id}
              onFocus={() => setActive(d.id)}
              onBlur={() => setActive(null)}
              onPointerEnter={() => setActive(d.id)}
              onPointerLeave={() => setActive(null)}
            >
              <i style={{ background: rampOf(d.value) }} aria-hidden="true" />
              <span className="da__name">{CONTINENTS[d.id]}</span>
              <span className="da__val">{d.value.toLocaleString("en-GB")}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
