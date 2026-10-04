"use client";

import { useState } from "react";
import "./trash-drop.css";

/**
 * Trash Drop
 * A delete button that shows where the thing went: the lid tips open, a sheet drops in, the lid
 * shuts and the bin gives a small shake. Use it with an undo — the demo list has one.
 */

type Props = { onDelete?: () => void; label?: string; className?: string };

export function TrashDrop({ onDelete, label = "Delete", className = "" }: Props) {
  const [beat, setBeat] = useState(0);
  return (
    <button
      type="button"
      className={`td ${className}`}
      aria-label={label}
      data-beat={beat ? (beat % 2 ? "a" : "b") : undefined}
      onClick={() => {
        setBeat((b) => b + 1);
        // let the drop play before the row goes
        setTimeout(() => onDelete?.(), 520);
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <g className="td__bin">
          <path d="M6.2 8.5 7.3 19c.1.9.9 1.5 1.8 1.5h5.8c.9 0 1.7-.6 1.8-1.5l1.1-10.5" />
          <path d="M10 11.5v5.5M14 11.5v5.5" />
        </g>
        <rect className="td__sheet" x="9.2" y="1.5" width="5.6" height="7" rx="0.8" />
        <g className="td__lid">
          <path d="M4.5 6.5h15" />
          <path d="M9.5 6.5V5.2c0-.7.6-1.2 1.2-1.2h2.6c.7 0 1.2.5 1.2 1.2v1.3" />
        </g>
      </svg>
    </button>
  );
}
