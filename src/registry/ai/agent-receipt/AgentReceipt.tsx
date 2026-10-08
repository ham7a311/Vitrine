"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { EFFORT_LABEL, FILES, MODELS, MODES, fileName, fmt, usage, type ModeId, type ModelId } from "./brief";
import { infer } from "./infer";
import { MakerLogo, ModeIcon } from "./logos";
import "./agent-receipt.css";

/**
 * Agent Receipt
 * Configuration turned around. You write the task; the component reads a run brief out of it — which
 * agent, mode, files and effort, each with the reason it guessed — and prints it as a work order. You
 * check it, change any line, and approve it.
 */

type Line = "model" | "mode" | "context" | "effort";
type Overrides = Partial<{ mode: ModeId; model: ModelId; effort: number; files: string[] }>;

export type ReceiptBrief = { text: string; mode: ModeId; model: ModelId; effort: number; files: string[] };

export type AgentReceiptProps = {
  /** First work-order number. */
  start?: number;
  /** Where it's running, printed under the title. */
  where?: string;
  defaultText?: string;
  onRun?: (brief: ReceiptBrief) => void;
  theme?: "dark" | "light";
  className?: string;
};

const pad = (n: number) => String(n).padStart(4, "0");
const clock = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function AgentReceipt({ start = 42, where = "ledger · fix/export-retries", defaultText = "", onRun, theme = "dark", className = "" }: AgentReceiptProps) {
  const uid = useId();
  const [text, setText] = useState(defaultText);
  const [set, setSet] = useState<Overrides>({});
  const [open, setOpen] = useState<Line | null>(null);
  const [no, setNo] = useState(start);
  const [time, setTime] = useState("--:--");
  const [stamp, setStamp] = useState(false);
  const [log, setLog] = useState<{ no: number; label: string; state: "running" | "done" }[]>([]);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [say, setSay] = useState("");
  const prev = useRef<Record<string, string>>({});
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setTime(clock()), []);

  /* Read the brief out of the prompt — a beat after typing stops, like a printer catching up. */
  const [settled, setSettled] = useState(defaultText);
  useEffect(() => {
    const t = window.setTimeout(() => setSettled(text), 380);
    return () => clearTimeout(t);
  }, [text]);
  const guess = useMemo(() => infer(settled), [settled]);

  const mode = set.mode ?? guess.mode.value;
  const model = set.model ?? guess.model.value;
  const effort = set.effort ?? guess.effort.value;
  const files = set.files ?? guess.files.value;
  const M = MODES.find((m) => m.id === mode)!;
  const Mo = MODELS.find((m) => m.id === model)!;
  const use = usage(files, effort, Mo);
  const blank = !settled.trim();

  /* Lines that just reprinted get a brief mark, so you can see what the last words changed. */
  useEffect(() => {
    const now: Record<string, string> = { task: guess.task, model, mode, effort: String(effort), context: files.join() };
    const changed = Object.keys(now).filter((k) => prev.current[k] !== undefined && prev.current[k] !== now[k]);
    prev.current = now;
    if (!changed.length || blank) return;
    setFresh(new Set(changed));
    const t = window.setTimeout(() => setFresh(new Set()), 900);
    return () => clearTimeout(t);
  }, [guess.task, model, mode, effort, files, blank]);

  useEffect(() => {
    const running = log.find((l) => l.state === "running");
    if (!running) return;
    const t = window.setTimeout(() => setLog((x) => x.map((l) => (l.no === running.no ? { ...l, state: "done" } : l))), 2600);
    return () => clearTimeout(t);
  }, [log]);

  const override = <K extends keyof Overrides>(k: K, v: Overrides[K]) => {
    setSet((s) => ({ ...s, [k]: v }));
  };
  const reset = (k: keyof Overrides) => {
    setSet((s) => { const n = { ...s }; delete n[k]; return n; });
    setSay(`Back to the guess for ${k === "files" ? "context" : k}.`);
  };

  const approve = () => {
    if (blank || stamp) return;
    const brief: ReceiptBrief = { text: text.trim(), mode, model, effort, files };
    onRun?.(brief);
    setStamp(true);
    setSay(`Work order ${pad(no)} approved. ${M.name} with ${Mo.name}, ${EFFORT_LABEL[effort]} effort, ${files.length} file${files.length === 1 ? "" : "s"}.`);
    window.setTimeout(() => {
      setLog((x) => [{ no, label: `${M.name} · ${Mo.name} · ${guess.task}`, state: "running" as const }, ...x].slice(0, 3));
      setNo((n) => n + 1);
      setStamp(false);
      setText("");
      setSettled("");
      setSet({});
      setOpen(null);
      setTime(clock());
      prev.current = {};
      area.current?.focus();
    }, 1100);
  };

  /* ⌘↵ approves once the slip has caught up with the last keystroke. */
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!pending || settled !== text) return;
    setPending(false);
    approve();
  });

  const toggle = (l: Line) => setOpen((o) => (o === l ? null : l));
  const isSet = (k: keyof Overrides) => set[k] !== undefined;

  const why = (k: keyof Overrides, g: string) =>
    isSet(k) ? (
      <span className="arcp__why arcp__why--you">
        set by you ·{" "}
        <button type="button" className="arcp__reset" onClick={() => reset(k)}>use guess</button>
      </span>
    ) : (
      <span className="arcp__why">{g}</span>
    );

  return (
    <div className={`arcp arcp--${theme} ${className}`} data-mode={mode} data-maker={Mo.maker} data-effort={effort}>
      <div className="arcp__wrap">
      {/* ---------- the prompt ---------- */}
      <div className="arcp__input">
        <label htmlFor={`${uid}-ta`} className="arcp__label">Task</label>
        <textarea
          ref={area}
          id={`${uid}-ta`}
          rows={6}
          value={text}
          placeholder={"Make the invoice exporter retry with backoff, carefully — keep the CSV byte-identical."}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setSettled(text); setPending(true); }
          }}
        />
        <p className="arcp__hint">The brief prints as you write. Change any line on it, then approve. <kbd>⌘</kbd><kbd>↵</kbd></p>
        {log.length > 0 && (
          <ul className="arcp__log" aria-label="Recent work orders">
            {log.map((l) => (
              <li key={l.no} data-s={l.state}>
                <span className="arcp__lno">No. {pad(l.no)}</span>
                <span className="arcp__lstate">{l.state === "running" ? "running" : "done"}</span>
                <span className="arcp__llabel">{l.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- the slip ---------- */}
      <div className="arcp__feed">
        <section className="arcp__slip" key={no} data-blank={blank || undefined} data-stamp={stamp || undefined} aria-labelledby={`${uid}-title`}>
          <header className="arcp__top">
            <h3 id={`${uid}-title`}>Run brief</h3>
            <span>No. {pad(no)}</span>
          </header>
          <p className="arcp__meta">{time} · {where}</p>
          <hr />

          {blank ? (
            <div className="arcp__empty" aria-live="polite">
              {[70, 52, 84, 46, 60].map((w, i) => <i key={i} style={{ width: `${w}%` }} />)}
              <p>Write a task — the brief prints here.</p>
            </div>
          ) : (
            <dl className="arcp__lines" aria-live="polite">
              <div className="arcp__row arcp__row--task" data-fresh={fresh.has("task") || undefined}>
                <dt>Task</dt>
                <dd><span className="arcp__task">{guess.task}</span></dd>
              </div>

              <div className="arcp__row" data-fresh={fresh.has("model") || undefined}>
                <dt>Agent</dt>
                <dd>
                  <button type="button" className="arcp__val" aria-expanded={open === "model"} aria-controls={`${uid}-model`} onClick={() => toggle("model")}>
                    <MakerLogo maker={Mo.maker} /> {Mo.name}
                  </button>
                  {why("model", guess.model.why)}
                </dd>
                {open === "model" && (
                  <div id={`${uid}-model`} className="arcp__opts" role="group" aria-label="Choose the agent">
                    {MODELS.map((m) => (
                      <button key={m.id} type="button" aria-pressed={m.id === model} data-maker={m.maker} onClick={() => { override("model", m.id); setOpen(null); setSay(`Agent set to ${m.name}.`); }}>
                        <MakerLogo maker={m.maker} /> {m.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="arcp__row" data-fresh={fresh.has("mode") || undefined}>
                <dt>Mode</dt>
                <dd>
                  <button type="button" className="arcp__val arcp__val--mode" aria-expanded={open === "mode"} aria-controls={`${uid}-mode`} onClick={() => toggle("mode")}>
                    <ModeIcon id={mode} /> {M.name}
                  </button>
                  {why("mode", guess.mode.why)}
                </dd>
                {open === "mode" && (
                  <div id={`${uid}-mode`} className="arcp__opts" role="group" aria-label="Choose the mode">
                    {MODES.map((m) => (
                      <button key={m.id} type="button" aria-pressed={m.id === mode} data-m={m.id} title={m.does} onClick={() => { override("mode", m.id); setOpen(null); setSay(`Mode set to ${m.name}.`); }}>
                        <ModeIcon id={m.id} /> {m.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="arcp__row" data-fresh={fresh.has("context") || undefined}>
                <dt>Context</dt>
                <dd>
                  <button type="button" className="arcp__val" aria-expanded={open === "context"} aria-controls={`${uid}-ctx`} onClick={() => toggle("context")}>
                    {files.length ? `${files.length} file${files.length === 1 ? "" : "s"} · ${fmt(use.files)} tokens` : "Message only"}
                  </button>
                  {why("files", guess.files.why)}
                  {files.length > 0 && <span className="arcp__files">{files.map(fileName).join("  ")}</span>}
                </dd>
                {open === "context" && (
                  <div id={`${uid}-ctx`} className="arcp__opts arcp__opts--files" role="group" aria-label="Choose files">
                    {FILES.map((f) => {
                      const on = files.includes(f.path);
                      return (
                        <button key={f.path} type="button" aria-pressed={on} onClick={() => { override("files", on ? files.filter((x) => x !== f.path) : [...files, f.path]); setSay(`${fileName(f.path)} ${on ? "removed" : "added"}.`); }}>
                          <span className="arcp__box" aria-hidden="true">{on ? "×" : ""}</span>
                          {f.path}
                          <span className="arcp__ftok">{fmt(f.tokens)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="arcp__row" data-fresh={fresh.has("effort") || undefined}>
                <dt>Effort</dt>
                <dd>
                  <button type="button" className="arcp__val arcp__val--effort" aria-expanded={open === "effort"} aria-controls={`${uid}-eff`} onClick={() => toggle("effort")}>
                    <span className="arcp__bars" aria-hidden="true">{EFFORT_LABEL.map((_, i) => <i key={i} data-on={i <= effort || undefined} style={{ ["--h" as string]: `${4 + i * 2}px` }} />)}</span>
                    {EFFORT_LABEL[effort]}
                  </button>
                  {why("effort", guess.effort.why)}
                </dd>
                {open === "effort" && (
                  <div id={`${uid}-eff`} className="arcp__opts" role="group" aria-label="Choose the effort">
                    {EFFORT_LABEL.map((l, i) => (
                      <button key={l} type="button" aria-pressed={i === effort} data-e={i} onClick={() => { override("effort", i); setOpen(null); setSay(`Effort set to ${l}.`); }}>
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </dl>
          )}

          <hr />
          <p className="arcp__total">
            <span>Est. context</span>
            <span>{blank ? "—" : `${Math.round(use.pct * 100)}% of ${fmt(use.window)}`}</span>
          </p>
          <button type="button" className="arcp__run" disabled={blank || stamp} onClick={approve}>
            <span>{stamp ? "Approved" : "Run"}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" /></svg>
          </button>
          {stamp && <span className="arcp__stamp" aria-hidden="true">Approved<small>{time}</small></span>}
        </section>
      </div>
      </div>
      <p className="arcp__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
