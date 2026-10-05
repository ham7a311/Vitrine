"use client";
import { useId, useRef, useState, type DragEvent } from "react";
import { COLUMN_TYPES, identifier, inferColumns, parseCsv, type ColumnType, type InferredColumn } from "./csv";
import "./schema-drop.css";

export type NewTable = { name: string; columns: { name: string; type: ColumnType }[]; rows: string[][] };
export type SchemaDropProps = {
  /** Create the table in your engine; reject to show the error and keep the form. */
  onCreate: (table: NewTable) => Promise<void>;
  /** Optional sample files offered under the drop zone. */
  samples?: { label: string; name: string; text: string }[];
  maxBytes?: number;
  locale?: string;
  theme?: "light" | "dark";
  className?: string;
};

type Loaded = { file: string; rows: string[][]; columns: InferredColumn[]; table: string };

/**
 * Schema Drop
 * Drop a CSV and see the table it will become: column names made safe,
 * a type inferred for each from its values (and editable), a preview of the
 * first rows, then one button to create it.
 */
export function SchemaDrop({ onCreate, samples = [], maxBytes = 10 * 1024 * 1024, locale, theme = "light", className = "" }: SchemaDropProps) {
  const id = useId();
  const [over, setOver] = useState(false);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [problem, setProblem] = useState("");
  const [phase, setPhase] = useState<"edit" | "creating" | "created" | "failed">("edit");
  const [failure, setFailure] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const tableField = useRef<HTMLInputElement>(null);
  const num = new Intl.NumberFormat(locale);

  const load = (name: string, text: string) => {
    const rows = parseCsv(text);
    if (rows.length < 2) { setProblem(`${name} has no data rows under its header.`); return; }
    setProblem("");
    setPhase("edit");
    setLoaded({ file: name, rows, columns: inferColumns(rows), table: identifier(name.replace(/\.[^.]+$/, ""), "new_table") });
    requestAnimationFrame(() => tableField.current?.focus());
  };
  const readFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > maxBytes) { setProblem(`${file.name} is ${num.format(Math.round(file.size / 1024 / 1024))} MB; the limit here is ${num.format(Math.round(maxBytes / 1024 / 1024))} MB.`); return; }
    if (!/\.(csv|tsv|txt)$/i.test(file.name) && !/csv|text\/plain|tab-separated/.test(file.type)) { setProblem(`${file.name} doesn't look like a CSV file.`); return; }
    try { load(file.name, await file.text()); } catch { setProblem(`${file.name} couldn't be read.`); }
  };
  const drop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setOver(false); readFile(e.dataTransfer.files[0]); };

  const validName = loaded ? /^[a-z_][a-z0-9_]*$/.test(loaded.table) : false;
  const create = async () => {
    if (!loaded || !validName || phase === "creating") return;
    setPhase("creating");
    try {
      await onCreate({ name: loaded.table, columns: loaded.columns.map(({ name, type }) => ({ name, type })), rows: loaded.rows.slice(1) });
      setPhase("created");
    } catch (e) {
      setFailure((e as Error)?.message || "The table couldn't be created.");
      setPhase("failed");
    }
  };
  const reset = () => { setLoaded(null); setPhase("edit"); setProblem(""); requestAnimationFrame(() => input.current?.focus()); };
  const setType = (i: number, type: ColumnType) => setLoaded((l) => l && { ...l, columns: l.columns.map((c, j) => (j === i ? { ...c, type } : c)) });

  if (!loaded) {
    return (
      <div className={`sdrop sdrop--${theme} ${className}`}>
        <div className="sdrop__zone" data-over={over || undefined} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={drop}>
          <svg className="sdrop__icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M12 6h17l9 9v27H12z" /><path d="M29 6v9h9" /><path d="M18 26h14M18 32h14M18 38h9" /></svg>
          <p className="sdrop__lead">Drop a CSV to make a table</p>
          <p className="sdrop__sub">Column types are inferred from the values. Nothing leaves your browser until you create it.</p>
          <label className="sdrop__choose">
            <input ref={input} type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values" onChange={(e) => { readFile(e.target.files?.[0]); e.target.value = ""; }} />
            Choose a file
          </label>
          {samples.length > 0 && (
            <p className="sdrop__samples">or try {samples.map((s, i) => <span key={s.name}>{i > 0 && " · "}<button type="button" onClick={() => load(s.name, s.text)}>{s.label}</button></span>)}</p>
          )}
        </div>
        <p className="sdrop__problem" role="alert">{problem}</p>
      </div>
    );
  }

  const body = loaded.rows.slice(1);
  return (
    <div className={`sdrop sdrop--${theme} ${className}`} data-phase={phase}>
      <div className="sdrop__card">
        <header className="sdrop__head">
          <p className="sdrop__file"><span>{loaded.file}</span>{num.format(body.length)} rows · {loaded.columns.length} columns</p>
          <button type="button" className="sdrop__ghost" onClick={reset} disabled={phase === "creating"}>Change file</button>
        </header>

        <div className="sdrop__name">
          <label htmlFor={`${id}-table`}>Table name</label>
          <input ref={tableField} id={`${id}-table`} value={loaded.table} spellCheck={false} disabled={phase === "creating" || phase === "created"}
            aria-invalid={!validName || undefined} aria-describedby={`${id}-table-hint`}
            onChange={(e) => setLoaded((l) => l && { ...l, table: e.target.value })} />
          <p id={`${id}-table-hint`} className="sdrop__hint" data-bad={!validName || undefined}>{validName ? "Lowercase letters, numbers and underscores." : "Use lowercase letters, numbers and underscores, starting with a letter."}</p>
        </div>

        <table className="sdrop__columns">
          <caption className="sdrop__caption">Columns</caption>
          <thead><tr><th scope="col">Column</th><th scope="col">Type</th><th scope="col">Nulls</th><th scope="col" className="sdrop__samples-col">Sample</th></tr></thead>
          <tbody>
            {loaded.columns.map((c, i) => (
              <tr key={i}>
                <th scope="row"><code>{c.name}</code></th>
                <td>
                  <select aria-label={`Type for ${c.name}`} value={c.type} data-type={c.type} disabled={phase === "creating" || phase === "created"} onChange={(e) => setType(i, e.target.value as ColumnType)}>
                    {COLUMN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </td>
                <td className="sdrop__nulls">{body.length ? `${Math.round((c.nulls / body.length) * 100)}%` : "–"}</td>
                <td className="sdrop__samples-col"><span>{c.samples.join(", ") || "—"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sdrop__preview" tabIndex={0} role="region" aria-label="First five rows">
          <table>
            <thead><tr>{loaded.columns.map((c) => <th key={c.name} scope="col">{c.name}</th>)}</tr></thead>
            <tbody>{body.slice(0, 5).map((r, i) => <tr key={i}>{loaded.columns.map((_, c) => <td key={c}>{r[c] ?? ""}</td>)}</tr>)}</tbody>
          </table>
        </div>

        <footer className="sdrop__foot">
          {phase === "created" ? (
            <p className="sdrop__done" role="status"><span aria-hidden="true">✓</span> Created <code>{loaded.table}</code> with {num.format(body.length)} rows.</p>
          ) : phase === "failed" ? (
            <p className="sdrop__failed" role="alert">{failure}</p>
          ) : <span />}
          {phase === "created"
            ? <button type="button" className="sdrop__go" onClick={reset}>Load another file</button>
            : <button type="button" className="sdrop__go" onClick={create} disabled={!validName || phase === "creating"}>{phase === "creating" ? "Creating…" : phase === "failed" ? "Try again" : "Create table"}</button>}
        </footer>
      </div>
    </div>
  );
}
