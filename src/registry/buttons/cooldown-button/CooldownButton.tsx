"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import "./cooldown-button.css";

/**
 * Cooldown Button
 * "Resend code" with the wait drawn on its border. The outline is a timer
 * that drains clockwise from the top; while it runs the button says how
 * long is left and won't act. When it runs out the outline closes, glows
 * once and the button is ready. Pressing it starts the wait again.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> & {
  /** Seconds to wait between sends. */
  seconds?: number;
  label?: string;
  onResend?: () => void;
  /** Announced after a resend, e.g. "New code sent to +968 9••• 4412". */
  sentMessage?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

const IN = 1.5;

/** Pill outline starting at the top centre, clockwise. */
function outline(w: number, h: number) {
  const r = h / 2 - IN, x0 = IN + r, x1 = w - IN - r, cx = w / 2;
  return `M ${cx} ${IN} H ${x1} A ${r} ${r} 0 0 1 ${x1} ${h - IN} H ${x0} A ${r} ${r} 0 0 1 ${x0} ${IN} Z`;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function CooldownButton({ seconds = 30, label = "Resend code", onResend, sentMessage = "New code sent", theme = "night", motion = "full", className = "", ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const arc = useRef<SVGPathElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [left, setLeft] = useState(seconds);
  const [round, setRound] = useState(0);
  const [note, setNote] = useState("");
  const ready = left <= 0;

  useLayoutEffect(() => {
    const el = btn.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The timer: the arc drains smoothly every frame; the label ticks once a second.
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = (now - t0) / 1000;
      const rem = Math.max(0, 1 - elapsed / seconds);
      arc.current?.setAttribute("stroke-dasharray", `${rem} 1`);
      arc.current?.setAttribute("stroke-dashoffset", String(-(1 - rem)));
      const s = Math.ceil(seconds - elapsed);
      setLeft((v) => (v === s ? v : Math.max(0, s)));
      if (rem > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seconds, round]);

  const resend = useCallback(() => {
    if (!ready) return;
    onResend?.();
    setNote(sentMessage);
    setLeft(seconds);
    setRound((r) => r + 1);
  }, [ready, onResend, sentMessage, seconds]);

  const d = box.w ? outline(box.w, box.h) : "";
  return (
    <>
      <button
        ref={btn}
        type="button"
        className={`cdb cdb--${theme} ${className}`}
        data-ready={ready || undefined}
        data-motion={motion}
        aria-disabled={!ready}
        aria-label={ready ? label : `${label}, available in ${left} seconds`}
        onClick={resend}
        {...rest}
      >
        {d && (
          <svg className="cdb__ring" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
            <path className="cdb__track" d={d} />
            <path ref={arc} className="cdb__arc" d={d} pathLength={1} strokeDasharray="1 1" />
            {ready && <path key={round} className="cdb__flash" d={d} />}
          </svg>
        )}
        <span className="cdb__label" aria-hidden="true">
          {ready ? label : <>{label} in <span className="cdb__time">{clock(left)}</span></>}
        </span>
      </button>
      <span className="cdb__sr" aria-live="polite">{ready ? `You can resend the code now.` : note}</span>
    </>
  );
}
