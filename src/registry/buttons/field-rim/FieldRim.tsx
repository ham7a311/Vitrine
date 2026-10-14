"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { FIELDS, type Field } from "./fields";
import { hex, runShader } from "./gl";
import "./field-rim.css";

export type FieldRimProps = {
  children: ReactNode;
  /** Which background runs round the rim. */
  field?: Field;
  /** How much of the field shows: higher shows more of it, smaller. */
  zoom?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

const GLOW: Record<Field, string> = { veins: "#8a5cff", strands: "#5aa8ff", sash: "#6fe0c8", plumes: "#ff7a45" };
const uniformsFor = (p: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

/**
 * Field Rim
 * A dark pill whose rim is a window onto a living background — neon veins, strands of light, a
 * blade of light or fire plumes — running slowly round its edge. Point at it and the rim widens,
 * the field quickens and its light spills out round the button.
 */
export function FieldRim({ children, field = "strands", zoom = 1.6, onClick, type = "button", motion = "full", className = "" }: FieldRimProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const awake = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = btn.current, cv = canvas.current;
    if (!el || !cv) return;
    const f = FIELDS[field];
    let rate = 1;
    return runShader(el, cv, {
      frag: f.frag, uniforms: uniformsFor(f.palette), quality: Math.max(0.8, f.quality), start: f.start, follow: 0.08, zoom,
      reduced: motion === "reduced",
      rate: () => (rate += ((awake.current ? 2.6 : 0.7) - rate) * 0.04),
      onFail: () => setFailed(true),
    });
  }, [field, zoom, motion]);

  const wake = (v: boolean) => () => { awake.current = v; };
  return (
    <button ref={btn} type={type} className={`frim frim--${field} ${className}`} data-fallback={failed ? "" : undefined} onClick={onClick}
      onPointerEnter={wake(true)} onPointerLeave={wake(false)} onFocus={wake(true)} onBlur={wake(false)}
      style={{ ["--fr-glow" as string]: GLOW[field] } as CSSProperties}>
      <canvas ref={canvas} className="frim__field" aria-hidden="true" />
      <span className="frim__face" aria-hidden="true" />
      <span className="frim__label">{children}</span>
    </button>
  );
}

export default FieldRim;
