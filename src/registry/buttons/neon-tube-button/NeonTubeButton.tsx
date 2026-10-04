"use client";

import { useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties } from "react";
import "./neon-tube-button.css";

/**
 * Neon Tube Button
 * The border is a bent glass tube with its two electrodes meeting at a small
 * gap underneath. At rest it's unlit glass; point at it and the gas strikes,
 * stutters twice and holds, and the label lights with it. It only flickers
 * on the way in, never while you're reading.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Gas colour. */
  color?: string;
  motion?: "full" | "reduced";
};

const INSET = 4;
const GAP = 14; // px gap under the button where the electrodes are

/** Pill outline starting just right of the bottom gap, clockwise round to just left of it. */
function tube(w: number, h: number) {
  const r = h / 2 - INSET, x0 = INSET + r, x1 = w - INSET - r, cx = w / 2, b = h - INSET, t = INSET;
  return `M ${cx + GAP / 2} ${b} H ${x1} A ${r} ${r} 0 0 0 ${x1} ${t} H ${x0} A ${r} ${r} 0 0 0 ${x0} ${b} H ${cx - GAP / 2}`;
}

export function NeonTubeButton({ color = "#ff4fa3", motion = "full", className = "", style, children, ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = btn.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const d = box.w ? tube(box.w, box.h) : "";
  const cx = box.w / 2, b = box.h - INSET;

  return (
    <button ref={btn} type="button" className={`ntb ${className}`} data-motion={motion} style={{ "--ntb-gas": color, ...style } as CSSProperties} {...rest}>
      {d && (
        <svg className="ntb__svg" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
          <path className="ntb__glass" d={d} />
          <g className="ntb__lit">
            <path className="ntb__bloom" d={d} />
            <path className="ntb__gas" d={d} />
            <path className="ntb__core" d={d} />
          </g>
          <path className="ntb__shine" d={d} />
          {/* Electrodes: two dark caps either side of the gap. */}
          <rect className="ntb__cap" x={cx + GAP / 2 - 1} y={b - 2.5} width="5" height="5" rx="1.2" />
          <rect className="ntb__cap" x={cx - GAP / 2 - 4} y={b - 2.5} width="5" height="5" rx="1.2" />
        </svg>
      )}
      <span className="ntb__label">{children}</span>
    </button>
  );
}
