"use client";
import { useCallback, useEffect, useId, useRef, useState, type DragEvent } from "react";
import { formatBytes, middle, reject, simulated, simulatedDuration } from "./upload";
import "./avatar-upload-button.css";

/** Send the file; report progress from 0 to 1; reject to show Retry. */
export type Uploader = (file: File, progress: (p: number) => void, signal: AbortSignal) => Promise<void>;

export type AvatarUploadProps = {
  accept?: string;
  maxBytes?: number;
  upload?: Uploader;
  onUploaded?: (file: File) => void;
  /** The idle title ("Add a photo"). */
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

const Tick = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3.5 8.5 3 3 6-6.5" /></svg>;
const Camera = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2.5h6.8L17 8h3v11H4Z" /><circle cx="12" cy="13.2" r="3.4" /></svg>;
const Pen = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="m3 13 .7-2.8L10.6 3.3a1.4 1.4 0 0 1 2 2L5.8 12.3Z" /></svg>;

/**
 * Avatar Upload
 * A round photo picker whose ring is the progress. Your chosen photo shows at
 * once, dimmed, while the ring fills around it; then it says it's done, or
 * says what went wrong and offers to retry.
 */
export function AvatarUpload({ accept, maxBytes, upload = simulate, onUploaded, label, hint, theme = "light", className = "" }: AvatarUploadProps) {
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
    if (file.type.startsWith("image/")) setPreview(URL.createObjectURL(file));
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
    <input ref={input} id={`${id}-f`} type="file" accept={accept} className="avub__input" tabIndex={-1} aria-hidden="true"
      onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) start(f); }} />
  );
  const status = <span className="avub__sr" role="status" aria-live="polite">{say}</span>;
  const errorLine = state.kind === "error" && (
    <span className="avub__error">
      <span>{state.message}</span>
      <button type="button" className="avub__link" onClick={state.file ? retry : pick}>{state.file ? "Retry" : "Choose another"}</button>
    </span>
  );

  const r = 47, c = 2 * Math.PI * r;
  return (
    <div className={`avub avub--${theme} avub--avatar ${className}`} data-state={state.kind} data-over={over || undefined}>
      <button ref={trigger} type="button" className="avub__face" onClick={busy ? undefined : pick} aria-busy={busy || undefined}
        aria-label={state.kind === "done" ? "Change photo" : busy ? `Uploading photo, ${pct} percent` : label ?? "Add a photo"} {...drag}>
        {preview ? <img src={preview} alt="" /> : <span className="avub__face-icon"><Camera /></span>}
        <svg className="avub__ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r={r} />
          <circle cx="50" cy="50" r={r} style={{ strokeDasharray: c, strokeDashoffset: c * (1 - (busy ? state.p : state.kind === "done" ? 1 : 0)) }} />
        </svg>
        {state.kind === "done" && <span className="avub__badge"><Pen /></span>}
        {busy && <span className="avub__pct">{pct}%</span>}
      </button>
      <div className="avub__caption">
        {state.kind === "idle" && <><strong>{label ?? "Add a photo"}</strong><span>{hint ?? "Click or drop an image"}</span></>}
        {busy && <><strong>Uploading…</strong><button type="button" className="avub__link" onClick={cancel}>Cancel</button></>}
        {state.kind === "done" && <><strong className="avub__ok"><Tick /> Photo updated</strong><button type="button" className="avub__link" onClick={reset}>Remove</button></>}
        {errorLine}
      </div>
      {hiddenInput}{status}
    </div>
  );
}
