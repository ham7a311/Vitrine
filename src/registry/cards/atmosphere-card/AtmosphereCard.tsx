"use client";

import type { PointerEvent, ReactNode } from "react";
import "./atmosphere-card.css";

/**
 * Atmosphere Card
 * Smoked-glass link cards. Colour lives in the corners, contour currents drift
 * slowly underneath, and the whole field leans toward the pointer while a soft
 * spotlight follows it. Copy sits in a deliberately quieter pool of shade.
 */

export type Atmosphere = "violet" | "cyan" | "teal";

export type AtmosphereItem = {
  label: string;
  description: string;
  href: string;
  icon: ReactNode;
  atmosphere: Atmosphere;
};

const WAVES: Record<Atmosphere, string[]> = {
  violet: [
    "M-60 168 C 20 12, 110 236, 198 64 S 318 228, 428 48 C 488 8, 540 120, 580 86",
    "M-48 42 C 70 188, 168 -28, 268 132 S 412 8, 540 154",
    "M-36 214 C 88 96, 176 248, 274 78 S 404 236, 560 118",
    "M 40 -20 C 120 80, 90 160, 210 190 S 360 40, 480 210",
  ],
  cyan: [
    "M-70 36 C 40 58, 150 22, 250 48 S 430 18, 560 52",
    "M-70 88 C 55 118, 165 72, 270 102 S 445 70, 570 108",
    "M-70 142 C 48 168, 160 128, 268 154 S 438 126, 565 160",
    "M-70 196 C 62 214, 172 178, 282 204 S 458 176, 575 212",
  ],
  teal: [
    "M-50 190 C 90 10, 210 230, 360 46 S 520 200, 610 90",
    "M 560 206 C 390 -10, 210 240, -40 72",
    "M-40 118 C 130 176, 250 28, 520 148",
    "M 80 240 C 160 40, 300 220, 470 -10",
  ],
};

function setPoint(e: PointerEvent<HTMLAnchorElement>) {
  const node = e.currentTarget;
  const r = node.getBoundingClientRect();
  node.style.setProperty("--atm-nx", ((e.clientX - r.left) / r.width).toFixed(3));
  node.style.setProperty("--atm-ny", ((e.clientY - r.top) / r.height).toFixed(3));
}

function clearPoint(e: PointerEvent<HTMLAnchorElement>) {
  e.currentTarget.style.removeProperty("--atm-nx");
  e.currentTarget.style.removeProperty("--atm-ny");
}

export function AtmosphereCard({ item }: { item: AtmosphereItem }) {
  return (
    <a
      href={item.href}
      className={`atm-card atm-card--${item.atmosphere} group relative isolate flex h-full gap-4 overflow-hidden p-5 sm:p-6`}
      onPointerMove={setPoint}
      onPointerLeave={clearPoint}
    >
      <span className="atm-atmosphere" aria-hidden="true" />
      <span className="atm-bloom" aria-hidden="true" />
      <span className="atm-field" aria-hidden="true">
        <svg className="atm-waves" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
          {WAVES[item.atmosphere].map((d, i) => (
            <path key={d} className={`atm-wave atm-wave--${i + 1}`} d={d} />
          ))}
        </svg>
      </span>
      <span className="atm-quiet" aria-hidden="true" />
      <span className="atm-presence" aria-hidden="true" />

      <span aria-hidden="true" className="atm-icon relative z-10 grid size-10 shrink-0 place-items-center rounded-md border border-[#33312e] text-[#c2c0b8]">
        {item.icon}
      </span>
      <span className="relative z-10">
        <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-[#f4f3f1]">
          {item.label}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-3.5 text-[#a8a59c] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </span>
        <span className="mt-1.5 block max-w-[32ch] text-sm leading-relaxed text-[#a8a59c]">{item.description}</span>
      </span>
    </a>
  );
}

/** The hairline-gap grid the cards were designed for. */
export function AtmosphereGrid({ items }: { items: AtmosphereItem[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[10px] border border-[#262422] bg-[#262422] sm:grid-cols-3">
      {items.map((item) => (
        <li key={item.label} className="min-w-0">
          <AtmosphereCard item={item} />
        </li>
      ))}
    </ul>
  );
}
