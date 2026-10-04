"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from "react";
import "./liquid-glass-sign-in.css";

/**
 * Liquid Glass Sign-in
 * A sign-in panel made of thick glass over slow colour. Its rim bends what's
 * behind it (in Chromium; a frosted pane elsewhere) and catches the light on
 * the side nearest your pointer. A drop of the same glass slides between
 * Password and Magic link on a spring, the button's words roll over letter
 * by letter, and a successful sign-in squashes the panel like a drop
 * landing before it settles on the next step.
 */

type Mode = "password" | "link";

type Props = {
  product?: string;
  /** Resolve to finish; reject with a message to show it. */
  onSubmit?: (v: { mode: Mode; email: string; password?: string }) => Promise<void>;
  variant?: "dusk" | "lagoon";
  motion?: "full" | "reduced";
  className?: string;
};

const BEZEL = 20;

/** Displacement map: neutral in the middle, ramping to full offsets at the rim. */
function lensMap(w: number, h: number) {
  const r = 30;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="x" x1="0" x2="1"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient><linearGradient id="y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00f"/><stop offset="1" stop-color="#000"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="${BEZEL / 2.4}"/></filter></defs><rect width="${w}" height="${h}" fill="#000"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#x)"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#y)" style="mix-blend-mode:difference"/><rect x="${BEZEL}" y="${BEZEL}" width="${w - BEZEL * 2}" height="${h - BEZEL * 2}" rx="${r - 8}" fill="#808080" filter="url(#b)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Each letter is its own span, so a new label can roll in one letter after another. */
function Roll({ text }: { text: string }) {
  return (
    <span key={text} className="lgs__roll" aria-hidden="true">
      {text.split("").map((c, i) => (
        <span key={i} style={{ "--i": i } as CSSProperties}>{c === " " ? " " : c}</span>
      ))}
    </span>
  );
}

const demoSubmit = () => new Promise<void>((ok) => setTimeout(ok, 1100));

export function LiquidGlassSignIn({ product = "Vitrine", onSubmit = demoSubmit, variant = "dusk", motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const panel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drop = useRef<HTMLSpanElement>(null);
  const opts = useRef<(HTMLButtonElement | null)[]>([]);
  const spring = useRef({ x: 0, w: 0, vx: 0, tx: 0, tw: 0, raf: 0 });
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [refract, setRefract] = useState(false);
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [phase, setPhase] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<{ field: "email" | "pw" | "form"; text: string } | null>(null);
  const [squish, setSquish] = useState(0);

  const reduced = () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const chromium = /Chrome\//.test(navigator.userAgent) && !/Edg\/|OPR\//.test(navigator.userAgent);
    setRefract(chromium && CSS.supports("backdrop-filter", "url(#x) blur(1px)"));
  }, []);

  useLayoutEffect(() => {
    const el = panel.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The glass drop under the chosen mode: a spring on x, stretching with speed.
  const paint = () => {
    const s = spring.current, el = drop.current;
    if (!el) return;
    const v = Math.abs(s.vx);
    el.style.width = `${s.w}px`;
    el.style.transform = `translateX(${s.x}px) scale(${(1 + Math.min(0.22, v / 2600)).toFixed(3)}, ${(1 - Math.min(0.12, v / 4200)).toFixed(3)})`;
  };
  const aim = (i: number, jump = false) => {
    const b = opts.current[i], s = spring.current;
    if (!b) return;
    s.tx = b.offsetLeft; s.tw = b.offsetWidth;
    if (jump || reduced()) { s.x = s.tx; s.w = s.tw; s.vx = 0; paint(); return; }
    if (s.raf) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.vx += (-(s.x - s.tx) * 480 - s.vx * 28) * dt;
      s.x += s.vx * dt;
      s.w += (s.tw - s.w) * Math.min(1, dt * 14);
      paint();
      if (Math.abs(s.x - s.tx) < 0.2 && Math.abs(s.vx) < 2) { s.x = s.tx; s.w = s.tw; s.vx = 0; paint(); s.raf = 0; return; }
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  };
  useLayoutEffect(() => {
    const t = track.current;
    if (!t) return;
    const m = () => aim(mode === "password" ? 0 : 1, true);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(t);
    return () => ro.disconnect();
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { cancelAnimationFrame(spring.current.raf); spring.current.raf = 0; }, []);

  const pick = (m: Mode) => {
    setMode(m);
    setError(null);
    aim(m === "password" ? 0 : 1);
  };

  const light = (e: PointerEvent<HTMLDivElement>) => {
    const el = panel.current!, r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError({ field: "email", text: "That email looks incomplete — check for a missing @ or domain." });
    if (mode === "password" && pw.length < 8) return setError({ field: "pw", text: "That's shorter than any Vitrine password. Check for a typo, or get a link instead." });
    setError(null);
    setPhase("busy");
    try {
      await onSubmit({ mode, email, password: mode === "password" ? pw : undefined });
      setSquish((s) => s + 1);
      setPhase("done");
    } catch (err) {
      setPhase("idle");
      setError({ field: "form", text: err instanceof Error ? err.message : "Something went wrong. Try again in a moment." });
    }
  };

  const lens = refract && box.w > 0;
  const label = phase === "busy" ? (mode === "password" ? "Signing in…" : "Sending…") : mode === "password" ? "Sign in" : "Email me a link";
  const err = (f: "email" | "pw") => (error?.field === f ? `${uid}-err` : undefined);

  return (
    <section className={`lgs lgs--${variant} ${className}`} data-motion={motion}>
      <div className="lgs__aurora" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="lgs__lines" aria-hidden="true" />

      <div
        ref={panel}
        className="lgs__panel"
        data-squish={squish ? (squish % 2 ? "a" : "b") : undefined}
        onPointerMove={light}
        style={lens ? ({ backdropFilter: `url(#${uid}-lens) blur(2px) saturate(1.6) brightness(1.04)` } as CSSProperties) : undefined}
      >
        {lens && (
          <svg width="0" height="0" className="lgs__defs" aria-hidden="true">
            <filter id={`${uid}-lens`} x="0" y="0" width={box.w} height={box.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feImage href={lensMap(box.w, box.h)} x="0" y="0" width={box.w} height={box.h} result="map" />
              <feDisplacementMap in="SourceGraphic" in2="map" scale="-56" xChannelSelector="R" yChannelSelector="B" />
            </filter>
          </svg>
        )}
        <span className="lgs__rim" aria-hidden="true" />

        {phase === "done" ? (
          <div className="lgs__done" role="status">
            <span className="lgs__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">{mode === "link" ? <path d="M3.5 7.5h17v10h-17zM3.5 7.5l8.5 6 8.5-6" pathLength={1} /> : <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />}</svg>
            </span>
            <h2 className="lgs__title">{mode === "link" ? "Check your inbox" : "Welcome back"}</h2>
            <p className="lgs__sub">
              {mode === "link" ? <>We sent a sign-in link to <strong>{email}</strong>. It works once, for the next 15 minutes.</> : <>Signed in as <strong>{email}</strong>. Opening your workspace…</>}
            </p>
            <button type="button" className="lgs__ghost" onClick={() => { setPhase("idle"); setPw(""); }}>
              {mode === "link" ? "Use a different email" : "Not you? Switch account"}
            </button>
          </div>
        ) : (
          <>
            <p className="lgs__brand"><span aria-hidden="true" className="lgs__logo" />{product}</p>
            <h2 className="lgs__title">Sign in</h2>
            <p className="lgs__sub">Pick up where you left off.</p>

            <div ref={track} className="lgs__modes" role="radiogroup" aria-label="How to sign in">
              <span ref={drop} className="lgs__drop" aria-hidden="true" />
              {(["password", "link"] as const).map((m, i) => (
                <button
                  key={m}
                  ref={(el) => void (opts.current[i] = el)}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  tabIndex={mode === m ? 0 : -1}
                  className="lgs__mode"
                  onClick={() => pick(m)}
                  onKeyDown={(e) => {
                    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
                    e.preventDefault();
                    const n = m === "password" ? "link" : "password";
                    pick(n);
                    opts.current[n === "password" ? 0 : 1]?.focus();
                  }}
                >
                  {m === "password" ? "Password" : "Magic link"}
                </button>
              ))}
            </div>

            <form className="lgs__form" onSubmit={submit} noValidate>
              <label className="lgs__field">
                <span className="lgs__label">Email</span>
                <input className="lgs__input" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={error?.field === "email" || undefined} aria-describedby={err("email")} placeholder="you@company.om" />
              </label>
              <div className="lgs__more" data-open={mode === "password" || undefined}>
                <div>
                  <label className="lgs__field">
                    <span className="lgs__label-row"><span className="lgs__label">Password</span><a href="#" className="lgs__link" tabIndex={mode === "password" ? 0 : -1}>Forgot?</a></span>
                    <input className="lgs__input" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} aria-invalid={error?.field === "pw" || undefined} aria-describedby={err("pw")} tabIndex={mode === "password" ? 0 : -1} disabled={mode !== "password"} />
                  </label>
                </div>
              </div>
              {mode === "link" && <p className="lgs__hint">We'll email you a link that signs you in — no password needed.</p>}
              {error && <p id={`${uid}-err`} className="lgs__error" role="alert">{error.text}</p>}
              <button type="submit" className="lgs__submit" disabled={phase === "busy"} aria-label={label}>
                <Roll text={label} />
              </button>
            </form>
            <p className="lgs__foot">New to {product}? <a href="#">Create an account</a></p>
          </>
        )}
      </div>
    </section>
  );
}
