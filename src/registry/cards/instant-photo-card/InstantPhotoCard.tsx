"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Corniche, Desert, Night } from "./scenes";
import "./instant-photo-card.css";

/**
 * Instant Photo
 * A print that develops in your hand. It comes out a murky brown-grey;
 * over six seconds or so the darks come up first, then the colour floods
 * in until the evening is all there. Give it a shake — drag it about — and
 * it develops faster, swinging as you go. Once it's done, a caption gets
 * written along the bottom in pen.
 */

const SCENES = {
  corniche: { el: Corniche, alt: "The Mutrah corniche at dusk: the fort on its hill, a dhow under sail and the sun setting on the water.", caption: "Mutrah, staying out late", date: "17·03" },
  desert: { el: Desert, alt: "Golden dunes at sunset with a small camel caravan along a ridge.", caption: "Wahiba — Sami fell off twice", date: "02·11" },
  night: { el: Night, alt: "Old Muscat at night under a full moon, warm windows and a minaret against the hills.", caption: "Muscat from the roof, 2am", date: "28·08" },
};
type Props = { scene?: keyof typeof SCENES; motion?: "full" | "reduced"; className?: string };

const DEV_SECONDS = 6.5;

export function InstantPhotoCard({ scene = "corniche", motion = "full", className = "" }: Props) {
  const S = SCENES[scene];
  const Scene = S.el;
  const cardRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  const st = useRef({ dev: 0, rot: -3, vr: 0, tr: -3, shake: 0, raf: 0, last: 0, px: NaN, py: NaN, drag: false, ox: 0, oy: 0 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const s = st.current;
    const rm = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.dev = rm ? 1 : 0;
    setDone(rm);
    const write = () => {
      card.style.setProperty("--dev", s.dev.toFixed(4));
      card.style.transform = `translate(${s.ox.toFixed(1)}px, ${s.oy.toFixed(1)}px) rotate(${s.rot.toFixed(2)}deg)`;
    };
    const step = (now: number) => {
      s.raf = 0;
      const dt = Math.min(0.05, s.last ? (now - s.last) / 1000 : 0.016);
      s.last = now;
      // Developing: faster while it's being shaken.
      if (s.dev < 1) {
        s.dev = Math.min(1, s.dev + (dt / DEV_SECONDS) * (1 + Math.min(3, s.shake)));
        if (s.dev >= 1) setDone(true);
      }
      s.shake *= Math.exp(-2.5 * dt);
      // The card swings on a spring, and drifts back to where it lay when let go.
      const k = 90, c = 9;
      s.vr += ((s.tr - s.rot) * k - s.vr * c) * dt;
      s.rot += s.vr * dt;
      if (!s.drag) { s.ox *= Math.exp(-6 * dt); s.oy *= Math.exp(-6 * dt); }
      write();
      const busy = s.dev < 1 || s.drag || Math.abs(s.vr) > 0.05 || Math.abs(s.tr - s.rot) > 0.05 || Math.abs(s.ox) + Math.abs(s.oy) > 0.3;
      if (busy && !document.hidden) s.raf = requestAnimationFrame(step); else s.last = 0;
    };
    const wake = () => { if (!s.raf) s.raf = requestAnimationFrame(step); };
    (card as HTMLDivElement & { __wake?: () => void }).__wake = wake;
    write();
    // Start developing once it's on screen.
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) wake(); }, { threshold: 0.4 });
    io.observe(card);
    const onVis = () => !document.hidden && wake();
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(s.raf); s.raf = 0; io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [motion, round, scene]);

  const onDown = (e: React.PointerEvent) => {
    const s = st.current;
    s.drag = true; s.px = e.clientX; s.py = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const s = st.current;
    if (!s.drag) return;
    const dx = e.clientX - s.px, dy = e.clientY - s.py;
    s.px = e.clientX; s.py = e.clientY;
    s.ox = Math.max(-60, Math.min(60, s.ox + dx * 0.6));
    s.oy = Math.max(-40, Math.min(40, s.oy + dy * 0.6));
    s.vr += dx * 6;
    s.shake += Math.hypot(dx, dy) / 60;
    (cardRef.current as (HTMLDivElement & { __wake?: () => void }) | null)?.__wake?.();
  };
  const onUp = () => { st.current.drag = false; };

  return (
    <div className={`ip ${className}`} data-motion={motion}>
      <figure
        ref={cardRef}
        className="ip__card"
        data-done={done || undefined}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ ["--dev" as string]: 0 } as CSSProperties}
        key={round}
      >
        <div className="ip__photo">
          <svg viewBox="0 0 260 260" role="img" aria-label={S.alt} className="ip__scene">
            <Scene />
          </svg>
          {/* The chemistry: a murky cast over the image that clears as it develops. */}
          <div className="ip__murk" aria-hidden="true" />
          <div className="ip__sheen" aria-hidden="true" />
        </div>
        <figcaption className="ip__caption">
          <span className="ip__ink">{S.caption}</span>
          <span className="ip__date">{S.date}</span>
        </figcaption>
      </figure>
      <div className="ip__ctl">
        <span className="ip__status" aria-live="polite">{done ? "Developed" : "Developing… shake it to hurry it along"}</span>
        <button type="button" onClick={() => setRound((r) => r + 1)} disabled={!done}>Take another</button>
      </div>
    </div>
  );
}
