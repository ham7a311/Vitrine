"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Lumen } from "./Lumen";
import { HUES, type Form, type Hue, type LumenState } from "./drop";

type Agent = { name: string; hue: Hue; form: Form; last: string; hello: string; file: string; reply: string };

const AGENTS: Agent[] = [
  { name: "pilot", hue: "blue", form: "drop", last: "Sent 1 PDF", hello: "I read the long documents so you don't have to.", file: "report-summary.md", reply: "Done. The report's eleven pages come down to four decisions; they're in the summary." },
  { name: "chalk", hue: "white", form: "egg", last: "Is the export test still flaky?", hello: "I keep an eye on tests and tell you what broke.", file: "flaky-tests.md", reply: "Done. Two tests fail only on Fridays; both wait on the same slow fixture." },
  { name: "cocoa", hue: "umber", form: "lump", last: "Sent 1 Markdown file", hello: "I tidy research into notes worth keeping.", file: "research-notes.md", reply: "Done. I grouped the sources by question and marked the ones that disagree." },
  { name: "fern", hue: "green", form: "pear", last: "Your reading list is ready", hello: "I find the few things worth reading this week.", file: "reading-list.md", reply: "Done. Seven pieces, sorted by how long they take, with one line on why each matters." },
];

type Msg = { from: "you" | "agent"; text: string; file?: string };
type Step = { state: LumenState; text: string; ms: number };

const stepsFor = (a: Agent): Step[] => [
  { state: "thinking", text: "Thinking", ms: 1500 },
  { state: "searching", text: "Searching your files", ms: 1900 },
  { state: "working", text: `Building ${a.file}`, ms: 1900 },
];

const Arrow = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" />
  </svg>
);

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  const [active, setActive] = useState(0);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [step, setStep] = useState<number | null>(null); // index into the steps while working
  const [done, setDone] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const a = AGENTS[active];
  const steps = useMemo(() => stepsFor(a), [a]);
  const busy = step !== null;
  const state: LumenState = busy ? steps[step].state : done ? "done" : "idle";

  /* walk through the steps, then answer */
  useEffect(() => {
    if (step === null) return;
    const id = window.setTimeout(() => {
      if (step + 1 < steps.length) return setStep(step + 1);
      setStep(null);
      setMsgs((m) => [...m, { from: "agent", text: a.reply, file: a.file }]);
      setDone(true);
    }, steps[step].ms);
    return () => window.clearTimeout(id);
  }, [step, steps, a]);
  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(() => setDone(false), 1500);
    return () => window.clearTimeout(id);
  }, [done]);
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [msgs, step]);

  const send = () => {
    const t = text.trim();
    if (!t || busy) return;
    setMsgs((m) => [...m, { from: "you", text: t }]);
    setText("");
    setDone(false);
    setStep(0);
  };
  const pick = (i: number) => {
    if (i === active) return;
    setActive(i);
    setMsgs([]);
    setStep(null);
    setDone(false);
  };

  const t = light
    ? { page: "bg-[#ecebe8]", shell: "bg-white border-[#e3e2df]", side: "bg-[#f6f5f3] border-[#e8e7e4]", ink: "text-[#1a1a1a]", muted: "text-[#6b6b6b]", sel: "bg-[#e9e8e5]", hover: "hover:bg-[#efeeeb]", pill: "bg-[#f3f2ef] border-[#e3e2df]", field: "bg-[#f6f5f3] border-[#e3e2df]", ph: "placeholder:text-[#9a9a9a]", focus: "focus-within:border-[#bdbcb8]", you: "bg-[#ecebe8]", them: "bg-[#f6f5f3]", chip: "bg-white border-[#e3e2df]" }
    : { page: "bg-[#060606]", shell: "bg-[#0b0b0b] border-[#1e1e1e]", side: "bg-[#131313] border-[#1e1e1e]", ink: "text-[#ededed]", muted: "text-[#8a8a8a]", sel: "bg-[#262626]", hover: "hover:bg-[#1c1c1c]", pill: "bg-[#161616] border-[#262626]", field: "bg-[#1a1a1a] border-[#2a2a2a]", ph: "placeholder:text-[#6f6f6f]", focus: "focus-within:border-[#4a4a4a]", you: "bg-[#262626]", them: "bg-[#161616]", chip: "bg-[#1f1f1f] border-[#2c2c2c]" };

  return (
    <div className={`flex min-h-dvh w-full items-center justify-center p-3 sm:p-6 ${t.page}`}>
      <div className={`flex h-[min(640px,calc(100dvh-3rem))] min-h-[480px] w-full max-w-[64rem] overflow-hidden rounded-2xl border ${t.shell} ${t.ink}`} style={{ fontFamily: '"Inter", "Hanken Grotesk Variable", "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif' }}>
        {/* sidebar */}
        <nav aria-label="Agents" className={`hidden w-[17rem] shrink-0 flex-col gap-1 border-r p-3 sm:flex ${t.side}`}>
          <p className={`px-3 pb-2 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] ${t.muted}`}>Agents</p>
          {AGENTS.map((g, i) => (
            <button key={g.name} type="button" aria-current={i === active || undefined} onClick={() => pick(i)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${i === active ? t.sel : t.hover}`}>
              <Lumen name={g.name} hue={g.hue} form={g.form} state={i === active ? state : "idle"} size={40} decorative />
              <span className="min-w-0">
                <span className="block text-[15px] font-medium leading-5">{g.name}</span>
                <span className={`block truncate text-[13px] leading-5 ${t.muted}`}>{i === active && busy ? `${steps[step!].text}…` : g.last}</span>
              </span>
            </button>
          ))}
        </nav>

        {/* conversation */}
        <section aria-label={`Chat with ${a.name}`} className="flex min-w-0 flex-1 flex-col">
          <header className="flex justify-center p-4">
            <span className={`inline-flex items-center gap-2 rounded-full border py-1.5 pl-2 pr-4 text-[15px] font-medium ${t.pill}`}>
              <Lumen name={a.name} hue={a.hue} form={a.form} state={state} size={22} decorative />
              {a.name}
            </span>
          </header>

          {/* on phones the agent list becomes a row of small drops */}
          <nav aria-label="Agents" className="flex justify-center gap-1 px-4 sm:hidden">
            {AGENTS.map((g, i) => (
              <button key={g.name} type="button" aria-label={g.name} aria-current={i === active || undefined} onClick={() => pick(i)} className={`grid size-11 place-items-center rounded-full transition-colors ${i === active ? t.sel : ""}`}>
                <Lumen name={g.name} hue={g.hue} form={g.form} size={30} decorative />
              </button>
            ))}
          </nav>

          {msgs.length === 0 && !busy ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
              <Lumen key={a.name} name={a.name} hue={a.hue} form={a.form} state={state} size={150} focusTarget={field} label={`${a.name}, your agent`} />
              <div>
                <p className="text-[22px] font-semibold tracking-[-0.01em]">Hi, I&rsquo;m {a.name}.</p>
                <p className={`mt-1 text-[15px] ${t.muted}`}>{a.hello}</p>
              </div>
            </div>
          ) : (
            <div ref={log} role="log" aria-label="Messages" className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-8">
              {msgs.map((m, i) =>
                m.from === "you" ? (
                  <p key={i} className={`max-w-[80%] self-end rounded-2xl px-4 py-2.5 text-[15px] leading-6 ${t.you}`}>{m.text}</p>
                ) : (
                  <div key={i} className="flex max-w-[86%] items-start gap-3">
                    <Lumen name={a.name} hue={a.hue} form={a.form} size={30} decorative />
                    <div className="grid gap-2">
                      <p className={`rounded-2xl px-4 py-2.5 text-[15px] leading-6 ${t.them}`}>{m.text}</p>
                      {m.file && (
                        <span className={`inline-flex w-fit items-center gap-2.5 rounded-xl border px-3 py-2 text-[13.5px] ${t.chip}`}>
                          <span className="grid h-7 w-6 place-items-center rounded-[4px] bg-[#2f7ff0] text-[8px] font-bold text-white">MD</span>
                          <span className="font-medium">{m.file}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ),
              )}
              {busy && (
                <div className="flex items-center gap-3" aria-hidden="true">
                  <Lumen name={a.name} hue={a.hue} form={a.form} state={state} size={44} focusTarget={field} decorative />
                  <span key={step} className={`text-[14.5px] ${t.muted}`} style={{ animation: "lmen-demo-in 0.3s ease-out" }}>
                    {steps[step!].text}
                    …
                  </span>
                </div>
              )}
            </div>
          )}
          <p className="sr-only" role="status" aria-live="polite">
            {busy ? `${a.name}: ${steps[step!].text}` : done ? `${a.name} replied with ${a.file}` : ""}
          </p>

          <form className="p-4" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <label className={`flex h-12 items-center gap-3 rounded-full border pl-5 pr-1.5 transition-colors ${t.field} ${t.focus}`}>
              <span className="sr-only">Message {a.name}</span>
              <input ref={field} value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${a.name}`} className={`min-w-0 flex-1 bg-transparent outline-none ${t.ph}`} style={{ fontSize: 16 }} />
              <button
                type="submit"
                aria-label={`Send to ${a.name}`}
                aria-disabled={!text.trim() || busy || undefined}
                className="lmen-demo-send grid size-9 shrink-0 place-items-center rounded-full"
                style={{ ["--c" as string]: HUES[a.hue].body, ["--d" as string]: HUES[a.hue].deep, color: HUES[a.hue].on, ...(a.hue === "white" ? { boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.12)" } : null) }}
              >
                <Arrow />
              </button>
            </label>
          </form>
        </section>
      </div>
      <style>{`@keyframes lmen-demo-in { from { opacity: 0; transform: translateY(3px); } } .lmen-demo-send { background: var(--c); transition: background-color .2s, opacity .2s, transform .15s; } .lmen-demo-send:hover:not([aria-disabled]) { background: var(--d); } .lmen-demo-send:active:not([aria-disabled]) { transform: scale(.94); } .lmen-demo-send[aria-disabled] { opacity: .3; cursor: default; } @media (prefers-reduced-motion: reduce) { [style*="lmen-demo-in"] { animation: none !important; } }`}</style>
    </div>
  );
}
