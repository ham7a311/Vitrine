"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import "./strength-ring-sign-up.css";

/**
 * Strength Ring Sign-up
 * The password field's border is the strength meter. As the password gets
 * better, a gradient line draws itself round the field from the top-left
 * corner, gaining colour as it goes; when every rule is met it closes the
 * loop and floods the field's edge with light for a moment. The rules below
 * tick off one by one, each with a check that draws itself.
 */

type Props = {
  product?: string;
  /** Called with the new account. Resolve to finish; reject with a message to show it. */
  onCreate?: (a: { name: string; email: string; password: string }) => Promise<void>;
  signInHref?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const R = 14; // field corner radius

/** A rounded-rect outline starting just after the top-left corner, clockwise. */
function outline(w: number, h: number) {
  const i = 0.75, r = R - i, x0 = i, y0 = i, x1 = w - i, y1 = h - i;
  return `M ${x0 + r} ${y0} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} V ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} V ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0}`;
}

const LEVELS = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

function assess(pw: string, name: string, email: string) {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  const first = name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const lower = pw.toLowerCase();
  const rules = [
    { id: "len", text: "At least 12 characters", ok: pw.length >= 12 },
    { id: "num", text: "A number", ok: /\d/.test(pw) },
    { id: "mix", text: "Upper and lower case, or a symbol", ok: (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) || /[^A-Za-z0-9]/.test(pw) },
    { id: "own", text: "Not your name or email", ok: pw.length > 0 && !(local.length > 2 && lower.includes(local)) && !(first.length > 2 && lower.includes(first)) },
  ];
  const met = rules.filter((r) => r.ok).length;
  // Most of the ring is the rules; the rest is length, so it keeps moving as you type.
  const p = pw.length === 0 ? 0 : Math.min(1, (met / rules.length) * 0.78 + Math.min(pw.length, 16) / 16 * 0.22);
  const level = pw.length === 0 ? -1 : met === rules.length ? 4 : pw.length < 8 ? 0 : Math.max(1, met - (pw.length < 12 ? 1 : 0));
  return { rules, p: met === rules.length ? 1 : Math.min(p, 0.94), level, strong: met === rules.length };
}

const demoCreate = () => new Promise<void>((ok) => setTimeout(ok, 1300));

export function StrengthRingSignUp({ product = "Vitrine", onCreate = demoCreate, signInHref = "#", theme = "paper", motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const field = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<{ field: "name" | "email" | "pw" | "form"; text: string } | null>(null);

  useLayoutEffect(() => {
    const el = field.current;
    if (!el) return;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phase]);

  const s = assess(pw, name, email);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError({ field: "name", text: "Add your name so your team knows who joined." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError({ field: "email", text: "That email doesn't look complete — check for a missing @ or domain." });
    if (!s.strong) return setError({ field: "pw", text: "Almost — tick off the rules below first." });
    setError(null);
    setPhase("busy");
    try {
      await onCreate({ name: name.trim(), email, password: pw });
      setPhase("done");
    } catch (err) {
      setPhase("idle");
      setError({ field: "form", text: err instanceof Error ? err.message : "Something went wrong. Try again in a moment." });
    }
  };

  if (phase === "done") {
    return (
      <section className={`srs srs--${theme} ${className}`} data-motion={motion} data-done>
        <div className="srs__done" role="status">
          <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" pathLength={1} /><path d="M15 24.5l6 6 12-13" pathLength={1} /></svg>
          <h2 className="srs__title">Welcome to {product}, {name.trim().split(/\s+/)[0]}</h2>
          <p className="srs__sub">We sent a link to <strong>{email}</strong>. Open it on any device to confirm the address.</p>
        </div>
      </section>
    );
  }

  const err = (f: "name" | "email" | "pw") => (error?.field === f ? `${uid}-err` : undefined);

  return (
    <section className={`srs srs--${theme} ${className}`} data-motion={motion}>
      <h2 className="srs__title">Create your {product} account</h2>
      <p className="srs__sub">Free for teams of up to five. No card needed.</p>

      <form className="srs__form" onSubmit={submit} noValidate>
        <label className="srs__field">
          <span className="srs__label">Full name</span>
          <input className="srs__input" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={error?.field === "name" || undefined} aria-describedby={err("name")} placeholder="Hamza Al Balushi" />
        </label>
        <label className="srs__field">
          <span className="srs__label">Work email</span>
          <input className="srs__input" type="email" name="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={error?.field === "email" || undefined} aria-describedby={err("email")} placeholder="you@company.om" />
        </label>

        <div className="srs__field">
          <span className="srs__label-row">
            <label className="srs__label" htmlFor={`${uid}-pw`}>Password</label>
            <span className="srs__level" data-level={s.level} aria-live="polite">{s.level >= 0 ? LEVELS[s.level] : ""}</span>
          </span>
          <div
            ref={field}
            className="srs__pw"
            data-strong={s.strong || undefined}
            style={{ "--p": s.p, "--hue": s.level } as CSSProperties}
          >
            {box.w > 0 && (
              <svg className="srs__ring" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
                <defs>
                  <linearGradient id={`${uid}-g`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={box.w} y2={box.h}>
                    <stop offset="0" className="srs__g1" />
                    <stop offset="0.5" className="srs__g2" />
                    <stop offset="1" className="srs__g3" />
                  </linearGradient>
                </defs>
                <path className="srs__track" d={outline(box.w, box.h)} />
                <path className="srs__arc" d={outline(box.w, box.h)} pathLength={1} stroke={`url(#${uid}-g)`} />
              </svg>
            )}
            <span className="srs__flood" aria-hidden="true" />
            <input
              id={`${uid}-pw`}
              className="srs__input srs__input--pw"
              type={show ? "text" : "password"}
              name="new-password"
              autoComplete="new-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              aria-invalid={error?.field === "pw" || undefined}
              aria-describedby={[`${uid}-rules`, err("pw")].filter(Boolean).join(" ")}
              spellCheck={false}
            />
            <button type="button" className="srs__eye" aria-label="Show password" aria-pressed={show} onClick={() => setShow((v) => !v)}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10Z" />
                <circle cx="10" cy="10" r="2.4" />
                {!show && <path d="M3.5 3.5l13 13" />}
              </svg>
            </button>
          </div>
          <ul id={`${uid}-rules`} className="srs__rules" aria-label="Password rules">
            {s.rules.map((r) => (
              <li key={r.id} className="srs__rule" data-ok={r.ok || undefined}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /><path d="M5 8.3l2 2 4-4.4" pathLength={1} /></svg>
                {r.text}
                <span className="srs__sr">{r.ok ? ", done" : ", not yet"}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && <p id={`${uid}-err`} className="srs__error" role="alert">{error.text}</p>}

        <button type="submit" className="srs__submit" disabled={phase === "busy"} data-busy={phase === "busy" || undefined}>
          <span>{phase === "busy" ? "Creating your account…" : "Create account"}</span>
        </button>
      </form>

      <p className="srs__foot">Already have an account? <a href={signInHref}>Sign in</a></p>
    </section>
  );
}
