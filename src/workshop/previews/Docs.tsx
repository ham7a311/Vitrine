"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { ChapterRail, type RailChapter } from "@/registry/sidebars/chapter-rail/ChapterRail";
import { DocketNav } from "@/registry/navbars/docket-nav/DocketNav";
import { PleatCrumbs, type Crumb } from "@/registry/navigation/pleat-crumbs/PleatCrumbs";
import { InstallSnippet, type SnippetTab } from "@/registry/data/install-snippet/InstallSnippet";
import { Less, More, Stretchtext } from "@/registry/reading/stretchtext/Stretchtext";
import { ShortcutPalette, type Command } from "@/registry/overlays/shortcut-palette/ShortcutPalette";
import { GlossTerm } from "@/registry/overlays/gloss-term/GlossTerm";
import { AlertCallout } from "@/registry/feedback/alert-callout/AlertCallout";

/* One palette for five components, set through their own tokens (Chapter Rail's night values are the reference). */
const TOKENS = `
.dhow { font-family: Geist, ui-sans-serif, system-ui, sans-serif; }
.dhow :is(code, pre, kbd) { font-family: "Geist Mono", ui-monospace, monospace; }
.dhow .gloss-term--night { --gt-bg: #15171b; --gt-ink: #eceef2; --gt-muted: #9a9eaa; --gt-line: rgb(255 255 255 / 0.12); --gt-accent: #8fb5ff; }
.dhow .docket-nav__docket li a { font: 600 1.25rem/1.2 Geist, ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.02em; }
.dhow .docket-nav--night { --dn-bg: #0f1013; --dn-ink: #eceef2; --dn-muted: #9a9eaa; --dn-line: rgb(255 255 255 / 0.08); --dn-accent: #8fb5ff; --dn-on-ink: #0f1013; }
.dhow .pleat-crumbs--night { --pc-ink: #eceef2; --pc-muted: #9a9eaa; --pc-line: rgb(255 255 255 / 0.12); --pc-chip: rgb(255 255 255 / 0.06); }
.dhow .stx--dark { --stx-paper: #15171b; --stx-ink: #eceef2; --stx-muted: #9a9eaa; --stx-line: rgb(255 255 255 / 0.08); --stx-wash: rgb(143 181 255 / 0.22); --stx-accent: #8fb5ff; --stx-seg: #0f1013; font-family: inherit; }
.dhow .isnip--dark { --is-page: #0f1013; --is-paper: #15171b; --is-ink: #eceef2; --is-muted: #9a9eaa; --is-line: rgb(255 255 255 / 0.14); --is-shadow: transparent; --is-code-bg: #0b0c0f; --is-code-ink: #e3e6ec; --is-code-faint: #6b7080; --is-yellow: #8fb5ff; --is-sky: #8fb5ff; --is-teal: #3d6fd6; --is-coral: #c9d8ff; font-family: inherit; }
`;

const g = (d: string) => (
  <svg viewBox="0 0 12 12">
    <path d={d} />
  </svg>
);

const CHAPTERS: RailChapter[] = [
  { id: "ch-start", title: "Get started", icon: g("M2 6h8M6.5 2.5 10 6 6.5 9.5"), sections: [{ id: "install", title: "Install" }, { id: "first-sync", title: "Your first sync" }, { id: "config", title: "The dhow.toml file" }] },
  { id: "ch-concepts", title: "Concepts", icon: g("M6 1.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM6 4v2.5M6 8.2v.1"), sections: [{ id: "how-it-works", title: "How syncing works" }, { id: "conflicts", title: "Conflicts" }, { id: "ignore", title: "Ignore rules" }] },
  { id: "ch-reference", title: "Reference", icon: g("M4 2.5 1.5 6 4 9.5M8 2.5 10.5 6 8 9.5"), sections: [{ id: "cmd-sync", title: "dhow sync" }, { id: "cmd-watch", title: "dhow watch" }, { id: "env", title: "Environment variables" }] },
];

/* Every page, searchable from ⌘K: the chapter is the group, the page title is the command. */
const PAGES: Command[] = CHAPTERS.flatMap((c) => c.sections.map((p) => ({ id: p.id, label: p.title, group: c.title, keywords: c.title })));

const INSTALL: SnippetTab[] = [
  {
    id: "brew",
    label: "Homebrew",
    steps: [
      { title: "Install the CLI", lang: "shell", code: "$ brew install dhow" },
      { title: "Sign in once per machine", lang: "shell", code: "$ dhow login\nOpening dhow.dev/device … code KQ7-48M\n✓ Signed in as aisha@nizwa-labs.com" },
    ],
  },
  {
    id: "npm",
    label: "npm",
    steps: [
      { title: "Install globally", lang: "shell", code: "$ npm install --global @dhow/cli" },
      { title: "Sign in once per machine", lang: "shell", code: "$ dhow login" },
    ],
  },
  {
    id: "ci",
    label: "Linux / CI",
    steps: [
      { title: "Install the binary", lang: "shell", code: "$ curl -fsSL https://get.dhow.dev | sh" },
      { title: "Use a token instead of a browser", lang: "shell", code: "$ export DHOW_TOKEN=dhw_live_…   # from Settings → Tokens\n$ dhow whoami" },
    ],
  },
];

type Node = { id: string; label: string; children?: Node[] };
const VERSIONS: Node[] = [{ id: "guide", label: "Guide" }, { id: "recipes", label: "Recipes" }, { id: "changelog", label: "Changelog" }];
const TREE: Node[] = [
  { id: "cli", label: "Dhow CLI", children: [{ id: "v24", label: "v2.4 (latest)", children: VERSIONS }, { id: "v23", label: "v2.3", children: VERSIONS }, { id: "v19", label: "v1.9", children: VERSIONS }] },
  { id: "desktop", label: "Desktop app", children: [{ id: "d-v3", label: "v3.0", children: VERSIONS }] },
  { id: "api", label: "HTTP API", children: [{ id: "a-v1", label: "v1", children: VERSIONS }] },
];

function pathFor(ids: string[]): Crumb[] {
  const out: Crumb[] = [];
  let level = TREE;
  for (const id of ids) {
    const node = level.find((n) => n.id === id);
    if (!node) break;
    out.push({ id: node.id, label: node.label, href: "#", siblings: level.map((n) => ({ id: n.id, label: n.label })) });
    level = node.children ?? [];
  }
  return out;
}

/** After picking a sibling, follow first children so the path keeps its depth. */
function extend(ids: string[], depth: number): string[] {
  const out = [...ids];
  let level = TREE;
  for (const id of out) level = level.find((n) => n.id === id)?.children ?? [];
  while (out.length < depth && level.length) {
    out.push(level[0].id);
    level = level[0].children ?? [];
  }
  return out;
}

const Code = ({ children }: { children: string }) => (
  <pre className="mt-4 overflow-x-auto rounded-xl bg-[#0b0c0f] p-4 font-mono text-[12.5px] leading-[1.65] text-[#e3e6ec] ring-1 ring-white/[0.06]">
    <code>{children}</code>
  </pre>
);
const C = ({ children }: { children: ReactNode }) => <code className="whitespace-nowrap rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-[#eceef2]">{children}</code>;
const P = ({ children }: { children: ReactNode }) => <p className="mt-3 text-[15px] leading-[1.7] text-[#a9adb8]">{children}</p>;

function Page({ id, title, children }: { id: string; title?: ReactNode; children: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-6 pt-10">
      {title && <h3 className="text-[1.375rem] font-bold tracking-[-0.015em] text-[#eceef2]">{title}</h3>}
      {children}
    </div>
  );
}

function Options({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="mt-4 divide-y divide-white/[0.07] border-y border-white/[0.07]">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
          <dt className="font-mono text-[13px] text-[#eceef2]">{k}</dt>
          <dd className="m-0 text-[14px] leading-[1.6] text-[#a9adb8]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Docs() {
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const [search, setSearch] = useState(false);
  const [ids, setIds] = useState(["cli", "v24", "guide"]);
  const path = useMemo(() => pathFor(ids), [ids]);

  return (
    <div ref={root} tabIndex={-1} className="dhow relative flex h-full w-full flex-col bg-[#0f1013] text-[#eceef2] outline-none md:flex-row">
      <style>{TOKENS}</style>

      {/* Desktop: the rail is the navigation. Phones: it gives way to the navbar's menu, which names the chapter you're in. */}
      <div className="hidden h-full border-r border-white/[0.06] md:flex">
        <ChapterRail name="Dhow" version="v2.4" chapters={CHAPTERS} scrollRoot={main} theme="night" />
      </div>
      <div className="md:hidden">
        <DocketNav
          theme="night"
          brand={{ name: "Dhow docs", mark: "D" }}
          links={[
            { label: "Get started", href: "#get-started" },
            { label: "Concepts", href: "#concepts" },
            { label: "Reference", href: "#reference" },
          ]}
          scrollRef={main}
        />
      </div>

      <main ref={main} className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[46rem] px-4 pb-32 pt-5 sm:px-8 md:pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PleatCrumbs theme="night" path={path} onNavigate={(level, id) => setIds(extend([...ids.slice(0, level), id], ids.length))} />
            <button
              type="button"
              onClick={() => setSearch(true)}
              className="flex h-9 items-center gap-3 rounded-lg px-3 text-[0.8125rem] text-[#9a9eaa] ring-1 ring-white/12 transition-colors hover:bg-white/[0.04] hover:text-[#eceef2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8fb5ff]"
            >
              Search docs
              <kbd className="text-[0.6875rem]">⌘K</kbd>
            </button>
          </div>

          <header className="mt-8 border-b border-white/[0.07] pb-8">
            <h1 className="text-[clamp(1.875rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em]">The Dhow CLI guide</h1>
            <p className="mt-3 max-w-[54ch] text-[16px] leading-[1.65] text-[#a9adb8]">
              Sync a folder to any{" "}
              <GlossTerm theme="night" title="S3-compatible" gloss="Storage that speaks the same API as Amazon S3. Cloudflare R2, Backblaze B2, MinIO and most cloud providers do, so one tool works with all of them." also="object storage">
                S3-compatible
              </GlossTerm>{" "}
              bucket from your terminal. Install it, run your first sync, then keep this page open as the reference.
            </p>
          </header>

          <section id="get-started" aria-labelledby="h-start" className="scroll-mt-4">
            <h2 id="h-start" className="mt-10 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8f93a0]">
              Get started
            </h2>
            <Page id="install" title="Install">
              <P>Dhow is one binary with no runtime to manage. Install it, sign in once, and every bucket your account can reach is available by name.</P>
              <div className="mt-5">
                <InstallSnippet tabs={INSTALL} theme="dark" />
              </div>
            </Page>
            <Page id="first-sync" title="Your first sync">
              <P>Point Dhow at a folder and a bucket. The first run uploads everything; after that, only what changed.</P>
              <Code>{"$ dhow sync ./site s3://nizwa-labs-web\nScanning ./site … 1,284 files, 212 MB\nUploading 1,284 files  ████████████████  100%\n✓ Synced in 38s · 212 MB sent\n\n$ dhow sync ./site s3://nizwa-labs-web\n✓ Already in sync · 0 files sent"}</Code>
            </Page>
            <Page id="config" title={<>The <C>dhow.toml</C> file</>}>
              <P>
                Commit a <C>dhow.toml</C> next to your project and <C>dhow sync</C> needs no arguments. Flags on the command line still win, so one-off runs don&rsquo;t mean editing the file.
              </P>
              <Code>{'[sync]\nsource = "./site"\ntarget = "s3://nizwa-labs-web"\ndelete = false   # never remove remote files unless asked\n\n[ignore]\npatterns = [".DS_Store", "node_modules/", "*.log"]'}</Code>
            </Page>
          </section>

          <section id="concepts" aria-labelledby="h-concepts" className="scroll-mt-4">
            <h2 id="h-concepts" className="mt-16 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8f93a0]">
              Concepts
            </h2>
            <Page id="how-it-works">
              <div className="mt-2">
                <Stretchtext title="How syncing works" theme="dark">
                  <p>
                    Dhow compares each file&rsquo;s size and{" "}
                    <GlossTerm theme="night" gloss="A short fingerprint computed from a file's contents. Change one byte and the checksum changes, so matching checksums mean matching files.">checksum</GlossTerm>{" "}
                    with what&rsquo;s already in the bucket
                    <More level={1}>
                      , using a{" "}
                      <GlossTerm theme="night" gloss="One file listing every synced file with its size, checksum and time. Reading it is far faster than listing millions of objects in the bucket.">manifest</GlossTerm>{" "}
                      it keeps at the bucket&rsquo;s root in <C>.dhow/manifest.json</C>
                    </More>
                    <More level={2}>, so a sync never has to list millions of remote objects to find what changed</More>.
                    {" "}<Less below={1}>Only changed files are sent.</Less>
                    <More level={1}>Matching files are skipped; new and changed files upload in parallel, eight at a time unless you set <C>--jobs</C>.</More>
                  </p>
                  <h3>Large files</h3>
                  <p>
                    Files over 64 MB upload in parts
                    <More level={1}>, so a dropped connection costs one part rather than the whole file</More>
                    <More level={2}>. Parts are 16 MB and each is retried three times with backoff before the sync stops and names the file that failed</More>.
                    {" "}<Less below={1}>Interrupted uploads resume where they stopped.</Less>
                  </p>
                  <h3>Deletes</h3>
                  <p>
                    <Less below={1}>Dhow never deletes remote files unless you ask.</Less>
                    <More level={1}>Files you delete locally stay in the bucket until you run with <C>--delete</C> or set <C>delete = true</C>. That&rsquo;s deliberate: a sync from the wrong folder should never empty a bucket</More>
                    <More level={2}>, and <C>--delete</C> always lists what it will remove and waits for a yes unless you also pass <C>--yes</C></More>
                    <More level={1}>.</More>
                  </p>
                </Stretchtext>
              </div>
            </Page>
            <Page id="conflicts" title="Conflicts">
              <P>
                A conflict is a file that changed on both sides since the last sync. Dhow doesn&rsquo;t guess: it keeps the remote copy, saves yours beside it with the machine&rsquo;s name, and lists both at the end of the run.
              </P>
              <Code>{"⚠ 1 conflict\n  docs/pricing.md   changed here and in s3://nizwa-labs-web\n  kept remote · yours saved as docs/pricing.conflict-aisha-mbp.md"}</Code>
            </Page>
            <Page id="ignore" title="Ignore rules">
              <P>
                Patterns follow <C>.gitignore</C> syntax. Dhow reads <C>.gitignore</C> and <C>.dhowignore</C> in every folder, then the <C>[ignore]</C> patterns in <C>dhow.toml</C>. A leading <C>!</C> brings a file back.
              </P>
            </Page>
          </section>

          <section id="reference" aria-labelledby="h-reference" className="scroll-mt-4">
            <h2 id="h-reference" className="mt-16 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8f93a0]">
              Reference
            </h2>
            <Page id="cmd-sync" title={<span className="font-mono text-[1.1875rem] font-semibold">dhow sync [source] [target]</span>}>
              <P>Brings the target in line with the source, once. Both arguments can come from <C>dhow.toml</C>.</P>
              <Options
                rows={[
                  ["--dry-run", "Print what would change and exit without uploading."],
                  ["--delete", "Remove remote files that no longer exist locally. Lists them and asks first."],
                  ["--yes", <>Skip the <C>--delete</C> confirmation. Meant for CI.</>],
                  ["--jobs <n>", "Parallel uploads. Default 8."],
                  ["--exclude <glob>", "Add an ignore pattern for this run only. Repeatable."],
                ]}
              />
              <AlertCallout tone="warning" look="accent" theme="dark" title="--delete can't be undone from Dhow" className="mt-6">
                <p>Remote files it removes are gone unless your bucket keeps versions. Run with <C>--dry-run</C> first, and turn on versioning for any bucket you sync with <C>--delete</C>.</p>
              </AlertCallout>
            </Page>
            <Page id="cmd-watch" title={<span className="font-mono text-[1.1875rem] font-semibold">dhow watch [source] [target]</span>}>
              <P>Syncs once, then watches the folder and sends each change within a second of saving. Ctrl-C stops after the current upload finishes.</P>
              <Code>{"$ dhow watch ./site\nWatching ./site · in sync at 14:02:11\n↑ index.html  4.2 KB  14:03:40\n↑ css/site.css  11 KB  14:03:41"}</Code>
            </Page>
            <Page id="env" title="Environment variables">
              <Options
                rows={[
                  ["DHOW_TOKEN", <>An access token for CI. Takes precedence over <C>dhow login</C>.</>],
                  ["DHOW_PROFILE", <>Which profile in <C>~/.config/dhow/profiles.toml</C> to use.</>],
                  ["DHOW_NO_COLOR", "Plain output, for log files."],
                ]}
              />
            </Page>
          </section>

          <footer className="mt-16 flex flex-wrap justify-between gap-3 border-t border-white/[0.07] pt-6 text-[13px] text-[#8f93a0]">
            <span>Last reviewed 12 October 2026 by Aisha Al-Harthy</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[#8fb5ff] underline decoration-[#8fb5ff]/30 underline-offset-4 hover:decoration-[#8fb5ff]">
              Edit this page
            </a>
          </footer>
        </div>
      </main>

      <ShortcutPalette
        contained
        theme="night"
        commands={PAGES}
        open={search}
        onOpenChange={setSearch}
        placeholder="Search the docs"
        hotkeyScope={root}
        onRun={(c) => main.current?.querySelector(`#${c.id}`)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })}
      />
    </div>
  );
}
