"use client";

import { useId, useState, type ReactNode } from "react";
import "./lever-switch.css";

/**
 * Lever Switch
 * A toggle built like a mechanical lever: the handle swings on a pivot, a
 * detent notch clicks, and a small indicator lamp warms up as it engages.
 */

type Props = {
  label: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

export function LeverSwitch({ label, description, checked, defaultChecked = false, onChange, disabled }: Props) {
  const id = useId();
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;

  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (checked === undefined) setInner(next);
    onChange?.(next);
  };

  return (
    <div className="lever" data-on={on || undefined} data-disabled={disabled || undefined}>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={on}
        aria-describedby={description ? `${id}-d` : undefined}
        disabled={disabled}
        onClick={toggle}
        className="lever__track"
      >
        <span className="lever__slot" aria-hidden="true">
          <span className="lever__tick lever__tick--off" />
          <span className="lever__tick lever__tick--on" />
        </span>
        <span className="lever__arm" aria-hidden="true">
          <span className="lever__knob" />
        </span>
        <span className="lever__pivot" aria-hidden="true" />
        <span className="lever__lamp" aria-hidden="true" />
      </button>
      <label htmlFor={id} className="lever__text">
        <span className="lever__label">{label}</span>
        {description && (
          <span id={`${id}-d`} className="lever__desc">
            {description}
          </span>
        )}
      </label>
    </div>
  );
}
