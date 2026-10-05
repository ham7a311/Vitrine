"use client";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./transaction-ledger.css";

export type LedgerEntry = {
  id: string;
  /** ISO timestamp. */
  at: string;
  merchant: string;
  /** Minor units; negative for money out. */
  amount: number;
  kind: "card" | "transfer" | "fee";
  category: string;
  status: "posted" | "pending";
  card?: string;
  receipt?: boolean;
  memo?: string;
};
export type TransactionLedgerProps = {
  entries: LedgerEntry[];
  /** Save a memo; reject to keep the draft and show an error. */
  onMemo?: (id: string, memo: string) => Promise<void>;
  /** "Today" and "Yesterday" are measured from this date (ISO); defaults to the viewer's clock. */
  today?: string;
  currency?: string;
  locale?: string;
  timeZone?: string;
  theme?: "dark" | "light";
  className?: string;
};

type Filter = "all" | "card" | "transfer" | "pending";
const HUES = [210, 260, 160, 20, 330, 45, 190];
const hue = (s: string) => HUES[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
const initials = (s: string) => s.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

/**
 * Transaction Ledger
 * Account activity grouped by day, each day with its net total. Money in is
 * marked, pending items say so, and any row opens in place to show its
 * details and take a memo.
 */
export function TransactionLedger({ entries, onMemo, today, currency = "USD", locale, timeZone, theme = "dark", className = "" }: TransactionLedgerProps) {
  const id = useId();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [memos, setMemos] = useState<Record<string, string>>(() => Object.fromEntries(entries.map((e) => [e.id, e.memo ?? ""])));
  const [memoState, setMemoState] = useState<Record<string, "saving" | "saved" | "error" | undefined>>({});
  const [now, setNow] = useState<string | null>(today ?? null);
  const rows = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => { if (!today) setNow(new Date().toISOString()); }, [today]);

  const money = new Intl.NumberFormat(locale, { style: "currency", currency });
  const dayKey = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone });
  const dayLabel = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", timeZone });
  const time = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone });
  const rel = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...entries]
      .sort((a, b) => b.at.localeCompare(a.at))
      .filter((e) => filter === "all" || (filter === "pending" ? e.status === "pending" : e.kind === filter))
      .filter((e) => !q || `${e.merchant} ${e.category} ${memos[e.id] ?? ""} ${e.card ?? ""}`.toLowerCase().includes(q));
  }, [entries, filter, query, memos]);

  const groups = useMemo(() => {
    const out: { key: string; items: LedgerEntry[] }[] = [];
    for (const e of visible) {
      const key = dayKey.format(new Date(e.at));
      const last = out[out.length - 1];
      if (last?.key === key) last.items.push(e); else out.push({ key, items: [e] });
    }
    return out;
  }, [visible, dayKey]);

  const heading = (key: string) => {
    if (now) {
      const diff = Math.round((Date.parse(dayKey.format(new Date(now))) - Date.parse(key)) / 86_400_000);
      if (diff === 0 || diff === 1) { const word = rel.format(-diff, "day"); return word[0].toUpperCase() + word.slice(1); }
    }
    return dayLabel.format(new Date(`${key}T12:00:00Z`));
  };

  const saveMemo = async (entryId: string) => {
    if (!onMemo || memoState[entryId] === "saving") return;
    const original = entries.find((e) => e.id === entryId)?.memo ?? "";
    setMemoState((s) => ({ ...s, [entryId]: "saving" }));
    try { await onMemo(entryId, memos[entryId] ?? original); setMemoState((s) => ({ ...s, [entryId]: "saved" })); }
    catch { setMemoState((s) => ({ ...s, [entryId]: "error" })); }
  };

  const onRowKey = (e: KeyboardEvent<HTMLButtonElement>, entryId: string) => {
    if (e.key !== "j" && e.key !== "k" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const i = visible.findIndex((v) => v.id === entryId);
    const next = visible[i + (e.key === "j" || e.key === "ArrowDown" ? 1 : -1)];
    if (next) rows.current.get(next.id)?.focus();
  };

  const FILTERS: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, { id: "card", label: "Card" }, { id: "transfer", label: "Transfers" }, { id: "pending", label: "Pending" }];

  return (
    <section className={`tledg tledg--${theme} ${className}`} aria-label="Transactions">
      <div className="tledg__bar">
        <div className="tledg__filters" role="group" aria-label="Show">
          {FILTERS.map((f) => <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>)}
        </div>
        <label className="tledg__search">
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>
          <span className="tledg__sr">Search transactions</span>
          <input type="search" value={query} placeholder="Search" onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      <p className="tledg__sr" aria-live="polite">{`${visible.length} ${visible.length === 1 ? "transaction" : "transactions"}`}</p>
      {groups.length === 0 && <p className="tledg__empty">Nothing matches{query ? ` “${query}”` : ""}. <button type="button" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</button></p>}

      {groups.map((g) => {
        const net = g.items.reduce((a, e) => a + e.amount, 0);
        return (
          <section key={g.key} className="tledg__day" aria-labelledby={`${id}-${g.key}`}>
            <h3 id={`${id}-${g.key}`} className="tledg__date"><span>{heading(g.key)}</span><span className="tledg__net">{net > 0 ? "+" : ""}{money.format(net / 100)}</span></h3>
            <ul className="tledg__list">
              {g.items.map((e) => {
                const isOpen = open === e.id;
                const credit = e.amount > 0;
                return (
                  <li key={e.id} className="tledg__item" data-open={isOpen || undefined}>
                    <button
                      ref={(el) => { if (el) rows.current.set(e.id, el); else rows.current.delete(e.id); }}
                      type="button" className="tledg__row" aria-expanded={isOpen} aria-controls={`${id}-d-${e.id}`}
                      onClick={() => setOpen(isOpen ? null : e.id)} onKeyDown={(ev) => onRowKey(ev, e.id)}
                    >
                      <span className="tledg__mono" style={{ "--h": hue(e.merchant) } as CSSProperties} aria-hidden="true">{e.kind === "transfer" ? "⇄" : e.kind === "fee" ? "%" : initials(e.merchant)}</span>
                      <span className="tledg__who">
                        <span className="tledg__merchant">{e.merchant}</span>
                        <span className="tledg__sub">{e.kind === "card" ? `${e.category} · •${e.card}` : e.kind === "transfer" ? `Transfer · ${e.category}` : e.category}</span>
                      </span>
                      {e.status === "pending" && <span className="tledg__pending">Pending</span>}
                      {e.kind === "card" && !e.receipt && !credit && <span className="tledg__receipt" title="Receipt missing" aria-label="Receipt missing">!</span>}
                      <span className="tledg__amount" data-credit={credit || undefined}>{credit ? "+" : ""}{money.format(e.amount / 100)}</span>
                    </button>
                    <div id={`${id}-d-${e.id}`} className="tledg__detail" hidden={!isOpen}>
                      <dl>
                        <div><dt>Time</dt><dd>{time.format(new Date(e.at))}</dd></div>
                        <div><dt>{e.kind === "card" ? "Card" : "Method"}</dt><dd>{e.kind === "card" ? `•••• ${e.card}` : e.kind === "transfer" ? e.category : "Account fee"}</dd></div>
                        <div><dt>Status</dt><dd>{e.status === "pending" ? "Pending, usually posts in 1–2 days" : "Posted"}</dd></div>
                        {e.kind === "card" && !credit && <div><dt>Receipt</dt><dd data-warn={!e.receipt || undefined}>{e.receipt ? "Attached" : "Missing"}</dd></div>}
                      </dl>
                      {onMemo && (
                        <div className="tledg__memo">
                          <label htmlFor={`${id}-m-${e.id}`}>Memo</label>
                          <div>
                            <input id={`${id}-m-${e.id}`} value={memos[e.id] ?? ""} placeholder="What was this for?" onChange={(ev) => { const v = ev.target.value; setMemos((m) => ({ ...m, [e.id]: v })); setMemoState((s) => ({ ...s, [e.id]: undefined })); }} onKeyDown={(ev) => { if (ev.key === "Enter") saveMemo(e.id); }} />
                            <button type="button" onClick={() => saveMemo(e.id)} disabled={memoState[e.id] === "saving"}>{memoState[e.id] === "saving" ? "Saving…" : "Save"}</button>
                          </div>
                          <p role="status" data-state={memoState[e.id]}>{memoState[e.id] === "saved" ? "Memo saved." : memoState[e.id] === "error" ? "The memo couldn't be saved. Your text is still here." : ""}</p>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </section>
  );
}
