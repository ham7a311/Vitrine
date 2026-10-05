"use client";
import { useEffect, useId, useMemo, useState } from "react";
import { days, since, stage, STAGES, type Stage } from "./age";
import "./patina.css";

export type PatinaPage = { id: string; title: string; summary: string; owner: string; checked: string };
export type PatinaProps = {
  pages: PatinaPage[];
  /** Days at which a page becomes Ageing, Stale and Old. */
  thresholds?: [number, number, number];
  /** Record that someone checked a page; reject to leave it as it was. */
  onCheck?: (id: string) => Promise<void>;
  /** "Today" for the ages; defaults to the viewer's clock after mount. */
  now?: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Patina
 * Documentation cards that age with their last review. Paper warms, corners
 * curl and a stamp says how long it has been, so stale pages are noticed;
 * checking a page brings it back to fresh.
 */
export function Patina({ pages, thresholds = [90, 180, 365], onCheck, now, theme = "light", motion = true, className = "" }: PatinaProps) {
  const id = useId();
  const [today, setToday] = useState<number | null>(now ? new Date(now).getTime() : null);
  useEffect(() => { if (!now) setToday(Date.now()); }, [now]);
  const [checked, setChecked] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ id: string; text: string } | null>(null);
  const [order, setOrder] = useState<"oldest" | "title">("oldest");
  const [message, setMessage] = useState("");

  const rows = useMemo(() => {
    if (today === null) return [];
    const list = pages.map((p) => { const d = days(checked[p.id] ?? p.checked, today); return { p, d, s: stage(d, thresholds) as Stage }; });
    return list.sort((a, b) => (order === "oldest" ? b.d - a.d : a.p.title.localeCompare(b.p.title)));
  }, [pages, checked, today, thresholds, order]);
  const old = rows.filter((r) => r.s === 3).length, stale = rows.filter((r) => r.s >= 2).length;

  const check = async (pid: string, title: string) => {
    if (busy || today === null) return;
    setBusy(pid); setError(null);
    try {
      await onCheck?.(pid);
      setChecked((c) => ({ ...c, [pid]: new Date(today).toISOString() }));
      setMessage(`${title} marked as checked today.`);
    } catch (e) {
      setError({ id: pid, text: (e as Error)?.message || "Couldn't record the check. The page is unchanged." });
    } finally { setBusy(null); }
  };

  return (
    <section className={`patn patn--${theme} ${className}`} data-motion={motion ? undefined : "off"} aria-labelledby={`${id}-h`}>
      <header className="patn__head">
        <div>
          <h3 id={`${id}-h`} className="patn__title">Pages that need a look</h3>
          <p className="patn__sum">{today === null ? "" : old ? `${old} ${old === 1 ? "page hasn't" : "pages haven't"} been checked in over a year; ${stale} in all are stale.` : stale ? `${stale} ${stale === 1 ? "page is" : "pages are"} getting stale.` : "Everything has been checked recently."}</p>
        </div>
        <label className="patn__sort">Sort
          <select value={order} onChange={(e) => setOrder(e.target.value as "oldest" | "title")}>
            <option value="oldest">Oldest check first</option>
            <option value="title">Title</option>
          </select>
        </label>
      </header>
      <ul className="patn__grid">
        {rows.map(({ p, d, s }) => (
          <li key={p.id} className="patn__card" data-stage={s} data-fresh={checked[p.id] ? true : undefined}>
            <article aria-labelledby={`${id}-${p.id}`}>
              <h4 id={`${id}-${p.id}`}>{p.title}</h4>
              <p className="patn__text">{p.summary}</p>
              <p className="patn__meta"><span>{p.owner}</span><span className="patn__sr">, {STAGES[s].toLowerCase()},</span> checked {since(d)}</p>
              {s >= 2 && <span className="patn__stamp" aria-hidden="true">Checked<br />{since(d).replace(" ago", "")} ago</span>}
              <div className="patn__actions">
                <span className="patn__stage" aria-hidden="true">{STAGES[s]}</span>
                <button type="button" onClick={() => check(p.id, p.title)} disabled={busy === p.id || d === 0}>{busy === p.id ? "Saving…" : d === 0 ? "Checked today" : "Mark as checked"}</button>
              </div>
              {error?.id === p.id && <p className="patn__error" role="alert">{error.text}</p>}
            </article>
          </li>
        ))}
      </ul>
      <p className="patn__sr" aria-live="polite">{message}</p>
    </section>
  );
}
