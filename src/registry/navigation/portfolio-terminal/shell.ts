/* The Portfolio Terminal's shell: commands, completion and "did you mean". Pure functions, no DOM. */

export type Project = { slug: string; name: string; year: string; kind: string; role: string; stack: string[]; summary: string; outcome: string };
export type Job = { years: string; title: string; org: string; note: string };
export type SkillGroup = { group: string; items: [string, number][] };
export type Portfolio = {
  handle: string;
  name: string;
  role: string;
  place: string;
  bio: string[];
  now: string;
  projects: Project[];
  experience: Job[];
  skills: SkillGroup[];
  email: string;
  links: { label: string; handle: string }[];
};

export type Cwd = "~" | "~/work";

export const COMMANDS: { name: string; usage: string; does: string }[] = [
  { name: "whoami", usage: "whoami", does: "who this is, in two lines" },
  { name: "ls", usage: "ls [work]", does: "list what's here" },
  { name: "open", usage: "open <project|number>", does: "a project's case file" },
  { name: "cd", usage: "cd <work|~>", does: "move around" },
  { name: "experience", usage: "experience", does: "where I've worked" },
  { name: "skills", usage: "skills", does: "what I'm good at, honestly" },
  { name: "contact", usage: "contact", does: "how to reach me" },
  { name: "history", usage: "history", does: "what you've typed" },
  { name: "clear", usage: "clear", does: "empty the screen (ctrl+l)" },
  { name: "help", usage: "help", does: "this list" },
];

/** Friendly words people type that mean an existing command. */
export const ALIASES: Record<string, string> = {
  about: "whoami",
  work: "ls work",
  projects: "ls work",
  cv: "experience",
  resume: "experience",
  email: "contact",
  hire: "contact",
  dir: "ls",
  "?": "help",
  cls: "clear",
  man: "help",
};

export const FILES = ["about.txt", "experience.txt", "skills.txt", "contact.txt"];
export const FILE_CMD: Record<string, string> = { "about.txt": "whoami", "experience.txt": "experience", "skills.txt": "skills", "contact.txt": "contact" };

export function parse(input: string) {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  return { cmd: (parts[0] ?? "").toLowerCase(), args: parts.slice(1) };
}

/** Resolve aliases and `cat file.txt` into the command that does the work. */
export function expand(input: string): string {
  const { cmd, args } = parse(input);
  if (ALIASES[cmd]) return [ALIASES[cmd], ...args].join(" ");
  if (cmd === "cat" && args[0] && FILE_CMD[args[0].toLowerCase()]) return FILE_CMD[args[0].toLowerCase()];
  return input.trim();
}

/** Find a project by slug, name, or 1-based number ("2", "02"). */
export function findProject(p: Portfolio, q: string): Project | undefined {
  const s = q.toLowerCase().replace(/^work\//, "").replace(/\/$/, "");
  if (/^\d+$/.test(s)) return p.projects[+s - 1];
  return p.projects.find((x) => x.slug === s || x.name.toLowerCase() === s) ?? p.projects.find((x) => x.slug.startsWith(s));
}

export function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** The closest command or alias, if it's close enough to be a typo. */
export function suggest(word: string): string | null {
  const pool = [...COMMANDS.map((c) => c.name), ...Object.keys(ALIASES).filter((k) => k.length > 2)];
  let best: string | null = null, score = Infinity;
  for (const c of pool) {
    const s = distance(word.toLowerCase(), c);
    if (s < score) { score = s; best = c; }
  }
  return best && score <= Math.max(1, Math.floor(best.length / 3)) ? best : null;
}

/** Everything that could complete the current input, in order. */
export function completions(input: string, p: Portfolio, cwd: Cwd): string[] {
  const hasSpace = /\s/.test(input);
  if (!hasSpace) {
    const w = input.toLowerCase();
    const words = [...COMMANDS.map((c) => c.name), "cat", ...Object.keys(ALIASES).filter((k) => k.length > 2)];
    return [...new Set(words)].filter((c) => c.startsWith(w) && c !== w).sort();
  }
  const { cmd } = parse(input);
  const last = input.endsWith(" ") ? "" : input.split(/\s+/).pop()!.toLowerCase();
  const head = input.slice(0, input.length - last.length);
  let pool: string[] = [];
  if (cmd === "open") pool = p.projects.map((x) => x.slug);
  else if (cmd === "cd") pool = cwd === "~" ? ["work", "~"] : ["~", ".."];
  else if (cmd === "ls") pool = cwd === "~" ? ["work"] : [];
  else if (cmd === "cat") pool = cwd === "~" ? FILES : [];
  return pool.filter((x) => x.startsWith(last) && x !== last).map((x) => head + x);
}

/** Commands worth offering next, given where the visitor is and what they just did. */
export function nextSteps(p: Portfolio, cwd: Cwd, last: string): string[] {
  const { cmd, args } = parse(expand(last));
  if (cmd === "open") {
    const cur = findProject(p, args[0] ?? "");
    if (cur) {
      const i = p.projects.indexOf(cur);
      const nx = p.projects[(i + 1) % p.projects.length];
      return [`open ${nx.slug}`, "ls work", "contact", "cd ~"];
    }
  }
  if (cwd === "~/work" || (cmd === "ls" && args[0] === "work")) return [...p.projects.slice(0, 3).map((x) => `open ${x.slug}`), "cd ~"];
  if (cmd === "experience") return ["skills", "ls work", "contact"];
  if (cmd === "skills") return ["ls work", "experience", "contact"];
  if (cmd === "contact") return ["ls work", "whoami", "clear"];
  return ["ls work", "experience", "skills", "contact", "help"];
}
