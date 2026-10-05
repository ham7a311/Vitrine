"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./blank-page-starter.css";

export type StarterBlock = { type: "heading" | "text" | "todo" | "bullet"; text: string };
export type StarterTemplate = { id: string; label: string; glyph: string; blocks: StarterBlock[] };
export type BlankPageStarterProps = {
  templates: StarterTemplate[];
  /** Called with a template id, or "empty" when the page is started blank. */
  onPick?: (id: string) => void;
  theme?: "light" | "dark";
  motion?: "auto" | "reduced";
  className?: string;
};

/**
 * Blank Page Starter
 * The empty state of a new page. Under the untitled heading, faint options
 * offer a blank page or a template; typing anything makes them step aside,
 * and choosing a template sets its lines in one after another.
 */
export function BlankPageStarter({ templates, onPick, theme = "light", motion = "auto", className = "" }: BlankPageStarterProps) {
  const id = useId();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [chosen, setChosen] = useState<StarterTemplate | "empty" | null>(null);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const options = useRef<(HTMLButtonElement | null)[]>([]);
  const restart = useRef<HTMLButtonElement>(null);
  const focusNext = useRef<"body" | "restart" | "title" | null>(null);

  useEffect(() => {
    const target = focusNext.current;
    focusNext.current = null;
    if (target === "body") bodyRef.current?.focus();
    if (target === "restart") restart.current?.focus();
    if (target === "title") titleRef.current?.focus();
  }, [chosen]);
  useEffect(() => {
    const el = bodyRef.current;
    if (el) { el.style.height = "0px"; el.style.height = `${el.scrollHeight}px`; }
  }, [body, chosen]);

  const pick = (choice: StarterTemplate | "empty") => {
    focusNext.current = choice === "empty" ? "body" : "restart";
    setChosen(choice);
    setDone({});
    if (choice !== "empty" && !title) setTitle(choice.label);
    onPick?.(choice === "empty" ? "empty" : choice.id);
  };
  const startOver = () => { focusNext.current = "title"; setChosen(null); setBody(""); setTitle(""); };

  const all = ["empty", ...templates.map((t) => t.id)];
  const optionKey = (i: number, e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = i + (e.key === "ArrowDown" ? 1 : -1);
      if (next < 0) titleRef.current?.focus();
      else options.current[Math.min(next, all.length - 1)]?.focus();
    }
  };

  const template = chosen && chosen !== "empty" ? chosen : null;

  return (
    <article className={`bps bps--${theme} ${className}`} data-motion={motion} aria-label={title || "Untitled page"}>
      <input
        ref={titleRef}
        className="bps__title"
        value={title}
        placeholder="Untitled"
        aria-label="Page title"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); if (!chosen) pick("empty"); else bodyRef.current?.focus(); }
          if (e.key === "ArrowDown" && !chosen) { e.preventDefault(); options.current[0]?.focus(); }
        }}
      />

      {template ? (
        <div className="bps__page" key={template.id}>
          {template.blocks.map((b, i) => {
            const style = { "--i": i } as CSSProperties;
            if (b.type === "heading") return <h3 key={i} className="bps__line bps__h" style={style}>{b.text}</h3>;
            if (b.type === "todo") return (
              <label key={i} className="bps__line bps__todo" style={style} data-done={done[i] || undefined}>
                <input type="checkbox" checked={!!done[i]} onChange={(e) => setDone((d) => ({ ...d, [i]: e.target.checked }))} />
                <span>{b.text}</span>
              </label>
            );
            if (b.type === "bullet") return <p key={i} className="bps__line bps__bullet" style={style}>{b.text}</p>;
            return <p key={i} className="bps__line" style={style}>{b.text}</p>;
          })}
          <button ref={restart} type="button" className="bps__restart" style={{ "--i": template.blocks.length } as CSSProperties} onClick={startOver}>Start over with a blank page</button>
        </div>
      ) : (
        <>
          <textarea
            ref={bodyRef}
            className="bps__body"
            rows={1}
            value={body}
            placeholder="Start writing…"
            aria-label="Page body"
            onChange={(e) => {
              const value = e.target.value;
              setBody(value);
              if (value && !chosen) { setChosen("empty"); onPick?.("empty"); }
              // Clearing the page brings the starters back.
              if (!value && chosen === "empty") setChosen(null);
            }}
          />
          {!chosen && (
            <div className="bps__starters" role="group" aria-labelledby={`${id}-starters`}>
              <p id={`${id}-starters`} className="bps__prompt">Begin with</p>
              <ul>
                {[{ id: "empty", label: "Empty page", glyph: "▢" }, ...templates].map((t, i) => (
                  <li key={t.id} style={{ "--i": i } as CSSProperties}>
                    <button
                      ref={(el) => { options.current[i] = el; }}
                      type="button"
                      className="bps__option"
                      onClick={() => pick(t.id === "empty" ? "empty" : templates.find((x) => x.id === t.id)!)}
                      onKeyDown={(e) => optionKey(i, e)}
                    >
                      <span className="bps__glyph" aria-hidden="true">{t.glyph}</span>
                      {t.label}
                      {i === 0 && <kbd className="bps__kbd" aria-hidden="true">↵</kbd>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </article>
  );
}
