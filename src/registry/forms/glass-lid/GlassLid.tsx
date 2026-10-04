"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import "./glass-lid.css";

/**
 * Glass Lid
 * Read-only settings sit under a pane of glass: you can read them, not touch
 * them. Edit lifts the lid on its top edge and the values become fields in
 * place; Save lowers it again. A section managed by someone else keeps its lid
 * shut and says who holds the key.
 */

export type LidField = {
  id: string;
  label: string;
  value: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  /** Shown under the value in both modes. */
  hint?: string;
  required?: boolean;
};

type Props = {
  title: string;
  description?: string;
  fields: LidField[];
  /** Resolve to close the lid; throw an Error to keep it open with the message. */
  onSave?: (values: Record<string, string>) => Promise<void> | void;
  /** When set, the lid stays shut and this names who manages the section. */
  lockedBy?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
};

export function GlassLid({ title, description, fields, onSave, lockedBy, theme = "paper", motion = "full" }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.id, f.value])));
  const [draft, setDraft] = useState(values);
  const [status, setStatus] = useState("");
  const editRef = useRef<HTMLButtonElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const returnFocus = useRef(false);

  useEffect(() => {
    if (open) firstRef.current?.focus({ preventScroll: true });
    else if (returnFocus.current) {
      returnFocus.current = false;
      editRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  const begin = () => {
    setDraft(values);
    setError("");
    setOpen(true);
    setStatus(`Editing ${title}.`);
  };
  const cancel = () => {
    returnFocus.current = true;
    setOpen(false);
    setError("");
    setStatus("Changes discarded.");
  };
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave?.(draft);
      setValues(draft);
      returnFocus.current = true;
      setOpen(false);
      setStatus(`${title} saved.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const changed = fields.some((f) => draft[f.id] !== values[f.id]);

  return (
    <form
      className={`glass-lid glass-lid--${theme}`}
      data-open={open || undefined}
      data-locked={lockedBy ? "" : undefined}
      data-motion={motion}
      aria-labelledby={`${uid}-t`}
      onSubmit={save}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open && !saving) {
          e.preventDefault();
          cancel();
        }
      }}
    >
      <header className="glass-lid__head">
        <div>
          <h3 id={`${uid}-t`} className="glass-lid__title">
            {title}
          </h3>
          {description && <p className="glass-lid__desc">{description}</p>}
        </div>
        {lockedBy ? (
          <p className="glass-lid__lock">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
              <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" />
            </svg>
            Managed by {lockedBy}
          </p>
        ) : (
          !open && (
            <button ref={editRef} type="button" className="glass-lid__btn" onClick={begin}>
              Edit
            </button>
          )
        )}
      </header>

      <div className="glass-lid__case">
        <dl className="glass-lid__fields">
          {fields.map((f, i) => (
            <div key={f.id} className="glass-lid__row">
              <dt>
                <label htmlFor={`${uid}-${f.id}`}>{f.label}</label>
              </dt>
              <dd>
                {open ? (
                  <input
                    ref={i === 0 ? firstRef : undefined}
                    id={`${uid}-${f.id}`}
                    className="glass-lid__input"
                    type={f.type ?? "text"}
                    autoComplete={f.autoComplete}
                    required={f.required}
                    value={draft[f.id] ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.id]: e.target.value }))}
                    disabled={saving}
                    aria-describedby={f.hint ? `${uid}-${f.id}-h` : undefined}
                  />
                ) : (
                  <span id={`${uid}-${f.id}`} className="glass-lid__value">
                    {values[f.id] || <span className="glass-lid__empty">Not set</span>}
                  </span>
                )}
                {f.hint && (
                  <span id={`${uid}-${f.id}-h`} className="glass-lid__hint">
                    {f.hint}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        {/* The pane: a hairline edge, a bevel and one reflection. Purely visual. */}
        <div className="glass-lid__pane" aria-hidden="true">
          <span className="glass-lid__glint" />
        </div>
      </div>

      {open && (
        <footer className="glass-lid__foot">
          <p className="glass-lid__error" role="alert">
            {error}
          </p>
          <button type="button" className="glass-lid__btn" onClick={cancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="glass-lid__btn glass-lid__btn--primary" disabled={saving || !changed}>
            {saving ? "Saving…" : "Save"}
          </button>
        </footer>
      )}
      <p className="glass-lid__sr" role="status">
        {status}
      </p>
    </form>
  );
}
