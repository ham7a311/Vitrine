"use client";
import { useEffect, useId, useRef, useState } from "react";
import { asText, remaining, type RecoveryCode } from "./codes";
import "./recovery-kit.css";

export type RecoveryKitProps = {
  codes: RecoveryCode[];
  account: string;
  /** When these codes were issued, in words. */
  issued: string;
  /** Make a fresh set; the old ones stop working. */
  onRegenerate?: () => Promise<RecoveryCode[]>;
  onContinue?: () => void;
  theme?: "night" | "paper";
  className?: string;
};

/**
 * Recovery Kit
 * Backup codes handled properly: copy, download or print them, see which are used, make a new
 * set (the old ones are struck through before they're replaced), and only continue once you've
 * said they're saved.
 */
export function RecoveryKit({ codes: initial, account, issued, onRegenerate, onContinue, theme = "night", className = "" }: RecoveryKitProps) {
  const id = useId();
  const [codes, setCodes] = useState(initial);
  const [when, setWhen] = useState(issued);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [asking, setAsking] = useState(false);
  const [phase, setPhase] = useState<"shown" | "striking" | "fresh">("shown");
  const [msg, setMsg] = useState("");
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const text = asText(codes, account, when);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setMsg("Codes copied."); clearTimeout(timer.current); timer.current = window.setTimeout(() => setCopied(false), 2000); }
    catch { setMsg("Couldn't copy. Select the codes and copy them yourself."); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${account.replace(/[^a-z0-9]+/gi, "-")}-recovery-codes.txt` });
    a.click(); URL.revokeObjectURL(url); setMsg("Download started.");
  };
  const print = () => {
    const w = window.open("", "_blank", "width=520,height=640");
    if (!w) { setMsg("Your browser blocked the print window. Download the codes instead."); return; }
    w.document.write(`<pre style="font:15px/1.7 ui-monospace,monospace;padding:24px">${text.replace(/[<&]/g, (c) => (c === "<" ? "&lt;" : "&amp;"))}</pre>`);
    w.document.close(); w.focus(); w.print();
  };
  const regenerate = async () => {
    setAsking(false); setPhase("striking"); setSaved(false);
    try {
      const [next] = await Promise.all([onRegenerate?.() ?? Promise.resolve(codes), new Promise((r) => setTimeout(r, 700))]);
      setCodes(next); setWhen("just now"); setPhase("fresh"); setMsg("New codes made. The old ones no longer work.");
    } catch { setPhase("shown"); setMsg("Couldn't make new codes. Your current ones still work."); }
  };

  const left = remaining(codes);
  return (
    <section className={`rkit rkit--${theme} ${className}`} aria-labelledby={`${id}-t`}>
      <header className="rkit__head">
        <span className="rkit__badge" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M14.5 3.5a6 6 0 0 0-5.7 7.9L3.5 16.7V20.5h3.8v-2h2v-2h2l1.3-1.3a6 6 0 1 0 1.9-11.7Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="16" cy="8" r="1.5" fill="currentColor" /></svg></span>
        <div>
          <h2 id={`${id}-t`}>Save your recovery codes</h2>
          <p>If you lose your phone, each code gets you in once. {left} of {codes.length} left · issued {when}.</p>
        </div>
      </header>

      <ol className={`rkit__codes rkit__codes--${phase}`} aria-label="Recovery codes" key={phase === "fresh" ? codes[0]?.code : "old"}>
        {codes.map((c, i) => (
          <li key={c.code} className={c.used ? "used" : ""} style={{ ["--i" as string]: i }}>
            <span className="rkit__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <code>{c.code}</code>
            {c.used && <span className="rkit__used">used</span>}
          </li>
        ))}
      </ol>

      <div className="rkit__actions">
        <button type="button" onClick={copy} aria-live="polite">{copied ? <><Tick />Copied</> : <><Icon d="M8 8h11v12H8zM5 16V4h11" />Copy</>}</button>
        <button type="button" onClick={download}><Icon d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" />Download</button>
        <button type="button" onClick={print}><Icon d="M7 9V4h10v5M7 17H4.5V9.5h15V17H17M7 14h10v6H7z" />Print</button>
        {!asking ? (
          <button type="button" className="rkit__regen" onClick={() => setAsking(true)} disabled={phase === "striking"}><Icon d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4" />{phase === "striking" ? "Making new codes…" : "New codes"}</button>
        ) : (
          <span className="rkit__ask" role="group" aria-label="Confirm new codes">
            <span>Old codes stop working.</span>
            <button type="button" onClick={() => setAsking(false)}>Keep these</button>
            <button type="button" className="rkit__danger" autoFocus onClick={regenerate}>Make new codes</button>
          </span>
        )}
      </div>

      <label className="rkit__check">
        <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} />
        <span aria-hidden="true"><Tick /></span>
        I've saved these codes somewhere safe
      </label>
      <button type="button" className="rkit__continue" disabled={!saved || phase === "striking"} onClick={onContinue}>Continue</button>
      <p className="rkit__sr" role="status">{msg}</p>
    </section>
  );
}

const Icon = ({ d }: { d: string }) => <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Tick = () => <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default RecoveryKit;
