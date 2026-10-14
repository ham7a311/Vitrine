"use client";
import { useEffect, useId, useRef, type CSSProperties } from "react";
import { pace, settle, wrap } from "./tape";
import "./crossed-tapes.css";

export type TapePalette = { ground: string; ink: string; muted: string; line: string; a: string; aInk: string; b: string; bInk: string };
export type TapeLink = { label: string; href: string };

export type CrossedTapesProps = {
  /** Words repeated along both tapes. */
  words: string[];
  eyebrow?: string;
  title: string;
  lead?: string;
  /** The small heading and line on the card beside the actions. */
  card?: { title: string; detail: string };
  primary: TapeLink;
  secondary?: TapeLink;
  palette?: TapePalette;
  /** Caution-tape stripes along the edges of the tapes. */
  stripes?: boolean;
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  className?: string;
};

const DEFAULT: TapePalette = { ground: "#f2efe6", ink: "#111111", muted: "#4a4740", line: "rgba(17, 17, 17, 0.16)", a: "#ffd400", aInk: "#111111", b: "#111111", bInk: "#ffd400" };

function Track({ words, dir }: { words: string[]; dir: 1 | -1 }) {
  const group = (copy: number) => (
    <span className="ctape__group" aria-hidden="true" key={copy}>
      {words.map((w, i) => <span key={i} className={`ctape__word ${i % 2 ? "ctape__word--outline" : ""}`}>{w}<i>✦</i></span>)}
    </span>
  );
  return <span className="ctape__track" data-dir={dir}>{[0, 1, 2, 3].map(group)}</span>;
}

/**
 * Crossed Tapes
 * A section that opens under two tapes crossed like a cordon, each printed with big words that
 * roll along it in opposite directions — and roll faster while the page is scrolling. Copy on the
 * left, the actions on a card in the tape's colour on the right.
 */
export function CrossedTapes({ words, eyebrow, title, lead, card, primary, secondary, palette = DEFAULT, stripes = true, onNavigate, className = "" }: CrossedTapesProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tracks = [...el.querySelectorAll<HTMLElement>(".ctape__track")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !tracks.length) return;
    let raf = 0, last = 0, offset = 0, speed = 0, lastScroll: { y: number; t: number } | null = null, visible = false;
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      speed = settle(speed, dt);
      offset += pace(46, speed) * dt;
      for (const t of tracks) {
        const span = (t.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
        const x = wrap(offset, span);
        t.style.transform = `translateX(${t.dataset.dir === "1" ? -x : x - span}px)`;
      }
      if (visible) raf = requestAnimationFrame(tick);
    };
    const onScroll = (e: Event) => {
      const tgt = e.target instanceof HTMLElement ? e.target : document.scrollingElement;
      const y = tgt?.scrollTop ?? window.scrollY, t = performance.now();
      if (lastScroll && t > lastScroll.t) speed = Math.max(speed, Math.abs(y - lastScroll.y) / ((t - lastScroll.t) / 1000));
      lastScroll = { y, t };
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { last = 0; raf = requestAnimationFrame(tick); } });
    io.observe(el);
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("scroll", onScroll, { capture: true }); };
  }, [words]);

  const go = (l: TapeLink) => (e: React.MouseEvent) => onNavigate?.(l.href, e);
  const vars = { ["--ct-ground" as string]: palette.ground, ["--ct-ink" as string]: palette.ink, ["--ct-muted" as string]: palette.muted, ["--ct-line" as string]: palette.line, ["--ct-a" as string]: palette.a, ["--ct-a-ink" as string]: palette.aInk, ["--ct-b" as string]: palette.b, ["--ct-b-ink" as string]: palette.bInk } as CSSProperties;

  return (
    <section ref={root} aria-labelledby={`${id}-t`} className={`ctape ${stripes ? "ctape--stripes" : ""} ${className}`} style={vars}>
      <div className="ctape__cross">
        <div className="ctape__tape ctape__tape--b"><Track words={words} dir={-1} /></div>
        <div className="ctape__tape ctape__tape--a"><Track words={words} dir={1} /></div>
        <p className="ctape__sr">{words.join(" · ")}</p>
      </div>
      <div className="ctape__body">
        <div className="ctape__copy">
          {eyebrow && <p className="ctape__eyebrow">{eyebrow}</p>}
          <h2 id={`${id}-t`} className="ctape__title">{title}</h2>
          {lead && <p className="ctape__lead">{lead}</p>}
        </div>
        <div className="ctape__card">
          {card && <><p className="ctape__card-title">{card.title}</p><p className="ctape__card-detail">{card.detail}</p></>}
          <div className="ctape__actions">
            <a className="ctape__btn ctape__btn--primary" href={primary.href} onClick={go(primary)}>{primary.label}</a>
            {secondary && <a className="ctape__btn ctape__btn--ghost" href={secondary.href} onClick={go(secondary)}>{secondary.label}</a>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CrossedTapes;
