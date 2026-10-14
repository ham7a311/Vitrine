"use client";
import { useEffect, useReducer, useRef, type ReactNode } from "react";
import { handoff } from "./handoff";
import { PROVIDER_NAMES, ProviderMark, type ProviderId } from "./providers";
import "./provider-stack.css";

export type ProviderStackProps = {
  /** Your product's name and mark, shown at the top and in the handoff. */
  app: { name: string; mark: ReactNode };
  providers?: ProviderId[];
  lastUsed?: ProviderId;
  /**
   * Start the provider's flow. Resolve with the signed-in name or email; reject with
   * { reason: "closed" } when the window is closed, or anything else for a failure.
   * The signal aborts when the person cancels.
   */
  onProvider?: (id: ProviderId, signal: AbortSignal) => Promise<string | void>;
  onEmail?: () => void;
  theme?: "night" | "paper";
  className?: string;
};

const reasonText = (p: ProviderId, e: unknown) => {
  const r = (e as { reason?: string })?.reason;
  return r === "closed" ? `The ${PROVIDER_NAMES[p]} window was closed before you finished.` : `${PROVIDER_NAMES[p]} couldn't sign you in just now.`;
};

/**
 * Provider Stack
 * Sign-in that starts with the account you already have. Each provider wears its own colours;
 * choose one and the stack gives way to the handoff — your mark and theirs joined by a moving
 * line — until the other side answers, with cancel, a plain reason and retry if it doesn't.
 */
export function ProviderStack({ app, providers = ["google", "apple", "github", "microsoft"], lastUsed, onProvider, onEmail, theme = "night", className = "" }: ProviderStackProps) {
  const [s, send] = useReducer(handoff, { phase: "pick" });
  const ctrl = useRef<AbortController | null>(null);
  const root = useRef<HTMLDivElement>(null);

  // focus follows the flow: the cancel button while waiting, the failed provider on error, the heading when done
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (s.phase === "waiting") el.querySelector<HTMLElement>(".pstack__cancel")?.focus();
    if (s.phase === "pick" && s.error) el.querySelector<HTMLElement>(`[data-provider="${s.error.provider}"]`)?.focus();
    if (s.phase === "done") el.querySelector<HTMLElement>(".pstack__done h2")?.focus();
  }, [s]);
  useEffect(() => () => ctrl.current?.abort(), []);

  const start = async (p: ProviderId) => {
    ctrl.current?.abort();
    const c = new AbortController(); ctrl.current = c;
    send({ type: "start", provider: p });
    try {
      const who = await (onProvider?.(p, c.signal) ?? Promise.resolve());
      if (!c.signal.aborted) send({ type: "succeed", who: who || undefined });
    } catch (e) { if (!c.signal.aborted) send({ type: "fail", text: reasonText(p, e) }); }
  };
  const cancel = () => { ctrl.current?.abort(); send({ type: "cancel" }); };

  return (
    <div ref={root} className={`pstack pstack--${theme} ${className}`} data-phase={s.phase}>
      <div className="pstack__card">
        {s.phase === "pick" && (
          <>
            <span className="pstack__app" aria-hidden="true">{app.mark}</span>
            <h2 className="pstack__title">Sign in to {app.name}</h2>
            <p className="pstack__sub">Use an account you already have. We never see your password.</p>
            {s.error && <p className="pstack__error" role="alert"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="currentColor" /><path d="M8 4.5v4.2M8 11v.3" stroke="var(--ps-card)" strokeWidth="1.8" strokeLinecap="round" /></svg><span>{s.error.text} <b>Try again</b> or pick another way in.</span></p>}
            <div className="pstack__list">
              {providers.map((p) => (
                <button key={p} type="button" data-provider={p} className={`pstack__btn pstack__btn--${p}`} onClick={() => start(p)}>
                  <ProviderMark id={p} size={20} />
                  <span>Continue with {PROVIDER_NAMES[p]}</span>
                  {lastUsed === p && <em>Last used</em>}
                </button>
              ))}
            </div>
            <p className="pstack__alt">{onEmail ? <button type="button" onClick={onEmail}>Continue with email instead</button> : null}</p>
          </>
        )}

        {s.phase === "waiting" && (
          <div className="pstack__wait" role="status">
            <div className="pstack__bridge" aria-hidden="true">
              <span className="pstack__node pstack__node--app">{app.mark}</span>
              <span className="pstack__wire"><i /><i /><i /></span>
              <span className={`pstack__node pstack__node--${s.provider}`}><ProviderMark id={s.provider} size={26} /></span>
            </div>
            <h2 className="pstack__title">Waiting for {PROVIDER_NAMES[s.provider]}…</h2>
            <p className="pstack__sub">Finish signing in in the window that just opened. We'll carry on here as soon as {PROVIDER_NAMES[s.provider]} answers.</p>
            <button type="button" className="pstack__cancel" onClick={cancel}>Cancel</button>
          </div>
        )}

        {s.phase === "done" && (
          <div className="pstack__done" role="status">
            <span className="pstack__tick" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 30 30"><path d="m8 15.5 4.6 4.6L22.5 10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <h2 className="pstack__title" tabIndex={-1}>You're in{s.who ? `, ${s.who}` : ""}</h2>
            <p className="pstack__sub">Signed in with {PROVIDER_NAMES[s.provider]}. Opening {app.name}…</p>
          </div>
        )}
      </div>
      <p className="pstack__legal">Protected by single sign-on. By continuing you accept the <a href="#terms">Terms</a>.</p>
    </div>
  );
}

export default ProviderStack;
