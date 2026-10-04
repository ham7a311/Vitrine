import type { ButtonHTMLAttributes } from "react";
import "./foldaway-button.css";

/**
 * Foldaway Button
 * A button made of two sheets of card meeting at a crease. On hover the top
 * sheet folds forward and down over the front, and the words on its back — the
 * next state — are revealed, with real shading along the fold.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** Shown at rest. */
  children: string;
  /** Revealed when the button folds. */
  reveal: string;
};

function Half({ text, part }: { text: string; part: "top" | "bottom" }) {
  return (
    <span className={`fold__half fold__half--${part}`} aria-hidden="true">
      <span className="fold__text">{text}</span>
    </span>
  );
}

export function FoldawayButton({ children, reveal, className = "", ...rest }: Props) {
  return (
    <button type="button" className={`fold ${className}`} {...rest}>
      <span className="fold__sr">{children}</span>
      {/* what's underneath: the revealed words, top half then the resting bottom half */}
      <Half text={reveal} part="top" />
      <Half text={children} part="bottom" />
      {/* the flap: front shows the resting top half; its back shows the revealed bottom half */}
      <span className="fold__flap" aria-hidden="true">
        <span className="fold__face fold__face--front">
          <Half text={children} part="top" />
        </span>
        <span className="fold__face fold__face--back">
          <Half text={reveal} part="bottom" />
        </span>
      </span>
      <span className="fold__crease" aria-hidden="true" />
    </button>
  );
}
