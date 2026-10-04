"use client";

import { useEffect, useRef, useState } from "react";
import "./bell-ring.css";

/**
 * Bell Ring
 * A notification bell that rings like a real one: it swings from its hook and dies down, the
 * clapper swinging the other way a beat behind, while the count badge pops up a number.
 * Opening it clears the badge.
 */

type Props = { count: number; onOpen?: () => void; label?: string; className?: string };

export function BellRing({ count, onOpen, label = "Notifications", className = "" }: Props) {
  const [beat, setBeat] = useState(0);
  const prev = useRef(count);
  useEffect(() => {
    if (count > prev.current) setBeat((b) => b + 1);
    prev.current = count;
  }, [count]);
  return (
    <button type="button" className={`br ${className}`} aria-label={count ? `${label}, ${count} unread` : label} data-ring={beat ? (beat % 2 ? "a" : "b") : undefined} onClick={onOpen}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <g className="br__bell">
          <path d="M6.2 16.5V11a5.8 5.8 0 0 1 11.6 0v5.5l1.6 2H4.6Z" />
          <path d="M12 3.2v1.9" />
          <g className="br__clapper">
            <path d="M9.9 19.3a2.2 2.2 0 0 0 4.2 0" />
          </g>
        </g>
      </svg>
      <span className="br__badge" data-show={count ? "" : undefined} key={count} aria-hidden="true">
        {count > 9 ? "9+" : count}
      </span>
    </button>
  );
}
