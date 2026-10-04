"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./flourish-name.css";

type Props = { name: string; ink?: string; className?: string };

export function FlourishName({ name, ink = "#f4efe6", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []);
  const swash = "M8 46 C 60 16, 150 12, 236 34 S 420 58, 470 26 C 500 8, 520 18, 508 34";
  return (
    <div ref={ref} className={`flourish-name ${className}`} style={{ "--fn-ink": ink } as CSSProperties}>
      <button type="button" className="flourish-name__btn" onClick={() => setRun((r) => r + 1)} aria-label={`${name} — replay signature`}>
        <span key={`t${run}`} className="flourish-name__text" data-on={seen || undefined}>{name}</span>
        <svg key={`s${run}`} viewBox="0 0 520 70" className="flourish-name__svg" data-on={seen || undefined} aria-hidden="true">
          <path className="flourish-name__stroke flourish-name__stroke--thick" d={swash} pathLength={1} />
          <path className="flourish-name__stroke flourish-name__stroke--thin" d={swash} pathLength={1} transform="translate(2 3)" />
          <circle className="flourish-name__dot" cx="508" cy="34" r="4.5" />
        </svg>
      </button>
    </div>
  );
}
