"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import "./word-bank.css";

export type WordBankProps = {
  /** What the learner is asked to do, e.g. "Write this in English". */
  instruction?: string;
  /** The sentence shown in the speech bubble. */
  prompt: string;
  /** Tiles, in the order they sit in the bank. Repeated words are fine. */
  words: string[];
  /** BCP 47 language of the prompt, e.g. "ar". */
  promptLang?: string;
  /** Accepted answers; compared ignoring case, punctuation and extra spaces. */
  answers: string[];
  /** Called once per check with the result and the built sentence. */
  onCheck?: (correct: boolean, answer: string) => void;
  onContinue?: (correct: boolean) => void;
  onSkip?: () => void;
  theme?: "light" | "dark";
  motion?: "auto" | "reduced";
  className?: string;
};

const normal = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s']/gu, "").replace(/\s+/g, " ").trim();
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Word Bank
 * Build the sentence from tiles. A tapped tile flies up onto the ruled line
 * and leaves its outline behind in the bank; tap it again to send it home.
 * Check slides up a bar that says whether you got it, and what was meant.
 */
export function WordBank({ instruction = "Write this in English", prompt, promptLang, words, answers, onCheck, onContinue, onSkip, theme = "light", motion = "auto", className = "" }: WordBankProps) {
  const id = useId();
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<null | { correct: boolean }>(null);
  const tiles = useRef(new Map<string, HTMLButtonElement>());
  const flight = useRef<{ index: number; from: DOMRect } | null>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const checkRef = useRef<HTMLButtonElement>(null);

  // FLIP: the tile that moved animates from where it was to where it landed.
  useLayoutEffect(() => {
    const f = flight.current;
    flight.current = null;
    if (!f || motion === "reduced" || reduced()) return;
    const el = tiles.current.get(picked.includes(f.index) ? `a${f.index}` : `b${f.index}`);
    if (!el) return;
    const to = el.getBoundingClientRect();
    el.animate([{ transform: `translate(${f.from.left - to.left}px, ${f.from.top - to.top}px)` }, { transform: "none" }], { duration: 280, easing: "cubic-bezier(.2,.8,.2,1)" });
  }, [picked, motion]);

  useEffect(() => { if (result) continueRef.current?.focus(); }, [result]);

  const toggle = (index: number) => {
    if (result) return;
    const source = tiles.current.get(picked.includes(index) ? `a${index}` : `b${index}`);
    if (source) flight.current = { index, from: source.getBoundingClientRect() };
    setPicked((p) => (p.includes(index) ? p.filter((i) => i !== index) : [...p, index]));
  };

  const answer = picked.map((i) => words[i]).join(" ");
  const check = () => {
    if (!picked.length || result) return;
    const correct = answers.some((a) => normal(a) === normal(answer));
    setResult({ correct });
    onCheck?.(correct, answer);
  };
  const next = () => {
    const correct = !!result?.correct;
    setResult(null);
    setPicked([]);
    onContinue?.(correct);
    requestAnimationFrame(() => checkRef.current?.focus());
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("input, textarea")) return;
    if (/^[1-9]$/.test(e.key) && !result) {
      const i = Number(e.key) - 1;
      if (i < words.length && !picked.includes(i)) { e.preventDefault(); toggle(i); }
    } else if (e.key === "Backspace" && picked.length && !result) {
      e.preventDefault(); toggle(picked[picked.length - 1]);
    } else if (e.key === "Enter" && (e.target as Element).tagName !== "BUTTON") {
      e.preventDefault(); if (result) next(); else check();
    }
  };

  const correctAnswer = answers[0];

  return (
    <div className={`wbank wbank--${theme} ${className}`} data-motion={motion} data-result={result ? (result.correct ? "correct" : "wrong") : undefined} onKeyDown={onKey}>
      <div className="wbank__main">
        <h2 className="wbank__instruction" id={`${id}-q`}>{instruction}</h2>
        <div className="wbank__prompt">
          <p className="wbank__bubble" lang={promptLang} dir="auto">{prompt}</p>
        </div>

        <div className="wbank__answer" role="group" aria-label={`Your answer${answer ? `: ${answer}` : ", empty"}`}>
          <div className="wbank__lines" aria-hidden="true"><span /><span /></div>
          <div className="wbank__picked">
            {picked.map((i) => (
              <button key={`a${i}`} ref={(el) => { if (el) tiles.current.set(`a${i}`, el); else tiles.current.delete(`a${i}`); }} type="button" className="wbank__tile" disabled={!!result} aria-label={`${words[i]}, remove from answer`} onClick={() => toggle(i)}>{words[i]}</button>
            ))}
          </div>
        </div>

        <div className="wbank__bank" role="group" aria-label="Word tiles">
          {words.map((w, i) => (
            <span key={i} className="wbank__slot">
              {picked.includes(i)
                ? <span className="wbank__ghost" aria-hidden="true">{w}</span>
                : <button ref={(el) => { if (el) tiles.current.set(`b${i}`, el); else tiles.current.delete(`b${i}`); }} type="button" className="wbank__tile" disabled={!!result} aria-keyshortcuts={i < 9 ? String(i + 1) : undefined} onClick={() => toggle(i)}>{w}</button>}
            </span>
          ))}
        </div>
      </div>

      <footer className="wbank__bar" data-state={result ? (result.correct ? "correct" : "wrong") : "idle"}>
        <div className="wbank__bar-inner">
          {result ? (
            <div className="wbank__verdict" role="status">
              <span className="wbank__badge" aria-hidden="true">
                {result.correct ? <svg viewBox="0 0 24 24"><path d="M5.5 12.5l4.2 4.2L18.5 8" /></svg> : <svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17" /></svg>}
              </span>
              <div>
                <p className="wbank__verdict-title">{result.correct ? "Nicely done!" : "Not quite. The answer:"}</p>
                {!result.correct && <p className="wbank__verdict-answer">{correctAnswer}</p>}
              </div>
            </div>
          ) : (
            <button type="button" className="wbank__skip" onClick={() => { setPicked([]); onSkip?.(); }}>Skip</button>
          )}
          {result
            ? <button ref={continueRef} type="button" className="wbank__go" onClick={next}>Continue</button>
            : <button ref={checkRef} type="button" className="wbank__go" disabled={!picked.length} onClick={check}>Check</button>}
        </div>
      </footer>
    </div>
  );
}
