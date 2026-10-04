"use client";

import { useState } from "react";
import { FirstLight, FutureSlot } from "./FirstLight";

type Preset = "projects" | "conversation" | "dashboard" | "collection";

const STARTERS = ["Summarise the Q3 roadmap in five bullets", "Draft a release note for PR #212", "What changed in Vitrine this week?"];
const METRICS = [
  { id: "deploys", label: "Deploys per day", value: "14", spark: [4, 6, 5, 9, 8, 12, 14] },
  { id: "latency", label: "p50 search latency", value: "62 ms", spark: [410, 380, 400, 90, 70, 64, 62] },
  { id: "issues", label: "Open issues", value: "12", spark: [18, 17, 15, 16, 14, 13, 12] },
];

function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${34 - ((v - min) / (max - min || 1)) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="h-9 w-full" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="#b4532a" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const theme = night ? "night" : "paper";
  const [preset, setPreset] = useState<Preset>("projects");
  const [projects, setProjects] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [tiles, setTiles] = useState<string[]>([]);
  const [items, setItems] = useState<{ title: string; host: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [announce, setAnnounce] = useState("");

  const c = night
    ? { page: "bg-[#0f1012] text-[#ececea]", card: "bg-[#17181b] ring-white/[0.08]", muted: "text-[#8b8d93]", input: "bg-[#0f1012] ring-white/15 focus:ring-white/50", primary: "bg-[#ececea] text-[#111214]", seg: "ring-white/10", on: "bg-white/10" }
    : { page: "bg-[#f4f2ed] text-[#1c1b18]", card: "bg-white ring-black/[0.08]", muted: "text-[#7a766d]", input: "bg-[#faf9f6] ring-black/15 focus:ring-black/50", primary: "bg-[#1c1b18] text-white", seg: "ring-black/10", on: "bg-black/[0.07]" };

  const reset = () => {
    setProjects([]);
    setMessages([]);
    setTiles([]);
    setItems([]);
    setAnnounce("");
  };

  const hostOf = (text: string) => {
    try {
      return new URL(text.trim()).host.replace(/^www\./, "");
    } catch {
      return null;
    }
  };

  const hasContent = projects.length + messages.length + tiles.length + items.length > 0;

  const inlineForm = (placeholder: string, submit: (v: string) => void, cancel: () => void, action: string) => (
    <form
      className="flex h-full flex-col justify-center gap-3 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (draft.trim()) {
          submit(draft.trim());
          setDraft("");
        }
      }}
    >
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`h-10 w-full rounded-[10px] px-3 text-[14px] outline-none ring-1 transition-shadow ${c.input}`}
      />
      <div className="flex items-center gap-2">
        <button type="submit" disabled={!draft.trim()} className={`h-8 rounded-lg px-3 text-[13px] font-medium disabled:opacity-40 ${c.primary}`}>
          {action}
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft("");
            cancel();
          }}
          className={`h-8 rounded-lg px-2 text-[13px] ${c.muted}`}
        >
          Cancel
        </button>
        <span className={`ml-auto hidden text-[11.5px] sm:inline ${c.muted}`}>Esc to cancel</span>
      </div>
    </form>
  );

  return (
    <div className={`flex h-full min-h-[600px] w-full justify-center overflow-auto px-4 py-8 ${c.page}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="w-full max-w-[760px]">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <div className={`flex flex-wrap rounded-lg p-0.5 text-[12px] ring-1 ${c.seg}`} role="group" aria-label="Empty state">
            {(["projects", "conversation", "dashboard", "collection"] as Preset[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={preset === p}
                onClick={() => {
                  setPreset(p);
                  setDraft("");
                }}
                className={`h-7 rounded-md px-2.5 capitalize ${preset === p ? c.on : "opacity-60"}`}
              >
                {p}
              </button>
            ))}
          </div>
          {hasContent && (
            <button type="button" onClick={reset} className={`ml-auto h-8 rounded-lg px-3 text-[12.5px] ring-1 ${c.seg}`}>
              Reset
            </button>
          )}
        </div>

        {preset === "projects" && (
          <section aria-label="Projects">
            <h2 className="m-0 mb-4 text-[20px] font-semibold tracking-[-0.02em]">Projects</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {projects.map((p) => (
                <article key={p} className={`flex h-[150px] flex-col justify-between rounded-2xl p-4 ring-1 ${c.card}`}>
                  <span className="grid size-8 place-items-center rounded-lg bg-[#b4532a] text-[13px] font-semibold text-white">{p[0].toUpperCase()}</span>
                  <div>
                    <p className="m-0 truncate text-[15px] font-semibold">{p}</p>
                    <p className={`m-0 text-[12.5px] ${c.muted}`}>Just now · 0 issues · only you</p>
                  </div>
                </article>
              ))}
              <FirstLight
                theme={theme}
                className="h-[150px]"
                label={projects.length ? "Create another project" : "Create your first project"}
                announce={announce}
                ghost={() => (
                  <span className="flex h-full flex-col justify-between p-4">
                    <span className="fl-call">
                      <span className="fl-plus" aria-hidden="true">
                        +
                      </span>
                      {projects.length ? "Another project" : "Your first project"}
                    </span>
                    <span className="fl-hint">{projects.length ? "Projects keep issues, docs and deploys together." : "Name it — you can invite people after."}</span>
                  </span>
                )}
                editor={({ done, cancel }) =>
                  inlineForm(
                    "Project name",
                    (v) => {
                      setProjects((p) => [...p, v]);
                      setAnnounce(`Created project ${v}.`);
                      done();
                    },
                    cancel,
                    "Create",
                  )
                }
              />
              {projects.length < 2 && <FutureSlot theme={theme} className="hidden h-[150px] sm:block" />}
              {projects.length < 1 && <FutureSlot theme={theme} className="hidden h-[150px] opacity-60 sm:block" />}
            </div>
          </section>
        )}

        {preset === "conversation" && (
          <section aria-label="Conversation" className={`flex min-h-[420px] flex-col rounded-2xl p-4 ring-1 ${c.card}`}>
            <div className="flex flex-1 flex-col justify-end gap-3" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <p className={`m-0 ml-auto max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 text-[14px] leading-[1.5] ${c.primary}`}>{m}</p>
                  <p className={`m-0 max-w-[85%] text-[14px] leading-[1.6] ${c.muted}`}>Looking through Vitrine for that now — I&rsquo;ll cite the issues and docs I use.</p>
                </div>
              ))}
              {!messages.length && (
                <FirstLight
                  theme={theme}
                  radius={20}
                  className="ml-auto w-full max-w-[420px]"
                  label="Start the conversation"
                  ghost={() => (
                    <span className="flex flex-col gap-1 p-4">
                      <span className="fl-call mb-1">Start with a question about Vitrine</span>
                      <span className="fl-hint">Your first message goes here. Click for a few starters, or write your own.</span>
                    </span>
                  )}
                  editor={({ done, cancel }) => (
                    <div className="flex flex-col gap-1 p-2">
                      {STARTERS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setMessages([s]);
                            done();
                          }}
                          className={`rounded-xl px-3 py-2 text-left text-[14px] transition-colors ${night ? "hover:bg-white/[0.06] focus-visible:bg-white/[0.06]" : "hover:bg-black/[0.04] focus-visible:bg-black/[0.04]"} outline-none`}
                        >
                          {s}
                        </button>
                      ))}
                      <div className="-mx-2 -mb-2">
                        {inlineForm(
                          "Or write your own…",
                          (v) => {
                            setMessages([v]);
                            done();
                          },
                          cancel,
                          "Send",
                        )}
                      </div>
                    </div>
                  )}
                />
              )}
            </div>
          </section>
        )}

        {preset === "dashboard" && (
          <section aria-label="Dashboard">
            <h2 className="m-0 mb-4 text-[20px] font-semibold tracking-[-0.02em]">Vitrine overview</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {tiles.map((id) => {
                const m = METRICS.find((x) => x.id === id)!;
                return (
                  <article key={id} className={`flex h-[150px] flex-col justify-between rounded-2xl p-4 ring-1 ${c.card}`}>
                    <p className={`m-0 text-[12.5px] ${c.muted}`}>{m.label}</p>
                    <p className="m-0 text-[28px] font-semibold tracking-[-0.02em] tabular-nums">{m.value}</p>
                    <Spark data={m.spark} />
                  </article>
                );
              })}
              {tiles.length < METRICS.length && (
                <FirstLight
                  theme={theme}
                  className="h-[150px]"
                  label={tiles.length ? "Add another tile" : "Add your first tile"}
                  ghost={() => (
                    <span className="flex h-full flex-col justify-between p-4">
                      <span className="fl-call">
                        <span className="fl-plus" aria-hidden="true">
                          +
                        </span>
                        {tiles.length ? "Another metric" : "Your first metric"}
                      </span>
                      <span className="flex items-end gap-1.5" aria-hidden="true">
                        {[40, 65, 50, 80, 70, 95].map((h, i) => (
                          <span key={i} className="fl-sketch w-full" style={{ height: `${h * 0.36}px` }} />
                        ))}
                      </span>
                    </span>
                  )}
                  editor={({ done, cancel }) => (
                    <div className="flex h-full flex-col justify-center gap-1.5 p-3" role="group" aria-label="Choose a metric">
                      {METRICS.filter((m) => !tiles.includes(m.id)).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setTiles((t) => [...t, m.id]);
                            done();
                          }}
                          className={`flex h-9 items-center justify-between rounded-lg px-3 text-left text-[13.5px] ring-1 transition-colors ${c.seg} ${night ? "hover:bg-white/[0.05]" : "hover:bg-black/[0.03]"}`}
                        >
                          {m.label}
                          <span className={`text-[12px] tabular-nums ${c.muted}`}>{m.value}</span>
                        </button>
                      ))}
                      <button type="button" onClick={cancel} className={`mt-1 self-start text-[12.5px] ${c.muted}`}>
                        Cancel
                      </button>
                    </div>
                  )}
                />
              )}
              {tiles.length === 0 && <FutureSlot theme={theme} className="hidden h-[150px] sm:block" />}
            </div>
          </section>
        )}

        {preset === "collection" && (
          <section aria-label="Reading list">
            <h2 className="m-0 mb-4 text-[20px] font-semibold tracking-[-0.02em]">Reading list</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {items.map((it, i) => (
                <article key={i} className={`flex h-[130px] flex-col justify-between rounded-2xl p-4 ring-1 ${c.card}`}>
                  <span className={`grid size-7 place-items-center rounded-md text-[12px] font-semibold ${night ? "bg-white/10" : "bg-black/[0.06]"}`}>{it.host[0]?.toUpperCase()}</span>
                  <div className="min-w-0">
                    <p className="m-0 truncate text-[14px] font-medium">{it.title}</p>
                    <p className={`m-0 truncate text-[12px] ${c.muted}`}>{it.host}</p>
                  </div>
                </article>
              ))}
              <FirstLight
                theme={theme}
                className="h-[130px]"
                label={items.length ? "Add another item" : "Add the first item to your reading list"}
                announce={announce}
                onDropItems={({ files, text }) => {
                  const host = hostOf(text);
                  if (files.length) setItems((x) => [...x, ...files.map((f) => ({ title: f.name, host: "Uploaded file" }))]);
                  else if (host) setItems((x) => [...x, { title: text.trim(), host }]);
                  setAnnounce("Added to your reading list.");
                }}
                ghost={(lit) => (
                  <span className="flex h-full flex-col justify-between p-4">
                    <span className="fl-call">
                      <span className="fl-plus" aria-hidden="true">
                        +
                      </span>
                      {lit ? "Drop, paste or click" : items.length ? "Another one" : "Your first read"}
                    </span>
                    <span className="fl-hint">Drop a file, paste a link, or click to add one.</span>
                  </span>
                )}
                editor={({ done, cancel }) =>
                  inlineForm(
                    "https://…",
                    (v) => {
                      const host = hostOf(v) ?? hostOf(`https://${v}`) ?? v;
                      setItems((x) => [...x, { title: v, host }]);
                      setAnnounce("Added to your reading list.");
                      done();
                    },
                    cancel,
                    "Add",
                  )
                }
              />
              {items.length < 2 && <FutureSlot theme={theme} className="hidden h-[130px] sm:block" />}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
