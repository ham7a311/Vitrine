"use client";
import { useEffect, useId, useRef, useState } from "react";
import { handleProblem, initials, suggest, tidy } from "./handle";
import { PROVIDER_NAMES, ProviderMark, Spinner, type ProviderId } from "./providers";
import "./handle-sign-up.css";

export type Profile = { name: string; avatar?: string; via?: ProviderId };

export type HandleSignUpProps = {
  brand: string;
  providers?: ProviderId[];
  /** Start an account; resolve with what you know about the person (name, avatar). */
  onStart?: (how: { provider: ProviderId } | { email: string; password: string }) => Promise<Profile>;
  /** Resolve true when the handle is free. */
  checkHandle?: (handle: string) => Promise<boolean>;
  onFinish?: (p: { name: string; handle: string }) => Promise<void>;
  /** Where the last button goes. */
  homeHref?: string;
  theme?: "night" | "paper";
  className?: string;
};

type Check = "idle" | "checking" | "free" | "taken" | "bad";
const STEPS = ["Account", "Profile", "Done"];

/**
 * Handle Sign-up
 * Three short steps: start with GitHub, Google or email; claim a handle while it checks
 * availability as you type and offers free ones when yours is taken; then meet your profile.
 */
export function HandleSignUp({ brand, providers = ["github", "google"], onStart, checkHandle, onFinish, homeHref = "#home", theme = "night", className = "" }: HandleSignUpProps) {
  const id = useId();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [check, setCheck] = useState<Check>("idle");
  const [taken, setTaken] = useState<string[]>([]);
  const seq = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const prevStep = useRef(0);

  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    root.current?.querySelector<HTMLElement>(`[data-step="${step}"] h2`)?.focus();
  }, [step]);

  // availability, debounced, ignoring answers to questions we've stopped asking
  useEffect(() => {
    if (step !== 1) return;
    const h = handle;
    if (!h) { setCheck("idle"); return; }
    if (handleProblem(h)) { setCheck("bad"); return; }
    setCheck("checking");
    const n = ++seq.current;
    const t = window.setTimeout(async () => {
      try {
        const ok = await (checkHandle?.(h) ?? Promise.resolve(true));
        if (n !== seq.current) return;
        setCheck(ok ? "free" : "taken");
        if (!ok) setTaken((x) => (x.includes(h) ? x : [...x, h]));
      } catch { if (n === seq.current) setCheck("idle"); }
    }, 350);
    return () => clearTimeout(t);
  }, [handle, step, checkHandle]);

  const start = async (how: { provider: ProviderId } | { email: string; password: string }) => {
    setError("");
    if ("email" in how) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(how.email)) { setError("Enter a valid email."); return; }
      if (how.password.length < 10) { setError("Use at least 10 characters for your password."); return; }
    }
    setBusy("provider" in how ? how.provider : "email");
    try {
      const p = await (onStart?.(how) ?? Promise.resolve({ name: "" }));
      setProfile(p); setName(p.name);
      const first = suggest(p.name)[0] ?? "";
      setHandle(first); setStep(1);
    } catch { setError("Couldn't start your account. Try again."); }
    finally { setBusy(null); }
  };

  const finish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (check !== "free" || !name.trim()) return;
    setBusy("finish"); setError("");
    try { await (onFinish?.({ name: name.trim(), handle }) ?? Promise.resolve()); setStep(2); }
    catch { setError("Someone just took that handle. Pick another."); setCheck("taken"); }
    finally { setBusy(null); }
  };

  const status = check === "checking" ? "Checking…" : check === "free" ? `@${handle} is yours.` : check === "taken" ? `@${handle} is taken.` : check === "bad" ? handleProblem(handle) : "Letters, numbers and underscores.";
  const [ideas, setIdeas] = useState<string[]>([]);
  // suggestions are checked before they're offered, so every chip is really free
  useEffect(() => {
    if (check !== "taken" && check !== "bad") { setIdeas([]); return; }
    let live = true;
    const pool = suggest(name || handle, [...taken, handle], 7, 6);
    Promise.all(pool.map((h) => (checkHandle?.(h) ?? Promise.resolve(true)).catch(() => false)))
      .then((ok) => { if (live) setIdeas(pool.filter((_, i) => ok[i]).slice(0, 3)); });
    return () => { live = false; };
  }, [check, name, handle, taken, checkHandle]);
  const av = profile?.avatar;

  return (
    <div ref={root} className={`hsign hsign--${theme} ${className}`}>
      <div className="hsign__card">
        <ol className="hsign__rail" aria-label="Sign-up progress">
          {STEPS.map((s, i) => <li key={s} className={i < step ? "done" : i === step ? "now" : ""} aria-current={i === step ? "step" : undefined}><i aria-hidden="true">{i < step ? "✓" : i + 1}</i>{s}</li>)}
        </ol>

        {step === 0 && (
          <div className="hsign__step" data-step={0}>
            <h2 tabIndex={-1}>Join {brand}</h2>
            <p className="hsign__sub">Bring your profile from somewhere you already are — it saves typing.</p>
            <div className="hsign__providers">
              {providers.map((p) => (
                <button key={p} type="button" className={`hsign__provider hsign__provider--${p}`} disabled={!!busy} onClick={() => start({ provider: p })}>
                  {busy === p ? <Spinner /> : <ProviderMark id={p} />}{PROVIDER_NAMES[p]}
                </button>
              ))}
            </div>
            <p className="hsign__or"><span>or with email</span></p>
            <form onSubmit={(e) => { e.preventDefault(); start({ email, password }); }} noValidate className="hsign__form">
              <label htmlFor={`${id}-e`}>Email</label>
              <input id={`${id}-e`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor={`${id}-p`}>Password</label>
              <input id={`${id}-p`} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby={`${id}-ph`} />
              <p id={`${id}-ph`} className="hsign__note">At least 10 characters.</p>
              {error && <p className="hsign__error" role="alert">{error}</p>}
              <button type="submit" className="hsign__primary" disabled={!!busy}>{busy === "email" ? <Spinner /> : null}Continue</button>
            </form>
          </div>
        )}

        {step === 1 && (
          <form className="hsign__step" data-step={1} onSubmit={finish} noValidate>
            <h2 tabIndex={-1}>Claim your handle</h2>
            <div className="hsign__who">
              <span className="hsign__avatar" aria-hidden="true">{av ? <img src={av} alt="" /> : initials(name || "?")}</span>
              <div>
                <b>{name || "Your name"}</b>
                {profile?.via && <span className="hsign__via"><ProviderMark id={profile.via} size={12} />Imported from {PROVIDER_NAMES[profile.via]}</span>}
              </div>
            </div>
            <div className="hsign__form">
              <label htmlFor={`${id}-n`}>Display name</label>
              <input id={`${id}-n`} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              <label htmlFor={`${id}-h`}>Handle</label>
              <div className={`hsign__handle hsign__handle--${check}`}>
                <span aria-hidden="true">@</span>
                <input id={`${id}-h`} autoComplete="username" spellCheck={false} autoCapitalize="none" value={handle} maxLength={24}
                  aria-invalid={check === "taken" || check === "bad" ? true : undefined} aria-describedby={`${id}-hs`} onChange={(e) => setHandle(tidy(e.target.value))} />
                <i aria-hidden="true">{check === "checking" ? <Spinner size={14} /> : check === "free" ? "✓" : check === "taken" || check === "bad" ? "✕" : null}</i>
              </div>
              <p id={`${id}-hs`} className={`hsign__status hsign__status--${check}`} aria-live="polite">{status}</p>
              {ideas.length > 0 && (
                <div className="hsign__ideas" role="group" aria-label="Free handles">
                  {ideas.map((x) => <button key={x} type="button" onClick={() => setHandle(x)}>@{x}</button>)}
                </div>
              )}
              {error && <p className="hsign__error" role="alert">{error}</p>}
              <button type="submit" className="hsign__primary" disabled={check !== "free" || !name.trim() || !!busy}>{busy === "finish" ? <Spinner /> : null}Create account</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="hsign__step hsign__step--done" data-step={2} role="status">
            <h2 tabIndex={-1}>You're in, {name.split(" ")[0]}</h2>
            <div className="hsign__profile">
              <div className="hsign__banner" aria-hidden="true" />
              <span className="hsign__avatar hsign__avatar--lg" aria-hidden="true">{av ? <img src={av} alt="" /> : initials(name)}</span>
              <b>{name}</b>
              <span>@{handle}</span>
              <p>Joined {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })} · 0 following · 0 followers</p>
            </div>
            <a className="hsign__primary" href={homeHref}>Open your feed</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default HandleSignUp;
