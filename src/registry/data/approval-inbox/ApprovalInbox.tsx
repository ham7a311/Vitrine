"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import "./approval-inbox.css";

export type ApprovalRequest = {
  id: string;
  kind: "card" | "reimbursement" | "limit";
  requester: string;
  team?: string;
  /** Minor units. */
  amount: number;
  title: string;
  note?: string;
  /** ISO timestamp. */
  submitted: string;
  /** Policy notes worth a second look, e.g. "Over the travel limit". */
  flags?: string[];
};
export type Decision = "approve" | "decline";
export type ApprovalInboxProps = {
  requests: ApprovalRequest[];
  /** Called after the undo window closes; reject to return the request to the inbox. */
  onDecide: (id: string, decision: Decision, note?: string) => Promise<void>;
  undoMs?: number;
  currency?: string;
  locale?: string;
  theme?: "dark" | "light";
  className?: string;
};

type Pending = { request: ApprovalRequest; decision: Decision; note?: string; timer: ReturnType<typeof setTimeout> };
const KIND = { card: "New card", reimbursement: "Reimbursement", limit: "Limit increase" } as const;
const initials = (s: string) => s.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

/**
 * Approval Inbox
 * Requests waiting on you, one at a time. A or D decides; the decision waits
 * a few seconds behind an Undo before it's sent, and if sending fails the
 * request comes back with the reason.
 */
export function ApprovalInbox({ requests, onDecide, undoMs = 5000, currency = "USD", locale, theme = "dark", className = "" }: ApprovalInboxProps) {
  const id = useId();
  const [queue, setQueue] = useState(requests);
  const [selected, setSelected] = useState(requests[0]?.id ?? null);
  const [declining, setDeclining] = useState(false);
  const [note, setNote] = useState("");
  const [pending, setPending] = useState<Pending | null>(null);
  const [message, setMessage] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const pendingRef = useRef<Pending | null>(null);
  const listRefs = useRef(new Map<string, HTMLButtonElement>());
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const money = new Intl.NumberFormat(locale, { style: "currency", currency });
  const rel = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); }, []);

  const current = queue.find((r) => r.id === selected) ?? null;
  const ago = (iso: string) => {
    if (now === null) return "";
    const mins = Math.round((Date.parse(iso) - now) / 60000);
    return Math.abs(mins) < 60 ? rel.format(mins, "minute") : Math.abs(mins) < 1440 ? rel.format(Math.round(mins / 60), "hour") : rel.format(Math.round(mins / 1440), "day");
  };

  // The latest callback, so an inline function doesn't re-run the unmount effect below.
  const decideRef = useRef(onDecide);
  decideRef.current = onDecide;
  // Send whatever is waiting if the component goes away.
  useEffect(() => () => { const p = pendingRef.current; if (p) { clearTimeout(p.timer); decideRef.current(p.request.id, p.decision, p.note).catch(() => {}); } }, []);

  const commit = async (p: Pending) => {
    pendingRef.current = null;
    setPending(null);
    try { await decideRef.current(p.request.id, p.decision, p.note); }
    catch {
      setQueue((q) => [p.request, ...q.filter((r) => r.id !== p.request.id)]);
      setSelected(p.request.id);
      setMessage(`Couldn't ${p.decision} ${p.request.requester}'s request. It's back at the top of your inbox.`);
    }
  };

  const decide = (decision: Decision) => {
    if (!current) return;
    if (pendingRef.current) { clearTimeout(pendingRef.current.timer); commit(pendingRef.current); }
    const index = queue.findIndex((r) => r.id === current.id);
    const rest = queue.filter((r) => r.id !== current.id);
    const next = rest[Math.min(index, rest.length - 1)] ?? null;
    const p: Pending = { request: current, decision, note: decision === "decline" ? note.trim() || undefined : undefined, timer: setTimeout(() => commit(p), undoMs) };
    pendingRef.current = p;
    setPending(p);
    setQueue(rest);
    setSelected(next?.id ?? null);
    setDeclining(false); setNote("");
    setMessage(`${decision === "approve" ? "Approved" : "Declined"} ${current.requester}'s ${KIND[current.kind].toLowerCase()}. Undo is available for ${Math.round(undoMs / 1000)} seconds.`);
    requestAnimationFrame(() => (next ? listRefs.current.get(next.id) : null)?.focus());
  };
  const undo = () => {
    const p = pendingRef.current;
    if (!p) return;
    clearTimeout(p.timer);
    pendingRef.current = null;
    setPending(null);
    setQueue((q) => [p.request, ...q]);
    setSelected(p.request.id);
    setMessage(`Undone. ${p.request.requester}'s request is back.`);
    requestAnimationFrame(() => listRefs.current.get(p.request.id)?.focus());
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("textarea, input")) return;
    const i = queue.findIndex((r) => r.id === selected);
    if (e.key === "j" || e.key === "k") {
      e.preventDefault();
      const next = queue[Math.max(0, Math.min(queue.length - 1, i + (e.key === "j" ? 1 : -1)))];
      if (next) { setSelected(next.id); setDeclining(false); listRefs.current.get(next.id)?.focus(); }
    } else if (e.key === "a" && current && !declining) { e.preventDefault(); decide("approve"); }
    else if (e.key === "d" && current && !declining) { e.preventDefault(); setDeclining(true); }
    else if (e.key === "z" && pending) { e.preventDefault(); undo(); }
  };

  return (
    <div className={`apinb apinb--${theme} ${className}`} onKeyDown={onKey} data-detail={showDetail || undefined}>
      <div className="apinb__panes">
      <section className="apinb__list" aria-labelledby={`${id}-inbox`}>
        <header className="apinb__list-head">
          <h3 id={`${id}-inbox`}>Waiting on you</h3>
          <span className="apinb__count">{queue.length}</span>
        </header>
        {queue.length === 0 ? (
          <p className="apinb__clear">All caught up. New requests will appear here.</p>
        ) : (
          <ul>
            {queue.map((r) => (
              <li key={r.id}>
                <button
                  ref={(el) => { if (el) listRefs.current.set(r.id, el); else listRefs.current.delete(r.id); }}
                  type="button" className="apinb__item" aria-current={r.id === selected ? "true" : undefined}
                  onClick={() => { setSelected(r.id); setDeclining(false); setShowDetail(true); requestAnimationFrame(() => detailHeading.current?.focus()); }}
                >
                  <span className="apinb__avatar" aria-hidden="true">{initials(r.requester)}</span>
                  <span className="apinb__item-main">
                    <span className="apinb__item-who">{r.requester}</span>
                    <span className="apinb__item-what">{KIND[r.kind]} · {r.title}</span>
                  </span>
                  <span className="apinb__item-side">
                    <span className="apinb__item-amount">{money.format(r.amount / 100)}</span>
                    {r.flags?.length ? <span className="apinb__flag-dot" aria-label={`${r.flags.length} policy ${r.flags.length === 1 ? "note" : "notes"}`} /> : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="apinb__keys" aria-hidden="true"><kbd>J</kbd><kbd>K</kbd> move · <kbd>A</kbd> approve · <kbd>D</kbd> decline · <kbd>Z</kbd> undo</p>
      </section>

      <section className="apinb__detail" aria-labelledby={`${id}-detail`}>
        {current ? (
          <>
            <button type="button" className="apinb__back" onClick={() => { setShowDetail(false); requestAnimationFrame(() => listRefs.current.get(current.id)?.focus()); }}>← All requests</button>
            <p className="apinb__kind">{KIND[current.kind]}{current.team ? ` · ${current.team}` : ""}</p>
            <h3 id={`${id}-detail`} ref={detailHeading} tabIndex={-1} className="apinb__title">{current.title}</h3>
            <p className="apinb__amount">{money.format(current.amount / 100)}</p>
            <p className="apinb__by"><span className="apinb__avatar" aria-hidden="true">{initials(current.requester)}</span>{current.requester}<span>· {ago(current.submitted)}</span></p>
            {current.note && <blockquote className="apinb__note">{current.note}</blockquote>}
            {current.flags?.length ? (
              <ul className="apinb__flags" aria-label="Policy notes">{current.flags.map((f) => <li key={f}>{f}</li>)}</ul>
            ) : null}

            {declining ? (
              <div className="apinb__decline">
                <label htmlFor={`${id}-why`}>Tell {current.requester.split(" ")[0]} why <em>optional</em></label>
                <textarea id={`${id}-why`} autoFocus rows={2} value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); setDeclining(false); } if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) decide("decline"); }} />
                <div className="apinb__actions">
                  <button type="button" className="apinb__ghost" onClick={() => setDeclining(false)}>Cancel</button>
                  <button type="button" className="apinb__decline-btn" onClick={() => decide("decline")}>Decline request</button>
                </div>
              </div>
            ) : (
              <div className="apinb__actions">
                <button type="button" className="apinb__ghost" aria-keyshortcuts="d" onClick={() => setDeclining(true)}>Decline</button>
                <button type="button" className="apinb__approve" aria-keyshortcuts="a" onClick={() => decide("approve")}>Approve</button>
              </div>
            )}
          </>
        ) : (
          <p className="apinb__clear apinb__clear--detail">Nothing selected.</p>
        )}
      </section>
      </div>

      {pending && (
        <div className="apinb__toast">
          <span>{pending.decision === "approve" ? "Approved" : "Declined"} · {pending.request.requester}</span>
          <button type="button" onClick={undo}>Undo</button>
          <span className="apinb__toast-bar" style={{ animationDuration: `${undoMs}ms` }} aria-hidden="true" />
        </div>
      )}
      <p className="apinb__sr" aria-live="polite">{message}</p>
    </div>
  );
}
