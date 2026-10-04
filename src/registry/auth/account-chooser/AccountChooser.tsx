"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import "./account-chooser.css";

/**
 * Account Chooser
 * "Choose an account", where the account you pick stays the same object.
 * Its avatar, name and email lift out of the list and travel up into the
 * header of the password step — one shared element, animated from where it
 * was to where it's going — while the other accounts step away. Back runs
 * it in reverse. Accounts can be removed from the device, with an undo.
 */

export type Account = { id: string; name: string; email: string; last: string; hue: number };
type View = "list" | "password" | "other" | "done";
type Props = {
  accounts: Account[];
  product?: string;
  onSignIn?: (email: string, password: string) => Promise<void>;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Identity({ a, size, refEl }: { a: Account; size: "row" | "head"; refEl?: (el: HTMLDivElement | null) => void }) {
  return (
    <div className={`ac__id ac__id--${size}`} ref={refEl} data-id={a.id}>
      <span className="ac__av" style={{ ["--h" as string]: a.hue }} aria-hidden="true">{initials(a.name)}</span>
      <span className="ac__who">
        <span className="ac__name">{a.name}</span>
        <span className="ac__email">{a.email}</span>
      </span>
    </div>
  );
}

export function AccountChooser({ accounts: initial, product = "Vitrine", onSignIn = () => new Promise((r) => setTimeout(r, 800)), theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId();
  const [accounts, setAccounts] = useState(initial);
  const [view, setView] = useState<View>("list");
  const [pick, setPick] = useState<Account | null>(null);
  const [editing, setEditing] = useState(false);
  const [removed, setRemoved] = useState<{ a: Account; at: number } | null>(null);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const idEls = useRef(new Map<string, HTMLDivElement>());
  const flip = useRef<{ id: string; rect: DOMRect } | null>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pwRef = useRef<HTMLInputElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const reduced = () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Remember where an account's identity is right now, so the next layout can animate from it. */
  const capture = (a: Account) => {
    const el = idEls.current.get(a.id);
    if (el) flip.current = { id: a.id, rect: el.getBoundingClientRect() };
  };

  // After the view changes, play the shared element from its old place to its new one.
  useLayoutEffect(() => {
    const f = flip.current;
    flip.current = null;
    if (!f || reduced()) return;
    const el = idEls.current.get(f.id);
    if (!el) return;
    const to = el.getBoundingClientRect();
    const dx = f.rect.left - to.left, dy = f.rect.top - to.top;
    const s = f.rect.height / to.height;
    el.animate(
      [{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, transformOrigin: "0 0" }, { transform: "none", transformOrigin: "0 0" }],
      { duration: 460, easing: "cubic-bezier(0.3, 1.15, 0.4, 1)" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    if (view === "password") window.setTimeout(() => pwRef.current?.focus(), reduced() ? 0 : 380);
    if (view === "done") headRef.current?.focus();
    if (view === "list" && pick) rowRefs.current[accounts.findIndex((a) => a.id === pick.id)]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    if (!removed) return;
    const t = window.setTimeout(() => setRemoved(null), 6000);
    return () => clearTimeout(t);
  }, [removed]);

  const choose = (a: Account) => {
    if (editing) return remove(a);
    setLeaving(a.id);
    // The others step away first; then the chosen one travels.
    window.setTimeout(() => {
      capture(a);
      setPick(a);
      setPw("");
      setErr("");
      setView("password");
      setLeaving(null);
    }, reduced() ? 0 : 170);
  };
  const back = () => {
    if (pick) capture(pick);
    setView("list");
  };
  const remove = (a: Account) => {
    const at = accounts.findIndex((x) => x.id === a.id);
    setAccounts((xs) => xs.filter((x) => x.id !== a.id));
    setRemoved({ a, at });
    if (accounts.length <= 1) setEditing(false);
  };
  const undo = () => {
    if (!removed) return;
    setAccounts((xs) => [...xs.slice(0, removed.at), removed.a, ...xs.slice(removed.at)]);
    setRemoved(null);
  };

  const onRowKey = (e: KeyboardEvent, i: number) => {
    const n = accounts.length;
    const go = e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (go < 0) return;
    e.preventDefault();
    rowRefs.current[go]?.focus();
  };

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!pick) return;
    if (pw.length < 8) { setErr("Enter your password — it’s at least 8 characters."); return; }
    setErr("");
    setBusy(true);
    try { await onSignIn(pick.email, pw); setView("done"); } catch { setErr("That password isn’t right. Try again, or reset it."); }
    setBusy(false);
  };
  const other = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(newEmail.trim())) { setErr("Enter an email address, like you@tryvitrine.dev."); return; }
    const email = newEmail.trim();
    const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const a: Account = { id: `n-${email}`, name, email, last: "New on this device", hue: (email.length * 47) % 360 };
    setAccounts((xs) => [...xs, a]);
    setPick(a);
    setErr("");
    setView("password");
  };

  return (
    <section className={`ac ac--${theme} ${className}`} data-motion={motion} data-view={view} aria-labelledby={`${id}-h`}>
      <p className="ac__brand"><span aria-hidden="true">◐</span> {product}</p>

      {view === "list" && (
        <div className="ac__pane">
          <h2 id={`${id}-h`} className="ac__h">{editing ? "Remove an account" : "Choose an account"}</h2>
          <p className="ac__p">{editing ? "Removing only forgets it on this device." : `to continue to ${product}`}</p>
          <ul className="ac__list" aria-label="Accounts on this device">
            {accounts.map((a, i) => (
              <li key={a.id} className="ac__item" data-away={leaving && leaving !== a.id ? "" : undefined} style={{ ["--i" as string]: i }}>
                <button
                  ref={(el) => { rowRefs.current[i] = el; }}
                  type="button"
                  className="ac__row"
                  onClick={() => choose(a)}
                  onKeyDown={(e) => onRowKey(e, i)}
                  aria-label={editing ? `Remove ${a.name}, ${a.email}, from this device` : `${a.name}, ${a.email}, last used ${a.last}`}
                >
                  <Identity a={a} size="row" refEl={(el) => { if (el) idEls.current.set(a.id, el); }} />
                  <span className="ac__last" aria-hidden="true">{editing ? <span className="ac__x">Remove</span> : a.last}</span>
                </button>
              </li>
            ))}
          </ul>
          {!editing && (
            <button type="button" className="ac__other" onClick={() => { setNewEmail(""); setErr(""); setView("other"); }}>
              <span className="ac__plus" aria-hidden="true">+</span> Use another account
            </button>
          )}
          <div className="ac__foot">
            {accounts.length > 0 && (
              <button type="button" className="ac__link" onClick={() => setEditing((x) => !x)} aria-pressed={editing}>
                {editing ? "Done" : "Remove an account"}
              </button>
            )}
          </div>
          {removed && (
            <div className="ac__toast" role="status">
              {removed.a.name} removed from this device.
              <button type="button" onClick={undo}>Undo</button>
            </div>
          )}
        </div>
      )}

      {view === "password" && pick && (
        <form className="ac__pane" onSubmit={signIn} noValidate>
          <h2 id={`${id}-h`} className="ac__h ac__h--small">Welcome back</h2>
          <div className="ac__chosen">
            <Identity a={pick} size="head" refEl={(el) => { if (el) idEls.current.set(pick.id, el); }} />
            <button type="button" className="ac__link" onClick={back}>Not you?</button>
          </div>
          <label htmlFor={`${id}-p`} className="ac__label">Password</label>
          <div className="ac__pw">
            <input
              ref={pwRef}
              id={`${id}-p`}
              className="ac__input"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(""); }}
              aria-invalid={!!err}
              aria-describedby={err ? `${id}-pe` : undefined}
            />
            <button type="button" className="ac__eye" onClick={() => setShow((s) => !s)} aria-pressed={show}>{show ? "Hide" : "Show"}</button>
          </div>
          {err && <p id={`${id}-pe`} className="ac__err">{err}</p>}
          <button type="submit" className="ac__btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          <div className="ac__foot ac__foot--split">
            <button type="button" className="ac__link" onClick={back}>← All accounts</button>
            <a href="#" className="ac__link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
          </div>
        </form>
      )}

      {view === "other" && (
        <form className="ac__pane" onSubmit={other} noValidate>
          <h2 id={`${id}-h`} className="ac__h">Use another account</h2>
          <p className="ac__p">Sign in with any {product} account.</p>
          <label htmlFor={`${id}-e`} className="ac__label">Email</label>
          <input id={`${id}-e`} className="ac__input" type="email" autoComplete="username" inputMode="email" autoFocus value={newEmail} onChange={(e) => { setNewEmail(e.target.value); setErr(""); }} aria-invalid={!!err} aria-describedby={err ? `${id}-ee` : undefined} placeholder="you@tryvitrine.dev" />
          {err && <p id={`${id}-ee`} className="ac__err">{err}</p>}
          <button type="submit" className="ac__btn">Continue</button>
          <div className="ac__foot"><button type="button" className="ac__link" onClick={() => { setErr(""); setView("list"); }}>← All accounts</button></div>
        </form>
      )}

      {view === "done" && pick && (
        <div className="ac__pane ac__done">
          <Identity a={pick} size="head" />
          <h2 id={`${id}-h`} ref={headRef} tabIndex={-1} className="ac__h">You’re in.</h2>
          <p className="ac__p">Signed in to {product} as {pick.email}.</p>
          <button type="button" className="ac__btn" onClick={() => { setView("list"); setPick(null); }}>Switch account</button>
        </div>
      )}
    </section>
  );
}
