"use client";
import { useRef, useState } from "react";
import { ago, remove, restore, type Device, type Session } from "./sessions";
import "./session-ledger.css";

export type SessionLedgerProps = {
  sessions: Session[];
  /** A recent sign-in to ask about; it should also be in `sessions`. */
  alert?: { sessionId: string };
  /** Timestamp to measure "ago" from (pass it from the server to avoid hydration drift). */
  now: number;
  /** Sign these sessions out; reject to put them back. */
  onRevoke?: (ids: string[]) => Promise<void>;
  /** The person says the alert wasn't them. */
  onSecure?: () => Promise<void> | void;
  theme?: "night" | "paper";
  className?: string;
};

const ICON: Record<Device, string> = {
  laptop: "M5 6.5h14v9H5zM3 18.5h18",
  desktop: "M3.5 4.5h17v11h-17zM9 19.5h6M12 15.5v4",
  phone: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
  tablet: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
};
const DeviceIcon = ({ d }: { d: Device }) => <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d={ICON[d]} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg>;

/**
 * Session Ledger
 * Every device signed in to your account, with the one you're on marked. Sign any of them out
 * — each asks once, inline — or all the others at once; a new sign-in waits at the top for you
 * to say whether it was you.
 */
export function SessionLedger({ sessions: initial, alert, now, onRevoke, onSecure, theme = "night", className = "" }: SessionLedgerProps) {
  const [list, setListState] = useState(initial);
  const current = useRef(initial);
  const setList = (next: Session[]) => { current.current = next; setListState(next); };
  const [asking, setAsking] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [askAll, setAskAll] = useState(false);
  const [flag, setFlag] = useState<"open" | "mine" | "secured">(alert ? "open" : "mine");
  const [msg, setMsg] = useState("");

  const others = list.filter((s) => !s.current);
  const flagged = alert ? list.find((s) => s.id === alert.sessionId) ?? initial.find((s) => s.id === alert.sessionId) : undefined;

  const revoke = async (ids: string[], label: string) => {
    setAsking(null); setAskAll(false);
    setErrors((e) => { const n = { ...e }; ids.forEach((i) => delete n[i]); return n; });
    setLeaving((l) => [...l, ...ids]);
    await new Promise((r) => setTimeout(r, 280)); // let the rows fold away
    const { kept, removed } = remove(current.current, ids);
    setList(kept);
    setLeaving((l) => l.filter((x) => !ids.includes(x)));
    setMsg(`Signed out ${label}.`);
    try { await (onRevoke?.(ids) ?? Promise.resolve()); }
    catch {
      setList(restore(current.current, removed));
      setErrors((e) => ({ ...e, ...Object.fromEntries(ids.map((i) => [i, "Couldn't sign this device out. Try again."])) }));
      setMsg(`Couldn't sign out ${label}. ${ids.length > 1 ? "They're" : "It's"} back in the list.`);
    }
  };

  const secure = async () => {
    setFlag("secured");
    if (flagged && list.some((s) => s.id === flagged.id)) await revoke([flagged.id], `${flagged.name}`);
    await onSecure?.();
    setMsg("That device is signed out. Change your password next.");
  };

  return (
    <section className={`sled sled--${theme} ${className}`} aria-labelledby="sled-title">
      <header className="sled__head">
        <div>
          <h2 id="sled-title">Where you're signed in</h2>
          <p>{list.length} {list.length === 1 ? "device" : "devices"} · review anything you don't recognise.</p>
        </div>
        {others.length > 0 && !askAll && <button type="button" className="sled__ghost" onClick={() => setAskAll(true)}>Sign out all others</button>}
        {askAll && (
          <div className="sled__confirm" role="group" aria-label="Confirm sign out of all other devices">
            <span>Sign out {others.length} other {others.length === 1 ? "device" : "devices"}?</span>
            <button type="button" className="sled__ghost" onClick={() => setAskAll(false)}>Cancel</button>
            <button type="button" className="sled__danger" autoFocus onClick={() => revoke(others.map((s) => s.id), `${others.length} devices`)}>Sign out all</button>
          </div>
        )}
      </header>

      {flagged && flag !== "mine" && (
        <div className={`sled__alert ${flag === "secured" ? "sled__alert--done" : ""}`} role={flag === "open" ? "alert" : "status"}>
          <span className="sled__shield" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 3 8.3 7 9.8 4-1.5 7-5.3 7-9.8V6Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d={flag === "secured" ? "m9 12 2.2 2.2L15.5 10" : "M12 8v4.5M12 15.5v.2"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg></span>
          {flag === "open" ? (
            <>
              <div className="sled__alert-text"><b>New sign-in on {flagged.name}</b><span>{flagged.browser} · {flagged.place} · {ago(flagged.lastActive, now)}</span></div>
              <div className="sled__alert-actions">
                <button type="button" className="sled__ghost" onClick={() => { setFlag("mine"); setMsg("Thanks. We'll remember that device."); }}>This was me</button>
                <button type="button" className="sled__danger" onClick={secure}>Secure account</button>
              </div>
            </>
          ) : (
            <div className="sled__alert-text"><b>Signed out {flagged.name}</b><span>Change your password to finish securing the account. <a href="#password">Change password</a></span></div>
          )}
        </div>
      )}

      <ul className="sled__list">
        {list.map((s) => (
          <li key={s.id} className={`sled__row ${leaving.includes(s.id) ? "sled__row--leaving" : ""}`}>
            <div className="sled__inner">
              <span className="sled__icon"><DeviceIcon d={s.device} /></span>
              <div className="sled__what">
                <b>{s.name}{s.current && <em>This device</em>}</b>
                <span>{s.browser} · {s.place}</span>
                <span className={s.current || now - s.lastActive < 120000 ? "sled__live" : ""}>{s.current ? "Active now" : ago(s.lastActive, now)}</span>
                {errors[s.id] && <span className="sled__err" role="alert">{errors[s.id]}</span>}
              </div>
              {!s.current && (asking === s.id ? (
                <div className="sled__confirm" role="group" aria-label={`Confirm sign out of ${s.name}`}>
                  <button type="button" className="sled__ghost" onClick={() => setAsking(null)}>Keep</button>
                  <button type="button" className="sled__danger" autoFocus onClick={() => revoke([s.id], s.name)}>Sign out</button>
                </div>
              ) : (
                <button type="button" className="sled__ghost" onClick={() => setAsking(s.id)} aria-label={`Sign out ${s.name}, ${s.browser}`}>Sign out</button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="sled__sr" role="status">{msg}</p>
    </section>
  );
}

export default SessionLedger;
