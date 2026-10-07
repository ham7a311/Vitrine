"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { blobBox, drift, mist, type Side } from "./mist";
import "./call-pill.css";

/**
 * Call Pill
 * A big, bright booking button: an ice-white glass pill with cool blue mist gathered at one end,
 * a white rim and a soft shadow on a navy page. It leads with a mark: a status dot that breathes
 * to say you're available, or a phone that rings when you hover. On hover the mist drifts across.
 */

type Mark = "dot" | "phone";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  mark?: Mark;
  /** Where the blue mist sits at rest. */
  side?: Side;
  /** Font size in px; everything else scales from it. */
  size?: number;
};

function Phone() {
  return (
    <svg className="clpl__phone" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.6 3.5h-.9c-1 0-1.9.8-2 1.8-.4 4 1.3 7.9 4.2 10.8s6.8 4.6 10.8 4.2c1-.1 1.8-1 1.8-2v-.9c0-.9-.6-1.6-1.4-1.9l-2.4-.8c-.7-.2-1.5 0-2 .5l-.9.9a12.6 12.6 0 0 1-5.4-5.4l.9-.9c.5-.5.7-1.3.5-2l-.8-2.4c-.3-.8-1-1.4-1.9-1.4Z" />
      <path className="clpl__ring" d="M14.5 3.6a6.3 6.3 0 0 1 5.9 5.9M14.2 7a3 3 0 0 1 2.8 2.8" />
    </svg>
  );
}

export function CallPill({ children = "Schedule a Call", mark = "dot", side, size = 22, className = "", style, ...rest }: Props) {
  const at: Side = side ?? (mark === "dot" ? "left" : "right");
  return (
    <button
      type="button"
      className={`clpl ${className}`}
      data-mark={mark}
      style={{ ["--clpl-drift" as string]: `${drift(at)}%`, fontSize: size, ...style }}
      {...rest}
    >
      <span className="clpl__paint" aria-hidden="true">
        <span className="clpl__mist">
          {mist(at).map((b, i) => (
            <span key={i} className="clpl__blob" style={{ ...blobBox(b), background: `radial-gradient(closest-side, ${b.c}, ${b.c} 35%, transparent)`, opacity: b.o ?? 1 }} />
          ))}
        </span>
      </span>
      <span className="clpl__label">
        {mark === "dot" ? <span className="clpl__dot" aria-hidden="true" /> : <Phone />}
        {children}
      </span>
    </button>
  );
}
