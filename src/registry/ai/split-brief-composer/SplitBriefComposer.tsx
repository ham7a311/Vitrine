"use client";
import { useEffect, useId, useMemo, useState } from "react";
import { EFFORT_HINT, EFFORT_LABEL, FILES, MODELS, MODES, fileName, fmt, usage, type ModeId, type ModelId } from "./brief";
import { infer } from "./infer";
import { MakerLogo, ModeIcon } from "./logos";
import "./split-brief-composer.css";

/**
 * Split-Brief Composer
 * Two surfaces, like a mission briefing: on the left, what should happen; on the right, how the agent
 * should do it. The right side reads the left as you write and marks what it would suggest — a mode,
 * the files you named, more effort for careful work — but nothing changes until you accept it.
 */

export type SplitBrief = { text: string; mode: ModeId; model: ModelId; effort: number; files: string[] };

export type SplitBriefComposerProps = {
  defaultMode?: ModeId;
  defaultModel?: ModelId;
  defaultEffort?: number;
  defaultFiles?: string[];
  defaultText?: string;
  onSend?: (brief: SplitBrief) => void;
  theme?: "dark" | "light";
  className?: string;
};

const I = {
  up: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" /></svg>,
  tick: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>,
  chev: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>,
};

export function SplitBriefComposer({ defaultMode = "agent", defaultModel = "astra", defaultEffort = 1, defaultFiles = [], defaultText = "", onSend, theme = "dark", className = "" }: SplitBriefComposerProps) {
  const uid = useId();
  const [text, setText] = useState(defaultText);
  const [mode, setMode] = useState<ModeId>(defaultMode);
  const [model, setModel] = useState<ModelId>(defaultModel);
  const [effort, setEffort] = useState(defaultEffort);
  const [files, setFiles] = useState<string[]>(defaultFiles);
  const [drawer, setDrawer] = useState(false);
  const [run, setRun] = useState<{ state: "running" | "done"; label: string } | null>(null);
  const [say, setSay] = useState("");

  /* The right side catches up a beat after typing stops. */
  const [read, setRead] = useState(defaultText);
  useEffect(() => {
    const t = window.setTimeout(() => setRead(text), 350);
    return () => clearTimeout(t);
  }, [text]);
  const g = useMemo(() => infer(read), [read]);
  const blank = !read.trim();

  const M = MODES.find((m) => m.id === mode)!;
  const Mo = MODELS.find((m) => m.id === model)!;
  const use = usage(files, effort, Mo);
  const pct = Math.round(use.pct * 100);

  /* What the right side would change, if you let it. */
  const sMode = !blank && g.mode.value !== mode ? g.mode : null;
  const sModel = !blank && g.model.value !== model ? g.model : null;
  const sEffort = !blank && g.effort.value > effort ? g.effort : null;
  const sFiles = blank ? [] : g.files.value.filter((p) => !files.includes(p));
  const count = (sMode ? 1 : 0) + (sModel ? 1 : 0) + (sEffort ? 1 : 0) + (sFiles.length ? 1 : 0);

  const applyAll = () => {
    if (sMode) setMode(sMode.value);
    if (sModel) setModel(sModel.value);
    if (sEffort) setEffort(sEffort.value);
    if (sFiles.length) setFiles((f) => [...f, ...sFiles]);
    setSay(`Applied ${count} suggestion${count === 1 ? "" : "s"}.`);
  };

  useEffect(() => {
    if (run?.state !== "running") return;
    const t = window.setTimeout(() => setRun((r) => (r ? { ...r, state: "done" } : r)), 2400);
    return () => clearTimeout(t);
  }, [run]);
  const send = () => {
    if (!text.trim()) { setSay("Say what should happen first."); return; }
    onSend?.({ text: text.trim(), mode, model, effort, files });
    setRun({ state: "running", label: `${M.name} · ${Mo.name} · ${EFFORT_LABEL[effort]} · ${files.length} file${files.length === 1 ? "" : "s"}` });
    setSay("Brief sent.");
    setText("");
    setRead("");
  };

  const tag = (why: string) => (
    <span className="spbf__tag" title={why}>
      <i aria-hidden="true" />suggested
    </span>
  );

  // Mentioned files rise to the top of the list.
  const mentioned = new Set(blank ? [] : g.files.value);
  const fileList = [...FILES].sort((a, b) => Number(mentioned.has(b.path)) - Number(mentioned.has(a.path)));

  return (
    <div className={`spbf spbf--${theme} ${className}`} data-mode={mode} data-maker={Mo.maker} data-effort={effort} data-drawer={drawer || undefined}>
      <div className="spbf__card">
        {/* ---------- what ---------- */}
        <section className="spbf__what" aria-labelledby={`${uid}-what`}>
          <h3 id={`${uid}-what`} className="spbf__h">What should happen?</h3>
          {run && (
            <p className="spbf__run" data-s={run.state} aria-live="polite">
              <span className="spbf__runicon" aria-hidden="true">{run.state === "running" ? <i className="spbf__spin" /> : I.tick}</span>
              {run.state === "running" ? "Running" : "Done"} <span>{run.label}</span>
            </p>
          )}
          <textarea
            className="spbf__prompt"
            aria-labelledby={`${uid}-what`}
            value={text}
            placeholder={"Exports time out on Fridays. Find out why, then make the exporter retry with backoff — carefully."}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
          />
          <div className="spbf__whatfoot">
            <span>{text.trim() ? `${text.trim().split(/\s+/).length} words` : "Plain words are fine — the right side reads them."}</span>
            <span className="spbf__keys" aria-hidden="true"><kbd>⌘</kbd><kbd>↵</kbd></span>
            <button type="button" className="spbf__go" aria-label="Send the brief" aria-keyshortcuts="Meta+Enter Control+Enter" aria-disabled={!text.trim() || undefined} onClick={send}>
              {I.up}
            </button>
          </div>
        </section>

        {/* ---------- how ---------- */}
        <section className="spbf__how" aria-labelledby={`${uid}-how`}>
          <button type="button" className="spbf__summary" aria-expanded={drawer} aria-controls={`${uid}-howbody`} onClick={() => setDrawer((d) => !d)}>
            <span className="spbf__h">How</span>
            <span className="spbf__sumval"><ModeIcon id={mode} />{M.name} · {Mo.short} · {EFFORT_LABEL[effort]} · {files.length} file{files.length === 1 ? "" : "s"}</span>
            {count > 0 && <span className="spbf__count">{count}</span>}
            {I.chev}
          </button>
          <div className="spbf__howhead">
            <h3 id={`${uid}-how`} className="spbf__h">How should the agent do it?</h3>
            {count > 0 && (
              <button type="button" className="spbf__apply" onClick={applyAll}>
                Apply {count} suggestion{count === 1 ? "" : "s"}
              </button>
            )}
          </div>

          <div id={`${uid}-howbody`} className="spbf__howbody">
            <fieldset className="spbf__group">
              <legend>Mode</legend>
              <div className="spbf__opts" role="radiogroup" aria-label="Mode">
                {MODES.map((m) => (
                  <button key={m.id} type="button" role="radio" aria-checked={m.id === mode} className="spbf__opt" data-m={m.id} aria-description={m.does} onClick={() => { setMode(m.id); setSay(`${m.name} mode.`); }}>
                    <ModeIcon id={m.id} />
                    <span>{m.name}</span>
                    {sMode?.value === m.id && tag(sMode.why)}
                  </button>
                ))}
              </div>
              {sMode && <p className="spbf__why">Suggested {MODES.find((m) => m.id === sMode.value)!.name}: {sMode.why}.</p>}
            </fieldset>

            <fieldset className="spbf__group">
              <legend>Model</legend>
              <div className="spbf__opts" role="radiogroup" aria-label="Model">
                {MODELS.map((m) => (
                  <button key={m.id} type="button" role="radio" aria-checked={m.id === model} className="spbf__opt" data-maker={m.maker} onClick={() => { setModel(m.id); setSay(`${m.name}.`); }}>
                    <MakerLogo maker={m.maker} />
                    <span>{m.name}</span>
                    {sModel?.value === m.id && tag(sModel.why)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="spbf__group">
              <legend>Effort</legend>
              <div className="spbf__effort" role="radiogroup" aria-label="Effort">
                {EFFORT_LABEL.map((l, i) => (
                  <button key={l} type="button" role="radio" aria-checked={i === effort} data-on={i <= effort || undefined} data-e={i} data-sug={sEffort?.value === i || undefined} aria-description={EFFORT_HINT[i]} onClick={() => { setEffort(i); setSay(`${l} effort.`); }}>
                    <i style={{ ["--h" as string]: `${8 + i * 4}px` }} aria-hidden="true" />
                    <span>{l}</span>
                  </button>
                ))}
              </div>
              {sEffort && <p className="spbf__why">Suggested {EFFORT_LABEL[sEffort.value]}: {sEffort.why}.</p>}
            </fieldset>

            <fieldset className="spbf__group">
              <legend>
                Context <small>{fmt(use.files)} tokens · {pct}% of {Mo.short}</small>
              </legend>
              <ul className="spbf__files">
                {fileList.map((f) => {
                  const on = files.includes(f.path);
                  return (
                    <li key={f.path}>
                      <button type="button" role="checkbox" aria-checked={on} className="spbf__file" data-mentioned={mentioned.has(f.path) || undefined} onClick={() => { setFiles((x) => (on ? x.filter((p) => p !== f.path) : [...x, f.path])); setSay(`${fileName(f.path)} ${on ? "removed" : "added"}.`); }}>
                        <b className="spbf__box" aria-hidden="true">{on && I.tick}</b>
                        <span>{f.path}</span>
                        {mentioned.has(f.path) && <span className="spbf__ment">{on ? "mentioned" : "mentioned · add"}</span>}
                        <small>{fmt(f.tokens)}</small>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </div>
        </section>
      </div>
      <p className="spbf__sr" role="status" aria-live="polite">{say}</p>
    </div>
  );
}
