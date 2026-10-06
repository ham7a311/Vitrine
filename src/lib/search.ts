import type { ComponentSummary } from "@/registry";
import { CATEGORIES } from "@/registry/types";

const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

function tokenize(s: string) {
  return s.toLowerCase().split(/[^a-z0-9&]+/).filter(Boolean);
}

/**
 * What people type → the words the library uses. Reviewed by hand: every entry is a decision.
 * Synonym hits score a little below exact hits, so a literal match still ranks first.
 */
const SYNONYMS: Record<string, string[]> = {
  cta: ["ctas", "call", "action"],
  login: ["auth", "authentication", "signin"],
  signin: ["auth", "authentication"],
  signup: ["auth", "authentication", "register"],
  auth: ["authentication"],
  password: ["auth", "authentication"],
  ai: ["chat", "assistant", "agent", "llm"],
  chatbot: ["ai", "chat"],
  chart: ["analytics", "graph", "stats"],
  graph: ["analytics", "chart"],
  dashboard: ["analytics", "stats", "data"],
  metrics: ["stats", "analytics"],
  nav: ["navbar", "navigation"],
  menu: ["navbar", "navigation", "sidebar"],
  header: ["navbar", "hero"],
  modal: ["dialog", "overlay", "sheet"],
  popup: ["dialog", "overlay", "popover"],
  toast: ["feedback", "notification"],
  alert: ["feedback", "toast"],
  notification: ["feedback", "toast"],
  bg: ["background"],
  wallpaper: ["background"],
  gradient: ["background", "mesh"],
  shader: ["webgl"],
  glass: ["liquid", "glassmorphism", "frosted"],
  animated: ["animation", "motion"],
  animation: ["animated", "motion"],
  toggle: ["switch"],
  switch: ["toggle"],
  slider: ["range"],
  input: ["field", "forms"],
  testimonial: ["voices", "quote"],
  plans: ["pricing"],
  price: ["pricing"],
  questions: ["faq"],
  landing: ["hero"],
  pointer: ["cursor"],
  mouse: ["cursor"],
  typography: ["type", "text"],
  rank: ["decisions", "ranking", "prioritise"],
  prioritize: ["decisions", "ranking"],
  prioritise: ["decisions", "ranking"],
  budget: ["decisions", "allocation"],
  allocate: ["decisions", "allocation"],
  filter: ["data", "facets"],
  facets: ["filter"],
  transcript: ["audio", "media", "captions"],
  podcast: ["audio", "transcript"],
  logs: ["developer", "tail"],
  tail: ["logs", "developer"],
  trace: ["tracing", "developer", "waterfall"],
  tracing: ["trace", "developer"],
  sms: ["text", "forms", "segments"],
  confidence: ["ai", "uncertainty"],
  uncertainty: ["ai", "confidence"],
  freshness: ["cards", "age"],
  timezone: ["time", "meeting", "schedule"],
  meeting: ["time", "timezone"],
  routing: ["connect", "controls", "cables"],
  patch: ["routing", "cables"],
  size: ["fit", "commerce", "scale"],
  fit: ["size", "commerce"],
  exploded: ["diagram", "commerce", "parts"],
  diagram: ["exploded", "parts"],
  download: ["buttons", "platform", "store"],
  store: ["download", "buttons"],
  platform: ["download", "buttons"],
  helix: ["showcase", "gallery", "3d"],
  showcase: ["gallery", "portfolio", "helix"],
  satin: ["silk", "heroes", "fabric"],
  keyword: ["heroes", "cloud", "words"],
  services: ["cards", "agency"],
  obsidian: ["liquid", "backgrounds", "dark"],
  blob: ["glass", "heroes", "refraction"],
  refraction: ["glass", "lens", "blob"],
  composer: ["ai", "chat", "prompt"],
  chat: ["ai", "composer"],
  highlight: ["cursors", "sweep", "selection"],
  sweep: ["highlight", "cursors"],
  infinite: ["loop", "cursors"],
  loop: ["infinite", "animation"],
  delete: ["danger", "buttons", "destructive"],
  destructive: ["delete", "danger"],
  danger: ["delete", "buttons", "alert"],
  confirm: ["danger", "buttons"],
  cancel: ["danger", "buttons"],
  upload: ["file", "buttons", "dropzone"],
  dropzone: ["upload", "file"],
  live: ["pulse", "status", "buttons"],
  pulse: ["live", "buttons"],
  ping: ["pulse", "badge"],
  chamfer: ["corner", "buttons", "hud"],
  notch: ["chamfer", "corner"],
  hud: ["chamfer", "corner"],
  corner: ["chamfer", "buttons"],
  ghost: ["buttons", "outline"],
  badge: ["status", "pill", "feedback"],
  status: ["badge", "feedback"],
  pill: ["badge", "status"],
  callout: ["alert", "banner"],
  banner: ["alert", "callout"],
  warning: ["alert", "status"],
  timeline: ["time", "activity", "changelog"],
  changelog: ["timeline", "releases"],
  milestones: ["timeline", "roadmap"],
  roadmap: ["milestones", "timeline"],
  progress: ["loader", "feedback", "bar"],
  loader: ["progress", "spinner"],
  outline: ["stroke", "text"],
  stroke: ["outline", "text"],
  line: ["chart", "analytics"],
  bar: ["chart", "analytics"],
  donut: ["chart", "pie"],
  pie: ["donut", "chart"],
  configurator: ["commerce", "configure"],
  configure: ["commerce", "configurator"],
  checkout: ["commerce"],
  shop: ["commerce"],
  undo: ["time", "history"],
  history: ["time", "undo", "versions"],
  versions: ["time", "history"],
  article: ["reading"],
  explorable: ["reading", "calculator"],
  calculator: ["reading", "explorable"],
  workflow: ["status", "controls"],
  toolbar: ["controls", "customise"],
  shortcuts: ["developer", "keyboard", "hotkeys"],
  hotkeys: ["developer", "shortcuts"],
  keyboard: ["shortcuts", "keymap"],
  cron: ["time", "schedule"],
  schedule: ["time", "cron"],
  merge: ["time", "conflict"],
  conflict: ["time", "merge", "sync"],
  transit: ["navigation", "map", "course"],
  course: ["navigation", "learning"],
  notifications: ["controls", "settings"],
  photos: ["media", "gallery"],
  guess: ["analytics", "quiz"],
  quiz: ["analytics", "guess"],
  inspector: ["forms", "number"],
  syntax: ["developer", "query"],
  font: ["type", "text"],
  table: ["data"],
  globe: ["maps", "world", "earth"],
  map: ["maps", "globe", "world"],
  world: ["maps", "globe"],
  earth: ["maps", "globe"],
  gallery: ["media", "images", "photos"],
  carousel: ["media", "slider", "gallery"],
  photo: ["media", "image", "gallery"],
  image: ["media", "photo"],
  compare: ["media", "before", "after"],
  dither: ["dithered", "pixel", "bayer"],
  pixel: ["dither", "pixelated"],
  signature: ["draw", "pen", "handwritten"],
  checkbox: ["check", "tick"],
  micro: ["micro-animation", "icon", "feedback"],
  like: ["heart", "favourite"],
  icon: ["micro-animation", "icons"],
  benchmark: ["bench", "models"],
  llm: ["ai", "chat", "model"],
  error: ["404", "recovery"],
  kanban: ["board"],
  leaderboard: ["league", "ranking"],
  payment: ["transfer", "fintech"],
  bank: ["fintech", "banking"],
  csv: ["import", "schema"],
  editor: ["blocks", "document"],
};

/**
 * Words that describe nearly everything here ("animated button"). They add to the score when they
 * match, but never knock a result out — otherwise "animated button" would find almost nothing.
 */
const SOFT = new Set(["animated", "animation", "interactive", "react", "component", "components", "ui", "modern", "beautiful", "cool", "custom", "nice", "effect", "a", "the", "with", "for"]);

/** "buttons" → "button", "categories" → "category"; leaves short words and "ss" endings alone. */
function singular(t: string) {
  if (t.length > 4 && t.endsWith("ies")) return t.slice(0, -3) + "y";
  if (t.length > 4 && /(ches|shes|xes|sses)$/.test(t)) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) return t.slice(0, -1);
  return t;
}

/** Damerau-Levenshtein distance capped at 2 — enough for one-typo tolerance. */
function closeEnough(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length] <= 1;
}

function fieldScore(query: string, words: string[], weight: number) {
  let best = 0;
  for (const raw of words) {
    const w = singular(raw);
    if (w === query) best = Math.max(best, 1);
    else if (w.startsWith(query)) best = Math.max(best, 0.8);
    else if (query.length >= 4 && w.includes(query)) best = Math.max(best, 0.5);
    else if (query.length >= 5 && closeEnough(query, w.slice(0, query.length + 1)) ) best = Math.max(best, 0.4);
  }
  return best * weight;
}

function termScore(t: string, fields: { words: string[]; weight: number }[]) {
  const best = (q: string) => Math.max(...fields.map((f) => fieldScore(q, f.words, f.weight)));
  const direct = Math.max(best(t), best(singular(t)));
  const alt = (SYNONYMS[t] ?? SYNONYMS[singular(t)] ?? []).reduce((m, q) => Math.max(m, best(q) * 0.7), 0);
  return Math.max(direct, alt);
}

export function search(items: ComponentSummary[], raw: string) {
  const terms = tokenize(raw);
  if (!terms.length) return items;
  const scored = items
    .map((item) => {
      const name = tokenize(item.name);
      const tags = item.tags.flatMap(tokenize).concat(item.traits.flatMap(tokenize));
      const cat = tokenize(categoryLabel(item.category)).concat(tokenize(item.category));
      const desc = tokenize(item.description);
      let total = 0;
      for (const t of terms) {
        const s = termScore(t, [
          { words: name, weight: 5 },
          { words: tags, weight: 3 },
          { words: cat, weight: 4 },
          { words: desc, weight: 1 },
        ]);
        // every term must match something (AND semantics), except soft descriptive words
        if (s === 0 && !SOFT.has(t)) return { item, score: 0 };
        total += s;
      }
      return { item, score: total };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.item.index - b.item.index);
  return scored.map((r) => r.item);
}
