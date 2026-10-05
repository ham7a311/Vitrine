export type Token = { type: "keyword" | "function" | "string" | "number" | "comment" | "operator" | "ident" | "space"; text: string };

const KEYWORDS = new Set("select from where group by order limit offset join left right inner outer full on as and or not in is null distinct case when then else end with having desc asc like ilike between union all insert into values create table replace view describe show over partition window filter qualify using cross natural true false interval cast".split(" "));
const FUNCTIONS = new Set("count sum avg min max round date_trunc strftime coalesce lower upper length now current_date extract epoch row_number rank lag lead median quantile_cont list string_agg".split(" "));

/** A small SQL tokenizer for highlighting: keywords, functions, strings, numbers, comments. */
export function tokenize(sql: string): Token[] {
  const out: Token[] = [];
  const re = /(--[^\n]*)|('(?:[^']|'')*'?)|("(?:[^"]|"")*"?)|(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql))) {
    if (m[1]) out.push({ type: "comment", text: m[1] });
    else if (m[2]) out.push({ type: "string", text: m[2] });
    else if (m[3]) out.push({ type: "ident", text: m[3] });
    else if (m[4]) out.push({ type: "number", text: m[4] });
    else if (m[5]) {
      const low = m[5].toLowerCase();
      const next = sql.slice(re.lastIndex).match(/^\s*\(/);
      out.push({ type: KEYWORDS.has(low) ? "keyword" : FUNCTIONS.has(low) && next ? "function" : "ident", text: m[5] });
    } else if (m[6]) out.push({ type: "space", text: m[6] });
    else out.push({ type: "operator", text: m[7] });
  }
  return out;
}
