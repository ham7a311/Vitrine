"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./daily-quests.css";

export type Quest = {
  id: string;
  title: string;
  icon: "bolt" | "target" | "clock" | "book";
  progress: number;
  goal: number;
  /** Shown after the numbers, e.g. "XP". */
  unit?: string;
  claimed?: boolean;
};
export type DailyQuestsProps = {
  quests: Quest[];
  /** When the quests reset, as an ISO timestamp. */
  resetsAt: string;
  /** Resolve when the reward is granted; reject to show a retry. */
  onClaim: (id: string) => Promise<void>;
  theme?: "light" | "dark";
  className?: string;
};

const ICONS: Record<Quest["icon"], ReactNode> = {
  bolt: <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" />,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  clock: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9.5 2.5h5" /></>,
  book: <path d="M4.5 5.5c2.5-1 5-1 7.5.5 2.5-1.5 5-1.5 7.5-.5v13c-2.5-1-5-1-7.5.5-2.5-1.5-5-1.5-7.5-.5z M12 6v13" />,
};

function timeLeft(iso: string, now: number) {
  const ms = Math.max(0, new Date(iso).getTime() - now);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h >= 1 ? `${h} ${h === 1 ? "hour" : "hours"}` : `${m} ${m === 1 ? "minute" : "minutes"}`;
}

/**
 * Daily Quests
 * Three small goals for the day, each a chunky bar that fills as you go.
 * A full bar turns gold and offers its chest; claiming opens it once the
 * reward is really granted.
 */
export function DailyQuests({ quests, resetsAt, onClaim, theme = "light", className = "" }: DailyQuestsProps) {
  const uid = useId();
  const [now, setNow] = useState<number | null>(null);
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<Record<string, "pending" | "error" | undefined>>({});
  const pending = useRef(new Set<string>());

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const claim = async (id: string) => {
    if (pending.current.has(id)) return;
    pending.current.add(id);
    setState((s) => ({ ...s, [id]: "pending" }));
    try {
      await onClaim(id);
      setClaimed((c) => ({ ...c, [id]: true }));
      setState((s) => ({ ...s, [id]: undefined }));
    } catch {
      setState((s) => ({ ...s, [id]: "error" }));
    } finally {
      pending.current.delete(id);
    }
  };

  return (
    <section className={`dquest dquest--${theme} ${className}`} aria-labelledby={`${uid}-h`}>
      <header className="dquest__head">
        <h3 id={`${uid}-h`} className="dquest__title">Daily quests</h3>
        <p className="dquest__reset"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>{now === null ? " " : `${timeLeft(resetsAt, now)} left`}</p>
      </header>
      <ul className="dquest__list">
        {quests.map((q) => {
          const done = q.progress >= q.goal;
          const isClaimed = q.claimed || claimed[q.id];
          const pct = Math.min(100, (q.progress / q.goal) * 100);
          const st = state[q.id];
          return (
            <li key={q.id} className="dquest__quest" data-done={done || undefined} data-claimed={isClaimed || undefined}>
              <span className="dquest__icon" data-icon={q.icon} aria-hidden="true"><svg viewBox="0 0 24 24">{ICONS[q.icon]}</svg></span>
              <div className="dquest__body">
                <p className="dquest__name" id={`${uid}-${q.id}`}>{q.title}</p>
                <div className="dquest__bar" role="progressbar" aria-labelledby={`${uid}-${q.id}`} aria-valuemin={0} aria-valuemax={q.goal} aria-valuenow={Math.min(q.progress, q.goal)} aria-valuetext={`${Math.min(q.progress, q.goal)} of ${q.goal}${q.unit ? ` ${q.unit}` : ""}`}>
                  <span className="dquest__fill" style={{ "--p": `${pct}%` } as CSSProperties} />
                  <span className="dquest__count" aria-hidden="true">{Math.min(q.progress, q.goal)} / {q.goal}</span>
                </div>
                {st === "error" && <p className="dquest__error" role="alert">That didn't go through. Try again.</p>}
              </div>
              <div className="dquest__reward">
                {done && !isClaimed ? (
                  <button type="button" className="dquest__claim" aria-describedby={`${uid}-${q.id}`} disabled={st === "pending"} onClick={() => claim(q.id)}>
                    {st === "pending" ? "Claiming…" : st === "error" ? "Retry" : "Claim"}
                  </button>
                ) : (
                  <svg className="dquest__chest" viewBox="0 0 40 36" data-open={isClaimed || undefined} aria-label={isClaimed ? "Reward claimed" : "Reward locked until the bar is full"} role="img">
                    <path className="dquest__chest-lid" d="M5 14V9a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v5z" />
                    <path className="dquest__chest-box" d="M5 15h30v14a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" />
                    <rect className="dquest__chest-lock" x="17" y="12" width="6" height="8" rx="1.5" />
                  </svg>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
