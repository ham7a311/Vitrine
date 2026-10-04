import "server-only";
import { createHighlighter } from "shiki";

/**
 * A small Markdown renderer for our own skill files: headings, paragraphs, nested lists (which may
 * hold code blocks), tables, block quotes, bold, italics, inline code and fenced code (highlighted).
 * The input is authored in this repo, not user content.
 */

const LANGS = ["js", "ts", "tsx", "bash", "css"];
let hl: ReturnType<typeof createHighlighter> | null = null;
const highlighter = () => (hl ??= createHighlighter({ themes: ["github-dark-default"], langs: LANGS }));
type Highlighter = Awaited<ReturnType<typeof highlighter>>;

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
      out.push(`<div class="md-code">${h.codeToHtml(code.join("\n"), { lang, theme: "github-dark-default" })}</div>`);
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
