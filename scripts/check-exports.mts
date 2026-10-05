import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { sourceBundle } from "../src/lib/source-bundle.ts";
const project = path.resolve(import.meta.dirname, "..");
const root = path.join(project, "src/registry");
const scratch = mkdtempSync(path.join(tmpdir(), "vitrine-exports-"));
try {
  symlinkSync(path.join(project, "node_modules"), path.join(scratch, "node_modules"), "dir");
  const entries = readFileSync(path.join(root, "order.txt"), "utf8").split("\n").filter(s => s && !s.startsWith("#"));
  for (const entry of entries) {
    const { meta } = await import(path.join(root, entry, "meta.ts"));
    const dir = path.join(scratch, meta.slug); mkdirSync(dir);
    for (const file of await sourceBundle(meta, root)) writeFileSync(path.join(dir, file.name), file.code);
  }
  writeFileSync(path.join(scratch, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2020", lib: ["dom", "dom.iterable", "esnext"], strict: true, skipLibCheck: true, module: "esnext", moduleResolution: "bundler", jsx: "react-jsx", noEmit: true, esModuleInterop: true }, include: ["**/*.ts", "**/*.tsx"] }));
  const result = spawnSync(process.execPath, [path.join(project, "node_modules/typescript/bin/tsc"), "-p", path.join(scratch, "tsconfig.json")], { stdio: "inherit" });
  if (result.status !== 0) throw new Error("Copied examples did not compile");
  console.log(`exports: all ${entries.length} copied examples compile in an isolated project`);
} finally { rmSync(scratch, { recursive: true, force: true }); }
