import { spawn } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";
import { createSourceHighlighter } from "../src/lib/highlight.ts";
import { writeSource } from "./build-source.mts";

/**
 * `npm run dev`: the Next dev server, plus a watcher that rewrites the Code tab's source whenever a
 * registry file or the source tooling changes, so Code always matches the preview. Arguments pass
 * through to `next dev` (e.g. `npm run dev -- -p 3001`).
 */
const project = path.resolve(import.meta.dirname, "..");
const highlight = await createSourceHighlighter();

let timer: ReturnType<typeof setTimeout> | undefined;
let running: Promise<void> | null = null;
let again = false;

async function regenerate() {
  const start = performance.now();
  try {
    const { components } = await writeSource(highlight);
    console.log(`source: ${components} components updated in ${Math.round(performance.now() - start)} ms`);
  } catch (error) {
    // A half-saved file can fail to bundle; the last good source stays until the next save.
    console.error(`source: not updated, ${(error as Error).message}`);
  }
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (running) { again = true; return; }
    running = regenerate().finally(() => {
      running = null;
      if (again) { again = false; schedule(); }
    });
  }, 200);
}

await regenerate();
for (const dir of ["src/registry", "src/lib"]) {
  watch(path.join(project, dir), { recursive: true }, (_event, file) => {
    if (file && /\.(tsx?|css|txt)$/.test(file)) schedule();
  });
}

const next = spawn(process.execPath, [path.join(project, "node_modules/next/dist/bin/next"), "dev", ...process.argv.slice(2)], { cwd: project, stdio: "inherit" });
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => next.kill(signal));
next.on("exit", (code) => process.exit(code ?? 0));
