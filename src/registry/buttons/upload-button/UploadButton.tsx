"use client";
import { useCallback, useEffect, useId, useRef, useState, type DragEvent } from "react";
import { formatBytes, middle, reject, simulated, simulatedDuration } from "./upload";
import "./upload-button.css";

/** Send the file; report progress from 0 to 1; reject to show Retry. */
export type Uploader = (file: File, progress: (p: number) => void, signal: AbortSignal) => Promise<void>;

export type UploadButtonProps = {
  /** button: a compact button; drop: a wide drop target; avatar: a round photo picker. */
  look?: "button" | "drop" | "avatar";
  accept?: string;
  maxBytes?: number;
  upload?: Uploader;
  onUploaded?: (file: File) => void;
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

const Up = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13.5V4M6 7.5 10 3.5l4 4M4 13v2.5h12V13" /></svg>;
const Cloud = () => <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 23H8.5a5.5 5.5 0 0 1-.6-11A8 8 0 0 1 23.4 10 6.5 6.5 0 0 1 24 23h-2" /><path d="M16 26V15M12 19l4-4 4 4" /></svg>;
const Doc = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M5 2.5h6.5L15 6v11.5H5Z" /><path d="M11.5 2.5V6H15" /></svg>;
const X = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m4.5 4.5 7 7M11.5 4.5l-7 7" /></svg>;
const Tick = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3.5 8.5 3 3 6-6.5" /></svg>;
const Camera = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2.5h6.8L17 8h3v11H4Z" /><circle cx="12" cy="13.2" r="3.4" /></svg>;
const Pen = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="m3 13 .7-2.8L10.6 3.3a1.4 1.4 0 0 1 2 2L5.8 12.3Z" /></svg>;

/**
 * Upload Button
 * Click or drop a file. The control itself becomes the progress (name,
 * percentage, a cancel cross), then says it's done, or says what went wrong
 * and offers to retry.
 */
export function UploadButton({ look = "button", accept, maxBytes, upload = simulate, onUploaded, label, hint, theme = "light", className = "" }: UploadButtonProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const abort = useRef<AbortController | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [over, setOver] = useState(false);
  const [say, setSay] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const lastSaid = useRef(0);

  useEffect(() => () => { abort.current?.abort(); }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const start = useCallback((file: File) => {
    const why = reject(file, accept, maxBytes);
    if (why) { setState({ kind: "error", message: why }); setSay(why); return; }
    abort.current?.abort();
    const ctl = new AbortController();
    abort.current = ctl;
    if (look === "avatar" && file.type.startsWith("image/")) setPreview(URL.createObjectURL(file));
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
  }, [accept, maxBytes, look, upload, onUploaded]);

  const pick = () => input.current?.click();
  const cancel = () => {
    abort.current?.abort();
    setState({ kind: "idle" }); setPreview(null); setSay("Upload cancelled");
    requestAnimationFrame(() => trigger.current?.focus());
  };
  const reset = () => { setState({ kind: "idle" }); setPreview(null); requestAnimationFrame(() => trigger.current?.focus()); };
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
    <input ref={input} id={`${id}-f`} type="file" accept={accept} className="upl__input" tabIndex={-1} aria-hidden="true"
      onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) start(f); }} />
  );
  const status = <span className="upl__sr" role="status" aria-live="polite">{say}</span>;
  const errorLine = state.kind === "error" && (
    <span className="upl__error">
      <span>{state.message}</span>
      <button type="button" className="upl__link" onClick={state.file ? retry : pick}>{state.file ? "Retry" : "Choose another"}</button>
    </span>
  );

  if (look === "avatar") {
    const r = 47, c = 2 * Math.PI * r;
    return (
      <div className={`upl upl--${theme} upl--avatar ${className}`} data-state={state.kind} data-over={over || undefined}>
        <button ref={trigger} type="button" className="upl__face" onClick={busy ? undefined : pick} aria-busy={busy || undefined}
          aria-label={state.kind === "done" ? "Change photo" : busy ? `Uploading photo, ${pct} percent` : label ?? "Add a photo"} {...drag}>
          {preview ? <img src={preview} alt="" /> : <span className="upl__face-icon"><Camera /></span>}
          <svg className="upl__ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r={r} />
            <circle cx="50" cy="50" r={r} style={{ strokeDasharray: c, strokeDashoffset: c * (1 - (busy ? state.p : state.kind === "done" ? 1 : 0)) }} />
          </svg>
          {state.kind === "done" && <span className="upl__badge"><Pen /></span>}
          {busy && <span className="upl__pct">{pct}%</span>}
        </button>
        <div className="upl__caption">
          {state.kind === "idle" && <><strong>{label ?? "Add a photo"}</strong><span>{hint ?? "Click or drop an image"}</span></>}
          {busy && <><strong>Uploading…</strong><button type="button" className="upl__link" onClick={cancel}>Cancel</button></>}
          {state.kind === "done" && <><strong className="upl__ok"><Tick /> Photo updated</strong><button type="button" className="upl__link" onClick={reset}>Remove</button></>}
          {errorLine}
        </div>
        {hiddenInput}{status}
      </div>
    );
  }

  if (look === "drop") {
    return (
      <div className={`upl upl--${theme} upl--drop ${className}`} data-state={state.kind} data-over={over || undefined} {...drag}>
        {busy || state.kind === "done" ? (
          <div className="upl__card">
            <span className="upl__doc"><Doc /></span>
            <span className="upl__meta">
              <strong title={file!.name}>{middle(file!.name, 26)}</strong>
              <small>{busy ? `${formatBytes(Math.round(file!.size * state.p))} of ${formatBytes(file!.size)}` : `${formatBytes(file!.size)} · uploaded`}</small>
              <span className="upl__bar" role="progressbar" aria-label={`Uploading ${file!.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={busy ? pct : 100}>
                <i style={{ transform: `scaleX(${busy ? state.p : 1})` }} />
              </span>
            </span>
            {busy
              ? <><span className="upl__num">{pct}%</span><button type="button" className="upl__x" onClick={cancel} aria-label={`Cancel uploading ${file!.name}`}><X /></button></>
              : <><span className="upl__done" aria-hidden="true"><Tick /></span><button ref={trigger} type="button" className="upl__link" onClick={reset}>Upload another</button></>}
          </div>
        ) : (
          <button ref={trigger} type="button" className="upl__zone" onClick={pick}>
            <span className="upl__cloud"><Cloud /></span>
            <span className="upl__lines">
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

  return (
    <div className={`upl upl--${theme} upl--button ${className}`} data-state={state.kind} data-over={over || undefined}>
      {busy ? (
        <div className="upl__pill" role="group" aria-label={`Uploading ${file!.name}`}>
          <i className="upl__progress" style={{ transform: `scaleX(${state.p})` }} aria-hidden="true" />
          <span className="upl__doc"><Doc /></span>
          <span className="upl__name" title={file!.name}>{middle(file!.name)}</span>
          <span className="upl__num" role="progressbar" aria-label="Upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>{pct}%</span>
          <button type="button" className="upl__x" onClick={cancel} aria-label={`Cancel uploading ${file!.name}`}><X /></button>
        </div>
      ) : state.kind === "done" ? (
        <div className="upl__pill upl__pill--done">
          <span className="upl__done" aria-hidden="true"><Tick /></span>
          <span className="upl__name" title={file!.name}>{middle(file!.name)}</span>
          <button ref={trigger} type="button" className="upl__link" onClick={pick}>Replace</button>
        </div>
      ) : (
        <button ref={trigger} type="button" className="upl__btn" onClick={pick} {...drag}><Up />{over ? "Drop to upload" : label ?? "Upload file"}</button>
      )}
      {errorLine}
      {hiddenInput}{status}
    </div>
  );
}
