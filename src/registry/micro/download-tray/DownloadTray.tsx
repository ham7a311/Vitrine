"use client";

import { useEffect, useRef, useState } from "react";
import "./download-tray.css";

/**
 * Download Tray
 * The arrow drops into the tray, a ring around the button fills with real progress, and when
 * it's done the arrow is replaced by a tick and the tray gives a little bounce.
 */

type Props = {
  /** Called on press; report progress 0–1 through the callback and resolve when finished. */
  onDownload?: (progress: (p: number) => void) => Promise<void>;
  label?: string;
  className?: string;
};

const fake = (progress: (p: number) => void) =>
  new Promise<void>((res) => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(1, p + 0.04 + Math.random() * 0.08);
      progress(p);
      if (p >= 1) {
        clearInterval(id);
        res();
      }
    }, 90);
  });

export function DownloadTray({ onDownload = fake, label = "Download", className = "" }: Props) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [p, setP] = useState(0);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const go = async () => {
    if (state !== "idle") return;
    setState("busy");
    setP(0);
    await onDownload(setP);
    setState("done");
    t.current = setTimeout(() => {
      setState("idle");
      setP(0);
    }, 2200);
  };
  const C = 2 * Math.PI * 21;
  return (
    <button type="button" className={`dt ${className}`} data-state={state} onClick={go} aria-label={state === "done" ? "Downloaded" : label} aria-busy={state === "busy"}>
      <svg className="dt__ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="21" className="dt__track" />
        <circle cx="24" cy="24" r="21" className="dt__progress" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
      </svg>
      <svg className="dt__icon" viewBox="0 0 24 24" aria-hidden="true">
        <g className="dt__arrow">
          <path d="M12 4v10.5" />
          <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
        </g>
        <path className="dt__tick" pathLength={1} d="m7 12.8 3.4 3.4L17.2 9" />
        <path className="dt__tray" d="M4.5 15.5v2.2c0 1 .8 1.8 1.8 1.8h11.4c1 0 1.8-.8 1.8-1.8v-2.2" />
      </svg>
      <span className="dt__sr" role="status">
        {state === "busy" ? `Downloading ${Math.round(p * 100)}%` : state === "done" ? "Download complete" : ""}
      </span>
    </button>
  );
}
