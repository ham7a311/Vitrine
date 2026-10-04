"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import "./follow-toggle.css";

/**
 * Follow Toggle
 * Three labels share one pill — Follow / Following / Unfollow — and the pill's
 * width eases to whichever is showing, measured from hidden copies. Following
 * is quiet (outlined, a check); hovering it previews the consequence (rose
 * Unfollow) before you commit. The switch bursts a faint ring outward.
 */

type Props = { initial?: boolean; name?: string; onChange?: (following: boolean) => void; className?: string };

export function FollowToggle({ initial = false, name, onChange, className = "" }: Props) {
  const [on, setOn] = useState(initial);
  const [hover, setHover] = useState(false);
  const [burst, setBurst] = useState(0);
  const [w, setW] = useState<Record<string, number>>({});
  const m = useRef<Record<string, HTMLSpanElement | null>>({});

  useLayoutEffect(() => {
    const read = () => setW(Object.fromEntries(Object.entries(m.current).map(([k, el]) => [k, el?.offsetWidth ?? 0])));
    read();
    document.fonts?.ready.then(read);
  }, []);

  const view = !on ? "follow" : hover ? "unfollow" : "following";
  const toggle = () => {
    const next = !on;
    setOn(next);
    setHover(false);
    if (next) setBurst((b) => b + 1);
    onChange?.(next);
  };

  const label = (k: string) =>
    k === "follow" ? (<><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" /></svg>Follow</>)
    : k === "following" ? (<><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>Following</>)
    : (<>Unfollow</>);

  return (
    <button
      type="button"
      className={`follow-toggle ${className}`}
      data-view={view}
      aria-pressed={on}
      aria-label={on ? `Following${name ? ` ${name}` : ""}. Press to unfollow.` : `Follow${name ? ` ${name}` : ""}`}
      style={{ "--ft-w": w[view] ? `${w[view]}px` : "auto" } as CSSProperties}
      onClick={toggle}
      onMouseEnter={() => on && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="follow-toggle__stage" aria-hidden="true">
        {(["follow", "following", "unfollow"] as const).map((k) => (
          <span key={k} className="follow-toggle__label" data-on={view === k || undefined}>{label(k)}</span>
        ))}
      </span>
      {burst > 0 && <span key={burst} className="follow-toggle__burst" aria-hidden="true" />}
      <span className="follow-toggle__measure" aria-hidden="true">
        {(["follow", "following", "unfollow"] as const).map((k) => (
          <span key={k} ref={(el) => void (m.current[k] = el)} className="follow-toggle__label">{label(k)}</span>
        ))}
      </span>
    </button>
  );
}
