"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./qr-handoff-sign-in.css";

/**
 * QR Handoff Sign-in
 * Sign in by pointing your phone at the screen. The code sits in a frame
 * whose edge carries the instructions and the time left, running round it
 * like a ticker — slowing right down when you look at it. When the phone
 * scans, a ripple runs out through the code from its centre; approve on the
 * phone and the code turns over to a check. If it runs out, it dims and
 * offers a fresh one.
 */

type Phase = "waiting" | "scanned" | "approved" | "expired";

type Props = {
  product?: string;
  /** The device name the phone reports, shown while waiting for approval. */
  device?: string;
  /** Seconds a code lasts. */
  ttl?: number;
  /**
   * Draw your real QR code here (an SVG from your server). Without it a
   * stand-in pattern is drawn, which no phone can read.
   */
  code?: ReactNode;
  /** Shows "Simulate scan" / "Simulate approve" buttons for demos. */
  demo?: boolean;
  phase?: Phase;
  emailHref?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const SIZE = 248; // frame, px
const BAND = 26; // ticker band
const R = 30; // frame corner radius
const FONT = 9.5;
const N = 25; // modules per side

function loop(w: number, h: number) {
  const i = BAND / 2, r = R - i, x0 = i, y0 = i, x1 = w - i, y1 = h - i;
  const d = `M ${x0 + r} ${y0} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} V ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} V ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
  return { d, length: 2 * (x1 - x0 - 2 * r) + 2 * (y1 - y0 - 2 * r) + 2 * Math.PI * r };
}

/** A stand-in pattern with QR anatomy: three finders, timing lines and seeded data. Not a readable code. */
function pattern(seed: number) {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const on: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
  const reserved: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
  const finder = (ox: number, oy: number) => {
    for (let y = -1; y <= 7; y++) for (let x = -1; x <= 7; x++) {
      const X = ox + x, Y = oy + y;
      if (X < 0 || Y < 0 || X >= N || Y >= N) continue;
      reserved[Y][X] = true;
      const ring = Math.max(Math.abs(x - 3), Math.abs(y - 3));
      on[Y][X] = x >= 0 && y >= 0 && x <= 6 && y <= 6 && ring !== 2;
    }
  };
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  for (let i = 8; i < N - 8; i++) { on[6][i] = on[i][6] = i % 2 === 0; reserved[6][i] = reserved[i][6] = true; }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!reserved[y][x]) on[y][x] = rnd() < 0.48;
  return on;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function QrHandoffSignIn({ product = "Vitrine", device = "Hamza's iPhone", ttl = 120, code, demo = false, phase: forced, emailHref = "#", theme = "night", motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const [seed, setSeed] = useState(20261001);
  const [inner, setInner] = useState<Phase>("waiting");
  const phase = forced ?? inner;
  const [left, setLeft] = useState(ttl);
  const a = useRef<SVGTextPathElement>(null);
  const b = useRef<SVGTextPathElement>(null);
  const slow = useRef(false);
  const raf = useRef(0);

  const grid = useMemo(() => pattern(seed), [seed]);
  const { d, length } = loop(SIZE, SIZE);

  // The code's clock. A fresh code (new seed) restarts it.
  useEffect(() => {
    if (phase !== "waiting" && phase !== "scanned") return;
    const t0 = Date.now() - (ttl - left) * 1000;
    const id = setInterval(() => {
      const l = Math.max(0, ttl - Math.floor((Date.now() - t0) / 1000));
      setLeft(l);
      if (!l) { setInner("expired"); clearInterval(id); }
    }, 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, seed, ttl]);

  // The ticker: two copies one lap apart, so it never shows a seam.
  useEffect(() => {
    if (motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let o = 0, last = performance.now(), speed = 26;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed += ((slow.current ? 4 : 26) - speed) * Math.min(1, dt * 3);
      o = (o + speed * dt) % length;
      a.current?.setAttribute("startOffset", String(o));
      b.current?.setAttribute("startOffset", String(o - length));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf.current); raf.current = 0; };
  }, [length, motion]);

  const refresh = () => { setSeed((s) => (s * 48271) % 2147483647); setLeft(ttl); setInner("waiting"); };

  const words =
    phase === "approved" ? [`Signed in to ${product}`, "Opening your workspace"] :
    phase === "scanned" ? [`Approve on ${device}`, "Waiting for you"] :
    phase === "expired" ? ["Code expired", "Get a new one below"] :
    [`Scan with ${product}`, `Expires in ${clock(left)}`, "Muscat · encrypted"];
  const unit = words.map((w) => w.toUpperCase()).join("  ·  ") + "  ·  ";
  const copies = Math.max(1, Math.round(length / (unit.length * FONT * 0.78)));
  const text = unit.repeat(copies);

  const status = {
    waiting: `Open ${product} on your phone, tap Profile › Scan to sign in, and point it at this code.`,
    scanned: `Scanned. Approve the sign-in on ${device} to continue.`,
    approved: "You're in. Taking you to your workspace…",
    expired: "This code expired so it can't be reused. Get a fresh one to try again.",
  }[phase];

  return (
    <section className={`qhs qhs--${theme} ${className}`} data-motion={motion} data-phase={phase}>
      <h2 className="qhs__title">Sign in with your phone</h2>
      <p className="qhs__sub">No password. Your phone vouches for you.</p>

      <div className="qhs__frame" onPointerEnter={() => (slow.current = true)} onPointerLeave={() => (slow.current = false)}>
        <svg className="qhs__ticker" width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <path id={`${uid}-p`} d={d} fill="none" />
          <text fontSize={FONT} dy="0.35em"><textPath ref={a} href={`#${uid}-p`} startOffset="0" textLength={length} lengthAdjust="spacing">{text}</textPath></text>
          <text fontSize={FONT} dy="0.35em"><textPath ref={b} href={`#${uid}-p`} startOffset={-length} textLength={length} lengthAdjust="spacing">{text}</textPath></text>
        </svg>

        <div className="qhs__card">
          <div className="qhs__face" role="img" aria-label={phase === "expired" ? "Expired sign-in code" : "Sign-in code to scan with your phone"}>
            {code ?? (
              <svg key={seed} className="qhs__code" viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">
                {grid.flatMap((row, y) =>
                  row.map((v, x) =>
                    v ? (
                      <rect
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        width="1"
                        height="1"
                        style={{ "--d": Math.hypot(x - 12, y - 12).toFixed(2) } as CSSProperties}
                      />
                    ) : null,
                  ),
                )}
              </svg>
            )}
            {phase === "scanned" && <span className="qhs__pulse" aria-hidden="true" />}
            {phase === "expired" && (
              <button type="button" className="qhs__refresh" onClick={refresh}>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 10a5.5 5.5 0 1 1-1.6-3.9M15.5 3.5v3h-3" /></svg>
                Get a new code
              </button>
            )}
          </div>
          <div className="qhs__back" aria-hidden={phase !== "approved"}>
            <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20" pathLength={1} /><path d="M15 24.5l6 6 12-13" pathLength={1} /></svg>
            <span>Signed in</span>
          </div>
        </div>
      </div>

      <p className="qhs__status" role="status">{status}</p>

      {demo && phase !== "approved" && (
        <div className="qhs__demo">
          {phase === "waiting" && <button type="button" onClick={() => setInner("scanned")}>Simulate scan</button>}
          {phase === "scanned" && <button type="button" onClick={() => setInner("approved")}>Simulate approve</button>}
          {phase !== "expired" && <button type="button" onClick={() => setInner("expired")}>Expire now</button>}
        </div>
      )}

      <div className="qhs__or" aria-hidden="true"><span>or</span></div>
      <a className="qhs__email" href={emailHref}>Sign in with email instead</a>
    </section>
  );
}
