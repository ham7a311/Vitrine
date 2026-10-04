"use client";

import { useId, useMemo, useState, type FormEvent } from "react";
import "./sigil-sign-in.css";

/**
 * Sigil Sign-in
 * A split sign-in where the left half responds to you. Every character of your
 * email adds a stroke to a geometric mark — the same address always grows the
 * same sigil — and the password's strength closes a ring of arcs around it.
 */

type Props = {
  brand: string;
  onSubmit?: (data: { email: string; password: string }) => void;
};

/* ——— A tiny deterministic hash so the same input always draws the same mark ——— */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number) {
  let s = seed || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const CX = 160;
const CY = 160;
const RINGS = [34, 62, 92, 118];

/** One stroke per character: an arc, spoke or chord, placed by hashing the prefix. */
function strokeFor(email: string, index: number) {
  const r = rng(hash(email.slice(0, index + 1)) ^ (email.charCodeAt(index) * 2654435761));
  const kind = Math.floor(r() * 3);
  const a1 = r() * Math.PI * 2;
  const a2 = a1 + 0.5 + r() * 1.6;
  const r1 = RINGS[Math.floor(r() * RINGS.length)];
  const r2 = RINGS[Math.floor(r() * RINGS.length)];
  const p = (a: number, rad: number) => [CX + Math.cos(a) * rad, CY + Math.sin(a) * rad] as const;
  const [x1, y1] = p(a1, r1);
  const [x2, y2] = p(a2, kind === 0 ? r1 : r2);
  if (kind === 0) return { d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r1} ${r1} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`, dot: [x2, y2] as const };
  if (kind === 1) return { d: `M ${CX} ${CY} L ${x1.toFixed(1)} ${y1.toFixed(1)}`, dot: [x1, y1] as const };
  return { d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`, dot: [x2, y2] as const };
}

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0–4
}
const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

export function SigilSignIn({ brand, onSubmit }: Props) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [sent, setSent] = useState(false);

  const strokes = useMemo(() => Array.from(email.slice(0, 32)).map((_, i) => strokeFor(email, i)), [email]);
  const s = strength(password);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid || password.length < 8) return;
    setSent(true);
    onSubmit?.({ email, password });
    setTimeout(() => setSent(false), 1800);
  };

  return (
    <div className="sig">
      <section className="sig__stage" aria-label="Your sigil">
        <div className="sig__grid" aria-hidden="true" />
        <svg className="sig__svg" viewBox="0 0 320 320" role="img" aria-label={email ? "A geometric mark generated from your email address" : "An empty mark, waiting for your email address"}>
          {/* guide rings */}
          {RINGS.map((r) => (
            <circle key={r} cx={CX} cy={CY} r={r} className="sig__guide" />
          ))}
          {/* strength arcs: four quarters that close as the password strengthens */}
          {[0, 1, 2, 3].map((q) => {
            const a0 = -Math.PI / 2 + q * (Math.PI / 2) + 0.12;
            const a1 = a0 + Math.PI / 2 - 0.24;
            const R = 138;
            const d = `M ${(CX + Math.cos(a0) * R).toFixed(1)} ${(CY + Math.sin(a0) * R).toFixed(1)} A ${R} ${R} 0 0 1 ${(CX + Math.cos(a1) * R).toFixed(1)} ${(CY + Math.sin(a1) * R).toFixed(1)}`;
            return <path key={q} d={d} pathLength={1} className={`sig__arc ${q < s ? "is-on" : ""}`} data-level={s} />;
          })}
          {/* the sigil itself */}
          <g className="sig__strokes">
            {strokes.map((st, i) => (
              <g key={`${i}-${st.d}`} className="sig__stroke">
                <path d={st.d} pathLength={1} />
                <circle cx={st.dot[0]} cy={st.dot[1]} r="2.2" />
              </g>
            ))}
          </g>
          <circle cx={CX} cy={CY} r="3.5" className={`sig__core ${valid ? "is-valid" : ""}`} />
        </svg>
        <p className="sig__caption" aria-live="polite">
          {email ? (valid ? "Your mark is complete." : "Keep going — your mark is growing.") : "Type your email. Watch what it draws."}
        </p>
      </section>

      <main className="sig__panel">
        <p className="sig__brand">{brand}</p>
        <h1 className="sig__title">Sign in</h1>
        <p className="sig__sub">The mark on the left is yours alone — the same address always draws the same one.</p>

        <form className="sig__form" onSubmit={submit} noValidate aria-label="Sign in">
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

          <label htmlFor={`${id}-pw`}>Password</label>
          <div className="sig__pw">
            <input id={`${id}-pw`} type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby={`${id}-strength`} />
            <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show} className="sig__show">
              {show ? "Hide" : "Show"}
            </button>
          </div>
          <p id={`${id}-strength`} className="sig__strength" data-level={s} aria-live="polite">
            <span aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <i key={i} className={i < s ? "is-on" : ""} />
              ))}
            </span>
            {password ? LABELS[s] : "Use 8+ characters"}
          </p>

          <button type="submit" className="sig__submit" disabled={!valid || password.length < 8}>
            {sent ? "Welcome back ✓" : "Enter"}
          </button>
        </form>

        <p className="sig__foot">
          No account yet? <a href="#create">Draw your mark</a>
        </p>
      </main>
    </div>
  );
}
