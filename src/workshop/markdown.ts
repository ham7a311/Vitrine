import "server-only";
import { createHighlighter, type ShikiTransformer } from "shiki";
import { CODE_THEME, TOKEN_CLASS } from "./code-colours";

/**
 * A small Markdown renderer for our own skill files: headings, paragraphs, nested lists (which may
 * hold code blocks), tables, block quotes, bold, italics, inline code and fenced code (highlighted).
 * The input is authored in this repo, not user content.
 */

const LANGS = ["js", "ts", "tsx", "bash", "css"];
let hl: ReturnType<typeof createHighlighter> | null = null;
const highlighter = () =>
  (hl ??= createHighlighter({ themes: [CODE_THEME], langs: LANGS }).then((h) => {
    const theme = h.getTheme(CODE_THEME);
    const colours = [theme.fg, ...theme.settings.map((s) => s.settings?.foreground)].filter((c): c is string => !!c);
    const missing = [...new Set(colours.map((c) => c.toUpperCase()))].filter((c) => !TOKEN_CLASS[c]);
    if (missing.length) throw new Error(`code-colours.ts has no class for ${missing.join(", ")}`);
    return h;
  }));
type Highlighter = Awaited<ReturnType<typeof highlighter>>;

/** A token whose only style is a colour gets that colour's class instead (see code-colours.ts). */
const colourClasses: ShikiTransformer = {
  name: "skill-colour-classes",
  span(node) {
    const colour = typeof node.properties.style === "string" && node.properties.style.match(/^color:(#[0-9A-Fa-f]{6})$/)?.[1];
    const cls = colour && TOKEN_CLASS[colour.toUpperCase()];
    if (!cls) return;
    delete node.properties.style;
    this.addClassToHast(node, cls);
  },
};

/**
 * A token whose only style is the block's own colour (which it inherits from <pre>) is sent as plain text — but
 * only where its neighbours stay elements. Two text runs side by side would be laid out as one, which moves later
 * characters by fractions of a pixel, so the next such token keeps its span. Tokens are never merged, for the same reason.
 */
const plainBaseTokens: ShikiTransformer = {
  name: "skill-plain-base-tokens",
  line(node) {
    const inherited = typeof this.pre.properties.style === "string" && this.pre.properties.style.match(/(?:^|;)color:(#[0-9A-Fa-f]{6})/)?.[1];
    const base = inherited && TOKEN_CLASS[inherited.toUpperCase()];
    if (!base) return;
    const out: typeof node.children = [];
    for (const child of node.children) {
      const plain = child.type === "element" && Object.keys(child.properties).length === 1 && Array.isArray(child.properties.class) &&
        child.properties.class.length === 1 && child.properties.class[0] === base && child.children.every((c) => c.type === "text");
      if (plain && out.at(-1)?.type !== "text") out.push(...child.children);
      else out.push(child);
    }
    node.children = out;
  },
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = (s: string) =>
  esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");

const indent = (s: string) => s.match(/^ */)![0].length;
const ITEM = /^( *)(-|\d+\.)\s+(.*)/;
const TABLE_RULE = /^\s*\|[\s:|-]+\|\s*$/;
const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
const startsBlock = (l: string) => /^\s*(```|#{1,4}\s|>\s?|\|)/.test(l) || ITEM.test(l);

function blocks(lines: string[], h: Highlighter): string {
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const fence = line.match(/^\s*```(\w*)/);
    if (fence) {
      const pad = indent(line);
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++].slice(Math.min(pad, indent(lines[i - 1]))));
      i++;
      const lang = LANGS.includes(fence[1]) ? fence[1] : "bash";
      out.push(`<div class="md-code">${h.codeToHtml(code.join("\n"), { lang, theme: CODE_THEME, transformers: [colourClasses, plainBaseTokens] })}</div>`);
      continue;
    }

    const head = line.match(/^(#{1,4})\s+(.*)/);
    if (head) {
      const level = Math.min(4, Math.max(2, head[1].length));
      out.push(`<h${level}>${inline(head[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*\|/.test(line) && TABLE_RULE.test(lines[i + 1] ?? "")) {
      const headRow = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(
        `<div class="md-table"><table><thead><tr>${headRow.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`,
      );
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, ""));
      out.push(`<blockquote>${blocks(quote, h)}</blockquote>`);
      continue;
    }

    const first = line.match(ITEM);
    if (first) {
      const base = first[1].length;
      const ordered = /\d/.test(first[2]);
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(ITEM);
        if (!m || m[1].length !== base || /\d/.test(m[2]) !== ordered) break;
        const text = [m[3]];
        const body: string[] = [];
        i++;
        // Wrapped text of the item itself.
        while (i < lines.length && lines[i].trim() && indent(lines[i]) > base && !startsBlock(lines[i])) text.push(lines[i++].trim());
        // Anything indented deeper belongs to the item: nested lists, code, more paragraphs.
        while (i < lines.length) {
          if (lines[i].trim() && indent(lines[i]) > base) body.push(lines[i++]);
          else if (!lines[i].trim() && i + 1 < lines.length && lines[i + 1].trim() && indent(lines[i + 1]) > base) body.push(lines[i++]);
          else break;
        }
        const pad = Math.min(...body.filter((l) => l.trim()).map(indent));
        items.push(`<li>${inline(text.join(" "))}${body.length ? blocks(body.map((l) => l.slice(pad)), h) : ""}</li>`);
        // A blank line between items keeps the list going.
        if (i < lines.length && !lines[i].trim() && (lines[i + 1] ?? "").match(ITEM)?.[1].length === base) i++;
      }
      out.push(ordered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`);
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) para.push(lines[i++].trim());
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

export async function renderMarkdown(md: string): Promise<string> {
  return blocks(md.split("\n"), await highlighter());
}
