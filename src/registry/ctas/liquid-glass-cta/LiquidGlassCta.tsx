"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent, type ReactNode } from "react";
import "./liquid-glass-cta.css";

/**
 * Liquid Glass CTA
 * A newsletter sign-up held in a capsule of glass floating over slow colour.
 * The capsule bends the colour behind it at its rim and catches the light
 * where your pointer is. Sign up and it squashes like a drop, then settles
 * into a single line that says you're in.
 */

type Props = {
  eyebrow?: string;
  headline: ReactNode;
  sub?: ReactNode;
  action?: string;
  /** Resolve to sign up; reject to show an error. Defaults to a short wait. */
  onSubmit?: (email: string) => Promise<void>;
  done?: (email: string) => ReactNode;
  palette?: "dusk" | "lagoon";
  motion?: "full" | "reduced";
  className?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BEZEL = 16;

/** Neutral grey in the middle, ramping to full red/blue offsets across the rim. */
function lensMap(w: number, h: number) {
  const r = h / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="x" x1="0" x2="1"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient><linearGradient id="y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00f"/><stop offset="1" stop-color="#000"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="${BEZEL / 2.2}"/></filter></defs><rect width="${w}" height="${h}" fill="#000"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#x)"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#y)" style="mix-blend-mode:difference"/><rect x="${BEZEL}" y="${BEZEL}" width="${Math.max(0, w - BEZEL * 2)}" height="${Math.max(0, h - BEZEL * 2)}" rx="${Math.max(0, r - BEZEL)}" fill="#808080" filter="url(#b)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function LiquidGlassCta({ eyebrow, headline, sub, action = "Subscribe", onSubmit, done, palette = "dusk", motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const glass = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [refract, setRefract] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    const chromium = /Chrome\//.test(navigator.userAgent) && !/Edg\/|OPR\//.test(navigator.userAgent);
    setRefract(chromium && CSS.supports("backdrop-filter", "url(#x) blur(1px)"));
  }, []);

  useLayoutEffect(() => {
    const el = glass.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const move = (e: PointerEvent<HTMLFormElement>) => {
    const el = glass.current!, r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  const squish = () => {
    const el = glass.current!;
    el.classList.remove("lgcta__glass--squish");
    void el.offsetWidth;
    el.classList.add("lgcta__glass--squish");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (phase !== "idle") return;
    const v = email.trim();
    if (!v) { setError("Add your email and we'll send the first letter this Sunday."); input.current?.focus(); return; }
    if (!EMAIL.test(v)) { setError("That doesn't look like an email address. Check for a missing @ or dot."); input.current?.focus(); return; }
    setError("");
    setPhase("sending");
    try {
      await (onSubmit ? onSubmit(v) : new Promise<void>((r) => setTimeout(r, 700)));
      squish();
      setPhase("done");
    } catch {
      setPhase("idle");
      setError("We couldn't sign you up just now. Your email is still here; try again in a moment.");
    }
  };

  const lens = refract && box.w > 0;
  return (
    <section className={`lgcta lgcta--${palette} ${className}`} data-motion={motion}>
      <div className="lgcta__aurora" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="lgcta__lines" aria-hidden="true" />
      <div className="lgcta__inner">
        {eyebrow && <p className="lgcta__eyebrow">{eyebrow}</p>}
        <h2 className="lgcta__headline">{headline}</h2>
        {sub && <p className="lgcta__sub">{sub}</p>}

        <form
          ref={glass}
          className="lgcta__glass"
          data-phase={phase}
          noValidate
          onSubmit={submit}
          onPointerMove={move}
          onAnimationEnd={() => glass.current?.classList.remove("lgcta__glass--squish")}
          style={lens ? ({ backdropFilter: `url(#${uid}-lens) blur(2px) saturate(1.6) brightness(1.05)` } as CSSProperties) : undefined}
        >
          {lens && (
            <svg width="0" height="0" className="lgcta__defs" aria-hidden="true">
              <filter id={`${uid}-lens`} x="0" y="0" width={box.w} height={box.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feImage href={lensMap(box.w, box.h)} x="0" y="0" width={box.w} height={box.h} result="map" />
                <feDisplacementMap in="SourceGraphic" in2="map" scale="-48" xChannelSelector="R" yChannelSelector="B" />
              </filter>
            </svg>
          )}
          <span className="lgcta__rim" aria-hidden="true" />
          <div className="lgcta__fields" inert={phase === "done"}>
            <label htmlFor={`${uid}-email`} className="lgcta__sr">Email address</label>
            <input
              ref={input}
              id={`${uid}-email`}
              className="lgcta__input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              disabled={phase !== "idle"}
              aria-invalid={!!error || undefined}
              aria-describedby={`${uid}-msg`}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
            />
            <button type="submit" className="lgcta__btn" disabled={phase !== "idle"}>{phase === "sending" ? "Signing up…" : action}</button>
          </div>
          <p className="lgcta__done" aria-hidden={phase !== "done"}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
            <span>{done ? done(email.trim()) : <>You&rsquo;re in. The first letter reaches <strong>{email.trim()}</strong> on Sunday.</>}</span>
          </p>
        </form>
        <p id={`${uid}-msg`} className="lgcta__msg" data-error={!!error || undefined} aria-live="polite">
          {error || (phase === "done" ? "Signed up. Check your inbox on Sunday." : "One email a week. Unsubscribe in one click.")}
        </p>
      </div>
    </section>
  );
}
