"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import "./etched-field.css";

/**
 * Etched Field
 * A text field with a floating label that rises into a notch cut in the top
 * border, like a name engraved on a plaque. An underline draws in on focus, and
 * validation state is carried by a small corner mark, not just colour.
 */

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function EtchedField({ label, hint, error, className = "", onFocus, onBlur, onChange, ...rest }: Props) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(Boolean(rest.defaultValue ?? rest.value));

  return (
    <div className={`etch ${className}`} data-focused={focused || undefined} data-filled={filled || undefined} data-invalid={error ? "true" : undefined}>
      <div className="etch__box">
        <input
          id={id}
          className="etch__input"
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-d` : undefined}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          onChange={(e) => { setFilled(e.target.value.length > 0); onChange?.(e); }}
          {...rest}
        />
        <label htmlFor={id} className="etch__label">{label}</label>
        <span className="etch__rule" aria-hidden="true" />
        <span className="etch__mark" aria-hidden="true">{error ? "!" : filled ? "✓" : ""}</span>
      </div>
      {(error || hint) && (
        <p id={`${id}-d`} className="etch__msg" role={error ? "alert" : undefined}>{error ?? hint}</p>
      )}
    </div>
  );
}
