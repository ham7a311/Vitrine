"use client";

import { useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";
import "./vinyl-sleeve-card.css";

/**
 * Vinyl Sleeve
 * An album as an object. Point at it and the record slides half out of its
 * sleeve; press play and it spins at 33⅓ while the tonearm swings over and
 * drops onto the groove. The light on the vinyl stays where it is while the
 * record turns beneath it — which is what makes it look like vinyl — and
 * the label goes round with the music.
 */

export type Album = {
  title: string;
  artist: string;
  year: string;
  track: string;
  seconds: number;
  cover: ReactNode;
  label: string; // label colour
  ink: string; // label text colour
};
type Props = { album: Album; motion?: "full" | "reduced"; className?: string };

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function VinylSleeveCard({ album, motion = "full", className = "" }: Props) {
  const id = useId();
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);

  // The clock only ticks while playing.
  useEffect(() => {
    if (!playing) return;
    const iv = window.setInterval(() => setT((x) => (x + 1 >= album.seconds ? 0 : x + 1)), 1000);
    return () => clearInterval(iv);
  }, [playing, album.seconds]);

  return (
    <article className={`vs ${className}`} data-motion={motion} data-playing={playing || undefined} aria-labelledby={`${id}-t`} style={{ ["--label" as string]: album.label, ["--label-ink" as string]: album.ink } as CSSProperties}>
      <div className="vs__stage">
        {/* The record, behind the sleeve. */}
        <div className="vs__record" aria-hidden="true">
          <div className="vs__disc">
            <div className="vs__label">
              <span className="vs__lt">{album.title}</span>
              <span className="vs__la">{album.artist}</span>
              <i className="vs__hole" />
            </div>
          </div>
          {/* The light on the vinyl: fixed, while the disc turns under it. */}
          <div className="vs__sheen" />
        </div>
        <div className="vs__sleeve" aria-hidden="true">
          {album.cover}
          <div className="vs__wear" />
        </div>
        {/* The tonearm, pivoting from the corner. */}
        <svg className="vs__arm" viewBox="0 0 120 200" aria-hidden="true">
          <circle cx="92" cy="22" r="16" className="vs__base" />
          <circle cx="92" cy="22" r="6" className="vs__pin" />
          <g className="vs__swing">
            <path d="M92 22 L86 150 Q85 162 74 170" className="vs__rod" />
            <rect x="62" y="164" width="18" height="26" rx="3" transform="rotate(32 71 177)" className="vs__head" />
            <rect x="96" y="2" width="12" height="18" rx="3" className="vs__weight" />
          </g>
        </svg>
      </div>

      <div className="vs__info">
        <div>
          <h3 id={`${id}-t`} className="vs__title">{album.title}</h3>
          <p className="vs__by">{album.artist} · {album.year}</p>
        </div>
        <div className="vs__now">
          <button type="button" className="vs__play" onClick={() => setPlaying((p) => !p)} aria-pressed={playing} aria-label={playing ? `Pause ${album.title}` : `Play ${album.title} by ${album.artist}`}>
            {playing ? (
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4h3v12H6zM11 4h3v12h-3z" /></svg>
            ) : (
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.2v11.6L16 10z" /></svg>
            )}
          </button>
          <div className="vs__track">
            <span className="vs__song">{album.track}</span>
            <div className="vs__bar" role="progressbar" aria-label="Track progress" aria-valuemin={0} aria-valuemax={album.seconds} aria-valuenow={t} aria-valuetext={`${mmss(t)} of ${mmss(album.seconds)}`}>
              <i style={{ width: `${(t / album.seconds) * 100}%` }} />
            </div>
            <span className="vs__time" aria-hidden="true">{mmss(t)} / {mmss(album.seconds)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
