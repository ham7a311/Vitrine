"use client";
import { useEffect, useRef, useState } from "react";
import { ChapterRail, type RailChapter } from "./ChapterRail";

const g = (d: string) => <svg viewBox="0 0 12 12"><path d={d} /></svg>;
const CHAPTERS: RailChapter[] = [
  { id: "start", title: "Getting started", icon: g("M2 6h8M6.5 2.5 10 6 6.5 9.5"), sections: [{ id: "install", title: "Install" }, { id: "first-job", title: "Your first job" }, { id: "concepts", title: "Core concepts" }] },
  { id: "guides", title: "Guides", icon: g("M2.5 2h7v8h-7zM4.5 4.5h3M4.5 6.5h3"), sections: [{ id: "retries", title: "Retries and backoff" }, { id: "schedules", title: "Schedules" }, { id: "rate-limits", title: "Rate limits" }, { id: "priorities", title: "Priorities" }] },
  { id: "api", title: "API reference", icon: g("M4 2.5 1.5 6 4 9.5M8 2.5 10.5 6 8 9.5"), sections: [{ id: "queue", title: "Queue" }, { id: "worker", title: "Worker" }, { id: "events", title: "Events" }] },
  { id: "ops", title: "Operations", icon: g("M6 1.5v2M6 8.5v2M1.5 6h2M8.5 6h2M6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"), sections: [{ id: "deploy", title: "Deploying workers" }, { id: "metrics", title: "Metrics and alerts" }] },
];

const COPY: Record<string, [string, string?]> = {
  install: ["Tidewater runs anywhere Node 20 does and keeps its state in Postgres, so there's nothing new to host. Add the package, point it at your database and run the migration once.", "npm install tidewater\nnpx tidewater migrate --url $DATABASE_URL"],
  "first-job": ["A job is a name and a JSON payload. Define a handler for the name, then enqueue work from anywhere in your app; a worker picks it up within a few milliseconds.", "queue.define('send-receipt', async ({ orderId }) => {\n  await mail.receipt(orderId);\n});\nawait queue.add('send-receipt', { orderId: 'A-1042' });"],
  concepts: ["Queues hold jobs, workers claim them with a lease, and a job that isn't finished before its lease ends goes back on the queue. Everything else — retries, schedules, limits — is built from those three ideas."],
  retries: ["Failed jobs are retried with exponential backoff and jitter. Set the attempts and the base delay per job type; the last failure lands in the dead-letter view with its stack trace.", "queue.define('sync-stock', handler, { attempts: 6, backoff: '2s' });"],
  schedules: ["Cron expressions and plain intervals both work. Schedules are stored in the database, so adding a worker never runs a schedule twice."],
  "rate-limits": ["Limit a job type to a number of runs per window across every worker — useful for third-party APIs with strict quotas.", "queue.define('geocode', handler, { limit: { max: 50, per: '1m' } });"],
  priorities: ["Each job has a priority from 1 to 10. Workers always take the highest waiting priority first and fall back to arrival order within it."],
  queue: ["new Queue(options) connects to the database. add, addMany, cancel and get cover the life of a job; pause and resume stop and start claiming without dropping work."],
  worker: ["new Worker(queue, options) claims jobs in batches. concurrency sets how many run at once per process; shutdown waits for running jobs to finish or their leases to lapse."],
  events: ["Subscribe to completed, failed, retried and stalled events on a queue or a single job type. Events are delivered once per process and carry the job's id, name and timing."],
  deploy: ["Run workers as their own process so web deploys don't interrupt jobs. Scale them horizontally; leases make sure each job is held by one worker at a time."],
  metrics: ["Tidewater exports queue depth, wait time, run time and failure rate. Alert on wait time rather than depth — a long queue that drains quickly is healthy."],
};

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const main = useRef<HTMLElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => { setNarrow(matchMedia("(max-width: 640px)").matches); }, []);
  const c = paper
    ? { page: "bg-[#ffffff] text-[#18191d]", muted: "text-[#5c5f68]", code: "bg-[#f4f3ef] text-[#2a2c33]" }
    : { page: "bg-[#131418] text-[#eceef2]", muted: "text-[#9a9eaa]", code: "bg-[#0c0d10] text-[#cfd3dc]" };
  return (
    <div className={`flex h-[34rem] w-full overflow-hidden ${c.page}`} style={{ fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui' }}>
      <ChapterRail key={String(narrow)} name="Tidewater" version="v3.2" chapters={CHAPTERS} scrollRoot={main} defaultCollapsed={narrow} theme={paper ? "paper" : "night"} />
      <main ref={main} className="min-w-0 flex-1 overflow-y-auto scroll-smooth px-6 py-8 sm:px-10">
        <article className="mx-auto max-w-2xl pb-[40vh]">
          {CHAPTERS.map((ch) => (
            <section key={ch.id} aria-labelledby={`h-${ch.id}`} className="mb-10">
              <p id={`h-${ch.id}`} className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${c.muted}`}>{ch.title}</p>
              {ch.sections.map((s) => (
                <div key={s.id} id={s.id} className="scroll-mt-6 pt-6">
                  <h2 className="text-[22px] font-bold tracking-[-0.015em]">{s.title}</h2>
                  <p className={`mt-3 text-[15px] leading-[1.7] ${c.muted}`}>{COPY[s.id][0]}</p>
                  {COPY[s.id][1] && <pre className={`mt-4 overflow-x-auto rounded-xl p-4 text-[12.5px] leading-[1.6] ${c.code}`}><code>{COPY[s.id][1]}</code></pre>}
                  <p className={`mt-3 text-[15px] leading-[1.7] ${c.muted}`}>Every option here can also be set once on the queue and overridden per job, so most apps keep their defaults in one place and only tune the few job types that need it.</p>
                </div>
              ))}
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}
