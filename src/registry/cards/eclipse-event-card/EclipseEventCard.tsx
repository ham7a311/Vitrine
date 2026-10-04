"use client";

import { useId, type PointerEvent, type ReactNode } from "react";
import "./eclipse-event-card.css";

/**
 * Eclipse Event Card
 * An editorial event plate: an oversized date and headline on the left, and an
 * orbital-eclipse artwork bleeding in from the right. The artwork drifts on
 * slow loops, a signal travels its hot orbit, and everything leans toward the
 * pointer and brightens on hover.
 */

export type EclipseEvent = {
  category: string;
  status: string;
  day: string;
  month: string;
  year: string;
  weekday: string;
  title: string;
  description: string;
  partner?: string;
  cta?: { label: string; href: string };
  meta: { label: string; value: ReactNode }[];
};

function setPoint(e: PointerEvent<HTMLElement>) {
  const node = e.currentTarget;
  const r = node.getBoundingClientRect();
  node.style.setProperty("--eclipse-nx", ((e.clientX - r.left) / r.width).toFixed(3));
  node.style.setProperty("--eclipse-ny", ((e.clientY - r.top) / r.height).toFixed(3));
}
function clearPoint(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.removeProperty("--eclipse-nx");
  e.currentTarget.style.removeProperty("--eclipse-ny");
}

function EclipseArtwork() {
  const uid = useId().replace(/:/g, "");
  const id = (k: string) => `eclipse-${k}-${uid}`;
  return (
    <div className="eclipse" aria-hidden="true">
      <div className="eclipse-atmosphere" />
      <div className="eclipse-bloom" />
      <svg className="eclipse-field" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <radialGradient id={id("wrap")} cx="72%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#e8a24a" stopOpacity="0.5" />
            <stop offset="22%" stopColor="#c4783a" stopOpacity="0.22" />
            <stop offset="48%" stopColor="#8a6e7c" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0c0b0a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id("limb")} cx="32%" cy="58%" r="68%">
            <stop offset="0%" stopColor="#0b0a09" stopOpacity="0" />
            <stop offset="58%" stopColor="#0b0a09" stopOpacity="0.2" />
            <stop offset="78%" stopColor="#e8a24a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0b0a09" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id("veil")} cx="46%" cy="48%" r="54%">
            <stop offset="0%" stopColor="#080706" stopOpacity="1" />
            <stop offset="70%" stopColor="#080706" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#080706" stopOpacity="0" />
          </radialGradient>
          <filter id={id("glow")} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.8" />
          </filter>
          <filter id={id("grain")} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.035" />
            </feComponentTransfer>
          </filter>
        </defs>

        <ellipse className="eclipse-wrap" cx="352" cy="204" rx="268" ry="228" transform="rotate(-11 352 204)" fill={`url(#${id("wrap")})`} />
        <g className="eclipse-grain" filter={`url(#${id("grain")})`}>
          <rect x="180" y="0" width="460" height="400" fill="#e8a24a" />
        </g>

        <g className="eclipse-drift eclipse-drift--a">
          <ellipse className="eclipse-ring" cx="354" cy="202" rx="132" ry="118" transform="rotate(-9 354 202)" pathLength={100} strokeDasharray="94 6" />
          <ellipse className="eclipse-ring eclipse-ring--soft" cx="346" cy="210" rx="162" ry="136" transform="rotate(-17 346 210)" pathLength={100} strokeDasharray="36 16 20 28" />
        </g>

        <g>
          <ellipse className="eclipse-arc eclipse-arc--dim" cx="338" cy="192" rx="196" ry="160" transform="rotate(8 338 192)" pathLength={100} strokeDasharray="34 66" strokeDashoffset="12" />
          <ellipse className="eclipse-arc eclipse-arc--copper" cx="366" cy="218" rx="222" ry="172" transform="rotate(-21 366 218)" pathLength={100} strokeDasharray="18 12 9 61" strokeDashoffset="-8" />
          <path className="eclipse-arc eclipse-arc--organic eclipse-arc--extra" d="M 168 98 C 248 34 398 52 458 134 C 502 192 492 274 412 324" />
        </g>

        <ellipse cx="352" cy="204" rx="128" ry="114" transform="rotate(-11 352 204)" fill={`url(#${id("veil")})`} opacity="0.9" />
        <ellipse className="eclipse-core" cx="352" cy="204" rx="104" ry="92" transform="rotate(-11 352 204)" />
        <ellipse className="eclipse-limb" cx="352" cy="204" rx="106" ry="94" transform="rotate(-11 352 204)" fill={`url(#${id("limb")})`} />

        <g className="eclipse-drift eclipse-drift--b">
          <ellipse className="eclipse-arc eclipse-arc--hot" cx="358" cy="198" rx="178" ry="148" transform="rotate(-14 358 198)" pathLength={100} strokeDasharray="24 10 16 50" strokeDashoffset="4" />
          <ellipse className="eclipse-arc eclipse-arc--outer eclipse-arc--extra" cx="372" cy="212" rx="248" ry="198" transform="rotate(13 372 212)" pathLength={100} strokeDasharray="22 16 11 51" strokeDashoffset="28" />
          <ellipse className="eclipse-arc eclipse-arc--spectral eclipse-arc--extra" cx="330" cy="186" rx="278" ry="214" transform="rotate(-6 330 186)" pathLength={100} strokeDasharray="14 86" strokeDashoffset="-22" />
        </g>

        <g>
          <ellipse className="eclipse-signal eclipse-signal--bloom" cx="358" cy="198" rx="178" ry="148" transform="rotate(-14 358 198)" pathLength={100} filter={`url(#${id("glow")})`} />
          <ellipse className="eclipse-signal" cx="358" cy="198" rx="178" ry="148" transform="rotate(-14 358 198)" pathLength={100} />
        </g>
      </svg>
      <div className="eclipse-quiet" />
    </div>
  );
}

function Badge({ children, dot }: { children: ReactNode; dot?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a24a]/30 bg-[#e8a24a]/[0.08] px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-[#f6c98a]">
      {dot && <span className="size-1.5 rounded-full bg-[#f3b45f]" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function EclipseEventCard({ event }: { event: EclipseEvent }) {
  const cols = event.meta.length <= 2 ? "grid-cols-2" : event.meta.length === 3 ? "grid-cols-2 @xl:grid-cols-3" : "grid-cols-2 @4xl:grid-cols-4";

  return (
    <div className="@container">
      <article className="eclipse-card relative isolate overflow-hidden rounded-[10px] border border-[#33312e] bg-[#121110] font-[family-name:Geist,ui-sans-serif,system-ui,sans-serif] text-[#f4f3f1]" onPointerMove={setPoint} onPointerLeave={clearPoint}>
        <EclipseArtwork />
        <div className="eclipse-card__scrim" aria-hidden="true" />

        <div className="relative z-[2] flex flex-wrap items-center justify-between gap-3 border-b border-[#262422] px-6 py-4 @xl:px-8">
          <Badge>{event.category}</Badge>
          <Badge dot>{event.status}</Badge>
        </div>

        <div className="eclipse-card__content">
          <div className="grid gap-10 px-6 py-10 @xl:px-8 @xl:py-12 @4xl:grid-cols-12 @4xl:gap-14 @4xl:py-14">
            <div className="@4xl:col-span-3">
              <p className="flex items-baseline gap-3 @4xl:flex-col @4xl:items-start @4xl:gap-1">
                <span className="text-[3.5rem] font-medium leading-[0.85] tracking-[-0.04em] tabular-nums @4xl:text-[4.5rem]">{event.day}</span>
                <span className="font-mono text-sm tracking-[0.14em] text-[#f6c98a]">
                  {event.month} {event.year}
                </span>
              </p>
              <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-[#c2c0b8] @4xl:mt-4">{event.weekday}</p>
            </div>

            <div className="@4xl:col-span-9">
              <h3 className="max-w-[28ch] text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.025em] @xl:text-[2.125rem]">{event.title}</h3>
              <p className="mt-5 max-w-[620px] text-[clamp(1.0625rem,1.5vw,1.1875rem)] leading-[1.65] text-[#c2c0b8]">{event.description}</p>
              {event.partner && (
                <p className="mt-5 max-w-[620px] text-sm text-[#c2c0b8]">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-[#a8a59c]">In collaboration with</span>
                  <span className="mt-1 block text-[0.9375rem] text-[#f4f3f1]">{event.partner}</span>
                </p>
              )}
              {event.cta && (
                <a
                  href={event.cta.href}
                  className="group/cta mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-[#e8a24a] px-5 text-[0.9375rem] font-medium tracking-[-0.01em] text-[#14120f] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22)] transition-[background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[#f3b45f] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_10px_24px_-16px_rgba(232,162,74,0.55)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#f3b45f] active:translate-y-px"
                >
                  {event.cta.label}
                  <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-200 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <dl className={`relative z-10 grid gap-px border-t border-[#262422] bg-[#262422] ${cols}`}>
          {event.meta.map((m) => (
            <div key={m.label} className="bg-[#121110] px-6 py-5 @xl:px-8">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-[#c2c0b8]">{m.label}</dt>
              <dd className="mt-2 text-[0.9375rem]">{m.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  );
}
