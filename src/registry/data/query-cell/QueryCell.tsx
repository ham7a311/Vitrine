"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { tokenize } from "./sql";
import "./query-cell.css";

export type ResultColumn = { name: string; type: string };
export type QueryResult = { columns: ResultColumn[]; rows: unknown[][] };
/** Throw one of these (or anything with a message and optional line) to mark the failing line. */
export type QueryError = Error & { line?: number };
export type QueryCellProps = {
  defaultSql: string;
  /** Run the query against your engine. The signal aborts when the user cancels. */
  run: (sql: string, signal: AbortSignal) => Promise<QueryResult>;
  /** Shown in the cell's header, e.g. the cell or dataset name. */
  title?: string;
  maxRows?: number;
  locale?: string;
  theme?: "light" | "dark";
  className?: string;
};

type State =
  | { kind: "idle" }
  | { kind: "running"; started: number }
  | { kind: "done"; result: QueryResult; ms: number }
  | { kind: "error"; message: string; line?: number }
  | { kind: "cancelled" };

const numeric = /^(BIGINT|INTEGER|INT|SMALLINT|TINYINT|HUGEINT|DOUBLE|FLOAT|REAL|DECIMAL|NUMERIC|UBIGINT|UINTEGER)/i;

/**
 * Query Cell
 * A notebook SQL cell: a plain textarea with a highlighted copy behind it,
 * ⌘/Ctrl + Enter to run, a status strip that says how many rows and how
 * long, and a result grid with typed column headers. Errors mark their line.
 */
export function QueryCell({ defaultSql, run, title = "query", maxRows = 200, locale, theme = "light", className = "" }: QueryCellProps) {
  const id = useId();
  const [sql, setSql] = useState(defaultSql);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [elapsed, setElapsed] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const highlight = useRef<HTMLPreElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const tokens = useMemo(() => tokenize(sql + (sql.endsWith("\n") ? " " : "")), [sql]);
  const lines = sql.split("\n").length;
  const num = new Intl.NumberFormat(locale);

  useEffect(() => {
    if (state.kind !== "running") return;
    const t = setInterval(() => setElapsed(Math.round(performance.now() - state.started)), 47);
    return () => clearInterval(t);
  }, [state]);
  useEffect(() => () => controller.current?.abort(), []);

  const execute = async () => {
    if (state.kind === "running" || !sql.trim()) return;
    const ctrl = new AbortController();
    controller.current = ctrl;
    const started = performance.now();
    setElapsed(0);
    setState({ kind: "running", started });
    try {
      const result = await run(sql, ctrl.signal);
      if (ctrl.signal.aborted) return;
      setState({ kind: "done", result, ms: Math.max(1, Math.round(performance.now() - started)) });
    } catch (e) {
      if (ctrl.signal.aborted) return;
      const err = e as QueryError;
      setState({ kind: "error", message: err?.message || "The query failed.", line: typeof err?.line === "number" ? err.line : undefined });
    }
  };
  const cancel = () => { controller.current?.abort(); setState({ kind: "cancelled" }); };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); execute(); return; }
    if (e.key === "Escape" && state.kind === "running") { e.preventDefault(); cancel(); return; }
  };
  const sync = () => {
    const el = field.current;
    if (!el) return;
    if (highlight.current) { highlight.current.scrollTop = el.scrollTop; highlight.current.scrollLeft = el.scrollLeft; }
    if (gutter.current) gutter.current.scrollTop = el.scrollTop;
  };

  const errorLine = state.kind === "error" ? state.line : undefined;
  const result = state.kind === "done" ? state.result : null;
  const shown = result ? result.rows.slice(0, maxRows) : [];

  return (
    <section className={`qcell qcell--${theme} ${className}`} aria-labelledby={`${id}-title`} data-state={state.kind}>
      <header className="qcell__head">
        <p id={`${id}-title`} className="qcell__title"><span aria-hidden="true" className="qcell__lang">SQL</span>{title}</p>
        <div className="qcell__actions">
          {state.kind === "running" && <button type="button" className="qcell__btn qcell__btn--ghost" onClick={cancel}>Cancel</button>}
          <button type="button" className="qcell__btn qcell__btn--run" onClick={execute} disabled={state.kind === "running"} aria-keyshortcuts="Meta+Enter Control+Enter">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" /></svg>{state.kind === "running" ? "Running" : "Run"}
          </button>
        </div>
      </header>

      <div className="qcell__editor">
        <div ref={gutter} className="qcell__gutter" aria-hidden="true">
          {Array.from({ length: lines }, (_, i) => <span key={i} data-error={errorLine === i + 1 || undefined}>{i + 1}</span>)}
        </div>
        <div className="qcell__code">
          <pre ref={highlight} className="qcell__highlight" aria-hidden="true">
            {tokens.map((t, i) => t.type === "space" ? t.text : <span key={i} className={`qcell__t-${t.type}`}>{t.text}</span>)}
          </pre>
          <textarea
            ref={field}
            className="qcell__input"
            value={sql}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label={`SQL for ${title}. Press Control or Command with Enter to run.`}
            aria-describedby={`${id}-status`}
            aria-invalid={state.kind === "error" || undefined}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={onKey}
            onScroll={sync}
            rows={Math.max(4, lines)}
            wrap="off"
          />
        </div>
      </div>

      <p id={`${id}-status`} className="qcell__status" role="status">
        {state.kind === "idle" && <><kbd>⌘</kbd><kbd>↵</kbd> to run</>}
        {state.kind === "running" && <><span className="qcell__spin" aria-hidden="true" />Running · {num.format(elapsed)} ms</>}
        {state.kind === "done" && <><b>{num.format(state.result.rows.length)}</b> {state.result.rows.length === 1 ? "row" : "rows"} · {num.format(state.ms)} ms{state.result.rows.length > maxRows ? ` · showing first ${num.format(maxRows)}` : ""}</>}
        {state.kind === "error" && <>Error{state.line ? ` on line ${state.line}` : ""}</>}
        {state.kind === "cancelled" && <>Cancelled</>}
      </p>

      {state.kind === "error" && <pre className="qcell__error" role="alert">{state.message}</pre>}

      {result && (
        <div className="qcell__results" tabIndex={0} role="region" aria-label={`Results, ${result.rows.length} rows`}>
          <table>
            <thead>
              <tr>{result.columns.map((c) => <th key={c.name} scope="col" data-num={numeric.test(c.type) || undefined}><span className="qcell__col">{c.name}</span><span className="qcell__type">{c.type}</span></th>)}</tr>
            </thead>
            <tbody>
              {shown.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => {
                    const isNum = numeric.test(result.columns[c]?.type ?? "");
                    return <td key={c} data-num={isNum || undefined} data-null={cell === null || undefined}>{cell === null ? "NULL" : isNum && typeof cell === "number" ? num.format(cell) : String(cell)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
