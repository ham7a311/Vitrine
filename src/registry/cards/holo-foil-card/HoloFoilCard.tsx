"use client";

import { useEffect, useRef, useState } from "react";
import "./holo-foil-card.css";

/**
 * Holo Foil Card
 * A founding-member card printed on holographic foil. Tilt it with the
 * pointer and the rainbow slides across the foil the way it does on a real
 * card — strongest at steep angles — glitter catches and goes, and a glare
 * follows the light. Click (or press Enter) to turn it over.
 */

type Props = {
  name?: string;
  number?: string;
  since?: string;
  finish?: "rainbow" | "gold" | "obsidian";
  motion?: "full" | "reduced";
  className?: string;
};

export function HoloFoilCard({ name = "Hamza Al-Bulushi", number = "0042", since = "2026", finish = "rainbow", motion = "full", className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const flipRef = useRef(false);
  flipRef.current = flipped;

  useEffect(() => {
    const host = hostRef.current, card = cardRef.current;
    if (!host || !card) return;
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = motion === "reduced" || rm.matches;
    // Tilt on a spring toward where the pointer is; the loop only runs while it moves.
    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, px: 50, py: 50, tpx: 50, tpy: 50, flip: 0, vf: 0 };
    let raf = 0, last = 0;
    const write = () => {
      card.style.setProperty("--rx", `${s.y.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(s.x + s.flip).toFixed(2)}deg`);
      card.style.setProperty("--px", `${s.px.toFixed(1)}%`);
      card.style.setProperty("--py", `${s.py.toFixed(1)}%`);
      card.style.setProperty("--pxn", s.px.toFixed(1));
      card.style.setProperty("--hyp", Math.min(1, Math.hypot(s.x, s.y) / 18).toFixed(3));
    };
    const step = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, last ? (now - last) / 1000 : 0.016);
      last = now;
      const k = 170, c = 2 * 0.72 * Math.sqrt(k);
      s.vx += ((s.tx - s.x) * k - s.vx * c) * dt;
      s.vy += ((s.ty - s.y) * k - s.vy * c) * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      const ft = flipRef.current ? 180 : 0, kf = 90, cf = 2 * 0.7 * Math.sqrt(kf);
      s.vf += ((ft - s.flip) * kf - s.vf * cf) * dt;
      s.flip += s.vf * dt;
      s.px += (s.tpx - s.px) * Math.min(1, dt * 12);
      s.py += (s.tpy - s.py) * Math.min(1, dt * 12);
      write();
      const busy = Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) + Math.abs(ft - s.flip) > 0.05 || Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(s.vf) > 0.05 || Math.abs(s.tpx - s.px) + Math.abs(s.tpy - s.py) > 0.1;
      if (busy) raf = requestAnimationFrame(step); else last = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(step); };
    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), ny = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
      s.tx = (nx - 0.5) * 30;
      s.ty = -(ny - 0.5) * 30;
      // The foil reads the light from the opposite side when the card is turned over.
      s.tpx = (flipRef.current ? 1 - nx : nx) * 100;
      s.tpy = ny * 100;
      host.dataset.on = "";
      if (still) { s.x = s.tx * 0.4; s.y = s.ty * 0.4; s.px = s.tpx; s.py = s.tpy; write(); return; }
      wake();
    };
    const onLeave = () => { s.tx = 0; s.ty = 0; s.tpx = 50; s.tpy = 50; delete host.dataset.on; if (still) { s.x = s.y = 0; write(); } else wake(); };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    (host as HTMLDivElement & { __wake?: () => void }).__wake = () => { if (still) { s.flip = flipRef.current ? 180 : 0; write(); } else wake(); };
    write();
    return () => { cancelAnimationFrame(raf); raf = 0; host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); };
  }, [motion]);

  useEffect(() => { (hostRef.current as (HTMLDivElement & { __wake?: () => void }) | null)?.__wake?.(); }, [flipped]);

  return (
    <div ref={hostRef} className={`hf hf--${finish} ${className}`} data-motion={motion}>
      <button type="button" className="hf__btn" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped} aria-label={`Vitrine founding member card, ${name}, number ${number}. ${flipped ? "Showing the back" : "Showing the front"}; press to turn over.`}>
        <div ref={cardRef} className="hf__card">
          {/* Front */}
          <div className="hf__face hf__front" aria-hidden="true">
            <div className="hf__base" />
            <div className="hf__foil" />
            <div className="hf__glitter" />
            <div className="hf__content">
              <div className="hf__top">
                <span className="hf__logo">Vitrine</span>
                <span className="hf__no">No. {number}</span>
              </div>
              <div className="hf__emblem" />
              <div className="hf__bottom">
                <span className="hf__kicker">Founding member</span>
                <span className="hf__name">{name}</span>
                <span className="hf__meta">Since {since} · Muscat</span>
              </div>
            </div>
            <div className="hf__glare" />
            <div className="hf__edge" />
          </div>
          {/* Back */}
          <div className="hf__face hf__back" aria-hidden="true">
            <div className="hf__base" />
            <div className="hf__stripe" />
            <div className="hf__content hf__content--back">
              <div className="hf__sig"><span>{name}</span></div>
              <p className="hf__terms">This card is yours for life. It opens early access, the members’ table at every Vitrine weekend, and a seat at the yearly gathering in Jabal Akhdar.</p>
              <div className="hf__seal" />
              <span className="hf__meta">tryvitrine.dev/members · {number}</span>
            </div>
            <div className="hf__glare" />
            <div className="hf__edge" />
          </div>
        </div>
      </button>
      <div className="hf__shadow" aria-hidden="true" />
    </div>
  );
}
