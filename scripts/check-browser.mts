import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
const base = process.env.VITRINE_TEST_URL ?? "http://127.0.0.1:3147";
const browser = await chromium.launch();
const errors: string[] = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(`${page.url()}: ${error.message}`));
  await page.goto(base + "/components");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.locator("#mobile-menu").getByRole("link", { name: /^New/ }).click();
  await page.waitForFunction(() => document.querySelector("#mobile-menu")?.hasAttribute("hidden"));
  assert.equal(await page.locator("html").evaluate(el => el.style.overflow), "");
  await page.getByRole("button", { name: /^Search$/ }).click();
  await page.getByRole("combobox", { name: "Search components" }).fill("glassbreak");
  await page.getByRole("combobox").press("Enter");
  await page.waitForURL("**/components/glassbreak-button");
  await page.goto(base + "/components/passkey-sign-in?variant=paper");
  await page.waitForFunction(() => document.querySelector('[data-prompt]')?.textContent?.includes("Selected variant — Paper (paper)"));
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /Selected variant — Paper \(paper\)/);
  await page.getByRole("radio", { name: "Paper", exact: true }).press("ArrowLeft");
  await page.waitForFunction(() => document.querySelector('[data-prompt]')?.textContent?.includes("Selected variant — Night (night)"));
  await page.getByRole("tab", { name: "code", exact: true }).click();
  await page.getByRole("tab", { name: "PasskeySignIn.tsx", exact: true }).press("ArrowRight");
  assert.equal(await page.getByRole("tab", { name: "passkey-sign-in.css", exact: true }).getAttribute("aria-selected"), "true");
  // Both copy mechanisms fail: selected text must remain available in a visible dialog.
  await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("denied")) } }); document.execCommand = () => false; });
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await page.getByRole("dialog", { name: "Copy this text" }).waitFor();
  assert((await page.getByRole("textbox", { name: "Text to copy" }).inputValue()).includes("Selected variant"));
  await page.getByRole("dialog", { name: "Copy this text" }).getByRole("button", { name: "Close" }).click();
  // Source is not in the page or its navigation payload; the Code tab fetches it once, on first open.
  for (const headers of [{}, { RSC: "1" }]) {
    const body = await (await fetch(base + "/components/glass-card", { headers })).text();
    assert(!body.includes("shiki") && !body.includes("useState"), "component page carries source");
  }
  const sourceRequests: string[] = [];
  page.on("request", r => { if (new URL(r.url()).pathname.startsWith("/source/")) sourceRequests.push(r.url()); });
  await page.goto(base + "/components/glass-card");
  await page.getByRole("tab", { name: "preview", exact: true }).waitFor();
  assert.equal(sourceRequests.length, 0, "source fetched before the Code tab opened");
  // A failed request keeps the chosen file and recovers on retry.
  await page.route("**/source/**", route => route.abort());
  await page.getByRole("tab", { name: "code", exact: true }).click();
  await page.getByRole("tab", { name: "glass-card.css", exact: true }).click();
  await page.getByRole("alert").getByText("The source didn’t load.").waitFor();
  await page.unroute("**/source/**");
  await page.getByRole("button", { name: "Try again" }).click();
  await page.getByRole("tabpanel", { name: "glass-card.css" }).locator(".shiki").waitFor();
  assert.equal(await page.getByRole("tab", { name: "glass-card.css", exact: true }).getAttribute("aria-selected"), "true");
  await page.getByRole("tab", { name: "glass-card.css", exact: true }).press("ArrowLeft");
  await page.getByRole("tabpanel", { name: "glass-tiles.css" }).locator(".shiki").waitFor();
  await page.getByRole("tab", { name: "GlassCard.tsx", exact: true }).click();
  await page.getByRole("tabpanel", { name: "GlassCard.tsx" }).locator(".shiki").waitFor();
  await page.getByRole("button", { name: "Copy", exact: true }).click();
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /export function GlassCard/);
  // Back to the preview and to the code again: the loaded source is reused.
  const fetched = sourceRequests.length;
  await page.getByRole("tab", { name: "preview", exact: true }).click();
  await page.getByRole("tab", { name: "code", exact: true }).click();
  await page.getByRole("tabpanel", { name: "GlassCard.tsx" }).locator(".shiki").waitFor();
  assert.equal(sourceRequests.length, fetched, "loaded source was fetched again");
  assert(sourceRequests.every(u => /\/source\/glass-card\.[0-9a-f]{12}\.json$/.test(u)), "source URL is not content-hashed");
  // A page opened before a newer deploy asks for a source file that no longer exists: reload, not retry.
  await page.goto(base + "/components/passkey-sign-in");
  await page.route("**/source/**", route => route.fulfill({ status: 404, body: "Not found" }));
  await page.getByRole("tab", { name: "code", exact: true }).click();
  await page.getByText("This component has been updated since the page opened.").waitFor();
  assert.equal(await page.getByRole("button", { name: "Try again" }).count(), 0);
  await page.unroute("**/source/**");
  await Promise.all([page.waitForEvent("load"), page.getByRole("button", { name: "Reload page" }).click()]);
  await page.getByRole("tab", { name: "code", exact: true }).click();
  await page.getByRole("tabpanel", { name: "PasskeySignIn.tsx" }).locator(".shiki").waitFor();
  const root = path.resolve(import.meta.dirname, "../src/registry");
  const entries = readFileSync(path.join(root, "order.txt"), "utf8").split("\n").filter(s => s && !s.startsWith("#"));
  let states = 0;
  for (const entry of entries) {
    const { meta } = await import(path.join(root, entry, "meta.ts"));
    for (const variant of meta.variants?.length ? meta.variants : [{ id: "" }]) {
      await page.goto(`${base}/preview/${meta.slug}${variant.id ? `?variant=${variant.id}` : ""}`);
      await page.waitForFunction(() => (document.querySelector("[data-demo-boundary]")?.children.length ?? 0) > 1);
      assert.equal(await page.getByRole("navigation", { name: "Primary", exact: true }).count(), 0);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      states++;
    }
  }
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/components?category=buttons", "/components/glass-card", "/workshop", "/about"]) {
      await page.goto(base + route);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} overflows at ${width}`);
    }
  }
  // Component lists must not prefetch component pages as they scroll into view, and a component page prefetches
  // nothing at all (production builds only). The navbar elsewhere still prefetches, which shows the check can see one.
  const prefetchedFrom = async (route: string, match = /^\/components\/[^/]+$/) => {
    const prefetched = new Set<string>();
    const track = (r: import("playwright").Request) => { const u = new URL(r.url()); if (match.test(u.pathname) && r.headers()["rsc"]) prefetched.add(u.pathname); };
    page.on("request", track);
    await page.goto(base + route);
    for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(50); }
    await page.waitForTimeout(1500);
    page.off("request", track);
    return [...prefetched];
  };
  for (const route of ["/", "/components", "/categories"]) assert.deepEqual(await prefetchedFrom(route), [], `${route} prefetched component pages`);
  assert.deepEqual(await prefetchedFrom("/components/glass-card", /./), [], "a component page prefetched");
  assert((await prefetchedFrom("/about", /./)).length > 0, "the navbar should still prefetch outside component pages");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const slug of ["glassbreak-button", "silk-field", "passkey-sign-in"]) await page.goto(`${base}/preview/${slug}`);
  assert.deepEqual(errors, []);
  console.log(`browser: ${states} preview states, copy/prompt selection, keyboard, navigation, no-prefetch, lazy source (retry, stale-page reload, copy, reuse), and responsive smoke checks passed`);
} finally { await browser.close(); }
