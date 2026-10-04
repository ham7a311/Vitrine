"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import "./liquid-glass-card.css";

/**
 * Liquid Glass Card
 * A now-playing card made of thick glass. The middle is clear; toward the
 * edges the glass bends what's behind it more and more, the way a lens's rim
 * does. A highlight rides the rim toward your pointer, and the play button
 * is a drop of the same glass that squashes when pressed.
 */

type Props = {
  title: string;
  artist: string;
  /** Seconds. */
  duration: number;
  upNext?: string;
  /** CSS background for the artwork tile. */
  art?: string;
  /** Seconds already played. */
  start?: number;
  motion?: "full" | "reduced";
  className?: string;
};

const BEZEL = 22; // px of the edge that refracts

/** A displacement map: neutral grey in the middle, ramping to full red/blue offsets at the edges. */
function lensMap(w: number, h: number) {
  const r = 28;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="x" x1="0" x2="1"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient><linearGradient id="y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00f"/><stop offset="1" stop-color="#000"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="${BEZEL / 2.4}"/></filter></defs><rect width="${w}" height="${h}" fill="#000"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#x)"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#y)" style="mix-blend-mode:difference"/><rect x="${BEZEL}" y="${BEZEL}" width="${w - BEZEL * 2}" height="${h - BEZEL * 2}" rx="${r - 8}" fill="#808080" filter="url(#b)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function LiquidGlassCard({ title, artist, duration, upNext, art, start = 0, motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const card = useRef<HTMLElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [refract, setRefract] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(start);

  // SVG backdrop filters only run in Chromium; elsewhere the glass is a plain blur.
  useEffect(() => {
    const chromium = /Chrome\//.test(navigator.userAgent) && !/Edg\/|OPR\//.test(navigator.userAgent);
    setRefract(chromium && CSS.supports("backdrop-filter", "url(#x) blur(1px)"));
  }, []);

  useLayoutEffect(() => {
    const el = card.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => { if (v + 0.25 >= duration) { setPlaying(false); return duration; } return v + 0.25; }), 250);
    return () => clearInterval(id);
  }, [playing, duration]);

  const move = (e: PointerEvent<HTMLElement>) => {
    const el = card.current!, r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  const squish = () => {
    const el = play.current!;
    el.classList.remove("lgc__play--squish");
    void el.offsetWidth; // restart on every press
    el.classList.add("lgc__play--squish");
  };

  const lens = refract && box.w > 0;
  return (
    <article
      ref={card}
      className={`lgc ${className}`}
      data-motion={motion}
      aria-label={`Now playing: ${title} by ${artist}`}
      onPointerMove={move}
      style={lens ? ({ backdropFilter: `url(#${uid}-lens) blur(1.5px) saturate(1.6) brightness(1.04)` } as CSSProperties) : undefined}
    >
      {lens && (
        <svg width="0" height="0" className="lgc__defs" aria-hidden="true">
          <filter id={`${uid}-lens`} x="0" y="0" width={box.w} height={box.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={lensMap(box.w, box.h)} x="0" y="0" width={box.w} height={box.h} result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="-64" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </svg>
      )}
      <span className="lgc__rim" aria-hidden="true" />
      <span className="lgc__sheen" aria-hidden="true" />

      <div className="lgc__head">
        <span className="lgc__art" style={art ? { background: art } : undefined} aria-hidden="true" />
        <div className="lgc__titles">
          <p className="lgc__eyebrow">Now playing</p>
          <h3 className="lgc__title">{title}</h3>
          <p className="lgc__artist">{artist}</p>
        </div>
      </div>

      <div className="lgc__scrub">
        <input
          type="range"
          className="lgc__range"
          min={0}
          max={duration}
          step={1}
          value={Math.floor(t)}
          aria-label="Position"
          aria-valuetext={`${clock(t)} of ${clock(duration)}`}
          style={{ "--p": `${(t / duration) * 100}%` } as CSSProperties}
          onChange={(e) => setT(Number(e.target.value))}
        />
        <div className="lgc__times" aria-hidden="true">
          <span>{clock(t)}</span>
          <span>-{clock(duration - t)}</span>
        </div>
      </div>

      <div className="lgc__controls">
        <button type="button" className="lgc__ctl" aria-label="Back 15 seconds" onClick={() => setT((v) => Math.max(0, v - 15))}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v3.5H8" /><text x="12" y="15.2" textAnchor="middle">15</text></svg>
        </button>
        <button
          ref={play}
          type="button"
          className="lgc__play"
          aria-label={playing ? "Pause" : "Play"}
          onPointerDown={squish}
          onAnimationEnd={() => play.current?.classList.remove("lgc__play--squish")}
          onClick={() => { if (t >= duration) setT(0); setPlaying((p) => !p); }}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 6v12M15.5 6v12" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13l10-6.5-10-6.5Z" /></svg>
          )}
        </button>
        <button type="button" className="lgc__ctl" aria-label="Forward 30 seconds" onClick={() => setT((v) => Math.min(duration, v + 30))}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v3.5H16" /><text x="12" y="15.2" textAnchor="middle">30</text></svg>
        </button>
      </div>

      {upNext && <p className="lgc__next"><span>Up next</span> {upNext}</p>}
    </article>
  );
}
