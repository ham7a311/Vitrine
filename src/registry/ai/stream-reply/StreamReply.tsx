"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "./stream-reply.css";

/**
 * Stream Reply
 * An assistant answer arriving token by token. Each word settles in from a soft blur instead of
 * popping, code types into its block with highlighting already in place, a glowing caret rides
 * the end of the text, and you can stop it mid-sentence and regenerate.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: { t: string; k?: "kw" | "str" | "fn" | "num" | "com" }[] };

type Props = { blocks: Block[]; question?: string; tokensPerSecond?: number; theme?: "paper" | "night"; motion?: "full" | "reduced"; className?: string };

/** Split blocks into tokens: words for prose, small chunks for code. */
function tokenise(blocks: Block[]) {
  const out: { b: number; i: number; j: number; text: string }[] = [];
  blocks.forEach((bl, b) => {
    if (bl.type === "p") bl.text.split(/(?<=\s)/).forEach((w, j) => out.push({ b, i: 0, j, text: w }));
    else if (bl.type === "list") bl.items.forEach((it, i) => it.split(/(?<=\s)/).forEach((w, j) => out.push({ b, i, j, text: w })));
    else bl.code.forEach((c, i) => c.t.match(/.{1,4}/gs)!.forEach((ch, j) => out.push({ b, i, j, text: ch })));
  });
  return out;
}

export function StreamReply({ blocks, question, tokensPerSecond = 38, theme = "paper", motion = "full", className = "" }: Props) {
  const tokens = useRef(tokenise(blocks)).current;
  const index = useRef(new Map(tokens.map((t, k) => [`${t.b}.${t.i}.${t.j}`, k]))).current;
  const stopped = useRef(false);
  const [n, setN] = useState(0);
  const [state, setState] = useState<"streaming" | "stopped" | "done">("streaming");
  const [run, setRun] = useState(0);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN(tokens.length);
      setState("done");
      return;
    }
    setN(0);
    setState("streaming");
    stopped.current = false;
    let i = 0, alive = true;
    const t0 = performance.now();
    const step = () => {
      if (!alive || stopped.current) return;
      // a little burstiness, like a real stream
      i = Math.min(tokens.length, i + 1 + (Math.random() < 0.25 ? 1 : 0));
      setN(i);
      setRate(Math.round(i / Math.max(0.2, (performance.now() - t0) / 1000)));
      if (i >= tokens.length) return setState("done");
      timer = setTimeout(step, (1000 / tokensPerSecond) * (0.6 + Math.random() * 0.9));
    };
    let timer = setTimeout(step, 450);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [run, tokens, tokensPerSecond, motion]);

  const stop = () => {
    stopped.current = true;
    setState("stopped");
  };
  const visible = (b: number, i: number, j: number) => (index.get(`${b}.${i}.${j}`) ?? Infinity) < n;
  const last = tokens[n - 1];

  const caret = (b: number, i: number, j: number): ReactNode =>
    state === "streaming" && last && last.b === b && last.i === i && last.j === j ? <span className="srp__caret" aria-hidden="true" /> : null;

  return (
    <div className={`srp srp--${theme} ${className}`} data-state={state}>
      {question && <p className="srp__q">{question}</p>}
      <div className="srp__a">
        <div className="srp__avatar" aria-hidden="true" />
        <div className="srp__body" aria-live="off">
          {blocks.map((bl, b) => {
            if (bl.type === "p")
              return (
                <p key={b}>
                  {bl.text.split(/(?<=\s)/).map((w, j) =>
                    visible(b, 0, j) ? (
                      <span key={j} className="srp__tok">
                        {w}
                        {caret(b, 0, j)}
                      </span>
                    ) : null,
                  )}
                </p>
              );
            if (bl.type === "list")
              return (
                <ul key={b}>
                  {bl.items.map((it, i) =>
                    visible(b, i, 0) ? (
                      <li key={i}>
                        {it.split(/(?<=\s)/).map((w, j) =>
                          visible(b, i, j) ? (
                            <span key={j} className="srp__tok">
                              {w}
                              {caret(b, i, j)}
                            </span>
                          ) : null,
                        )}
                      </li>
                    ) : null,
                  )}
                </ul>
              );
            return visible(b, 0, 0) ? (
              <figure key={b} className="srp__code">
                <figcaption>{bl.lang}</figcaption>
                <pre>
                  <code>
                    {bl.code.map((c, i) =>
                      c.t.match(/.{1,4}/gs)!.map((ch, j) =>
                        visible(b, i, j) ? (
                          <span key={`${i}-${j}`} className={`srp__c ${c.k ? `srp__${c.k}` : ""}`}>
                            {ch}
                            {caret(b, i, j)}
                          </span>
                        ) : null,
                      ),
                    )}
                  </code>
                </pre>
              </figure>
            ) : null;
          })}
          {state !== "streaming" && <p className="srp__sr">{state === "stopped" ? "Response stopped." : "Response complete."}</p>}
        </div>
      </div>
      <div className="srp__bar">
        <span className="srp__meta" aria-hidden="true">
          {state === "streaming" ? (
            <>
              <i className="srp__pulse" /> Writing · {rate} tok/s
            </>
          ) : state === "stopped" ? (
            "Stopped"
          ) : (
            `${tokens.length} tokens`
          )}
        </span>
        {state === "streaming" ? (
          <button type="button" className="srp__btn" onClick={stop}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <rect x="4" y="4" width="8" height="8" rx="1.5" />
            </svg>
            Stop
          </button>
        ) : (
          <button type="button" className="srp__btn" onClick={() => setRun((r) => r + 1)}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.8h-2.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Regenerate
          </button>
        )}
      </div>
    </div>
  );
}
