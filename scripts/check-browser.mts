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
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const slug of ["glassbreak-button", "silk-field", "passkey-sign-in"]) await page.goto(`${base}/preview/${slug}`);
  assert.deepEqual(errors, []);
  console.log(`browser: ${states} preview states, copy/prompt selection, keyboard, navigation, and responsive smoke checks passed`);
} finally { await browser.close(); }
