"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import "./invite-join.css";

/**
 * Invite Join
 * An invitation that shows you the room before you walk in. The team sits
 * as a cluster of faces around the person who invited you. Accept, choose
 * a name and password, and your face flies up into the cluster — right
 * beside theirs — while everyone else shuffles out on springs to make room.
 */

export type Member = { name: string; hue: number };
type Props = {
  team: string;
  inviter: Member;
  members: Member[];
  /** People not drawn, shown as "+N". */
  more?: number;
  email: string;
  onJoin?: (name: string, password: string) => Promise<void>;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const GOLD = 137.508 * (Math.PI / 180);

/** Phyllotaxis: slot 0 in the middle, each next one a golden angle round and a little further out. */
function slot(i: number, gap = 31) {
  if (i === 0) return { x: 0, y: 0 };
  // Offset so the first ring clears the larger centre face.
  const r = gap * Math.sqrt(i + 2.2);
  return { x: Math.cos(i * GOLD) * r * 1.42, y: Math.sin(i * GOLD) * r * 0.84 };
}

export function InviteJoin({ team, inviter, members, more = 0, email, onJoin = () => new Promise((r) => setTimeout(r, 700)), theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId();
  const [step, setStep] = useState<"invite" | "form" | "joined" | "declined">("invite");
  const [name, setName] = useState(() => email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
  const [pw, setPw] = useState("");
  const [errs, setErrs] = useState<{ name?: string; pw?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const joined = step === "joined";
  const me: Member = { name: name.trim() || "You", hue: 212 };

  useEffect(() => {
    if (step === "form") window.setTimeout(() => nameRef.current?.focus(), 60);
    if (step === "joined" || step === "declined") headRef.current?.focus();
  }, [step]);

  // Everyone in order: the inviter at the centre, you beside them once you've joined, then the rest.
  const people = [inviter, ...(joined ? [me] : []), ...members];

  const join = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errs = {};
    if (name.trim().length < 2) next.name = "Add the name your team will see.";
    if (pw.length < 10) next.pw = "Use at least 10 characters.";
    setErrs(next);
    if (next.name || next.pw) return;
    setBusy(true);
    try { await onJoin(name.trim(), pw); setStep("joined"); } catch { setErrs({ form: "We couldn’t add you just now. Try again." }); }
    setBusy(false);
  };

  return (
    <section className={`ij ij--${theme} ${className}`} data-motion={motion} data-step={step} aria-labelledby={`${id}-h`}>
      <div className="ij__cluster" role="img" aria-label={`${team}: ${people.map((p) => p.name).join(", ")}${more ? ` and ${more} more` : ""}`}>
        {people.map((p, i) => {
          const s = slot(i);
          const mine = joined && i === 1;
          return (
            <span
              key={p.name + (mine ? "-me" : "")}
              className="ij__face"
              data-lead={i === 0 || undefined}
              data-me={mine || undefined}
              style={{ ["--h" as string]: p.hue, ["--x" as string]: `${s.x}px`, ["--y" as string]: `${s.y}px`, ["--i" as string]: i }}
              aria-hidden="true"
            >
              {initials(p.name)}
            </span>
          );
        })}
        {more > 0 && (() => {
          const s = slot(people.length);
          return (
            <span className="ij__face ij__more" style={{ ["--x" as string]: `${s.x}px`, ["--y" as string]: `${s.y}px`, ["--i" as string]: people.length }} aria-hidden="true">
              +{more}
            </span>
          );
        })()}
      </div>

      {step === "invite" && (
        <div className="ij__body">
          <h2 id={`${id}-h`} className="ij__h">
            {inviter.name} invited you to join <b>{team}</b>
          </h2>
          <p className="ij__p">{members.length + 1 + more} people · sent to {email}</p>
          <div className="ij__actions">
            <button type="button" className="ij__btn" onClick={() => setStep("form")}>Accept invitation</button>
            <button type="button" className="ij__link" onClick={() => setStep("declined")}>Decline</button>
          </div>
        </div>
      )}

      {step === "form" && (
        <form className="ij__body" onSubmit={join} noValidate>
          <h2 id={`${id}-h`} className="ij__h">Join {team}</h2>
          <p className="ij__p">You’ll sign in with <b>{email}</b>.</p>
          <label htmlFor={`${id}-n`} className="ij__label">Your name</label>
          <input ref={nameRef} id={`${id}-n`} className="ij__input" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); setErrs((x) => ({ ...x, name: undefined })); }} aria-invalid={!!errs.name} aria-describedby={errs.name ? `${id}-ne` : undefined} />
          {errs.name && <p id={`${id}-ne`} className="ij__err">{errs.name}</p>}
          <label htmlFor={`${id}-p`} className="ij__label">Choose a password</label>
          <input id={`${id}-p`} className="ij__input" type="password" autoComplete="new-password" value={pw} onChange={(e) => { setPw(e.target.value); setErrs((x) => ({ ...x, pw: undefined })); }} aria-invalid={!!errs.pw} aria-describedby={errs.pw ? `${id}-pe` : `${id}-ph`} />
          {errs.pw ? <p id={`${id}-pe`} className="ij__err">{errs.pw}</p> : <p id={`${id}-ph`} className="ij__hint">At least 10 characters.</p>}
          {errs.form && <p className="ij__err" role="alert">{errs.form}</p>}
          <div className="ij__actions">
            <button type="submit" className="ij__btn" disabled={busy}>{busy ? "Joining…" : `Join ${team}`}</button>
            <button type="button" className="ij__link" onClick={() => setStep("invite")}>Back</button>
          </div>
        </form>
      )}

      {step === "joined" && (
        <div className="ij__body ij__done">
          <h2 id={`${id}-h`} ref={headRef} tabIndex={-1} className="ij__h">You’re in, {name.trim().split(" ")[0]}.</h2>
          <p className="ij__p">{inviter.name.split(" ")[0]} and the rest of {team} can see you now.</p>
          <div className="ij__actions">
            <a href="#" className="ij__btn" onClick={(e) => e.preventDefault()}>Open {team} →</a>
          </div>
        </div>
      )}

      {step === "declined" && (
        <div className="ij__body">
          <h2 id={`${id}-h`} ref={headRef} tabIndex={-1} className="ij__h">Invitation declined</h2>
          <p className="ij__p">We won’t tell {inviter.name.split(" ")[0]}. The link stays valid for 7 days if you change your mind.</p>
          <div className="ij__actions">
            <button type="button" className="ij__link" onClick={() => setStep("invite")}>Undo</button>
          </div>
        </div>
      )}
      <p className="ij__sr" role="status" aria-live="polite">{joined ? `You joined ${team}.` : ""}</p>
    </section>
  );
}
