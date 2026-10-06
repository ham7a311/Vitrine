"use client";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { badge } from "./ping";
import "./ping-button.css";

export type PingButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  /** Unread count; the badge is hidden at zero. */
  count?: number;
  icon?: ReactNode;
  theme?: "light" | "dark";
};

/**
 * Ping Button
 * A button with a count badge on its corner. When the number goes up the
 * badge bumps and a copy of it pings outward three times, then rests.
 */
export function PingButton({ label, count = 0, icon, theme = "light", className = "", ...rest }: PingButtonProps) {
  const [ping, setPing] = useState(0);
  const prev = useRef(count);
  useEffect(() => {
    if (count > prev.current) setPing((n) => n + 1);
    prev.current = count;
  }, [count]);
  return (
    <button type="button" className={`pngb ${theme === "dark" ? "pngb--dark" : ""} ${className}`} {...rest}>
      {icon}
      <span>{label}</span>
      {count > 0 && (
        <span className="pngb__badge" key={ping}>
          {badge(count)}<span className="pngb__sr"> unread</span>
        </span>
      )}
    </button>
  );
}
