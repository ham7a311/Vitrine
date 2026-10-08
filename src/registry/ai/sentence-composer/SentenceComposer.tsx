"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { EFFORT_HINT, EFFORT_LABEL, FILES, MODELS, MODES, fileName, fmt, usage, type ModeId, type ModelId } from "./brief";
import { MakerLogo, ModeIcon } from "./logos";
import "./sentence-composer.css";

/**
 * Sentence Composer
 * The settings are a sentence. Under the prompt it reads "Claude Opus 5.5 will make the change at high
 * effort, reading 2 files." — and every underlined word is the control for that part. Change one and the
 * sentence rewrites itself, so what will happen is always said in plain words before you send.
 */

type Token = "model" | "mode" | "effort" | "files";

/** How each mode reads inside the sentence. */
const PHRASE: Record<ModeId, string> = {
  agent: "make the change",
  plan: "draft a plan first",
  debug: "track down the cause",
  multitask: "run each line as its own task",
  ask: "only answer",
};

export type SentenceBrief = { text: string; mode: ModeId; model: ModelId; effort: number; files: string[] };

export type SentenceComposerProps = {
  defaultMode?: ModeId;
  defaultModel?: ModelId;
  defaultEffort?: number;
  defaultFiles?: string[];
  placeholder?: string;
  onSend?: (brief: SentenceBrief) => void;
  theme?: "dark" | "light";
  className?: string;
};

const I = {
  up: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" /></svg>,
  tick: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>,
};

export function SentenceComposer({ defaultMode = "agent", defaultModel = "opus", defaultEffort = 2, defaultFiles = ["exporter/retry.ts", "exporter/invoice-export.ts"], placeholder = "Make the invoice exporter retry with backoff", onSend, theme = "dark", className = "" }: SentenceComposerProps) {
  const uid = useId();
  const [mode, setMode] = useState<ModeId>(defaultMode);
  const [model, setModel] = useState<ModelId>(defaultModel);
  const [effort, setEffort] = useState(defaultEffort);
  const [files, setFiles] = useState<string[]>(defaultFiles);
  const [text, setText] = useState("");
  const [open, setOpen] = useState<Token | null>(null);
  const [at, setAt] = useState({ left: 0, top: 0 });
  const [run, setRun] = useState<{ state: "running" | "done"; sentence: string } | null>(null);
  const [say, setSay] = useState("");
  const card = useRef<HTMLDivElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const tokens = useRef<Partial<Record<Token, HTMLButtonElement | null>>>({});

  const M = MODES.find((m) => m.id === mode)!;
  const Mo = MODELS.find((m) => m.id === model)!;
  const use = usage(files, effort, Mo);
  const filesWord = files.length === 0 ? "just this message" : files.length === 1 ? fileName(files[0]) : `${files.length} files`;
  const sentence = `${Mo.name} will ${PHRASE[mode]} at ${EFFORT_LABEL[effort].toLowerCase()} effort, reading ${filesWord}.`;

  /* The menu hangs under the word it changes. */
  useLayoutEffect(() => {
    if (!open) return;
    const t = tokens.current[open], c = card.current;
    if (!t || !c) return;
    const tb = t.getBoundingClientRect(), cb = c.getBoundingClientRect();
    const w = pop.current?.offsetWidth ?? 240;
    setAt({ left: Math.max(8, Math.min(cb.width - w - 8, tb.left - cb.left - 8)), top: tb.bottom - cb.top + 6 });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      const items = [...(pop.current?.querySelectorAll<HTMLElement>("[role^='menuitem']") ?? [])];
      (items.find((i) => i.getAttribute("aria-checked") === "true") ?? items[0])?.focus();
    });
    const down = (e: PointerEvent) => {
      const t = e.target as Node;
      if (pop.current?.contains(t) || Object.values(tokens.current).some((b) => b?.contains(t))) return;
      setOpen(null);
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open]);

  useEffect(() => {
    if (run?.state !== "running") return;
    const t = window.setTimeout(() => setRun((r) => (r ? { ...r, state: "done" } : r)), 2400);
    return () => clearTimeout(t);
  }, [run]);

  const close = (back: Token) => {
    setOpen(null);
    tokens.current[back]?.focus();
  };
  const menuKey = (e: KeyboardEvent<HTMLDivElement>, back: Token) => {
    const items = [...(pop.current?.querySelectorAll<HTMLElement>("[role^='menuitem']") ?? [])];
    const k = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); items[(k + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus(); }
    else if (e.key === "Home" || e.key === "End") { e.preventDefault(); items[e.key === "Home" ? 0 : items.length - 1]?.focus(); }
    else if (e.key === "Escape") { e.preventDefault(); close(back); }
    else if (e.key === "Tab") setOpen(null);
  };
  const choose = (t: Token, fn: () => void, words: string) => {
    fn();
    setSay(words);
    close(t);
  };

  const send = () => {
    if (!text.trim()) { setSay("Write the task first."); return; }
    onSend?.({ text: text.trim(), mode, model, effort, files });
    setRun({ state: "running", sentence });
    setSay(`Sent. ${sentence}`);
    setText("");
  };

  /** A word in the sentence that is also a control. Its key changes with its value, so the new word rolls in. */
  const word = (t: Token, label: string, value: string, icon: ReactNode, attrs: Record<string, string | number> = {}) => (
    <button
      ref={(el) => { tokens.current[t] = el; }}
      type="button"
      className="snts__tok"
      data-t={t}
      {...attrs}
      aria-haspopup="menu"
      aria-expanded={open === t}
      aria-controls={`${uid}-pop`}
      aria-label={`${label}: ${value}. Change`}
      onClick={() => setOpen((o) => (o === t ? null : t))}
    >
      {icon}
      <span className="snts__roll" key={value}>{value}</span>
    </button>
  );

  return (
    <div className={`snts snts--${theme} ${className}`} data-mode={mode} data-maker={Mo.maker} data-effort={effort}>
      <div ref={card} className="snts__card">
        {run && (
          <p className="snts__run" data-s={run.state} aria-live="polite">
            <span className="snts__runicon" aria-hidden="true">{run.state === "running" ? <i className="snts__spin" /> : I.tick}</span>
            <span>{run.state === "running" ? "Running —" : "Done —"} {run.sentence}</span>
          </p>
        )}
        <label htmlFor={`${uid}-ta`} className="snts__sr">Task</label>
        <textarea
          id={`${uid}-ta`}
          className="snts__prompt"
          rows={3}
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }}
        />

        <div className="snts__foot">
          <p className="snts__sentence">
            {word("model", "Model", Mo.name, <MakerLogo maker={Mo.maker} />)}{" "}
            <span className="snts__glue">will</span>{" "}
            {word("mode", "Mode", PHRASE[mode], <ModeIcon id={mode} />)}{" "}
            <span className="snts__glue">at</span>{" "}
            {word("effort", "Effort", EFFORT_LABEL[effort].toLowerCase(), <span className="snts__bars" aria-hidden="true">{EFFORT_LABEL.map((_, i) => <i key={i} data-on={i <= effort || undefined} style={{ ["--h" as string]: `${4 + i * 2}px` }} />)}</span>)}{" "}
            <span className="snts__glue">effort, reading</span>{" "}
            {word("files", "Context", filesWord, null)}
            <span className="snts__glue">.</span>
          </p>
          <button type="button" className="snts__go" aria-label={`Send: ${sentence}`} aria-disabled={!text.trim() || undefined} onClick={send}>{I.up}</button>
        </div>

        {open && (
          <div ref={pop} id={`${uid}-pop`} className="snts__pop" data-t={open} role="menu" aria-label={open === "files" ? "Files to read" : open} style={{ left: at.left, top: at.top }} onKeyDown={(e) => menuKey(e, open)}>
            {open === "model" && MODELS.map((m) => (
              <button key={m.id} type="button" role="menuitemradio" aria-checked={m.id === model} tabIndex={-1} className="snts__item" data-maker={m.maker} onClick={() => choose("model", () => setModel(m.id), `${m.name} will do it.`)}>
                <MakerLogo maker={m.maker} /><span>{m.name}</span><small>{fmt(m.window)}</small><i aria-hidden="true">{m.id === model && I.tick}</i>
              </button>
            ))}
            {open === "mode" && MODES.map((m) => (
              <button key={m.id} type="button" role="menuitemradio" aria-checked={m.id === mode} tabIndex={-1} className="snts__item" data-m={m.id} aria-description={m.does} onClick={() => choose("mode", () => setMode(m.id), `It will ${PHRASE[m.id]}.`)}>
                <ModeIcon id={m.id} /><span>{PHRASE[m.id]}</span><small>{m.name}</small><i aria-hidden="true">{m.id === mode && I.tick}</i>
              </button>
            ))}
            {open === "effort" && EFFORT_LABEL.map((l, i) => (
              <button key={l} type="button" role="menuitemradio" aria-checked={i === effort} tabIndex={-1} className="snts__item" data-e={i} aria-description={EFFORT_HINT[i]} onClick={() => choose("effort", () => setEffort(i), `${l} effort.`)}>
                <span className="snts__bars" aria-hidden="true">{EFFORT_LABEL.map((_, j) => <i key={j} data-on={j <= i || undefined} style={{ ["--h" as string]: `${4 + j * 2}px` }} />)}</span><span>{l.toLowerCase()}</span><small>{["fast", "brief", "careful", "checks itself", "slowest"][i]}</small><i aria-hidden="true">{i === effort && I.tick}</i>
              </button>
            ))}
            {open === "files" && (
              <>
                {FILES.map((f) => {
                  const on = files.includes(f.path);
                  return (
                    <button key={f.path} type="button" role="menuitemcheckbox" aria-checked={on} tabIndex={-1} className="snts__item snts__item--file" onClick={() => { setFiles((x) => (on ? x.filter((p) => p !== f.path) : [...x, f.path])); setSay(`${fileName(f.path)} ${on ? "removed" : "added"}.`); }}>
                      <b className="snts__box" aria-hidden="true">{on && I.tick}</b><span>{f.path}</span><small>{fmt(f.tokens)}</small>
                    </button>
                  );
                })}
                <p className="snts__popfoot" aria-hidden="true">{fmt(use.files)} tokens of files · {Math.round(use.pct * 100)}% of {Mo.short}</p>
              </>
            )}
          </div>
        )}
      </div>
      <p className="snts__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
