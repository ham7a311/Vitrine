"use client";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { advance, copiesFor, shift, split } from "./murmur";
import "./murmur-rows.css";

export type Murmur = {
  id: string;
  text: string;
  name: string;
  role?: string;
  /** A small portrait or illustration; omit for initials (tinted and pressed looks) or nothing. */
  avatar?: ReactNode;
  /** Pastel for the tinted and pressed looks; picked from the palette when omitted. */
  tint?: string;
};

export type MurmurRowsProps = {
  quotes: Murmur[];
  rows?: 1 | 2 | 3;
  /** Pixels per second; 0 holds still. Defaults to 24, or 18 in narrow containers. */
  speed?: number;
  look?: "illustrated" | "text-only" | "tinted" | "pressed";
  /** Accessible name for the region. */
  label?: string;
  className?: string;
};

const TINTS = ["#f6d9c4", "#d4e8d6", "#dcd6f2", "#f3e6b3", "#cfe2f2", "#f2d0dc"];
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

function Quote({ q, i, look }: { q: Murmur; i: number; look: NonNullable<MurmurRowsProps["look"]> }) {
  const tint = q.tint ?? TINTS[i % TINTS.length];
  const showAvatar = look !== "text-only";
  const avatar = q.avatar ?? (look === "tinted" || look === "pressed" ? <span className="murmur__initials">{initials(q.name)}</span> : null);
  return (
    <figure className="murmur__q" style={{ "--murmur-tint": tint } as CSSProperties}>
      <div className="murmur__face">
        <blockquote className="murmur__text">{q.text}</blockquote>
        <figcaption className="murmur__by">
          {showAvatar && avatar && <span className="murmur__avatar" aria-hidden="true">{avatar}</span>}
          <span className="murmur__who">
            <span className="murmur__name">{look === "text-only" ? "— " : ""}{q.name}</span>
            {q.role && <span className="murmur__role">{q.role}</span>}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

function Row({ items, offsetIndex, direction, speed, paused, look }: {
  items: Murmur[]; offsetIndex: number; direction: "left" | "right"; speed?: number; paused: boolean; look: NonNullable<MurmurRowsProps["look"]>;
}) {
  const viewport = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null), group = useRef<HTMLDivElement>(null);
  const period = useRef(0), offset = useRef(-1), hover = useRef(false), visible = useRef(false);
  const [copies, setCopies] = useState(2);

  const apply = () => { if (track.current) track.current.style.transform = `translate3d(${shift(offset.current, period.current, direction)}px,0,0)`; };

  useLayoutEffect(() => {
    const box = viewport.current, first = group.current;
    if (!box || !first) return;
    const measure = () => {
      const next = first.getBoundingClientRect().width;
      if (next <= 0) return;
      // first measure: rows start out of step with each other
      if (offset.current < 0) offset.current = (next * (offsetIndex * 0.37)) % next;
      else if (period.current > 0) offset.current = (offset.current / period.current) * next;
      period.current = next;
      setCopies(copiesFor(box.getBoundingClientRect().width, next));
      apply();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box); ro.observe(first);
    let live = true;
    document.fonts?.ready.then(() => { if (live) measure(); });
    return () => { live = false; ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, direction]);

  useEffect(() => {
    const box = viewport.current;
    if (!box || paused) return;
    let frame = 0, last = 0, gone = false;
    const tick = (now: number) => {
      frame = 0;
      if (gone || document.hidden || !visible.current || hover.current) { last = 0; return; }
      const px = speed ?? (box.clientWidth < 640 ? 18 : 24);
      if (last) offset.current = advance(offset.current, (now - last) / 1000, px, period.current);
      last = now; apply();
      frame = requestAnimationFrame(tick);
    };
    const start = () => { if (!frame && !gone && speed !== 0) frame = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; };
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; stop(); start(); });
    io.observe(box);
    const vis = () => { stop(); start(); };
    const enter = () => { hover.current = true; stop(); box.classList.add("murmur__row--held"); };
    const leave = () => { hover.current = false; box.classList.remove("murmur__row--held"); start(); };
    document.addEventListener("visibilitychange", vis);
    box.addEventListener("pointerenter", enter); box.addEventListener("pointerleave", leave);
    hover.current = box.matches(":hover");
    start();
    return () => {
      gone = true; stop(); io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      box.removeEventListener("pointerenter", enter); box.removeEventListener("pointerleave", leave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, speed, direction]);

  return (
    <div ref={viewport} className="murmur__row">
      <div ref={track} className="murmur__track">
        {Array.from({ length: copies }, (_, c) => (
          <div key={c} ref={c === 0 ? group : undefined} className="murmur__group">
            {items.map((q, i) => <Quote key={`${c}-${q.id}`} q={q} i={i + offsetIndex} look={look} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MurmurRows({ quotes, rows = 2, speed, look = "illustrated", label = "What people say", className = "" }: MurmurRowsProps) {
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on(); m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  const still = reduced || quotes.length < 3;
  const lines = split(quotes, rows);
  const dark = look === "illustrated" || look === "text-only";

  return (
    <section className={`murmur murmur--${look} ${dark ? "murmur--dark" : "murmur--light"} ${className}`} aria-label={label}>
      {still ? (
        <ul className="murmur__still">
          {quotes.map((q, i) => <li key={q.id}><Quote q={q} i={i} look={look} /></li>)}
        </ul>
      ) : (
        <>
          <ul className="murmur__sr">
            {quotes.map((q) => <li key={q.id}><figure><blockquote>{q.text}</blockquote><figcaption>{q.name}{q.role ? `, ${q.role}` : ""}</figcaption></figure></li>)}
          </ul>
          <div className="murmur__rows" aria-hidden="true">
            {lines.map((items, r) => (
              <Row key={r} items={items} offsetIndex={r} direction={r % 2 ? "right" : "left"} speed={speed} paused={paused} look={look} />
            ))}
            {[0, 1].map((side) => (
              <div key={side} className={`murmur__edge murmur__edge--${side ? "r" : "l"}`}>
                <i /><i /><i /><i />
              </div>
            ))}
          </div>
          <button type="button" className="murmur__pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            {paused
              ? <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
              : <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1.5" width="2.8" height="9" rx=".7" fill="currentColor" /><rect x="7.2" y="1.5" width="2.8" height="9" rx=".7" fill="currentColor" /></svg>}
            <span>{paused ? "Play testimonials" : "Pause testimonials"}</span>
          </button>
        </>
      )}
    </section>
  );
}

export default MurmurRows;
