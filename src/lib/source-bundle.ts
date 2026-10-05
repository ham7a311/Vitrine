import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ComponentMeta } from "../registry/types";

/** Resolve the complete local import graph and flatten it into a portable folder. */
export async function sourceBundle(meta: ComponentMeta, root = path.join(process.cwd(), "src/registry")) {
  const demoFile = path.join(root, meta.category, meta.slug, "demo.tsx");
  const boundaryFile = path.join(root, "DemoBoundary.tsx");
  const dir = path.join(root, meta.category, meta.slug);
  const files = new Map<string, string>();
  const imports = /(?:from\s*|import\s*)["'](\.[^"']+)["']/g;
  const resolve = async (base: string) => {
    for (const file of [base, `${base}.tsx`, `${base}.ts`, `${base}.css`]) {
      if (!file.startsWith(root + path.sep)) throw new Error(`Source outside registry: ${file}`);
      try { return { file, code: await readFile(file, "utf8") }; } catch (e) { if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e; }
    }
    throw new Error(`Missing source import: ${base}`);
  };
  const visit = async (base: string): Promise<void> => {
    const { file, code } = await resolve(base);
    if (files.has(file)) return;
    files.set(file, code);
    for (const m of code.matchAll(imports)) await visit(path.resolve(path.dirname(file), m[1]));
  };
  for (const f of [...meta.files, "demo.tsx"]) await visit(path.resolve(dir, f));
  await visit(boundaryFile);
  const names = new Map<string, string>();
  const used = new Set<string>();
  for (const file of files.keys()) {
    let name = file === demoFile ? "example.tsx" : path.basename(file);
    if (used.has(name)) name = `${path.basename(path.dirname(file))}-${name}`;
    if (used.has(name)) throw new Error(`Conflicting export name: ${name}`);
    used.add(name); names.set(file, name);
  }
  const bundle = [...files].map(([file, code]) => {
    const name = names.get(file)!;
    const portable = code.replace(imports, (match, specifier: string) => {
      const base = path.resolve(path.dirname(file), specifier);
      const target = [base, `${base}.tsx`, `${base}.ts`, `${base}.css`].find((p) => names.has(p));
      if (!target) throw new Error(`Unresolved export: ${specifier}`);
      const exported = names.get(target)!;
      return match.replace(specifier, `./${exported.replace(/\.tsx?$/, "")}`);
    });
    return { name, code: portable.trimEnd() + "\n", role: name === "usage.tsx" ? "usage" as const : name.endsWith(".css") ? "style" as const : "component" as const };
  });
  bundle.push({
    name: "usage.tsx",
    role: "usage",
    code: `"use client";
import type { ComponentType } from "react";
import Example from "./${names.get(demoFile)!.replace(/\.tsx$/, "")}";
import { DemoBoundary } from "./${names.get(boundaryFile)!.replace(/\.tsx$/, "")}";

const PreviewExample: ComponentType<{ variant?: string }> = Example;

// Run this usage example to keep demonstration links inside the preview.
export default function Usage({ variant }: { variant?: string }) {
  return <DemoBoundary><PreviewExample variant={variant} /></DemoBoundary>;
}
`,
  });
  return bundle.sort((a, b) => Number(a.role === "usage") - Number(b.role === "usage"));
}
