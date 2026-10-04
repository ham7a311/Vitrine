"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import "./feral-title.css";

/**
 * Feral Title
 * A brutal, tall condensed wordmark: heartbeat in the dark, letters slam in one
 * by one with a shudder, a gash tears through and the word bleeds. Then it
 * breathes, its raw edges jittering.
 */

type Props = {
  text?: string;
  /** [top, bottom] of the letter gradient. */
  colors?: [string, string];
  /** Colour of the bleed and glow. */
  blood?: string;
  background?: string;
  className?: string;
};

const START = 1.3; // seconds before the first slam
const STEP = 0.24; // seconds between slams

export function FeralTitle({
  text = "HAMZA",
  colors = ["#c1121f", "#7a0000"],
  blood = "#5a0000",
  background = "#050303",
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const [run, setRun] = useState(0);
  const shakeRef = useRef<HTMLDivElement>(null);
  const seedRef = useRef<SVGFETurbulenceElement>(null);
  const letters = Array.from(text.toUpperCase());
  const end = START + letters.length * STEP;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    letters.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          shakeRef.current?.animate(
            [
              { transform: "translate(0,0)" },
              { transform: `translate(${i % 2 ? -5 : 5}px, 4px)` },
              { transform: `translate(${i % 2 ? 3 : -3}px, -3px)` },
              { transform: "translate(0,0)" },
            ],
            { duration: 220, easing: "ease-out" },
          );
        }, (START + i * STEP + 0.12) * 1000),
      );
    });
    let seed = 1;
    const jitter = setInterval(() => {
      seed = (seed % 40) + 1;
      seedRef.current?.setAttribute("seed", String(seed));
    }, 160);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(jitter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, text]);

  const style = {
    "--ft-a": colors[0],
    "--ft-b": colors[1],
    "--ft-blood": blood,
    "--ft-bg": background,
    "--ft-start": `${START}s`,
    "--ft-step": `${STEP}s`,
    "--ft-end": `${end}s`,
  } as CSSProperties;

  return (
    <div className={`feral-title ${className}`} style={style} key={run}>
      <svg width="0" height="0" aria-hidden="true" className="feral-title__defs">
        <filter id={`${uid}-rough`} x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence ref={seedRef} type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="3" seed="1" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="feral-title__pulse" aria-hidden="true" />
      <div className="feral-title__grain" aria-hidden="true" />

      <div className="feral-title__shake" ref={shakeRef}>
        <h2 className="feral-title__word" aria-label={text} style={{ filter: `url(#${uid}-rough)` }}>
          <span className="feral-title__bleed" aria-hidden="true">{letters.join("")}</span>
          {letters.map((ch, i) => (
            <span key={i} aria-hidden="true" className="feral-title__letter" style={{ "--i": i } as CSSProperties}>
              {ch}
            </span>
          ))}
          <span className="feral-title__gash" aria-hidden="true" />
          <span className="feral-title__drips" aria-hidden="true">
            {[8, 21, 37, 52, 66, 79, 91].map((left, i) => (
              <i key={i} style={{ left: `${left}%`, "--d": i } as CSSProperties} />
            ))}
          </span>
        </h2>
      </div>

      <button type="button" className="feral-title__replay" onClick={() => setRun((r) => r + 1)}>
        Replay
      </button>
    </div>
  );
}
