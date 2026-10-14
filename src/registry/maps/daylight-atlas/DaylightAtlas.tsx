"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { landAt } from "../route-globe/land";
import { altitude, clock, hourAt, light, subsolar, terminator } from "./sun";
import "./daylight-atlas.css";

export type Teammate = { name: string; city: string; lon: number; lat: number; /** UTC offset in hours */ offset: number };

export type DaylightAtlasProps = {
  people: Teammate[];
  /** Working hours, local (default 9–18). */
  hours?: [number, number];
  /** Start time (ms); defaults to now and keeps ticking. */
  start?: number;
  theme?: "night" | "paper";
  className?: string;
};

const TOP = 80, BOTTOM = -58, STEP = 2;
const THEMES = {
  night: { day: [138, 170, 214], dusk: [214, 150, 110], dark: [40, 46, 64], lights: "255, 196, 110", sea: "transparent", line: "rgba(255, 210, 140, 0.55)" },
  paper: { day: [126, 146, 176], dusk: [206, 146, 100], dark: [56, 64, 94], lights: "255, 186, 84", sea: "transparent", line: "rgba(200, 110, 40, 0.6)" },
} as const;

const mix = (a: readonly number[], b: readonly number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
const hash = (x: number, y: number) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };

/**
 * Daylight Atlas
 * A dotted world map with the real line between day and night drawn across it — the night side
 * dark and glittering with city lights, twilight warm along the edge — and your team pinned where
 * they live with their local times. Drag the 24-hour scrubber to sweep the night across the map
 * and see who's awake when.
 */
export function DaylightAtlas({ people, hours = [9, 18], start, theme = "night", className = "" }: DaylightAtlasProps) {
  const uid = useId();
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  // start at a fixed moment so the server and the first client render agree, then read the clock
  const [now, setNow] = useState(start ?? 0);
  const [ready, setReady] = useState(start !== undefined);
  const [shift, setShift] = useState(0); // hours ahead of now, from the scrubber
  const [playing, setPlaying] = useState(false);
  const [size, setSize] = useState({ w: 720, h: 280 });
  const t = now + shift * 3600000;
  const sun = useMemo(() => subsolar(t), [t]);

  const dots = useMemo(() => {
    const out: { lon: number; lat: number; glow: number }[] = [];
    for (let lat = TOP; lat > BOTTOM; lat -= STEP)
      for (let lon = -180; lon < 180; lon += STEP) {
        const c = landAt(lon + STEP / 2, lat - STEP / 2);
        // city lights: a scattering, denser in the temperate bands where most people live
        const band = Math.exp(-(((lat - 32) / 22) ** 2)) + 0.5 * Math.exp(-(((lat + 20) / 16) ** 2));
        if (c && c !== 7) out.push({ lon: lon + STEP / 2, lat: lat - STEP / 2, glow: hash(lon, lat) < 0.18 + band * 0.32 ? hash(lat, lon) : 0 });
      }
    return out;
  }, []);

  // the clock keeps ticking unless a fixed start was given
  useEffect(() => {
    if (start !== undefined) return;
    setNow(Date.now()); setReady(true);
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, [start]);

  // play sweeps a whole day in about 12 seconds
  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now();
    const step = (n: number) => {
      const dt = (n - last) / 1000; last = n;
      setShift((s) => (s + dt * 2) % 24);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => { const w = Math.round(e.contentRect.width); setSize({ w, h: Math.round((w * (TOP - BOTTOM)) / 360) }); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const X = (lon: number) => ((lon + 180) / 360) * size.w;
  const Y = (lat: number) => ((TOP - lat) / (TOP - BOTTOM)) * size.h;

  useEffect(() => {
    const cv = canvas.current, ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const T = THEMES[theme], dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(size.w * dpr); cv.height = Math.round(size.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);
    const r = Math.max(1, (size.w / 360) * STEP * 0.36);
    for (const d of dots) {
      const k = light(altitude(d.lat, d.lon, sun));
      // night → a warm band through twilight → day
      ctx.fillStyle = k > 0.5 ? mix(T.dusk, T.day, (k - 0.5) / 0.5) : mix(T.dark, T.dusk, k / 0.5);
      ctx.beginPath(); ctx.arc(X(d.lon), Y(d.lat), r, 0, Math.PI * 2); ctx.fill();
      if (d.glow && k < 0.3) {
        const a = (1 - k / 0.3) * (0.35 + d.glow * 0.65);
        ctx.fillStyle = `rgba(${T.lights}, ${a})`;
        ctx.beginPath(); ctx.arc(X(d.lon), Y(d.lat), r * (0.55 + d.glow * 0.5), 0, Math.PI * 2); ctx.fill();
      }
    }
    // the terminator, a soft line
    ctx.strokeStyle = T.line; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
    ctx.beginPath();
    for (let lon = -180; lon <= 180; lon += 2) { const y = Y(Math.max(BOTTOM, Math.min(TOP, terminator(lon, sun)))); if (lon === -180) ctx.moveTo(X(lon), y); else ctx.lineTo(X(lon), y); }
    ctx.stroke(); ctx.setLineDash([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dots, sun, size, theme]);

  const status = (p: Teammate) => {
    const h = hourAt(t, p.offset), awake = h >= 7 && h < 23, work = h >= hours[0] && h < hours[1];
    return { h, work, awake, day: altitude(p.lat, p.lon, sun) > -6 };
  };
  const working = people.filter((p) => status(p).work).length;
  const utc = new Date(t).toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

  return (
    <section className={`dlat dlat--${theme} ${className}`} aria-labelledby={`${uid}-t`} aria-busy={!ready} data-ready={ready ? "" : undefined}>
      <header className="dlat__head">
        <div>
          <h3 id={`${uid}-t`} className="dlat__title">Who&rsquo;s awake</h3>
          <p className="dlat__sub"><b>{working}</b> of {people.length} in working hours · {utc} UTC{shift ? ` · ${shift > 12 ? `${(24 - shift).toFixed(0)}h back` : `+${shift.toFixed(0)}h`}` : " · now"}</p>
        </div>
        <div className="dlat__ctrl">
          <button type="button" className="dlat__btn" aria-pressed={playing} onClick={() => setPlaying((p) => !p)}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">{playing ? <path d="M4 3v8M10 3v8" /> : <path d="M4.5 2.8v8.4L11 7z" />}</svg>
            {playing ? "Pause" : "Play the day"}
          </button>
          <button type="button" className="dlat__btn" onClick={() => { setPlaying(false); setShift(0); setNow(start ?? Date.now()); }} disabled={shift === 0 && !playing}>Now</button>
        </div>
      </header>

      <div ref={host} className="dlat__map" style={{ height: size.h } as CSSProperties}>
        <canvas ref={canvas} className="dlat__canvas" style={{ width: size.w, height: size.h }} role="img" aria-label={`World map with day and night at ${utc} UTC; the sun is overhead near ${Math.round(sun.lat)}° latitude, ${Math.round(sun.lon)}° longitude.`} />
        <span className="dlat__sun" style={{ left: X(sun.lon), top: Y(Math.max(BOTTOM, Math.min(TOP, sun.lat))) }} aria-hidden="true" />
        {people.map((p) => {
          const s = status(p);
          return (
            <span key={p.name} className={`dlat__pin ${s.work ? "is-work" : s.awake ? "is-awake" : "is-asleep"} ${X(p.lon) > size.w - 110 ? "is-flip" : ""}`} style={{ left: X(p.lon), top: Y(p.lat) }} aria-hidden="true">
              <i /><span className="dlat__pin-label">{p.name.split(" ")[0]} · {clock(t, p.offset)}</span>
            </span>
          );
        })}
      </div>

      <div className="dlat__scrub">
        <label htmlFor={`${uid}-r`} className="dlat__scrub-label">Shift time</label>
        <input id={`${uid}-r`} type="range" min={0} max={24} step={0.25} value={shift} aria-valuetext={`${shift ? `${shift.toFixed(2).replace(/\.?0+$/, "")} hours ahead` : "now"}, ${utc} UTC`}
          onChange={(e) => { setPlaying(false); setShift(Number(e.target.value)); }} />
        <span className="dlat__scrub-ends" aria-hidden="true"><span>Now</span><span>+12h</span><span>+24h</span></span>
      </div>

      <ul className="dlat__team">
        {people.map((p) => {
          const s = status(p);
          return (
            <li key={p.name} className={s.work ? "is-work" : s.awake ? "is-awake" : "is-asleep"}>
              <span className="dlat__glyph" aria-hidden="true">
                {s.day ? <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="3.2" /><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" /></svg>
                  : <svg viewBox="0 0 16 16"><path d="M12.8 10.4A5.6 5.6 0 0 1 5.6 3.2a5.6 5.6 0 1 0 7.2 7.2z" /></svg>}
              </span>
              <span className="dlat__who"><b>{p.name}</b><span>{p.city}</span></span>
              <span className="dlat__time">{clock(t, p.offset)}</span>
              <span className="dlat__state">{s.work ? "Working" : s.awake ? "Off" : "Asleep"}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default DaylightAtlas;
