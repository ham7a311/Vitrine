"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import "./paper-plane.css";

/**
 * Paper Plane
 * A send button whose plane actually leaves: it tips back, launches up and away trailing a
 * dashed line, the label rolls to "Sent", and a moment later a fresh plane glides in from the
 * other side, ready for the next one.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & { label?: string; sentLabel?: string; onSend?: () => void };

export function PaperPlane({ label = "Send", sentLabel = "Sent", onSend, className = "", ...rest }: Props) {
  const [state, setState] = useState<"idle" | "flying" | "sent">("idle");
  const t = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => t.current.forEach(clearTimeout), []);
  const send = () => {
    if (state !== "idle") return;
    onSend?.();
    setState("flying");
    t.current.push(setTimeout(() => setState("sent"), 650), setTimeout(() => setState("idle"), 2400));
  };
  return (
    <button type="button" className={`pp ${className}`} data-state={state} onClick={send} aria-disabled={state !== "idle"} {...rest}>
      <span className="pp__plane" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path className="pp__trail" d="M-40 38 C-20 30 -6 22 4 14" />
          <path d="M21.5 2.5 2.8 10.2c-.8.3-.8 1.4 0 1.7l6.4 2.5 2.5 6.4c.3.8 1.4.8 1.7 0Z" />
          <path d="m21.5 2.5-12.3 12" />
        </svg>
      </span>
      <span className="pp__label">
        <span className="pp__reel">
          <span>{label}</span>
          <span>{sentLabel}</span>
        </span>
      </span>
      <span className="pp__sr" role="status">
        {state === "sent" ? sentLabel : ""}
      </span>
    </button>
  );
}
