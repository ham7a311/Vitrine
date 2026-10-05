"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import "./enquiry-slip.css";

/**
 * Enquiry Slip
 * A contact form set like a correspondence slip: To / From / Re / Message on
 * ruled lines, with no boxes. It tells you when to expect an answer and what time
 * it is for the person answering, validates in place, and when it is sent the
 * slip is stamped with a reference number and locks.
 */

export type EnquiryValues = { name: string; email: string; topic: string; message: string };

type Props = {
  /** Who it is going to. */
  to: { name: string; email: string };
  /** What the enquiry can be about. One is required. */
  topics: string[];
  /** IANA time zone of the recipient, for the local-time line. */
  timeZone?: string;
  /** "usually within two days" */
  replyWithin?: string;
  /** May return a promise. Throw to show the failure and keep the slip open. */
  onSend: (values: EnquiryValues) => void | Promise<void>;
  /** Prefix for the reference number on the stamp. */
  referencePrefix?: string;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

type Errors = Partial<Record<keyof EnquiryValues, string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: EnquiryValues): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Your name";
  if (!EMAIL.test(v.email.trim())) e.email = "An address I can reply to";
  if (!v.topic) e.topic = "Choose what it's about";
  if (v.message.trim().length < 20) e.message = `A little more, please (${Math.max(0, 20 - v.message.trim().length)} characters to go)`;
  return e;
}

function useLocalTime(timeZone: string) {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return t;
}

export function EnquirySlip({ to, topics, timeZone = "Asia/Muscat", replyWithin = "within two days", onSend, referencePrefix = "ES", theme = "paper", motion = "auto", className = "" }: Props) {
  const uid = useId();
  const [v, setV] = useState<EnquiryValues>({ name: "", email: "", topic: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof EnquiryValues, boolean>>>({});
  const [phase, setPhase] = useState<"open" | "sending" | "sent">("open");
  const [failed, setFailed] = useState(false);
  const [ref, setRef] = useState("");
  const [copied, setCopied] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const time = useLocalTime(timeZone);
  const locked = phase !== "open";

  const set = (k: keyof EnquiryValues, value: string) => {
    const next = { ...v, [k]: value };
    setV(next);
    if (touched[k] || errors[k]) setErrors((e) => ({ ...e, [k]: validate(next)[k] }));
  };
  const blur = (k: keyof EnquiryValues) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, [k]: validate(v)[k] }));
  };

  // The message grows with what is written, up to a limit.
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 280)}px`;
  }, [v.message]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (locked) return;
    const found = validate(v);
    setErrors(found);
    setTouched({ name: true, email: true, topic: true, message: true });
    const first = (Object.keys(found) as (keyof EnquiryValues)[])[0];
    if (first) return (document.getElementById(`${uid}-${first}`) ?? document.querySelector<HTMLElement>(`[name="${uid}-topic"]`))?.focus();
    setPhase("sending");
    setFailed(false);
    try {
      await onSend(v);
      setRef(`${referencePrefix}-${String(Math.floor(1000 + Math.random() * 9000))}`);
      setPhase("sent");
    } catch {
      setFailed(true);
      setPhase("open");
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(to.email); } catch {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const again = () => { setV({ name: "", email: "", topic: "", message: "" }); setErrors({}); setTouched({}); setPhase("open"); };
  const err = (k: keyof EnquiryValues) => errors[k];

  return (
    <form
      className={`enquiry-slip enquiry-slip--${theme} ${className}`}
      onSubmit={send}
      noValidate
      data-phase={phase}
      data-motion={motion === "reduced" ? "reduced" : undefined}
      aria-label={`Write to ${to.name}`}
    >
      <div className="enquiry-slip__row">
        <span className="enquiry-slip__label">To</span>
        <div className="enquiry-slip__to">
          <span className="enquiry-slip__to-name">{to.name}</span>
          <button type="button" className="enquiry-slip__copy" onClick={copy}>
            {copied ? "Copied" : to.email}
          </button>
        </div>
      </div>

      <div className="enquiry-slip__row" data-invalid={err("name") ? "" : undefined}>
        <label className="enquiry-slip__label" htmlFor={`${uid}-name`}>From</label>
        <div className="enquiry-slip__field">
          <input id={`${uid}-name`} autoComplete="name" placeholder="Your name" value={v.name} disabled={locked} aria-invalid={!!err("name")} aria-describedby={err("name") ? `${uid}-name-e` : undefined} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} />
          {err("name") && <p id={`${uid}-name-e`} className="enquiry-slip__error" role="alert">{err("name")}</p>}
        </div>
      </div>

      <div className="enquiry-slip__row" data-invalid={err("email") ? "" : undefined}>
        <label className="enquiry-slip__label" htmlFor={`${uid}-email`}>Reply to</label>
        <div className="enquiry-slip__field">
          <input id={`${uid}-email`} type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" value={v.email} disabled={locked} aria-invalid={!!err("email")} aria-describedby={err("email") ? `${uid}-email-e` : undefined} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} />
          {err("email") && <p id={`${uid}-email-e`} className="enquiry-slip__error" role="alert">{err("email")}</p>}
        </div>
      </div>

      <div className="enquiry-slip__row enquiry-slip__re" role="radiogroup" aria-labelledby={`${uid}-re`} aria-required="true" aria-invalid={!!err("topic")} data-invalid={err("topic") ? "" : undefined}>
        <span id={`${uid}-re`} className="enquiry-slip__label">Re</span>
        <div className="enquiry-slip__field">
          <div className="enquiry-slip__chips">
            {topics.map((t) => (
              <label key={t}>
                <input type="radio" name={`${uid}-topic`} value={t} disabled={locked} checked={v.topic === t} onChange={() => { set("topic", t); setTouched((x) => ({ ...x, topic: true })); }} />
                <span>{t}</span>
              </label>
            ))}
          </div>
          {err("topic") && <p className="enquiry-slip__error" role="alert">{err("topic")}</p>}
        </div>
      </div>

      <div className="enquiry-slip__row enquiry-slip__msg" data-invalid={err("message") ? "" : undefined}>
        <label className="enquiry-slip__label" htmlFor={`${uid}-message`}>Message</label>
        <div className="enquiry-slip__field">
          <textarea ref={area} id={`${uid}-message`} rows={4} placeholder="What are you making, and by when?" value={v.message} disabled={locked} aria-invalid={!!err("message")} aria-describedby={err("message") ? `${uid}-message-e` : undefined} onChange={(e) => set("message", e.target.value)} onBlur={() => blur("message")} />
          {err("message") && <p id={`${uid}-message-e`} className="enquiry-slip__error" role="alert">{err("message")}</p>}
        </div>
      </div>

      <div className="enquiry-slip__foot">
        <p className="enquiry-slip__note">
          Replies {replyWithin}. {time && <>It is <time>{time}</time> in {to.name.split(" ")[0]}'s city now.</>}
        </p>
        {phase !== "sent" ? (
          <button type="submit" className="enquiry-slip__send" disabled={phase === "sending"} aria-busy={phase === "sending" || undefined}>
            {phase === "sending" ? "Sending" : "Send"}
          </button>
        ) : (
          <button type="button" className="enquiry-slip__again" onClick={again}>Write another</button>
        )}
      </div>
      {failed && <p className="enquiry-slip__fail" role="alert">That didn't go through. Nothing was lost; try again, or copy the address above.</p>}

      {phase === "sent" && (
        <div className="enquiry-slip__stamp" aria-hidden="true">
          <span>Received</span>
          <b>{ref}</b>
        </div>
      )}
      <p className="enquiry-slip__sr" role="status">{phase === "sent" ? `Sent. Reference ${ref}.` : ""}</p>
    </form>
  );
}
