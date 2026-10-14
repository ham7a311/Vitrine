"use client";
import { useEffect, useId, useRef, useState } from "react";
import { METHOD_LABEL, digits, nextTab, triesLeft, type Method } from "./access";
import "./confirm-access.css";

export type ConfirmAccessProps = {
  /** What needs confirming. */
  action: { verb: string; target: string };
  account: { handle: string; initials?: string };
  methods?: Method[];
  /** Resolve when the proof is good; reject when it isn't. */
  onVerify?: (method: Method, value?: string) => Promise<void>;
  /** Runs after the dialog has confirmed and closed. */
  onConfirmed?: () => void;
  triggerLabel?: string;
  /** How long the confirmation lasts, in words. */
  grace?: string;
  attempts?: number;
  theme?: "night" | "paper";
  className?: string;
};

type State = "idle" | "busy" | "wrong" | "ok";

const Lock = () => <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="15.5" r="1.4" fill="currentColor" /></svg>;
const RIDGES = ["M12 4.5a7.5 7.5 0 0 1 7.5 7.5", "M4.5 12A7.5 7.5 0 0 1 9 5.1", "M7.5 18.6A7.5 7.5 0 0 1 4.5 15", "M12 7.5a4.5 4.5 0 0 1 4.5 4.5c0 2.2-.4 4.2-1.2 6", "M7.5 12a4.5 4.5 0 0 1 2-3.7", "M7.8 15.2c.7 1.3 1 2.6 1 4", "M12 10.5a1.5 1.5 0 0 1 1.5 1.5c0 3-.6 5.6-1.8 8", "M10.5 12.6c0 2.5-.5 4.6-1.4 6.4", "M19.5 15c-.2 1.3-.6 2.5-1.1 3.6"];

/**
 * Confirm Access
 * A guard for dangerous actions: before it goes ahead, prove it's still you — with a passkey,
 * a code from your authenticator or your password — in a dialog that says plainly what you're
 * about to do and as whom.
 */
export function ConfirmAccess({ action, account, methods = ["passkey", "code", "password"], onVerify, onConfirmed, triggerLabel, grace = "2 hours", attempts = 3, theme = "night", className = "" }: ConfirmAccessProps) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);
  const [method, setMethod] = useState<Method>(methods[0]);
  const [state, setState] = useState<State>("idle");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [left, setLeft] = useState(attempts);
  const [shake, setShake] = useState(0);

  const open = () => { setState("idle"); setCode(""); setPassword(""); setLeft(attempts); setMethod(methods[0]); dialog.current?.showModal(); };
  const close = () => { dialog.current?.close(); };
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const back = () => trigger.current?.focus();
    d.addEventListener("close", back);
    return () => d.removeEventListener("close", back);
  }, []);
  useEffect(() => { if (method === "code" && state !== "ok") codeInput.current?.focus(); }, [method, state]);

  const verify = async (value?: string) => {
    if (state === "busy" || state === "ok" || left <= 0) return;
    setState("busy");
    try {
      await (onVerify?.(method, value) ?? Promise.resolve());
      setState("ok");
      window.setTimeout(() => { close(); onConfirmed?.(); }, 1100);
    } catch {
      setState("wrong"); setLeft((n) => n - 1); setShake((n) => n + 1);
      if (method === "code") { setCode(""); codeInput.current?.focus(); }
    }
  };

  const tabKey = (e: React.KeyboardEvent) => {
    const n = nextTab(methods, method, e.key);
    if (n !== method) { e.preventDefault(); setMethod(n); setState("idle"); document.getElementById(`${id}-tab-${n}`)?.focus(); }
  };

  const message = state === "wrong" ? (method === "passkey" ? "That passkey didn't match this account." : method === "code" ? "That code didn't work." : "That password isn't right.") + " " + triesLeft(left) : "";

  return (
    <div className={`cacc cacc--${theme} ${className}`}>
      <button ref={trigger} type="button" className="cacc__trigger" onClick={open} aria-haspopup="dialog">{triggerLabel ?? `${action.verb} ${action.target}`}</button>

      <dialog ref={dialog} className="cacc__dialog" aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`}>
        {state === "ok" ? (
          <div className="cacc__ok" role="status">
            <span><svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="m9.5 17.5 5 5L25 12" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <h2 id={`${id}-t`}>Access confirmed</h2>
            <p id={`${id}-d`}>You won't be asked again for {grace}.</p>
          </div>
        ) : (
          <>
            <header className="cacc__head">
              <span className="cacc__lock"><Lock /></span>
              <div>
                <h2 id={`${id}-t`}>Confirm access</h2>
                <p className="cacc__as">Signed in as <span className="cacc__who"><i aria-hidden="true">{account.initials ?? account.handle.replace(/^@/, "")[0]?.toUpperCase()}</i>@{account.handle.replace(/^@/, "")}</span></p>
              </div>
              <button type="button" className="cacc__x" onClick={close} aria-label="Cancel"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></button>
            </header>
            <p id={`${id}-d`} className="cacc__what"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8 15 14H1Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 6.2v3.4M8 11.6v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg><span>You're about to <b>{action.verb.toLowerCase()} <code>{action.target}</code></b>. This can't be undone.</span></p>

            <div className="cacc__tabs" role="tablist" aria-label="Ways to confirm">
              {methods.map((m) => (
                <button key={m} id={`${id}-tab-${m}`} type="button" role="tab" aria-selected={method === m} aria-controls={`${id}-panel`} tabIndex={method === m ? 0 : -1}
                  className="cacc__tab" onClick={() => { setMethod(m); setState("idle"); }} onKeyDown={tabKey}>{METHOD_LABEL[m]}</button>
              ))}
            </div>

            <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${method}`} className="cacc__panel" key={method}>
              {method === "passkey" && (
                <div className="cacc__passkey">
                  <svg className={`cacc__print ${state === "busy" ? "cacc__print--reading" : ""}`} width="72" height="72" viewBox="0 0 24 24" aria-hidden="true">
                    {RIDGES.map((d, i) => <path key={i} d={d} pathLength={1} style={{ animationDelay: `${i * 70}ms` }} />)}
                  </svg>
                  <p>Use the passkey saved on this device — Touch ID, Windows Hello or your phone.</p>
                  <button type="button" className="cacc__primary" onClick={() => verify()} disabled={state === "busy" || left <= 0}>{state === "busy" ? "Waiting for your device…" : "Use passkey"}</button>
                </div>
              )}
              {method === "code" && (
                <div className="cacc__code">
                  <label htmlFor={`${id}-code`}>Enter the 6-digit code from your authenticator app</label>
                  <div className="cacc__cells" key={shake} data-shake={state === "wrong" ? "" : undefined}>
                    <input ref={codeInput} id={`${id}-code`} inputMode="numeric" autoComplete="one-time-code" value={code} maxLength={6} disabled={state === "busy" || left <= 0}
                      aria-invalid={state === "wrong" || undefined} aria-describedby={`${id}-msg`}
                      onChange={(e) => { const v = digits(e.target.value); setCode(v); if (state === "wrong") setState("idle"); if (v.length === 6) verify(v); }} />
                    {Array.from({ length: 6 }, (_, i) => <span key={i} aria-hidden="true" className={i === code.length && state !== "busy" ? "at" : code[i] ? "set" : ""}>{code[i] ?? ""}</span>)}
                  </div>
                </div>
              )}
              {method === "password" && (
                <form className="cacc__pw" onSubmit={(e) => { e.preventDefault(); if (password) verify(password); }}>
                  <label htmlFor={`${id}-pw`}>Password</label>
                  <input id={`${id}-pw`} type="password" autoComplete="current-password" value={password} autoFocus disabled={state === "busy" || left <= 0}
                    aria-invalid={state === "wrong" || undefined} aria-describedby={`${id}-msg`} onChange={(e) => { setPassword(e.target.value); if (state === "wrong") setState("idle"); }} />
                  <button type="submit" className="cacc__primary" disabled={!password || state === "busy" || left <= 0}>{state === "busy" ? "Checking…" : "Confirm"}</button>
                </form>
              )}
              <p id={`${id}-msg`} className="cacc__msg" role={state === "wrong" ? "alert" : undefined}>{message}</p>
            </div>

            <footer className="cacc__foot">
              <span>You won't be asked again for {grace}.</span>
              <button type="button" onClick={close}>Cancel</button>
            </footer>
          </>
        )}
      </dialog>
    </div>
  );
}

export default ConfirmAccess;
