"use client";
import { useEffect, useId, useState, type CSSProperties } from "react";
import "./lesson-summary.css";

export type LessonSummaryProps = {
  xp: number;
  /** 0–100 */
  accuracy: number;
  seconds: number;
  /** Seven days ending today: true for days the goal was met. */
  week: boolean[];
  /** Labels for the seven days ending today; defaults to narrow weekday names in the viewer's locale. */
  dayLabels?: string[];
  locale?: string;
  streak: number;
  onContinue?: () => void;
  onReview?: () => void;
  theme?: "light" | "dark";
  motion?: "auto" | "reduced";
  className?: string;
};

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
const grade = (a: number) => (a >= 100 ? "Flawless" : a >= 90 ? "Amazing" : a >= 75 ? "Good" : "Accuracy");

/** Counts from 0 to `to` once it is visible, easing out; jumps straight there under reduced motion. */
function useCount(to: number, delay: number, still: boolean) {
  const [value, setValue] = useState(still ? to : 0);
  useEffect(() => {
    if (still || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setValue(to); return; }
    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 900));
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, delay, still]);
  return value;
}

/**
 * Lesson Summary
 * The results screen at the end of a lesson: three chunky tiles count up the
 * XP earned, the accuracy and the time, then the week's streak fills in today.
 */
export function LessonSummary({ xp, accuracy, seconds, week, dayLabels, locale, streak, onContinue, onReview, theme = "light", motion = "auto", className = "" }: LessonSummaryProps) {
  const still = motion === "reduced";
  const xpNow = useCount(xp, 200, still);
  const accNow = useCount(Math.round(accuracy), 350, still);
  const secNow = useCount(seconds, 500, still);
  const titleId = useId();
  const days = week.slice(-7);
  // Weekday names depend on the viewer's clock, so they are filled in after mount.
  const [labels, setLabels] = useState<string[]>(dayLabels ?? []);
  useEffect(() => {
    if (dayLabels) { setLabels(dayLabels); return; }
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    const today = new Date();
    setLabels(Array.from({ length: 7 }, (_, i) => fmt.format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + i))));
  }, [dayLabels, locale]);

  return (
    <section className={`lsum lsum--${theme} ${className}`} data-motion={motion} aria-labelledby={titleId}>
      <div className="lsum__inner">
        <h2 id={titleId} className="lsum__title">Lesson complete!</h2>
        <p className="lsum__sr" role="status">{`${xp} XP earned, ${Math.round(accuracy)}% accuracy, ${clock(seconds)} taken. ${streak} day streak.`}</p>
        <dl className="lsum__tiles" aria-hidden="true">
          <div className="lsum__tile" data-tone="gold" style={{ "--d": "0ms" } as CSSProperties}>
            <dt>Total XP</dt>
            <dd><svg viewBox="0 0 24 24"><path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" /></svg>{xpNow}</dd>
          </div>
          <div className="lsum__tile" data-tone="green" style={{ "--d": "150ms" } as CSSProperties}>
            <dt>{grade(accuracy)}</dt>
            <dd><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></svg>{accNow}%</dd>
          </div>
          <div className="lsum__tile" data-tone="blue" style={{ "--d": "300ms" } as CSSProperties}>
            <dt>{seconds <= 120 ? "Speedy" : "Time"}</dt>
            <dd><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9.5 2.5h5" /></svg>{clock(secNow)}</dd>
          </div>
        </dl>

        <div className="lsum__streak">
          <p className="lsum__streak-label"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c1 3.4 5.5 5.6 5.5 10.6a5.5 5.5 0 0 1-11 0c0-2.2 1-3.7 2.3-5 .2 1.6.9 2.6 2 3.1-.6-3.2.2-6 1.2-8.7z" /></svg>{streak} day streak</p>
          <ol className="lsum__week" aria-label="This week">
            {days.map((met, i) => (
              <li key={i} data-met={met || undefined} data-today={i === days.length - 1 || undefined} style={{ "--i": i } as CSSProperties}>
                <span className="lsum__day" aria-hidden="true">{labels[labels.length - days.length + i] ?? ""}</span>
                <span className="lsum__dot"><span className="lsum__sr">{met ? "goal met" : "missed"}{i === days.length - 1 ? ", today" : ""}</span></span>
              </li>
            ))}
          </ol>
        </div>

        <div className="lsum__actions">
          {onReview && <button type="button" className="lsum__review" onClick={onReview}>Review lesson</button>}
          <button type="button" className="lsum__continue" onClick={onContinue}>Continue</button>
        </div>
      </div>
    </section>
  );
}
