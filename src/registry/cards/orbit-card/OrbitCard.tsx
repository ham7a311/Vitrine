"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import "./orbit-card.css";

/**
 * Orbit Card
 * A compact profile card. On hover, seven dots in the person's colour start
 * travelling around the card's rounded border (CSS offset-path) and the border
 * warms toward that colour. Ships with an endless, draggable marquee.
 */

export type OrbitPerson = {
  id: string;
  name: string;
  role: string;
  /** Unique orbit colour for this person. */
  color: string;
  href?: string;
};

const DOTS = [
  { duration: 4.2, delay: 0, size: 5 },
  { duration: 3.55, delay: -0.9, size: 4 },
  { duration: 4.85, delay: -1.8, size: 6 },
  { duration: 3.9, delay: -2.6, size: 4.5 },
  { duration: 5.1, delay: -3.4, size: 5.5 },
  { duration: 3.7, delay: -1.35, size: 4 },
  { duration: 4.45, delay: -2.15, size: 5 },
] as const;

export function OrbitCard({ person, decorative, trailing }: { person: OrbitPerson; decorative?: boolean; trailing?: ReactNode }) {
  return (
    <article
      tabIndex={decorative ? undefined : 0}
      aria-hidden={decorative || undefined}
      className="orbit-card group relative flex font-[family-name:Geist,ui-sans-serif,system-ui,sans-serif] h-[6.5rem] w-[18rem] shrink-0 flex-col justify-center rounded-[10px] border border-[#33312e] bg-[#121110] px-5 py-4 outline-none"
      style={{ "--orbit-color": person.color } as CSSProperties}
    >
      {DOTS.map((dot, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="orbit-card__dot"
          style={{ width: dot.size, height: dot.size, animationDuration: `${dot.duration}s`, animationDelay: `${dot.delay}s` }}
        />
      ))}
      <p className="flex items-center gap-1.5 text-[0.9875rem] font-medium tracking-[-0.015em] text-[#f4f3f1]">
        <span className="min-w-0 truncate">{person.name}</span>
        {trailing}
      </p>
      <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-snug text-[#c2c0b8]">{person.role}</p>
    </article>
  );
}

/* ——— Marquee ——— */

const SPEED_DESKTOP = 30; // px / s
const SPEED_MOBILE = 22;
const STEP_MS = 480;
const SWIPE_ARM_PX = 10;

const wrapModulo = (value: number, loop: number) => (loop < 8 ? 0 : ((value % loop) + loop) % loop);
const easeStep = (t: number) => 1 - (1 - t) ** 3;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function PersonSet({ people, hidden }: { people: OrbitPerson[]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5" aria-hidden={hidden || undefined}>
      {people.map((p, i) => (
        <li key={`${hidden ? "dup" : "live"}-${p.id}-${i}`}>
          <OrbitCard person={p} decorative={hidden} />
        </li>
      ))}
    </ul>
  );
}

function Pager({ label, onClick, dir }: { label: string; onClick: () => void; dir: -1 | 1 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute bottom-0 z-[4] inline-flex size-11 items-center justify-center rounded-md border border-[#33312e] bg-[#121110]/90 text-[#f4f3f1] backdrop-blur-sm transition-colors duration-200 hover:border-[#45423d] hover:bg-[#181716] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 ${
        dir === -1 ? "left-[calc(50%-3rem)] sm:left-3" : "right-[calc(50%-3rem)] sm:right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === -1 ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

export function OrbitMarquee({ people, label = "People" }: { people: OrbitPerson[]; label?: string }) {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const loopWidth = useRef(0);
  const stride = useRef(304);
  const speed = useRef(SPEED_DESKTOP);
  const hoverPause = useRef(false);
  const visible = useRef(true);
  const lastTs = useRef(0);
  const stepAnim = useRef<{ from: number; to: number; start: number } | null>(null);
  const pointer = useRef<{ id: number; x: number; dragging: boolean } | null>(null);
  const skipClick = useRef(false);
  const [repeats, setRepeats] = useState(1);

  const apply = useCallback(() => {
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
  }, []);

  const step = useCallback(
    (direction: -1 | 1) => {
      const loop = loopWidth.current;
      if (loop < 8 || stride.current < 8) return;
      let from = wrapModulo(offset.current, loop);
      let to = from + direction * stride.current;
      if (to < 0) {
        from += loop;
        to += loop;
      }
      offset.current = from;
      apply();
      stepAnim.current = { from, to, start: performance.now() };
    },
    [apply],
  );

  useLayoutEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const firstSet = wrap?.querySelector<HTMLElement>("[data-marquee-set]");
    if (!wrap || !firstSet) return;
    const measure = () => {
      const item = firstSet.querySelector<HTMLElement>("li");
      const next = item?.nextElementSibling as HTMLElement | null;
      if (item && next) stride.current = next.getBoundingClientRect().left - item.getBoundingClientRect().left;
      const oneSet = firstSet.scrollWidth / Math.max(repeats, 1);
      const viewWidth = wrap.getBoundingClientRect().width;
      if (oneSet < 8) return;
      const copies = Math.max(1, Math.ceil(viewWidth / oneSet));
      speed.current = window.innerWidth < 640 ? SPEED_MOBILE : SPEED_DESKTOP;
      if (copies !== repeats) return setRepeats(copies);
      loopWidth.current = firstSet.scrollWidth;
      offset.current = wrapModulo(offset.current, loopWidth.current);
      apply();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(firstSet);
    return () => ro.disconnect();
  }, [apply, reduced, repeats]);

  useEffect(() => {
    if (reduced) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    if (wrapRef.current) io.observe(wrapRef.current);
    let frame = 0;
    const tick = (now: number) => {
      const anim = stepAnim.current;
      if (anim) {
        const t = Math.min(1, (now - anim.start) / STEP_MS);
        offset.current = anim.from + (anim.to - anim.from) * easeStep(t);
        apply();
        if (t >= 1) {
          offset.current = wrapModulo(anim.to, loopWidth.current);
          apply();
          stepAnim.current = null;
          lastTs.current = now;
        }
      } else if (!hoverPause.current && visible.current) {
        if (lastTs.current) {
          const dt = Math.min(32, now - lastTs.current) / 1000;
          offset.current = wrapModulo(offset.current + speed.current * dt, loopWidth.current);
          apply();
        }
        lastTs.current = now;
      } else {
        lastTs.current = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [apply, reduced]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("a, button")) return;
    pointer.current = { id: e.pointerId, x: e.clientX, dragging: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    if (!p.dragging && Math.abs(e.clientX - p.x) > SWIPE_ARM_PX) {
      p.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    pointer.current = null;
    if (!p || p.id !== e.pointerId || !p.dragging) return;
    skipClick.current = true;
    const dx = e.clientX - p.x;
    const threshold = stride.current * 0.45;
    if (dx <= -threshold) step(1);
    else if (dx >= threshold) step(-1);
  };

  if (reduced) {
    return (
      <ul aria-label={label} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((p) => (
          <li key={p.id}>
            <OrbitCard person={p} />
          </li>
        ))}
      </ul>
    );
  }

  const extra = Math.max(repeats - 1, 0);
  return (
    <div
      role="region"
      aria-label={label}
      className="relative pb-16 sm:pb-0"
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        step(e.key === "ArrowLeft" ? -1 : 1);
      }}
    >
      <Pager label="Previous" dir={-1} onClick={() => step(-1)} />
      <div
        ref={wrapRef}
        className="overflow-hidden py-1 [touch-action:pan-y]"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointer.current = null)}
        onClickCapture={(e) => {
          if (!skipClick.current) return;
          e.preventDefault();
          e.stopPropagation();
          skipClick.current = false;
        }}
        onMouseOver={(e) => {
          if ((e.target as HTMLElement).closest(".orbit-card")) hoverPause.current = true;
        }}
        onMouseOut={(e) => {
          const next = e.relatedTarget as HTMLElement | null;
          if (!next || !e.currentTarget.contains(next) || !next.closest(".orbit-card")) hoverPause.current = false;
        }}
        onFocus={() => (hoverPause.current = true)}
        onBlur={() => (hoverPause.current = false)}
      >
        <div ref={trackRef} className="flex w-max items-center will-change-transform">
          <div data-marquee-set="" className="flex items-center">
            <PersonSet people={people} />
            {Array.from({ length: extra }, (_, i) => (
              <PersonSet key={`pad-${i}`} people={people} hidden />
            ))}
          </div>
          <div className="flex items-center" aria-hidden="true">
            {Array.from({ length: repeats }, (_, i) => (
              <PersonSet key={`loop-${i}`} people={people} hidden />
            ))}
          </div>
        </div>
      </div>
      <Pager label="Next" dir={1} onClick={() => step(1)} />
    </div>
  );
}
