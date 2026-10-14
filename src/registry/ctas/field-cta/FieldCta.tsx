"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FIELDS, type CtaField } from "./fields";
import { centreIn } from "./focus";
import { hex, runShader } from "./gl";
import "./field-cta.css";

export type CtaLink = { label: string; href: string };

export type FieldCtaProps = {
  field?: CtaField;
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  primary: CtaLink;
  secondary?: CtaLink;
  /** Centred banner, or text on the left with the buttons on the right. */
  layout?: "center" | "split";
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  motion?: "full" | "reduced";
  className?: string;
};

const uniformsFor = (p: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

/**
 * Field CTA
 * A closing banner set on one of the living backgrounds — and the background listens to the
 * button: point at the main action and the light gathers under it, the strands bow round it,
 * the plumes part or the pigment swells beneath it.
 */
export function FieldCta({ field = "horizon", eyebrow, title, lede, primary, secondary, layout = "center", onNavigate, motion = "full", className = "" }: FieldCtaProps) {
  const id = useId();
  const host = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const main = useRef<HTMLAnchorElement>(null);
  const focus = useRef<{ x: number; y: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const f = FIELDS[field];
    return runShader(el, cv, {
      frag: f.frag, uniforms: uniformsFor(f.palette), quality: f.quality, start: f.start, follow: 0.05,
      reduced: motion === "reduced", focus: () => focus.current, onFail: () => setFailed(true),
    });
  }, [field, motion]);

  const aim = () => { const a = main.current, h = host.current; if (a && h) focus.current = centreIn(a.getBoundingClientRect(), h.getBoundingClientRect()); };
  const release = () => { focus.current = null; };
  const go = (l: CtaLink) => (e: React.MouseEvent) => onNavigate?.(l.href, e);

  return (
    <section ref={host} className={`fcta fcta--${field} fcta--${layout} ${className}`} data-fallback={failed ? "" : undefined} aria-labelledby={`${id}-t`}>
      <canvas ref={canvas} className="fcta__field" aria-hidden="true" />
      <div className="fcta__inner">
        <div className="fcta__copy">
          {eyebrow && <p className="fcta__eyebrow">{eyebrow}</p>}
          <h2 id={`${id}-t`} className="fcta__title">{title}</h2>
          {lede && <p className="fcta__lede">{lede}</p>}
        </div>
        <div className="fcta__actions">
          <a ref={main} className="fcta__primary" href={primary.href} onClick={go(primary)}
            onPointerEnter={aim} onPointerLeave={release} onFocus={aim} onBlur={release}>
            {primary.label}
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          {secondary && <a className="fcta__secondary" href={secondary.href} onClick={go(secondary)}>{secondary.label}</a>}
        </div>
      </div>
    </section>
  );
}

export default FieldCta;
