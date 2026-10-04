"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import "./voices-carousel.css";

/**
 * Voices Carousel
 * A testimonial "exhibition": one large quote at a time on a frosted glass
 * card, crossfading between voices without ever resizing. Serif pull-quotes
 * float at the edges, and a wide image plate grounds the bottom of the section.
 */

export type Voice = {
  id: string;
  name: string;
  role: string;
  /** Shown as two lines if it contains ": " (e.g. "Workshop: Designing for latency"). */
  session: string;
  quote: string;
};

type Props = {
  voices: Voice[];
  eyebrowIndex?: string;
  title: string;
  lead: ReactNode;
  pullA?: ReactNode;
  pullB?: ReactNode;
  archive?: { label: string; href: string };
  /** Image for the ground plate (2688×1220 works best). Omit to show a placeholder plate. */
  image?: string;
};

const pad = (v: number) => String(v).padStart(2, "0");
const formatRole = (role: string) => role.replace(/\s+at\s+/gi, " · ").toUpperCase();
const sessionLines = (s: string) => {
  const i = s.indexOf(": ");
  return i === -1 ? [s] : [s.slice(0, i), s.slice(i + 2)];
};

function Arrow({ dir }: { dir: "left" | "right" | "up-right" }) {
  const d = dir === "left" ? "M19 12H5M12 19l-7-7 7-7" : dir === "right" ? "M5 12h14M12 5l7 7-7 7" : "M7 17 17 7M7 7h10v10";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function VoiceStage({ voice }: { voice: Voice }) {
  return (
    <article aria-labelledby={`${voice.id}-name`} className="vc-article">
      <div className="vc-author">
        <span className="vc-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </span>
        <div className="vc-author__text">
          <p id={`${voice.id}-name`} className="vc-author__name">
            {voice.name}
          </p>
          <p className="vc-author__role">{formatRole(voice.role)}</p>
        </div>
      </div>
      <p className="vc-session">
        {sessionLines(voice.session).map((l) => (
          <span key={l}>{l}</span>
        ))}
      </p>
      <blockquote className="vc-quote">
        <span className="vc-mark" aria-hidden="true">
          “
        </span>
        {voice.quote}
      </blockquote>
    </article>
  );
}

export function VoicesCarousel({ voices, eyebrowIndex, title, lead, pullA, pullB, archive, image }: Props) {
  const [index, setIndex] = useState(0);
  const titleId = useId();
  const stageRef = useRef<HTMLElement>(null);
  const inView = useRef(false);
  const count = voices.length;
  const voice = voices[index] ?? voices[0];

  const go = useCallback((step: -1 | 1) => setIndex((i) => (i + step + count) % count), [count]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (inView.current = Boolean(e?.isIntersecting)), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Arrow keys page through voices while the section is at least 25% on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inView.current) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable || t.closest("[data-own-arrows]"))) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!voice) return null;

  return (
    <section ref={stageRef} className="vc-stage" aria-labelledby={titleId}>
      <div className="vc-ground" aria-hidden="true">
        <div className="vc-ground__art">
          {image ? (
            <img src={image} alt="" className="vc-ground__img" />
          ) : (
            <div className="vc-placeholder">
              <span className="vc-placeholder__corner vc-placeholder__corner--tl" />
              <span className="vc-placeholder__corner vc-placeholder__corner--br" />
              <span className="vc-placeholder__caption">[ image · 2688 × 1220 ]</span>
            </div>
          )}
        </div>
      </div>

      <div className="vc-frame">
        <p className="vc-eyebrow">
          {eyebrowIndex && <span className="vc-eyebrow__index">{eyebrowIndex}</span>}
          <span className="vc-eyebrow__rule" aria-hidden="true" />
          {title}
        </p>
        <h2 id={titleId} className="vc-title">
          {title}
        </h2>
        <p className="vc-lead">{lead}</p>

        {pullA && (
          <p className="vc-pull vc-pull--a" aria-hidden="true">
            {pullA}
          </p>
        )}

        <div className="vc-deck">
          <button type="button" className="vc-pager vc-pager--prev" onClick={() => go(-1)} aria-label="Previous voice">
            <Arrow dir="left" />
          </button>

          <div className="vc-card">
            <div className="vc-card__live">
              <p className="vc-sr" aria-live="polite">
                {voice.name}. {voice.quote}
              </p>
              {voices.map((item) => {
                const active = item.id === voice.id;
                return (
                  <div key={item.id} className="vc-slide" data-active={active || undefined} aria-hidden={active ? undefined : true} inert={!active}>
                    <VoiceStage voice={item} />
                  </div>
                );
              })}
            </div>
          </div>

          <button type="button" className="vc-pager vc-pager--next" onClick={() => go(1)} aria-label="Next voice">
            <Arrow dir="right" />
          </button>
        </div>

        <p className="vc-index">
          {pad(index + 1)}
          <span className="vc-index__rule" aria-hidden="true">
            /
          </span>
          {pad(count)}
        </p>

        {pullB && (
          <p className="vc-pull vc-pull--b" aria-hidden="true">
            {pullB}
          </p>
        )}

        {archive && (
          <div className="vc-archive-wrap">
            <a href={archive.href} className="vc-archive">
              {archive.label}
              <Arrow dir="up-right" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
