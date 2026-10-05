"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./lesson-path.css";

export type LessonState = "done" | "current" | "locked";
export type PathLesson = { id: string; title: string; xp: number; state: LessonState };
export type PathUnit = { id: string; title: string; subtitle: string; color: "green" | "blue" | "purple" | "orange" | "pink"; lessons: PathLesson[] };
export type LessonPathProps = {
  units: PathUnit[];
  /** Called with the lesson id when Start or Practice is pressed. */
  onStart?: (lessonId: string) => void;
  theme?: "light" | "dark";
  motion?: "auto" | "reduced";
  className?: string;
};

/** Sideways offset for the nth node, as a fraction of the swing: a gentle S-curve. */
const swing = (i: number) => Math.round(Math.sin(i * 0.95) * 100) / 100;

function Glyph({ state }: { state: LessonState }) {
  if (state === "done") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.5l4.2 4.2L18.5 8" /></svg>;
  if (state === "locked") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="11" width="12" height="9" rx="2.5" /><path d="M9 11V8.5a3 3 0 0 1 6 0V11" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="lpath__star"><path d="M12 3.8l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.2l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" /></svg>;
}

/**
 * Lesson Path
 * A course drawn as a winding path of round lessons: finished ones carry a
 * tick, the next one waits with a Start flag, locked ones sit grey. Press a
 * lesson to see what it is and how much it's worth.
 */
export function LessonPath({ units, onStart, theme = "light", motion = "auto", className = "" }: LessonPathProps) {
  const id = useId();
  const all = units.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u })));
  const current = all.find((l) => l.state === "current") ?? all[0];
  const [open, setOpen] = useState<string | null>(null);
  const [focus, setFocus] = useState(current?.id);
  const nodes = useRef(new Map<string, HTMLButtonElement>());
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node) || !(e.target as Element).closest("[data-lesson]")) setOpen(null); };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open]);

  const key = (lessonId: string, e: KeyboardEvent<HTMLButtonElement>) => {
    const i = all.findIndex((l) => l.id === lessonId);
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = Math.min(all.length - 1, i + 1);
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = Math.max(0, i - 1);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = all.length - 1;
    if (next >= 0) { e.preventDefault(); setFocus(all[next].id); setOpen(null); nodes.current.get(all[next].id)?.focus(); }
    if (e.key === "Escape" && open) { e.preventDefault(); setOpen(null); }
  };

  let n = 0;
  return (
    <div ref={root} className={`lpath lpath--${theme} ${className}`} data-motion={motion}>
      {units.map((unit, ui) => {
        const total = unit.lessons.length;
        return (
          <section key={unit.id} className="lpath__unit" data-color={unit.color} aria-labelledby={`${id}-${unit.id}`}>
            <header className="lpath__band">
              <p className="lpath__kicker">Unit {ui + 1}</p>
              <h3 id={`${id}-${unit.id}`} className="lpath__unit-title">{unit.title}</h3>
              <p className="lpath__unit-sub">{unit.subtitle}</p>
            </header>
            <ol className="lpath__nodes">
              {unit.lessons.map((lesson, li) => {
                const index = n++;
                const isOpen = open === lesson.id;
                const done = unit.lessons.filter((l) => l.state === "done").length;
                const prev = all[index - 1];
                return (
                  <li key={lesson.id} className="lpath__stop" style={{ "--x": swing(index) } as CSSProperties} data-lesson>
                    {lesson.state === "current" && <span className="lpath__flag" aria-hidden="true">Start</span>}
                    <button
                      ref={(el) => { if (el) nodes.current.set(lesson.id, el); else nodes.current.delete(lesson.id); }}
                      type="button"
                      className="lpath__node"
                      data-state={lesson.state}
                      tabIndex={focus === lesson.id ? 0 : -1}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-card-${lesson.id}`}
                      aria-label={`${lesson.title}, lesson ${li + 1} of ${total}, ${lesson.state === "done" ? "complete" : lesson.state === "current" ? "up next" : "locked"}`}
                      onClick={() => { setFocus(lesson.id); setOpen(isOpen ? null : lesson.id); }}
                      onKeyDown={(e) => key(lesson.id, e)}
                    >
                      <Glyph state={lesson.state} />
                    </button>
                    <div id={`${id}-card-${lesson.id}`} className="lpath__card" data-state={lesson.state} hidden={!isOpen} role="region" aria-label={`${lesson.title} details`} onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); setOpen(null); nodes.current.get(lesson.id)?.focus(); } }}>
                      <p className="lpath__card-title">{lesson.title}</p>
                      <p className="lpath__card-sub">
                        {lesson.state === "locked" ? `Finish ${prev?.title ?? "the lesson before"} to unlock this` : lesson.state === "done" ? `Complete · ${done} of ${total} in this unit` : `Lesson ${li + 1} of ${total}`}
                      </p>
                      {lesson.state !== "locked" && (
                        <button type="button" className="lpath__go" onClick={() => { setOpen(null); onStart?.(lesson.id); }}>
                          {lesson.state === "done" ? `Practise +${Math.max(1, Math.round(lesson.xp / 3))} XP` : `Start +${lesson.xp} XP`}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
