"use client";
import { useCallback, useEffect, useId, useRef, useState, type DragEvent } from "react";
import { formatBytes, middle, reject, simulated, simulatedDuration } from "./upload";
import "./drop-upload-button.css";

/** Send the file; report progress from 0 to 1; reject to show Retry. */
export type Uploader = (file: File, progress: (p: number) => void, signal: AbortSignal) => Promise<void>;

export type UploadDropZoneProps = {
  accept?: string;
  maxBytes?: number;
  upload?: Uploader;
  onUploaded?: (file: File) => void;
  /** Unused; the drop zone writes its own prompt. */
  label?: string;
  hint?: string;
  theme?: "light" | "dark";
  className?: string;
};

type State =
  | { kind: "idle" }
  | { kind: "sending"; file: File; p: number }
  | { kind: "done"; file: File }
  | { kind: "error"; file?: File; message: string };

// A stand-in for a real request: believable progress, cancellable, and it fails when offline.
const simulate: Uploader = (file, progress, signal) => new Promise((resolve, reject) => {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return reject(new Error("You're offline."));
  const t0 = performance.now(), total = simulatedDuration(file.size);
  let raf = 0;
  const tick = (now: number) => {
    const t = now - t0;
    progress(simulated(t, file.size));
    if (t >= total) return resolve();
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  signal.addEventListener("abort", () => { cancelAnimationFrame(raf); reject(new DOMException("Cancelled", "AbortError")); });
});

const Cloud = () => <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 23H8.5a5.5 5.5 0 0 1-.6-11A8 8 0 0 1 23.4 10 6.5 6.5 0 0 1 24 23h-2" /><path d="M16 26V15M12 19l4-4 4 4" /></svg>;
const Doc = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M5 2.5h6.5L15 6v11.5H5Z" /><path d="M11.5 2.5V6H15" /></svg>;
const X = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m4.5 4.5 7 7M11.5 4.5l-7 7" /></svg>;
const Tick = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3.5 8.5 3 3 6-6.5" /></svg>;

/**
 * Upload Drop Zone
 * A wide dashed target for files: drop one on it or click to browse. It turns
 * into a file card with a progress bar, then says it's done, or says what
 * went wrong and offers to retry.
 */
export function UploadDropZone({ accept, maxBytes, upload = simulate, onUploaded, hint, theme = "light", className = "" }: UploadDropZoneProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const abort = useRef<AbortController | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [over, setOver] = useState(false);
  const [say, setSay] = useState("");
  const lastSaid = useRef(0);

  useEffect(() => () => { abort.current?.abort(); }, []);

  const start = useCallback((file: File) => {
    const why = reject(file, accept, maxBytes);
    if (why) { setState({ kind: "error", message: why }); setSay(why); return; }
    abort.current?.abort();
    const ctl = new AbortController();
    abort.current = ctl;
    setState({ kind: "sending", file, p: 0 });
    setSay(`Uploading ${file.name}`);
    lastSaid.current = 0;
    upload(file, (p) => {
      if (ctl.signal.aborted) return;
      setState({ kind: "sending", file, p });
      // Announce progress in quarters, not every frame.
      const q = Math.floor(p * 4);
      if (q > lastSaid.current && q < 4) { lastSaid.current = q; setSay(`${q * 25} percent`); }
    }, ctl.signal).then(
      () => { if (ctl.signal.aborted) return; setState({ kind: "done", file }); setSay(`${file.name} uploaded`); onUploaded?.(file); },
      (e: unknown) => {
        if (ctl.signal.aborted) return;
        const message = e instanceof Error && e.message ? e.message : "The upload didn't finish.";
        setState({ kind: "error", file, message }); setSay(`Upload failed. ${message}`);
      },
    );
  }, [accept, maxBytes, upload, onUploaded]);

  const pick = () => input.current?.click();
  const cancel = () => {
    abort.current?.abort();
    setState({ kind: "idle" }); setSay("Upload cancelled");
    requestAnimationFrame(() => trigger.current?.focus());
  };
  const reset = () => { setState({ kind: "idle" }); requestAnimationFrame(() => trigger.current?.focus()); };
  const retry = () => { if (state.kind === "error" && state.file) start(state.file); else pick(); };

  const drag = {
    onDragEnter: (e: DragEvent) => { e.preventDefault(); setOver(true); },
    onDragOver: (e: DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; },
    onDragLeave: (e: DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false); },
    onDrop: (e: DragEvent) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files?.[0]; if (f) start(f); },
  };

  const pct = state.kind === "sending" ? Math.round(state.p * 100) : 0;
  const file = "file" in state ? state.file : undefined;
  const busy = state.kind === "sending";
  const hiddenInput = (
    <input ref={input} id={`${id}-f`} type="file" accept={accept} className="dzub__input" tabIndex={-1} aria-hidden="true"
      onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) start(f); }} />
  );
  const status = <span className="dzub__sr" role="status" aria-live="polite">{say}</span>;
  const errorLine = state.kind === "error" && (
    <span className="dzub__error">
      <span>{state.message}</span>
      <button type="button" className="dzub__link" onClick={state.file ? retry : pick}>{state.file ? "Retry" : "Choose another"}</button>
    </span>
  );

  return (
    <div className={`dzub dzub--${theme} dzub--drop ${className}`} data-state={state.kind} data-over={over || undefined} {...drag}>
      {busy || state.kind === "done" ? (
        <div className="dzub__card">
          <span className="dzub__doc"><Doc /></span>
          <span className="dzub__meta">
            <strong title={file!.name}>{middle(file!.name, 26)}</strong>
            <small>{busy ? `${formatBytes(Math.round(file!.size * state.p))} of ${formatBytes(file!.size)}` : `${formatBytes(file!.size)} · uploaded`}</small>
            <span className="dzub__bar" role="progressbar" aria-label={`Uploading ${file!.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={busy ? pct : 100}>
              <i style={{ transform: `scaleX(${busy ? state.p : 1})` }} />
            </span>
          </span>
          {busy
            ? <><span className="dzub__num">{pct}%</span><button type="button" className="dzub__x" onClick={cancel} aria-label={`Cancel uploading ${file!.name}`}><X /></button></>
            : <><span className="dzub__done" aria-hidden="true"><Tick /></span><button ref={trigger} type="button" className="dzub__link" onClick={reset}>Upload another</button></>}
        </div>
      ) : (
        <button ref={trigger} type="button" className="dzub__zone" onClick={pick}>
          <span className="dzub__cloud"><Cloud /></span>
          <span className="dzub__lines">
            <strong>{over ? "Drop to upload" : <>Drop a file here or <u>browse</u></>}</strong>
            <small>{hint ?? "PDF, PNG or JPG, up to 20 MB"}</small>
          </span>
        </button>
      )}
      {errorLine}
      {hiddenInput}{status}
    </div>
  );
}
