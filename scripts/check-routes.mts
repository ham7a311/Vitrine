import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
const base = process.env.VITRINE_TEST_URL ?? "http://127.0.0.1:3147";
const root = path.resolve(import.meta.dirname, "../src");
const entries = readFileSync(path.join(root, "registry/order.txt"), "utf8").split("\n").filter(s => s && !s.startsWith("#"));
const routes = ["/", "/about", "/contact", "/terms", "/privacy", "/categories", "/components", "/workshop", "/robots.txt", "/sitemap.xml", "/opengraph-image"];
for (const entry of entries) { const slug = entry.split("/")[1]; routes.push(`/components/${slug}`, `/preview/${slug}`); }
const recipes = [...readFileSync(path.join(root, "workshop/recipes.ts"), "utf8").matchAll(/^    slug: "([^"]+)"/gm)].map(m => m[1]);
for (const slug of recipes) routes.push(`/workshop/recipes/${slug}`, `/workshop/recipes/${slug}/preview`);
for (const slug of readdirSync(path.join(root, "workshop/skills"))) routes.push(`/workshop/skills/${slug}`, `/workshop/skills/${slug}/SKILL.md`);
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (next < routes.length) {
    const route = routes[next++]; const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    if (route.startsWith("/preview/") || route.endsWith("/preview")) {
      assert(!html.includes('aria-label="Primary"'), `${route}: gallery chrome in preview`);
      assert(/noindex/.test(html), `${route}: missing noindex`);
    }
    if (route.startsWith("/components/")) assert(html.includes("data-prompt"), `${route}: missing prompt`);
    if (route.endsWith("SKILL.md")) assert(response.headers.get("content-disposition")?.includes("attachment"), route);
  }
}));
const removed = ["feature-folio", "case-study-ledger", "article-masthead", "directory-mega-nav"];
for (const slug of removed) {
  assert.equal((await fetch(`${base}/components/${slug}`)).status, 404, slug);
  assert.equal((await fetch(`${base}/preview/${slug}`)).status, 404, slug);
}
for (const route of ["/components/does-not-exist", "/preview/does-not-exist", "/workshop/skills/does-not-exist/SKILL.md", "/film/launch"]) assert.equal((await fetch(base + route)).status, 404, route);
console.log(`routes: ${routes.length} production URLs passed; unknown resources and production film return 404`);
