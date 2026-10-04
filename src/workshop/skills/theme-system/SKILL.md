---
name: theme-system
description: Build or repair a site's design tokens - colour, type, space, radius, motion - as CSS custom properties with a light and dark theme that are designed rather than inverted, every text/surface pair checked for WCAG contrast by a script, and components that consume roles instead of raw values. Use when setting up theming or dark mode, when colours are hard-coded across components, or when contrast or theme bugs appear.
---

# /theme-system

A theme is a set of **roles**, not a palette. Components ask for "the text colour for secondary information on a raised surface", never for `#837d88`. Get the roles right and dark mode, brand changes and accessibility fixes become one-line edits.

## 1. Inventory what exists

- Find every hard-coded colour, font size, radius, shadow and duration in the components:

  ```
  grep -rnoE "#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|oklch\([^)]*\)" src --include=*.{css,tsx,jsx} | sort | uniq -c | sort -rn | head -60
  ```

- Group them into near-duplicates. Five greys within 3% of each other are one role used inconsistently.
- Note where each colour is used: as text, as a surface, as a border, or as an accent. Its role comes from its use, not its value.

## 2. Define roles

Keep the set small. Most interfaces need about this:

| Group | Roles |
|---|---|
| Surfaces | `--bg` (page), `--surface` (raised), `--surface-2` (raised twice, or pressed), `--overlay` (scrims) |
| Text | `--ink` (primary), `--ink-2` (secondary), `--ink-3` (tertiary: captions, meta), `--ink-on-accent` |
| Lines | `--line` (hairlines), `--line-strong` (inputs, focus-adjacent) |
| Accent | `--accent` (the one action colour), `--accent-soft` (its tinted background) |
| Status | `--ok`, `--warn`, `--bad` (each needs to pass as text on `--surface`) |
| Focus | `--focus` (the ring; must reach 3:1 against every surface it appears on) |
| Type | `--font-display`, `--font-sans`, `--font-mono`, and a size scale `--text-xs … --text-3xl` |
| Space and shape | `--space-1 … --space-8` (a 4px or 8px base), `--radius-sm/md/lg` |
| Motion | `--dur-*`, `--ease-*` (see `/motion-director`) |

Name by role, never by value or hue: `--ink-2`, not `--grey-500` or `--light-text`. A hue-named palette (`--plum-900`) can exist underneath, but components never use it directly.

## 3. Design both themes

Dark is not light inverted. Design each deliberately:

- **Dark surfaces get lighter as they rise.** Light surfaces rise with shadow instead.
- **Avoid pure black and pure white** for large areas. Use a tinted near-black (for example `#0b080d`) and an off-white (`#efe8dc` or `#f5f1e8`) so the palette has a temperature.
- **Desaturate and lighten the accent for dark themes.** A saturated brand colour that passes on white usually vibrates on black.
- **Shadows mostly stop working in dark themes.** Use a 1px lighter line or a lighter surface instead.
- **Images and illustrations** may need a dark version, or a lower brightness (`filter: brightness(0.9)`), in the dark theme.

Wire it so the user's choice wins, then the system preference:

```css
:root { color-scheme: light; --bg: #f5f1e8; --ink: #1b1a17; /* … */ }
:root[data-theme="dark"] { color-scheme: dark; --bg: #0b080d; --ink: #efe8dc; /* … */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { color-scheme: dark; --bg: #0b080d; --ink: #efe8dc; /* … */ }
}
```

- Set `data-theme` before first paint, with a tiny inline script reading the saved choice, so the page doesn't flash the wrong theme.
- `color-scheme` makes form controls and scrollbars follow the theme.

## 4. Check contrast

Save this as `contrast.mjs` in a scratch directory and run it on the files that define your tokens:

```
node contrast.mjs src/styles/tokens.css
```

It reads every colour custom property, groups them by the block that defines them (each theme), resolves `var()` references, and checks every text token against every surface token.

- It understands hex, `rgb()`, `hsl()` and `oklch()`, and composites translucent text over the surface.
- It guesses which tokens are text and which are surfaces from their names. Pass `--text ink,ink-2 --bg bg,surface` to name them yourself.

```js
// Token contrast: reads the colour custom properties from CSS files, groups them by the block that
// defines them (:root, .dark, [data-theme=night], @theme…), and checks every text token against every
// surface token in each theme with the WCAG 2 contrast ratio. Translucent colours are composited
// over the surface they're checked against.
import fs from "node:fs";

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : null;
};
const textOpt = opt("--text");
const bgOpt = opt("--bg");
const files = args;
if (!files.length) {
  console.error("usage: node contrast.mjs <file.css> [more.css] [--text a,b] [--bg c,d]");
  process.exit(1);
}
const TEXT = textOpt ? new RegExp(`^--(${textOpt.split(",").join("|")})$`) : /(ink|text|fg|foreground|cream|muted|heading|body|link|accent|primary|frost|lilac|danger|success|warning)/i;
const BG = bgOpt ? new RegExp(`^--(${bgOpt.split(",").join("|")})$`) : /(bg|background|surface|paper|ground|void|card|canvas|base|panel|sheet|plum-9|elevated)/i;

// Parse: selector -> { --name: value }
const themes = new Map();
for (const f of files) {
  const css = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const sel = m[1].trim().split("\n").pop().trim();
    const decls = [...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)];
    if (!decls.length) continue;
    const t = themes.get(sel) ?? {};
    for (const [, k, v] of decls) t[k] = v.trim();
    themes.set(sel, t);
  }
}
const ROOTS = [":root", "@theme", "html", ":host"];
const root = Object.assign({}, ...[...themes].filter(([s]) => ROOTS.some((r) => s.startsWith(r) && !/dark|night|light|theme=/.test(s))).map(([, t]) => t));

function resolve(v, scope, depth = 0) {
  if (depth > 8) return null;
  const m = v.match(/^var\((--[\w-]+)(?:\s*,\s*(.+))?\)$/);
  if (!m) return v;
  const next = scope[m[1]] ?? root[m[1]] ?? m[2];
  return next ? resolve(next.trim(), scope, depth + 1) : null;
}

function parse(c) {
  if (!c) return null;
  c = c.trim().toLowerCase();
  let m;
  if ((m = c.match(/^#([0-9a-f]{3,8})$/))) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((x) => x + x).join("");
    const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
    return [n(0), n(2), n(4), h.length === 8 ? n(6) : 1];
  }
  const parts = (s) => s.replace(/[(),/]/g, " ").trim().split(/\s+/);
  const num = (x, scale) => (x.endsWith("%") ? parseFloat(x) / 100 : parseFloat(x) / scale);
  if ((m = c.match(/^rgba?\((.+)\)$/))) {
    const p = parts(m[1]);
    return [num(p[0], 255), num(p[1], 255), num(p[2], 255), p[3] ? num(p[3], 1) : 1];
  }
  if ((m = c.match(/^hsla?\((.+)\)$/))) {
    const p = parts(m[1]);
    const h = parseFloat(p[0]) / 360, s = num(p[1], 100), l = num(p[2], 100);
    const f = (n) => {
      const k = (n + h * 12) % 12;
      return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return [f(0), f(8), f(4), p[3] ? num(p[3], 1) : 1];
  }
  if ((m = c.match(/^oklch\((.+)\)$/))) {
    const p = parts(m[1]);
    const L = num(p[0], 1), C = parseFloat(p[1]), H = (parseFloat(p[2]) || 0) * Math.PI / 180;
    const a = C * Math.cos(H), b = C * Math.sin(H);
    const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const lin = [4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_, -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_, -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_];
    const g = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
    return [...lin.map((x) => Math.min(1, Math.max(0, g(x)))), p[3] ? num(p[3], 1) : 1];
  }
  if (c === "white") return [1, 1, 1, 1];
  if (c === "black") return [0, 0, 0, 1];
  return null;
}

const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lum = ([r, g, b]) => [r, g, b].map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)).reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

let fails = 0;
for (const [sel, own] of themes) {
  const scope = { ...root, ...own };
  const colours = Object.entries(scope)
    .map(([k, v]) => [k, parse(resolve(v, scope))])
    .filter(([, c]) => c);
  const texts = colours.filter(([k]) => TEXT.test(k) && !BG.test(k));
  const bgs = colours.filter(([k, c]) => BG.test(k) && c[3] === 1);
  // Only report a block that defines some of the pair itself, so :root isn't repeated per theme.
  if (!texts.length || !bgs.length || !Object.keys(own).some((k) => TEXT.test(k) || BG.test(k))) continue;
  console.log(`\n## ${sel}`);
  for (const [bk, bc] of bgs) {
    const row = texts.map(([tk, tc]) => {
      const r = ratio(over(tc, bc), bc);
      const mark = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "large only" : "FAIL";
      if (r < 4.5) fails++;
      return `  ${tk.padEnd(26)} ${r.toFixed(2).padStart(6)}  ${mark}`;
    });
    console.log(`\non ${bk}`);
    console.log(row.join("\n"));
  }
}
console.log(`\n${fails} text/surface pairs below 4.5:1. "large only" passes for text ≥ 24px, or ≥ 18.66px bold, and for icons and borders (3:1).`);
```

Targets (WCAG 2.2 AA):

| What | Minimum contrast |
|---|---|
| Body text | 4.5:1 |
| Large text (24px, or 18.66px bold) | 3:1 |
| Icons, input borders, focus rings and chart lines | 3:1 against what's next to them |
| Disabled controls | exempt, but still keep them legible |

Fix a failure by moving the **text** token, not the surface, unless several text roles fail on the same surface.

## 5. Migrate components

Replace raw values with roles, one component at a time:

1. Swap each value for the role that matches its **use**.
2. Switch themes and look at the component in both: `/responsive-audit`'s script can take screenshots with `data-theme` set on `<html>`.
3. Delete any colours left over once nothing uses them.

Components can expose their own tokens (`--card-bg: var(--surface)`) so a single instance can be re-themed without touching the global roles.

## Output

Deliver:

1. The role table with values for each theme.
2. The contrast report, with every failure fixed or explicitly accepted (for example large text only).
3. The list of components migrated, and any hard-coded values that remain, with the reason each one stays.
