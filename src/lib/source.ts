import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type ThemeRegistrationRaw } from "shiki";
import type { ComponentMeta } from "@/registry/types";

const vitrineTheme: ThemeRegistrationRaw = {
  name: "vitrine",
  type: "dark",
  settings: [
    { settings: { foreground: "#d9d2c6", background: "#100b12" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#6f6875", fontStyle: "italic" } },
    { scope: ["keyword", "storage", "storage.type", "keyword.control", "keyword.operator.new"], settings: { foreground: "#c8b9ea" } },
    { scope: ["string", "string.template", "punctuation.definition.string"], settings: { foreground: "#e8d5b5" } },
    { scope: ["constant.numeric", "constant.language", "support.constant"], settings: { foreground: "#f0b98a" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#b9cce4" } },
    { scope: ["entity.name.type", "support.type", "entity.name.class", "entity.other.inherited-class"], settings: { foreground: "#9fd4c8" } },
    { scope: ["entity.name.tag", "support.class.component"], settings: { foreground: "#b9cce4" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: "#a7a1ab", fontStyle: "italic" } },
    { scope: ["variable", "variable.other.readwrite", "meta.object-literal.key"], settings: { foreground: "#e6dfd3" } },
    { scope: ["variable.parameter"], settings: { foreground: "#f1e3cf" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#8d8692" } },
    { scope: ["support.type.property-name.css", "support.type.property-name"], settings: { foreground: "#b9cce4" } },
    { scope: ["support.type.vendored.property-name.css"], settings: { foreground: "#9fb3cc" } },
    { scope: ["entity.other.attribute-name.class.css", "entity.other.attribute-name.pseudo-class.css"], settings: { foreground: "#c8b9ea", fontStyle: "" } },
    { scope: ["keyword.other.unit", "constant.other.color"], settings: { foreground: "#f0b98a" } },
    { scope: ["source.glsl", "string.template.glsl"], settings: { foreground: "#e8d5b5" } },
  ],
};

let highlighter: ReturnType<typeof createHighlighter> | null = null;
function getHighlighter() {
  highlighter ??= createHighlighter({ themes: [vitrineTheme], langs: ["tsx", "ts", "css"] });
  return highlighter;
}

const langOf = (file: string) => (file.endsWith(".css") ? "css" : file.endsWith(".ts") ? "ts" : "tsx");

export interface SourceFile {
  name: string;
  code: string;
  html: string;
  role: "component" | "style" | "usage";
}

const REGISTRY_DIR = path.join(process.cwd(), "src", "registry");

export async function loadSource(meta: ComponentMeta): Promise<SourceFile[]> {
  const dir = path.join(REGISTRY_DIR, meta.category, meta.slug);
  const hl = await getHighlighter();
  const entries: { name: string; file: string; role: SourceFile["role"] }[] = [
    ...meta.files.map((f) => ({ name: f, file: f, role: f.endsWith(".css") ? ("style" as const) : ("component" as const) })),
    { name: "usage.tsx", file: "demo.tsx", role: "usage" as const },
  ];
  return Promise.all(
    entries.map(async ({ name, file, role }) => {
      let code = await readFile(path.join(dir, file), "utf8");
      if (role === "usage") code = toUsage(code);
      const html = hl.codeToHtml(code, { lang: langOf(name), theme: "vitrine" });
      return { name, code, html, role };
    }),
  );
}

/** Demo files import siblings with "./"; in usage we show the same, minus the gallery-only variant plumbing. */
function toUsage(code: string) {
  return code.replace(/^"use client";\n\n/, '"use client";\n\n').trimEnd() + "\n";
}
