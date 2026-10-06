"use client";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { badge, compact } from "./pulse";
import "./pulse-button.css";

export type PulseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** live: an on-air button with a beating dot; ping: a button with a badge that pings when it changes; breathe: a call to action with a slow glow. */
  kind?: "live" | "ping" | "breathe";
  label: string;
  /** live: people watching. ping: unread count. */
  count?: number;
  icon?: ReactNode;
  /** live: whether you've joined (shows the playing state). */
  active?: boolean;
  theme?: "light" | "dark";
};

/**
 * Pulse Button
 * Buttons that are allowed to move because something is happening: an
 * on-air dot that beats, a badge that pings when it changes, a call to
 * action that breathes.
 */
export function PulseButton({ kind = "live", label, count, icon, active = false, theme = "light", className = "", ...rest }: PulseButtonProps) {
  // The badge pings a few times when its number goes up, then rests.
  const [ping, setPing] = useState(0);
  const prev = useRef(count ?? 0);
  useEffect(() => {
    if (kind !== "ping" || count == null) return;
    if (count > prev.current) setPing((n) => n + 1);
    prev.current = count;
  }, [count, kind]);

  return (
    <button type="button" className={`pulb pulb--${kind} ${theme === "dark" ? "pulb--dark" : ""} ${className}`} data-active={active || undefined} {...rest}>
      {kind === "live" && (
        <>
          <span className="pulb__onair">
            <span className="pulb__dot" aria-hidden="true"><i /><i /></span>
            Live
          </span>
          <span className="pulb__label">
            {active ? <span className="pulb__eq" aria-hidden="true"><i /><i /><i /></span> : icon}
            {label}
          </span>
          {count != null && <span className="pulb__count">{compact(count)}<span className="pulb__sr"> watching</span></span>}
        </>
      )}
      {kind === "ping" && (
        <>
          {icon}
          <span>{label}</span>
          {count != null && count > 0 && (
            <span className="pulb__badge" key={ping}>
              {badge(count)}<span className="pulb__sr"> unread</span>
            </span>
          )}
        </>
      )}
      {kind === "breathe" && (
        <>
          <span className="pulb__halo" aria-hidden="true" />
          <span className="pulb__label">{label}{icon}</span>
        </>
      )}
    </button>
  );
}
