"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import "./progressive-form.css";

/**
 * Progressive Form
 * One question at a time, and every answer is written into a sentence above
 * the field. While you type, your words appear in the sentence in pencil;
 * Continue inks them in. Answered words are buttons that take you back. When
 * the last blank is filled the sentence is the review: read it, fix a word,
 * confirm.
 */

export type StepOption = { value: string; label: string; description?: string; disabled?: boolean };
export type Step = {
  id: string;
  /** The question, shown above the field. */
  label: string;
  hint?: string;
  type: "text" | "email" | "number" | "choice" | "date";
  placeholder?: string;
  options?: StepOption[];
  min?: number;
  max?: number;
  /** Return an error message, or null when the value is acceptable. */
  validate?: (value: string) => string | null;
  /** How the value reads inside the sentence. */
  summary?: (value: string) => string;
  /** Label for the review list. */
  name: string;
};

type Props = {
  title: string;
  steps: Step[];
  /** Compose the sentence; call slot(id) where each answer belongs. */
  template: (slot: (id: string) => ReactNode) => ReactNode;
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
  submitLabel?: string;
  successMessage?: ReactNode;
  initialValues?: Record<string, string>;
  theme?: "paper" | "night";
};

export function ProgressiveForm({ title, steps, template, onSubmit, submitLabel = "Confirm", successMessage = "Done.", initialValues = {}, theme = "paper" }: Props) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [inked, setInked] = useState<Record<string, boolean>>({});
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"editing" | "submitting" | "done">("editing");
  const [returnToReview, setReturnToReview] = useState(false);
  const fieldRef = useRef<HTMLFormElement>(null);
  const reviewRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const titleId = useId();
  const errorId = useId();
  const hintId = useId();

  const reviewing = index >= steps.length;
  const step = steps[Math.min(index, steps.length - 1)];
  const value = values[step.id] ?? "";

  const read = (s: Step, v: string) => (s.summary ? s.summary(v) : s.options?.find((o) => o.value === v)?.label ?? v);

  // Move focus to the new question (or the review heading) whenever the step changes.
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (reviewing) return reviewRef.current?.focus({ preventScroll: true });
    const root = fieldRef.current;
    const target =
      root?.querySelector<HTMLElement>('input[type="radio"]:checked') ??
      root?.querySelector<HTMLElement>('input:not([type="radio"]), input[type="radio"]:not(:disabled)');
    target?.focus({ preventScroll: true });
  }, [index, reviewing]);

  const check = (s: Step, v: string): string | null => {
    if (!v.trim()) return s.type === "choice" ? "Choose one to continue." : "This one's needed to continue.";
    if (s.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "That doesn't look like an email address.";
    if (s.type === "number") {
      const n = Number(v);
      if (!Number.isInteger(n)) return "Use a whole number.";
      if (s.min !== undefined && n < s.min) return `At least ${s.min}.`;
      if (s.max !== undefined && n > s.max) return `No more than ${s.max}.`;
    }
    return s.validate?.(v) ?? null;
  };

  const next = (e?: FormEvent) => {
    e?.preventDefault();
    if (status !== "editing") return;
    const problem = check(step, value);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setInked((k) => ({ ...k, [step.id]: true }));
    if (returnToReview && steps.every((s) => s.id === step.id || !check(s, values[s.id] ?? ""))) {
      setReturnToReview(false);
      setIndex(steps.length);
      return;
    }
    setIndex((i) => i + 1);
  };

  const goTo = (i: number) => {
    if (status !== "editing") return;
    setError(null);
    if (reviewing) setReturnToReview(true);
    setIndex(i);
  };

  const back = () => goTo(Math.max(0, index - 1));

  const submit = async () => {
    setStatus("submitting");
    try {
      await onSubmit(values);
      setStatus("done");
    } catch {
      setStatus("editing");
      setError("Something went wrong. Try again.");
    }
  };

  const set = (v: string) => {
    setValues((vs) => ({ ...vs, [step.id]: v }));
    if (error) setError(null);
    setInked((k) => (k[step.id] ? { ...k, [step.id]: false } : k));
  };

  /** A slot in the sentence: blank, pencilled (being answered) or inked (committed). */
  const slot = (id: string) => {
    const i = steps.findIndex((s) => s.id === id);
    const s = steps[i];
    if (!s) return null;
    const v = values[id] ?? "";
    const current = !reviewing && i === index;
    const isInked = inked[id] && !!v;
    const state = current ? (error ? "error" : v ? "pencil" : "blank-current") : isInked ? "ink" : v ? "pencil" : "blank";
    if (state === "ink" && status === "editing") {
      return (
        // A span with button semantics, so a long answer wraps like the words around it.
        <span
          key={id}
          role="button"
          tabIndex={0}
          className="progressive-form__token"
          data-state="ink"
          data-editable=""
          onClick={() => goTo(i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goTo(i);
            }
          }}
          aria-label={`${s.name}: ${read(s, v)}. Edit`}
        >
          {read(s, v)}
        </span>
      );
    }
    if (state === "ink" || state === "pencil") {
      return (
        <span key={id} className="progressive-form__token" data-state={state} aria-current={current ? "step" : undefined}>
          {read(s, v)}
        </span>
      );
    }
    return (
      <span key={id} className="progressive-form__token" data-state={state} aria-current={current ? "step" : undefined}>
        <span className="progressive-form__sr">{s.name}, not yet answered</span>
      </span>
    );
  };

  const answered = steps.filter((s) => inked[s.id]).length;

  return (
    <section className={`progressive-form progressive-form--${theme}`} aria-labelledby={titleId} data-status={status}>
      <header className="progressive-form__head">
        <h2 id={titleId} className="progressive-form__title">
          {title}
        </h2>
        <p className="progressive-form__progress" aria-live="polite">
          {status === "done" ? "Complete" : reviewing ? "Review" : `Step ${index + 1} of ${steps.length}`}
          <span className="progressive-form__ticks" aria-hidden="true">
            {steps.map((s, i) => (
              <i key={s.id} data-on={inked[s.id] || undefined} data-current={(!reviewing && i === index) || undefined} />
            ))}
          </span>
        </p>
      </header>

      <p className="progressive-form__sentence" role="group" aria-label={`Your answers so far, ${answered} of ${steps.length}`}>
        {template(slot)}
      </p>

      {!reviewing ? (
        <form className="progressive-form__step" key={step.id} ref={fieldRef} onSubmit={next} noValidate>
          <Field
            step={step}
            value={value}
            onChange={set}
            invalid={!!error}
            describedBy={[error ? errorId : null, step.hint ? hintId : null].filter(Boolean).join(" ") || undefined}
          />
          {step.hint && !error && (
            <p id={hintId} className="progressive-form__hint">
              {step.hint}
            </p>
          )}
          {error && (
            <p id={errorId} className="progressive-form__error" role="alert">
              {error}
            </p>
          )}
          <div className="progressive-form__nav">
            {index > 0 && (
              <button type="button" className="progressive-form__back" onClick={back}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M10 3.5L5.5 8l4.5 4.5" />
                </svg>
                Back
              </button>
            )}
            <button type="submit" className="progressive-form__next">
              {returnToReview ? "Update" : index === steps.length - 1 ? "Review" : "Continue"}
              <kbd aria-hidden="true">↵</kbd>
            </button>
          </div>
        </form>
      ) : (
        <div className="progressive-form__review">
          <h3 ref={reviewRef} tabIndex={-1} className="progressive-form__review-title">
            {status === "done" ? successMessage : "Does that read right?"}
          </h3>
          <dl className="progressive-form__list">
            {steps.map((s, i) => (
              <div key={s.id}>
                <dt>{s.name}</dt>
                <dd>{s.options?.find((o) => o.value === values[s.id])?.label ?? read(s, values[s.id] ?? "")}</dd>
                {status === "editing" && (
                  <button type="button" onClick={() => goTo(i)} aria-label={`Edit ${s.name}`}>
                    Edit
                  </button>
                )}
              </div>
            ))}
          </dl>
          {error && (
            <p className="progressive-form__error" role="alert">
              {error}
            </p>
          )}
          {status !== "done" && (
            <div className="progressive-form__nav">
              <button type="button" className="progressive-form__back" onClick={back} disabled={status === "submitting"}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M10 3.5L5.5 8l4.5 4.5" />
                </svg>
                Back
              </button>
              <button type="button" className="progressive-form__next" onClick={submit} disabled={status === "submitting"} aria-busy={status === "submitting" || undefined}>
                {status === "submitting" && <span className="progressive-form__spinner" aria-hidden="true" />}
                {status === "submitting" ? "Creating…" : submitLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ─── Fields ────────────────────────────────────────────────────────── */

function Field({ step, value, onChange, invalid, describedBy }: { step: Step; value: string; onChange: (v: string) => void; invalid: boolean; describedBy?: string }) {
  const id = useId();
  const common = { "aria-invalid": invalid || undefined, "aria-describedby": describedBy };

  if (step.type === "choice") {
    return (
      <fieldset className="progressive-form__field" aria-describedby={describedBy}>
        <legend className="progressive-form__question">{step.label}</legend>
        <div className="progressive-form__choices" data-invalid={invalid || undefined}>
          {step.options?.map((o) => (
            <label key={o.value} className="progressive-form__choice" data-disabled={o.disabled || undefined}>
              <input type="radio" name={step.id} value={o.value} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} />
              <span className="progressive-form__choice-label">{o.label}</span>
              {o.description && <span className="progressive-form__choice-desc">{o.description}</span>}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (step.type === "number") {
    const n = Number(value || 0);
    const bump = (d: number) => onChange(String(Math.max(step.min ?? 0, Math.min(step.max ?? Infinity, (Number.isFinite(n) ? n : 0) + d))));
    return (
      <div className="progressive-form__field">
        <label htmlFor={id} className="progressive-form__question">
          {step.label}
        </label>
        <div className="progressive-form__stepper">
          <button type="button" onClick={() => bump(-1)} aria-label="Fewer" disabled={n <= (step.min ?? 0)}>
            −
          </button>
          <input
            id={id}
            className="progressive-form__input"
            inputMode="numeric"
            autoComplete="off"
            placeholder={step.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") (e.preventDefault(), bump(1));
              if (e.key === "ArrowDown") (e.preventDefault(), bump(-1));
            }}
            {...common}
          />
          <button type="button" onClick={() => bump(1)} aria-label="More" disabled={step.max !== undefined && n >= step.max}>
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="progressive-form__field">
      <label htmlFor={id} className="progressive-form__question">
        {step.label}
      </label>
      <input
        id={id}
        className="progressive-form__input"
        type={step.type}
        autoComplete={step.type === "email" ? "email" : step.id === "name" ? "name" : step.id === "org" ? "organization" : "off"}
        placeholder={step.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...common}
      />
    </div>
  );
}

export function useToday() {
  const [today, setToday] = useState("");
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  return today;
}
