"use client";
import { useEffect, useId, useRef, useState } from "react";
import { addBusinessDays } from "./business-days";
import "./transfer-composer.css";

export type TransferAccount = { id: string; name: string; last4: string; balance: number };
export type TransferRecipient = { id: string; name: string; bank: string; last4: string };
export type TransferMethod = { id: string; label: string; /** Business days to arrive, fastest and slowest. */ days: [number, number]; fee: number };
export type Transfer = { from: string; to: string; method: string; amount: number; fee: number; memo: string; arrives: [string, string] };
export type TransferComposerProps = {
  accounts: TransferAccount[];
  recipients: TransferRecipient[];
  methods?: TransferMethod[];
  /** Submit the transfer; resolve with your reference, reject to stay on review with the reason. */
  onSend: (transfer: Transfer) => Promise<{ reference: string }>;
  /** Today's date (YYYY-MM-DD) in the bank's time zone. */
  today: string;
  /** Non-business days, 0 = Sunday. */
  weekend?: number[];
  currency?: string;
  locale?: string;
  theme?: "dark" | "light";
  className?: string;
};

const DEFAULT_METHODS: TransferMethod[] = [
  { id: "ach", label: "ACH", days: [1, 3], fee: 0 },
  { id: "wire", label: "Wire", days: [0, 0], fee: 2_500 },
];

/**
 * Transfer Composer
 * Send money in three honest steps: the amount and where it goes, a review
 * that says what it costs and when it lands, then a receipt with a reference.
 */
export function TransferComposer({ accounts, recipients, methods = DEFAULT_METHODS, onSend, today, weekend = [0, 6], currency = "USD", locale, theme = "dark", className = "" }: TransferComposerProps) {
  const id = useId();
  const [step, setStep] = useState<"compose" | "review" | "sent">("compose");
  const [from, setFrom] = useState(accounts[0]?.id);
  const [to, setTo] = useState(recipients[0]?.id);
  const [method, setMethod] = useState(methods[0]?.id);
  const [raw, setRaw] = useState("");
  const [memo, setMemo] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const shownStep = useRef(step);

  const money = new Intl.NumberFormat(locale, { style: "currency", currency });
  const plain = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const day = new Intl.DateTimeFormat(locale, { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

  // Move focus to the new step's heading only when the step really changes (not on mount).
  useEffect(() => { if (shownStep.current !== step) { shownStep.current = step; heading.current?.focus(); } }, [step]);

  const account = accounts.find((a) => a.id === from)!;
  const recipient = recipients.find((r) => r.id === to)!;
  const m = methods.find((x) => x.id === method)!;
  const amount = Math.round(Number(raw.replace(/[^\d.]/g, "") || 0) * 100);
  const total = amount + m.fee;
  const arrives: [string, string] = [addBusinessDays(today, m.days[0], weekend), addBusinessDays(today, m.days[1], weekend)];
  const when = arrives[0] === arrives[1] ? (arrives[0] === today ? "today" : day.format(new Date(`${arrives[0]}T12:00:00Z`))) : `${day.format(new Date(`${arrives[0]}T12:00:00Z`))} – ${day.format(new Date(`${arrives[1]}T12:00:00Z`))}`;
  const problem = !amount ? "" : total > account.balance ? `That's more than the ${money.format(account.balance / 100)} available${m.fee ? " after the fee" : ""}.` : "";
  const ready = amount > 0 && !problem;

  const typed = (v: string) => {
    // Keep digits and one decimal point, two places at most.
    const clean = v.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1").replace(/^(\d*\.\d{0,2}).*$/, "$1");
    const [whole, frac] = clean.split(".");
    setRaw(whole ? `${plain.format(Number(whole))}${frac !== undefined ? `.${frac}` : ""}` : frac !== undefined ? `0.${frac}` : "");
  };
  const send = async () => {
    if (sending || !ready) return;
    setSending(true); setError("");
    try {
      const res = await onSend({ from, to, method, amount, fee: m.fee, memo: memo.trim(), arrives });
      setReference(res.reference);
      setStep("sent");
    } catch (e) {
      setError((e as Error)?.message || "The transfer wasn't sent. Nothing left your account.");
    } finally { setSending(false); }
  };
  const again = () => { setRaw(""); setMemo(""); setReference(""); setError(""); setStep("compose"); requestAnimationFrame(() => amountRef.current?.focus()); };

  return (
    <section className={`xfer xfer--${theme} ${className}`} aria-labelledby={`${id}-h`} data-step={step}>
      <ol className="xfer__steps" aria-label="Progress">
        {["Details", "Review", "Sent"].map((s, i) => {
          const at = ["compose", "review", "sent"].indexOf(step);
          return <li key={s} data-state={i < at ? "done" : i === at ? "current" : "next"} aria-current={i === at ? "step" : undefined}>{s}</li>;
        })}
      </ol>

      {step === "compose" && (
        <form className="xfer__body" onSubmit={(e) => { e.preventDefault(); if (ready) setStep("review"); }} noValidate>
          <h3 id={`${id}-h`} ref={heading} tabIndex={-1} className="xfer__title">Send money</h3>
          <div className="xfer__amount" data-problem={!!problem || undefined}>
            <label htmlFor={`${id}-amt`} className="xfer__sr">Amount in {currency}</label>
            <span aria-hidden="true">{money.formatToParts(0).find((p) => p.type === "currency")?.value}</span>
            <input ref={amountRef} id={`${id}-amt`} inputMode="decimal" autoComplete="off" placeholder="0.00" value={raw} onChange={(e) => typed(e.target.value)} aria-invalid={!!problem || undefined} aria-describedby={`${id}-avail`} />
          </div>
          <p id={`${id}-avail`} className="xfer__avail" data-problem={!!problem || undefined}>{problem || `${money.format(account.balance / 100)} available in ${account.name}`}</p>

          <div className="xfer__grid">
            <label className="xfer__field"><span>From</span>
              <select value={from} onChange={(e) => setFrom(e.target.value)}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ••{a.last4} · {money.format(a.balance / 100)}</option>)}</select>
            </label>
            <label className="xfer__field"><span>To</span>
              <select value={to} onChange={(e) => setTo(e.target.value)}>{recipients.map((r) => <option key={r.id} value={r.id}>{r.name} · {r.bank} ••{r.last4}</option>)}</select>
            </label>
          </div>

          <fieldset className="xfer__methods">
            <legend>How it travels</legend>
            {methods.map((x) => {
              const a = addBusinessDays(today, x.days[0], weekend), b = addBusinessDays(today, x.days[1], weekend);
              return (
                <label key={x.id} data-checked={method === x.id || undefined}>
                  <input type="radio" name={`${id}-m`} value={x.id} checked={method === x.id} onChange={() => setMethod(x.id)} />
                  <span className="xfer__method-name">{x.label}</span>
                  <span className="xfer__method-sub">{x.days[1] === 0 ? "Arrives today" : `${x.days[0]}–${x.days[1]} business days`} · {x.fee ? money.format(x.fee / 100) : "Free"}</span>
                  <span className="xfer__sr">{`, arrives ${a === b ? day.format(new Date(`${a}T12:00:00Z`)) : `between ${day.format(new Date(`${a}T12:00:00Z`))} and ${day.format(new Date(`${b}T12:00:00Z`))}`}`}</span>
                </label>
              );
            })}
          </fieldset>

          <label className="xfer__field"><span>Memo <em>optional, the recipient sees it</em></span>
            <input value={memo} maxLength={80} onChange={(e) => setMemo(e.target.value)} placeholder="Invoice 2026-114" />
          </label>

          <button type="submit" className="xfer__primary" disabled={!ready}>Review transfer</button>
        </form>
      )}

      {step === "review" && (
        <div className="xfer__body">
          <h3 id={`${id}-h`} ref={heading} tabIndex={-1} className="xfer__title">Check the details</h3>
          <p className="xfer__big">{money.format(amount / 100)}</p>
          <dl className="xfer__review">
            <div><dt>To</dt><dd>{recipient.name}<span>{recipient.bank} ••{recipient.last4}</span></dd></div>
            <div><dt>From</dt><dd>{account.name}<span>••{account.last4}</span></dd></div>
            <div><dt>Method</dt><dd>{m.label}</dd></div>
            <div><dt>Arrives</dt><dd>{when}</dd></div>
            <div><dt>Fee</dt><dd>{m.fee ? money.format(m.fee / 100) : "Free"}</dd></div>
            {memo.trim() && <div><dt>Memo</dt><dd>{memo.trim()}</dd></div>}
            <div className="xfer__total"><dt>Total from {account.name}</dt><dd>{money.format(total / 100)}</dd></div>
          </dl>
          {error && <p className="xfer__error" role="alert">{error}</p>}
          <div className="xfer__actions">
            <button type="button" className="xfer__ghost" onClick={() => setStep("compose")} disabled={sending}>Edit</button>
            <button type="button" className="xfer__primary" onClick={send} disabled={sending}>{sending ? "Sending…" : `Send ${money.format(amount / 100)}`}</button>
          </div>
        </div>
      )}

      {step === "sent" && (
        <div className="xfer__body xfer__body--sent">
          <span className="xfer__tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5.5 12.5l4.2 4.2L18.5 8" /></svg></span>
          <h3 id={`${id}-h`} ref={heading} tabIndex={-1} className="xfer__title">{money.format(amount / 100)} is on its way</h3>
          <p className="xfer__lede">{recipient.name} should see it {when === "today" ? "today" : `by ${day.format(new Date(`${arrives[1]}T12:00:00Z`))}`}.</p>
          <p className="xfer__ref">Reference <code>{reference}</code></p>
          <button type="button" className="xfer__ghost" onClick={again}>Make another transfer</button>
        </div>
      )}
    </section>
  );
}
