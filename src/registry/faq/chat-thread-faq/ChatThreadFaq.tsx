"use client";

import { useEffect, useRef, useState } from "react";
import "./chat-thread-faq.css";

/**
 * Chat Thread FAQ
 * An FAQ you ask rather than scan. Questions sit at the bottom of a support
 * thread as suggestions; pick one and it's sent as your message, the reply
 * types for a moment and then arrives word by word — with the follow-up
 * questions people usually ask next, so the thread can keep going.
 */

export type Qa = { id: string; q: string; a: string; next?: string[] };
type Msg = { id: number; from: "you" | "them"; text: string; streaming?: boolean };
type Props = {
  items: Qa[];
  agent?: { name: string; role: string };
  greeting?: string;
  human?: { label: string; reply: string };
  /** Questions offered first. */
  start?: string[];
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

export function ChatThreadFaq({ items, agent = { name: "Vitrine Help", role: "Answers in seconds" }, greeting = "Marhaba! What can I help you with?", human, start, theme = "paper", motion = "full", className = "" }: Props) {
  const byId = new Map(items.map((x) => [x.id, x]));
  const first = start ?? items.slice(0, 4).map((x) => x.id);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: "them", text: greeting }]);
  const [offer, setOffer] = useState<string[]>(first);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [typing, setTyping] = useState(false);
  const [shown, setShown] = useState<Record<number, number>>({});
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const timers = useRef<number[]>([]);
  const reduced = () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Keep the newest message in view.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced() ? "auto" : "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs, typing, shown, offer]);

  const reply = (text: string, follow: string[]) => {
    setTyping(true);
    const think = reduced() ? 150 : 650 + Math.min(900, text.length * 4);
    later(() => {
      setTyping(false);
      const id = nextId.current++;
      const words = text.split(" ");
      setMsgs((m) => [...m, { id, from: "them", text, streaming: !reduced() }]);
      if (reduced()) { setOffer(follow); return; }
      // Words arrive one after another, a little faster than reading speed.
      let n = 0;
      const tick = () => {
        n++;
        setShown((s) => ({ ...s, [id]: n }));
        if (n < words.length) later(tick, 28 + Math.random() * 30);
        else {
          setMsgs((m) => m.map((x) => (x.id === id ? { ...x, streaming: false } : x)));
          later(() => setOffer(follow), 160);
        }
      };
      later(tick, 40);
    }, think);
  };

  const ask = (qid: string) => {
    if (typing || msgs.some((m) => m.streaming)) return;
    const used = new Set(asked).add(qid);
    setAsked(used);
    setOffer([]);
    if (qid === "__human" && human) {
      setMsgs((m) => [...m, { id: nextId.current++, from: "you", text: human.label }]);
      reply(human.reply, []);
      return;
    }
    const item = byId.get(qid);
    if (!item) return;
    setMsgs((m) => [...m, { id: nextId.current++, from: "you", text: item.q }]);
    // Offer what people usually ask next, then anything not asked yet.
    const rest = items.map((x) => x.id).filter((x) => !used.has(x));
    const follow = [...(item.next ?? []).filter((x) => !used.has(x)), ...rest.filter((x) => !(item.next ?? []).includes(x))].slice(0, 3);
    reply(item.a, follow);
  };

  const restart = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setMsgs([{ id: 0, from: "them", text: greeting }]);
    setOffer(first);
    setAsked(new Set());
    setTyping(false);
    setShown({});
  };

  const busy = typing || msgs.some((m) => m.streaming);

  return (
    <section className={`ct ct--${theme} ${className}`} data-motion={motion} aria-label={`${agent.name} — frequently asked questions`}>
      <header className="ct__head">
        <span className="ct__av" aria-hidden="true">A</span>
        <span className="ct__who">
          <span className="ct__name">{agent.name}</span>
          <span className="ct__role"><i aria-hidden="true" /> {agent.role}</span>
        </span>
        <button type="button" className="ct__restart" onClick={restart} disabled={msgs.length < 2}>Start over</button>
      </header>

      <div ref={logRef} className="ct__log" role="log" aria-live="polite" aria-busy={busy} aria-label="Conversation">
        {msgs.map((m) => {
          const words = m.text.split(" ");
          const n = m.streaming ? shown[m.id] ?? 0 : words.length;
          return (
            <div key={m.id} className="ct__msg" data-from={m.from}>
              <p className="ct__bubble">
                {m.from === "them" && m.streaming ? (
                  <>
                    {words.slice(0, n).join(" ")}
                    <span className="ct__ghost" aria-hidden="true">{n < words.length ? " " + words.slice(n).join(" ") : ""}</span>
                  </>
                ) : (
                  m.text
                )}
              </p>
            </div>
          );
        })}
        {typing && (
          <div className="ct__msg" data-from="them">
            <p className="ct__bubble ct__typing" aria-label={`${agent.name} is typing`}>
              <span /><span /><span />
            </p>
          </div>
        )}
      </div>

      <div className="ct__offer" role="group" aria-label="Suggested questions">
        {offer.map((qid, i) => {
          const it = byId.get(qid);
          return it ? (
            <button key={qid} type="button" className="ct__chip" style={{ ["--i" as string]: i }} onClick={() => ask(qid)} disabled={busy}>
              {it.q}
            </button>
          ) : null;
        })}
        {human && !busy && !asked.has("__human") && msgs.length > 1 && (
          <button type="button" className="ct__chip ct__chip--human" style={{ ["--i" as string]: offer.length }} onClick={() => ask("__human")}>
            {human.label}
          </button>
        )}
        {!offer.length && !busy && asked.size >= items.length && <p className="ct__end">That’s everything I know — start over any time.</p>}
      </div>
    </section>
  );
}
