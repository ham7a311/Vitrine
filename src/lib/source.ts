import "server-only";
import { sourceBundle } from "./source-bundle";
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

export async function loadSource(meta: ComponentMeta): Promise<SourceFile[]> {
  const hl = await getHighlighter();
  const files = await sourceBundle(meta);
  return files.map((file) => ({ ...file, html: hl.codeToHtml(file.code, { lang: langOf(file.name), theme: "vitrine" }) }));
}
