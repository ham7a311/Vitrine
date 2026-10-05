import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost", pretendToBeVisual: true });
for (const key of ["Element", "MutationObserver", "window", "document", "navigator", "HTMLElement", "HTMLInputElement", "Event", "MouseEvent", "FormData"]) Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, requestAnimationFrame: (fn: FrameRequestCallback) => setTimeout(() => fn(0), 0), cancelAnimationFrame: clearTimeout });
const { createElement, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const require = createRequire(import.meta.url);
const project = path.resolve(import.meta.dirname, "..");
function load(file: string, exportName: string, overrides: Record<string, any> = {}) {
  const source = readFileSync(path.join(project, file), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const mod = { exports: {} };
  const localRequire = (id: string) => overrides[id] ?? (id.endsWith(".css") ? {} : require(id));
  new Function("require", "module", "exports", outputText)(localRequire, mod, mod.exports);
  return exportName === "*" ? mod.exports : mod.exports[exportName];
}
const root = createRoot(document.getElementById("root")!);
const mount = async (component: any, props: any) => { await act(async () => { root.render(createElement(component, props)); }); };
const clear = async () => { await act(async () => { root.render(null); }); };
const click = async (selector: string) => { const el = document.querySelector<HTMLElement>(selector); assert(el, selector); await act(async () => { el.click(); }); };
const input = async (selector: string, value: string) => { const el = document.querySelector<HTMLInputElement>(selector)!; assert(el, selector); await act(async () => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(el, value); el.dispatchEvent(new Event("input", { bubbles: true })); }); };
const submit = async () => { await act(async () => { document.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); }); };
const fail = async () => { throw new Error("Network unavailable"); };

const Passkey = load("src/registry/auth/passkey-sign-in/PasskeySignIn.tsx", "PasskeySignIn");
await mount(Passkey, { verify: fail, onSendLink: fail });
await click(".passkey-sign-in__primary");
assert.equal(document.querySelector("section")!.getAttribute("data-phase"), "fail");
assert.equal(document.querySelector<HTMLButtonElement>(".passkey-sign-in__primary")!.disabled, false);
await mount(Passkey, { verify: async () => true, onSendLink: fail });
await click(".passkey-sign-in__primary");
assert.equal(document.querySelector("section")!.getAttribute("data-phase"), "ok");
await click(".passkey-sign-in__link"); await input("input", "test@example.com"); await submit();
assert.match(document.querySelector('[role="status"]')!.textContent!, /could not be sent/);
await clear();

const One = load("src/registry/auth/one-field-sign-in/OneFieldSignIn.tsx", "OneFieldSignIn");
await mount(One, { sendCode: fail, verify: fail });
await input('input[type="email"]', "test@example.com"); await submit();
assert.equal(document.querySelector("section")!.getAttribute("data-step"), "email");
assert.match(document.querySelector('[role="status"]')!.textContent!, /could not send/);
await mount(One, { sendCode: async () => {}, verify: fail }); await submit();
assert.equal(document.querySelector("section")!.getAttribute("data-step"), "code");
await input('input[inputmode="numeric"]', "123456");
assert.equal(document.querySelector("section")!.getAttribute("data-step"), "code");
assert.match(document.querySelector('[role="status"]')!.textContent!, /could not check/);
await mount(One, { sendCode: async () => {}, verify: async () => true });
await input('input[inputmode="numeric"]', "123456");
assert.equal(document.querySelector("section")!.getAttribute("data-step"), "done");
await clear();

const Cascade = load("src/registry/auth/code-cascade-verify/CodeCascadeVerify.tsx", "CodeCascadeVerify");
await mount(Cascade, { sentTo: "test@example.com", verify: fail, onResend: fail, cooldown: 0 });
await input("input", "123456");
assert.equal(document.querySelector("section")!.getAttribute("data-phase"), "typing");
assert.match(document.querySelector('.ccv__note')!.textContent!, /could not verify/);
await click(".ccv__resend");
assert.match(document.querySelector('.ccv__note')!.textContent!, /could not be sent/);
await mount(Cascade, { sentTo: "test@example.com", verify: async () => true, cooldown: 0 });
await input("input", "123456");
assert.equal(document.querySelector("section")!.getAttribute("data-phase"), "ok");
await clear();
// Prompt selection: theme-only variants, invalid links, updates and browser history.
Object.assign(globalThis, { location: dom.window.location, history: dom.window.history });
const types = load("src/registry/types.ts", "*");
const variantModule = load("src/site/VariantState.tsx", "*", {
  "@/registry/types": types,
  "./CopyButton": { CopyButton: ({ text }: { text: string }) => createElement("button", { "data-copy": text }, "Copy") },
});
const meta = { name: "Example", prompt: "Build a readable card.", interaction: "Click the action.", animation: "No motion.", a11y: "Keyboard access.", responsive: "Fit narrow screens.", variants: [{ id: "night", label: "Night" }, { id: "paper", label: "Paper" }] };
let state: any;
function Probe() { state = variantModule.useVariantState(); return createElement(variantModule.PromptPanel, { meta }); }
const Wrapper = () => createElement(variantModule.VariantProvider, { variants: meta.variants }, createElement(Probe));
history.replaceState(null, "", "?variant=paper"); await mount(Wrapper, {});
assert.match(document.querySelector("[data-prompt]")!.textContent!, /Selected variant — Paper/);
await act(async () => state.setVariant("night"));
assert.match(document.querySelector("[data-copy]")!.getAttribute("data-copy")!, /Selected variant — Night/);
assert(!location.search.includes("variant"));
await act(async () => { history.replaceState(null, "", "?variant=paper"); window.dispatchEvent(new Event("popstate")); });
assert.match(document.querySelector("[data-prompt]")!.textContent!, /Selected variant — Paper/);
await act(async () => { history.replaceState(null, "", "?variant=invalid"); window.dispatchEvent(new Event("popstate")); });
assert.match(document.querySelector("[data-prompt]")!.textContent!, /Selected variant — Night/);
assert(document.querySelector("[data-prompt]")!.textContent!.includes(meta.a11y));
await clear();
const { rovingFocus } = load("src/site/rovingFocus.ts", "*");
const icons = Object.fromEntries(["DesktopIcon", "PhoneIcon", "ReplayIcon", "TabletIcon", "CloseIcon", "GitHubIcon", "MenuIcon", "StarIcon"].map(key => [key, () => null]));
const Preview = load("src/site/PreviewStage.tsx", "PreviewStage", {
  "./rovingFocus": { rovingFocus }, "@/registry/types": types,
  "./CodeViewer": { CodeViewer: () => createElement("p", {}, "Source view") },
  "./VariantState": { useVariantState: () => null }, "./icons": icons,
});
await mount(Preview, { slug: "example", bg: "#000", mode: "fill", variants: meta.variants, files: [{ name: "example.tsx", code: "test", html: "test", role: "component" }] });
const key = async (selector: string, value: string) => { const el = document.querySelector<HTMLElement>(selector)!; assert(el, selector); await act(async () => { el.focus(); el.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true })); }); };
await key('[role="radio"][aria-checked="true"]', "ArrowRight");
assert.match(document.querySelector("iframe")!.src, /variant=paper/);
assert.equal(document.querySelector('[role="radiogroup"][aria-label="Variant"] [tabindex="0"]')!.textContent, "Paper");
await key('[role="tab"][aria-selected="true"]', "ArrowRight");
assert.match(document.querySelector('[role="tabpanel"]')!.textContent!, /Source view/);
await clear();
Object.assign(globalThis, { matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
const Navbar = load("src/site/Navbar.tsx", "Navbar", {
  "next/link": { default: ({ children, onClick, ...props }: any) => createElement("a", { ...props, onClick: (e: any) => { e.preventDefault(); onClick?.(e); } }, children) },
  "next/navigation": { usePathname: () => "/components" }, "@/site.config": { site: { github: "https://example.com" } },
  "./Logo": { LogoMark: () => null, Wordmark: () => null }, "./icons": icons,
  "./SearchPalette": { SearchTrigger: () => createElement("button", {}, "Search") },
});
await mount(Navbar, { stars: null });
await click('[aria-label="Open menu"]');
assert.equal(document.documentElement.style.overflow, "hidden");
assert(document.activeElement?.closest("#mobile-menu"));
await click('#mobile-menu a[href="/components?filter=new"]');
assert(document.querySelector("#mobile-menu")!.hasAttribute("hidden"));
assert.equal(document.documentElement.style.overflow, "");
assert.equal(document.activeElement?.getAttribute("aria-label"), "Open menu");
await clear();
// Expansion: disclosure semantics, native activation, destination routing and partner fallbacks.
const Faq = load("src/registry/faq/colour-register-faq/ColourRegisterFaq.tsx", "ColourRegisterFaq");
const questions = [{ id: "one", question: "First?", answer: createElement("a", { href: "/first" }, "Read more") }, { id: "two", question: "Second?", answer: "A longer answer" }];
await mount(Faq, { items: questions, initiallyOpenId: "missing" });
assert.equal(document.querySelectorAll('[aria-expanded="true"]').length, 0);
assert(document.querySelector('.crfaq__answer')!.hasAttribute("inert"));
await click(".crfaq__question");
assert.equal(document.querySelector('.crfaq__answer')!.getAttribute("aria-hidden"), "false");
assert(!document.querySelector('.crfaq__answer')!.hasAttribute("inert"));
await key(".crfaq__question", "End");
assert.equal(document.activeElement?.textContent?.includes("Second?"), true);
await act(async () => (document.activeElement as HTMLElement).click());
assert.equal(document.querySelectorAll('[aria-expanded="true"]').length, 1);
assert(document.querySelector('.crfaq__answer')!.hasAttribute("inert"));
await act(async () => (document.activeElement as HTMLElement).click());
assert.equal(document.querySelectorAll('[aria-expanded="true"]').length, 0);
await clear();
const Offset = load("src/registry/buttons/offset-press-button/OffsetPressButton.tsx", "OffsetPressButton");
let presses = 0;
await mount(Offset, { children: "Keep", onClick: () => presses++ });
await click(".opb"); assert.equal(presses, 1);
assert.equal(document.querySelector("button")!.getAttribute("type"), "button");
await mount(Offset, { children: "Keep", disabled: true, onClick: () => presses++, type: "submit" });
await click(".opb"); assert.equal(presses, 1);
assert.equal(document.querySelector("button")!.getAttribute("type"), "submit");
await clear();
const Wayfinder = load("src/registry/feedback/wayfinder-404/Wayfinder404.tsx", "Wayfinder404");
await mount(Wayfinder, { home: { label: "Start", href: "/" }, destinations: [{ label: "Work", href: "/work" }, { label: "About", href: "/about" }] });
await key('[role="radio"][aria-checked="true"]', "ArrowRight");
assert.equal(document.querySelector('.wf404__go')!.getAttribute("href"), "/work");
assert.equal(document.querySelector('.wf404__home')!.getAttribute("href"), "/");
await key('[role="radio"][aria-checked="true"]', "End");
assert.equal(document.querySelector('.wf404__go')!.getAttribute("href"), "/about");
await clear();
const callbacks: (() => void)[] = [];
const motion = { matches: false, addEventListener(_type: string, fn: () => void) { callbacks.push(fn); }, removeEventListener() {} };
Object.assign(globalThis, { ResizeObserver: class { observe() {} disconnect() {} }, IntersectionObserver: class { observe() {} disconnect() {} } });
window.matchMedia = () => motion as any;
const Ribbon = load("src/registry/sections/partner-ribbon/PartnerRibbon.tsx", "PartnerRibbon");
await mount(Ribbon, { items: [] }); assert.equal(document.querySelector("section"), null);
await mount(Ribbon, { items: [{ id: "a", name: "Alpha", imageSrc: "/broken.svg", href: "/alpha" }] });
assert.equal(document.querySelector("section")!.getAttribute("data-static"), "true");
await act(async () => document.querySelector("img")!.dispatchEvent(new Event("error")));
assert.match(document.querySelector('.pribbon__static')!.textContent!, /Alpha/);
assert.equal(document.querySelector("img"), null);
await clear();
const partners = [{ id: "a", name: "Alpha", href: "/alpha" }, { id: "b", name: "Beta", href: "/beta" }];
await mount(Ribbon, { items: partners, rows: 2 });
assert.equal(document.querySelector("section")!.getAttribute("data-static"), "true");
assert.equal(document.querySelectorAll('.pribbon__static .pribbon__mark').length, 2);
assert.equal(document.querySelectorAll('.pribbon__surface').length, 0);
await clear();
await mount(Ribbon, { items: partners });
assert.equal(document.querySelector("section")!.getAttribute("data-paused"), "false");
await click('.pribbon__surface');
assert.equal(document.querySelector("section")!.getAttribute("data-paused"), "true");
await click('.pribbon__surface');
assert.equal(document.querySelector('.pribbon__directory'), null);
assert.equal(document.querySelectorAll('.pribbon__viewport a').length, 0);
await act(async () => { motion.matches = true; callbacks.forEach(fn => fn()); });
assert.equal(document.querySelectorAll('.pribbon__viewport').length, 0);
assert.equal(document.querySelectorAll('.pribbon__static .pribbon__mark').length, 2);
await clear();
console.log("expansion interactions: FAQ inert disclosure and keyboard focus, button native/disabled behavior, Wayfinder destinations, partner empty/single/broken-image/surface-pause/reduced-motion passed");
// The same portable boundary protects live demos and copied usage examples.
const Boundary = load("src/registry/DemoBoundary.tsx", "DemoBoundary");
const demoUrl = window.location.href;
let linkActions = 0, buttonActions = 0, formActions = 0, scrolled = 0;
await mount(Boundary, { children: createElement("div", null,
  createElement("a", { href: "/components", target: "_blank", onClick: () => linkActions++ }, "Demo destination"),
  createElement("a", { href: "#local-section" }, "Local section"),
  createElement("button", { type: "button", onClick: () => buttonActions++ }, "Local action"),
  createElement("form", { action: "/about", onSubmit: () => formActions++ }, createElement("button", { type: "submit" }, "Send locally")),
  createElement("p", { id: "local-section" }, "Section content")) });
const destination = document.querySelector("a")!;
assert.equal(destination.getAttribute("href"), "#");
assert.equal(destination.getAttribute("target"), null);
await act(async () => { assert.equal(destination.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true })), false); });
assert.equal(linkActions, 1, "Local link handlers must still run");
await act(async () => { assert.equal(destination.dispatchEvent(new MouseEvent("auxclick", { bubbles: true, cancelable: true, button: 1 })), false); });
await act(async () => { assert.equal(destination.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true })), false); });
document.getElementById("local-section")!.scrollIntoView = () => { scrolled++; };
await click('a[href="#local-section"]'); assert.equal(scrolled, 1);
await click('button[type="button"]'); assert.equal(buttonActions, 1);
await submit(); assert.equal(formActions, 1);
await act(async () => { destination.setAttribute("href", "https://example.test/elsewhere"); });
assert.equal(destination.getAttribute("href"), "#", "Changed destinations must also be neutralised");
assert.equal(window.location.href, demoUrl);
assert.match(document.querySelector('[data-demo-boundary] [role="status"]')!.textContent!, /no navigation/);
await clear();
console.log("demo boundary: link callbacks, modified/middle clicks, native targets, local scrolling, local buttons, form submission and updated destinations passed");
await act(async () => root.unmount()); dom.window.close();
console.log("interactions: auth delivery, cancellation/network failure, retry, success, and resend failure, prompt/theme selection, history, keyboard controls and mobile navigation passed");
