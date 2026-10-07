"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { leakCentre } from "./leak";
import "./light-leak-card.css";

/**
 * Light Leak Card
 * A dark glass card with light pouring in through its top edge: a white-hot, smoky burst right
 * under the edge that spills coloured light down the top half. A glowing mark floats in the
 * light; the name sits on a frosted chip, with a short line and an outline button underneath.
 * The leak drifts on its own and leans toward the pointer.
 */

export type LeakTone = { light: string; deep: string; rim: string; page: string };

type Props = {
  name?: string;
  children?: ReactNode;
  action?: string;
  href?: string;
  mark?: ReactNode;
  tone?: LeakTone;
  className?: string;
  style?: CSSProperties;
};

const INDIGO: LeakTone = { light: "#3b4dff", deep: "#0d0f2c", rim: "#9aa6ff", page: "#09092a" };

/** An original mark: a ring with a small moon riding its edge and a spark at its heart. */
function OrbitMark() {
  return (
    <svg className="lklc__mark" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeWidth="9" strokeDasharray="128 42" strokeDashoffset="-18" strokeLinecap="round" />
      <circle cx="78" cy="27" r="7.5" fill="currentColor" />
      <path d="M50 37c1.4 7.6 5.4 11.6 13 13-7.6 1.4-11.6 5.4-13 13-1.4-7.6-5.4-11.6-13-13 7.6-1.4 11.6-5.4 13-13Z" fill="currentColor" />
    </svg>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg className={`lklc__spark ${className}`} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 0c.9 5.3 3.7 8.1 10 10-6.3 1.9-9.1 4.7-10 10-.9-5.3-3.7-8.1-10-10 6.3-1.9 9.1-4.7 10-10Z" />
    </svg>
  );
}

export function LightLeakCard({
  name = "Nova",
  children = "Nova 2 answers in plain words, shows where every fact came from and keeps working offline. Free on desktop.",
  action = "Explore it",
  href = "#",
  mark,
  tone = INDIGO,
  className = "",
  style,
}: Props) {
  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const c = leakCentre((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    e.currentTarget.style.setProperty("--lklc-x", `${c.x}%`);
    e.currentTarget.style.setProperty("--lklc-y", `${c.y}%`);
  };
  const leave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--lklc-x", "50%");
    e.currentTarget.style.setProperty("--lklc-y", "0%");
  };
  return (
    <article
      className={`lklc ${className}`}
      style={{ ["--lklc-light" as string]: tone.light, ["--lklc-deep" as string]: tone.deep, ["--lklc-rim" as string]: tone.rim, ...style }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <span className="lklc__leak" aria-hidden="true">
        <span className="lklc__wash" />
        <span className="lklc__burst" />
        <span className="lklc__smoke" />
      </span>
      <Sparkle className="lklc__spark--a" />
      <Sparkle className="lklc__spark--b" />
      <div className="lklc__body">
        <span className="lklc__mark-wrap">{mark ?? <OrbitMark />}</span>
        <h3 className="lklc__name">
          <span>{name}</span>
        </h3>
        <p className="lklc__text">{children}</p>
        <a className="lklc__action" href={href}>
          {action}
        </a>
      </div>
    </article>
  );
}
