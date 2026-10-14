"use client";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { counter, ring, type Glyph } from "./ring";
import "./wrap-caption.css";

export type WrapSlide = {
  id: string;
  /** An illustration or picture element… */
  picture?: ReactNode;
  /** …or an image URL. */
  src?: string;
  alt: string;
  place: string;
  /** Two phrases that circle the picture, top and bottom. */
  lines: [string, string];
};

export type WrapCaptionProps = {
  slides: WrapSlide[];
  /** Colour of the circling text and the labels. */
  accent?: string;
  /** Seconds for one full turn of the text. */
  turn?: number;
  className?: string;
};

const SEP = "  ·  ";

function Ring({ phrase, size, radius, top, reverse, turn }: { phrase: string; size: number; radius: number; top: string; reverse?: boolean; turn: number }) {
  const [layout, setLayout] = useState<{ radius: number; glyphs: Glyph[] }>({ radius, glyphs: [] });
  // measure in the browser, after mount and again once the font has loaded
  useEffect(() => {
    let live = true;
    const measure = () => {
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx || !live) return;
      ctx.font = `700 ${size}px "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif`;
      const tracking = -0.02 * size;
      setLayout(ring(phrase.toUpperCase() + SEP, (ch) => ctx.measureText(ch).width + tracking, radius));
    };
    measure();
    document.fonts?.ready.then(measure);
    return () => { live = false; };
  }, [phrase, size, radius]);
  return (
    <div className="wrapc__ring" style={{ top, ["--wrapc-r" as string]: `${layout.radius}px`, fontSize: size } as CSSProperties} aria-hidden="true">
      <div className={`wrapc__spin ${reverse ? "wrapc__spin--rev" : ""}`} style={{ animationDuration: `${turn}s` }}>
        {layout.glyphs.map((g, i) => (
          <span key={i} className="wrapc__glyph" style={{ transform: `rotateY(${g.angle}deg) translateZ(${layout.radius}px) translate(-50%, -50%)` }}>{g.ch === " " ? " " : g.ch}</span>
        ))}
      </div>
    </div>
  );
}

export function WrapCaption({ slides, accent = "#4a7be0", turn = 70, className = "" }: WrapCaptionProps) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(1200);
  const [live, setLive] = useState(true);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width || 1200);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // stop turning offscreen and in hidden tabs
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let visible = true;
    const sync = () => setLive(visible && !document.hidden);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  const n = slides.length;
  const go = (d: number) => setIndex((i) => (i + d + n) % n);
  // on narrow screens the words circle above and below the picture instead of across it
  const narrow = width < 640;
  const size = Math.round(narrow ? Math.max(36, width * 0.13) : Math.max(40, Math.min(170, width * 0.085)));
  const radius = Math.max(300, width * 0.8);
  const tops = narrow ? ["9%", "84%"] : ["34%", "58%"];
  const s = slides[index];

  return (
    <div
      ref={root}
      className={`wrapc ${live ? "" : "wrapc--still"} ${className}`}
      style={{ ["--wrapc-accent" as string]: accent } as CSSProperties}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photo stories"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } }}
    >
      <div className="wrapc__stage">
        {slides.map((sl, i) => (
          <div key={sl.id} className={`wrapc__rings ${i === index ? "wrapc__rings--on" : ""}`}>
            <Ring phrase={sl.lines[0]} size={size} radius={radius} top={tops[0]} turn={turn} />
            <Ring phrase={sl.lines[1]} size={size} radius={radius} top={tops[1]} reverse turn={turn * 1.15} />
          </div>
        ))}
        <figure className="wrapc__card">
          {slides.map((sl, i) => (
            <div key={sl.id} className={`wrapc__pic ${i === index ? "wrapc__pic--on" : ""}`} aria-hidden={i !== index}>
              {sl.src ? <img src={sl.src} alt={sl.alt} /> : <span role="img" aria-label={sl.alt}>{sl.picture}</span>}
            </div>
          ))}
          <figcaption className="wrapc__meta">
            <span className="wrapc__count" aria-live="polite">{counter(index, n)}</span>
            <span className="wrapc__nav">
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M9 2.5 4.5 7 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M5 2.5 9.5 7 5 11.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </span>
            <span className="wrapc__place">{s.place}</span>
          </figcaption>
        </figure>
      </div>
      <p className="wrapc__sr" aria-live="polite">{`${s.lines[0]}. ${s.lines[1]}. ${s.place}.`}</p>
    </div>
  );
}

export default WrapCaption;
