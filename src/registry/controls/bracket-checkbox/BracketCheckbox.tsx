import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import "./bracket-checkbox.css";

/**
 * Bracket Checkbox
 * A square checkbox framed by two offset corner brackets, like a crop mark.
 * Checking it floods the box and draws a hand-made cubic tick.
 */

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  children: ReactNode;
  /** Colour scheme: ink on a light page, or light ink on a dark page. */
  surface?: "light" | "dark";
  /** Optional hint shown at the end of the row, e.g. "Required". */
  hint?: ReactNode;
  /** Error message; also switches the box and brackets to the error colour. */
  error?: string;
};

export function BracketCheckbox({ children, surface = "light", hint, error, id, className = "", ...input }: Props) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className={`bcb bcb--${surface} ${className}`} data-invalid={error ? "true" : undefined}>
      <label className="bcb__row" htmlFor={inputId}>
        <span className="bcb__frame">
          <input
            id={inputId}
            type="checkbox"
            className="bcb__box"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...input}
          />
          <svg className="bcb__mark" viewBox="0 0 22 22" aria-hidden="true">
            <path pathLength={1} d="M4.6 12.3 C6.1 13.5 6.8 15.4 8.6 15.2 C10.1 13.1 12.2 9.4 14.1 7.6 C15.4 6.3 16.4 5.4 17.4 6.1" />
          </svg>
        </span>
        <span className="bcb__text">{children}</span>
        {hint ? <span className="bcb__hint">{hint}</span> : null}
      </label>
      {error ? (
        <p className="bcb__error" id={errorId} role="alert">
          <i aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
