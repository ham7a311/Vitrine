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
// Agent Composer, Portfolio Terminal and Mega Nav: modes, menus, shell logic and disclosure focus.
const press = async (el: Element, value: string, init: KeyboardEventInit = {}) => { await act(async () => { (el as HTMLElement).focus(); el.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true, ...init })); }); };
const typeInto = async (el: Element, value: string) => { await act(async () => { const proto = el instanceof dom.window.HTMLTextAreaElement ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value); el.dispatchEvent(new Event("input", { bubbles: true })); }); };
const frame = () => act(async () => { await new Promise((r) => setTimeout(r, 5)); });

const scope = load("src/registry/ai/agent-composer/scope.ts", "*");
const Composer = load("src/registry/ai/agent-composer/AgentComposer.tsx", "AgentComposer", { "./scope": scope, "./logos": { MakerLogo: () => null, ModeIcon: () => null } });
const sent: any[] = [];
await mount(Composer, { defaultFiles: ["exporter/retry.ts"], onSend: (b: any) => sent.push(b) });
const go = () => document.querySelector(".agcm__go")!;
assert.equal(go().getAttribute("data-a"), "mic", "With nothing typed, the round button dictates");
await click(".agcm__go"); assert.equal(sent.length, 0);
await click(".agcm__mode"); await frame();
assert(document.querySelector('[role="menu"][aria-label="Mode"]'));
await press(document.activeElement!, "Escape");
assert.equal(document.querySelector('[role="menu"]'), null);
assert.equal(document.activeElement, document.querySelector(".agcm__mode"), "Escape returns focus to the mode button");
await click(".agcm__model"); await frame();
assert.equal(document.querySelectorAll('[role="menu"][aria-label="Model"] [role="menuitemradio"]').length, 3);
assert.doesNotMatch(document.querySelector('[role="menu"]')!.textContent!, /\b[123]\b(?!\d)/, "No number keys beside the models");
await press(document.activeElement!, "Escape");
const brief = document.querySelector("textarea")!;
await typeInto(brief, "First task\nSecond task");
assert.equal(go().getAttribute("data-a"), "send");
await press(brief, "Tab", { shiftKey: true });
assert.equal(document.querySelector(".agcm")!.getAttribute("data-mode"), "ask", "Shift+Tab cycles from Agent to Ask");
await press(document.querySelector(".agcm__effort")!, "ArrowRight");
assert.equal(document.querySelector(".agcm__effort")!.getAttribute("aria-valuenow"), "3");
assert.match(document.querySelector(".agcm__elabel")!.textContent!, /Extra High/);
assert.equal(scope.lanes("a\n\nb\n c"), 3);
assert.equal(scope.attachedTokens(["exporter", "exporter/retry.ts"]), scope.byPath("exporter").tokens, "A folder absorbs its own files");
await press(brief, "Enter");
assert.equal(sent.length, 1); assert.equal(sent[0].mode, "ask"); assert.equal(sent[0].effort, "XHigh"); assert.deepEqual(sent[0].files, ["exporter/retry.ts"]);
assert.equal(document.querySelector(".agcm__run")!.getAttribute("data-s"), "running");
assert.equal(go().getAttribute("data-a"), "stop");
await click(".agcm__go");
assert.equal(document.querySelector(".agcm__run")!.getAttribute("data-s"), "stopped");
await clear();

const Roster = load("src/registry/ai/model-roster/ModelRoster.tsx", "ModelRoster", { "./logos": { MakerLogo: () => null } });
const changes: [string, boolean][] = [];
await mount(Roster, { models: [{ id: "a", name: "Claude Opus 5.5", maker: "claude", on: true }, { id: "b", name: "GPT-5.5", maker: "openai", on: false }], more: [{ id: "c", name: "Grok 4.5", maker: "xai", on: false }], onChange: (id: string, on: boolean) => changes.push([id, on]) });
const sw = (n: number) => document.querySelectorAll<HTMLButtonElement>('[role="switch"]')[n];
assert.equal(document.querySelectorAll('[role="switch"]').length, 2, "Extra models wait behind View All");
await act(async () => { sw(0).click(); });
assert.equal(sw(0).getAttribute("aria-checked"), "true", "The last model on can't be switched off");
assert.equal(changes.length, 0);
await act(async () => { sw(1).click(); });
assert.deepEqual(changes, [["b", true]]);
await act(async () => { sw(0).click(); });
assert.equal(sw(0).getAttribute("aria-checked"), "false");
await click(".mrst__all"); assert.equal(document.querySelectorAll('[role="switch"]').length, 3);
const search = document.querySelector<HTMLInputElement>(".mrst__field input")!;
await typeInto(search, "openai");
assert.equal(document.querySelectorAll('[role="switch"]').length, 1, "Searching a maker filters its models");
assert.equal(document.querySelector(".mrst__addrow"), null, "A maker search doesn't offer to add the maker");
await typeInto(search, "Gemini 3 Pro"); await press(search, "Enter");
assert.equal(search.value, "");
assert.match(document.querySelector(".mrst__row")!.textContent!, /Gemini 3 Pro/);
assert.equal(sw(0).getAttribute("aria-checked"), "true", "Added models start switched on");
await clear();

const shell = load("src/registry/navigation/portfolio-terminal/shell.ts", "*");
const folio = { handle: "me", name: "Test Person", role: "Designer", place: "Here", bio: ["Bio."], now: "Now.", email: "a@b.example", links: [], skills: [{ group: "Design", items: [["Type", 0.5]] }], experience: [{ years: "2020", title: "Designer", org: "Org", note: "Note." }], projects: [{ slug: "tidewater", name: "Tidewater", year: "2025", kind: "app", role: "Solo", stack: ["Swift"], summary: "S.", outcome: "O." }, { slug: "ledgerline", name: "Ledgerline", year: "2024", kind: "app", role: "Lead", stack: ["TS"], summary: "S.", outcome: "O." }] };
assert.equal(shell.suggest("wrk"), "work");
assert.equal(shell.suggest("qqqqqq"), null);
assert.deepEqual(shell.completions("open ti", folio, "~"), ["open tidewater"]);
assert(shell.completions("ex", folio, "~").includes("experience"));
assert.equal(shell.expand("cat about.txt"), "whoami");
assert.equal(shell.findProject(folio, "2").slug, "ledgerline");
assert.deepEqual(shell.nextSteps(folio, "~", "open tidewater")[0], "open ledgerline");
const Terminal = load("src/registry/navigation/portfolio-terminal/PortfolioTerminal.tsx", "PortfolioTerminal", { "./shell": shell, "./plate": load("src/registry/navigation/portfolio-terminal/plate.ts", "*") });
await mount(Terminal, { portfolio: folio, boot: "" });
const prompt = document.querySelector<HTMLInputElement>(".ptrm__line input")!;
await typeInto(prompt, "wrk"); await press(prompt, "Enter");
assert.match(document.querySelector(".ptrm__log")!.textContent!, /not found: wrk — did you mean work\?/);
await typeInto(prompt, "open 2"); await press(prompt, "Enter"); await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
assert.match(document.querySelector(".ptrm__log")!.textContent!, /Ledgerline/);
await press(prompt, "ArrowUp"); assert.equal(prompt.value, "open 2", "↑ recalls the last command");
await typeInto(prompt, "ex"); await press(prompt, "Tab"); assert.equal(prompt.value, "experience");
await press(prompt, "l", { ctrlKey: true });
assert.equal(document.querySelectorAll(".ptrm__entry").length, 0, "Ctrl+L clears the screen");
await clear();

const Mega = load("src/registry/navbars/mega-nav/MegaNav.tsx", "MegaNav", { "./aim": load("src/registry/navbars/mega-nav/aim.ts", "*"), "./previews": { Schematic: () => null } });
const link = (id: string) => ({ id, title: id, blurb: "", href: `/${id}`, preview: { kind: "doc", note: "", finds: [] } });
await mount(Mega, { brand: "Test", sections: [{ id: "a", label: "Alpha", groups: [{ id: "g1", label: "One", links: [link("x"), link("y")] }, { id: "g2", label: "Two", links: [link("z")] }] }, { id: "b", label: "Beta", groups: [{ id: "g3", label: "Three", links: [link("w")] }] }] });
const alpha = () => document.querySelectorAll<HTMLButtonElement>(".mgnv__top")[0];
await press(alpha(), "ArrowDown"); await frame();
assert.equal(alpha().getAttribute("aria-expanded"), "true");
assert.equal(document.activeElement?.getAttribute("role"), "tab", "↓ opens and focuses the selected category");
await press(document.activeElement!, "ArrowDown");
assert.equal(document.querySelector('[role="tab"][aria-selected="true"]')!.textContent, "Two1");
await press(document.activeElement!, "ArrowRight");
assert.equal(document.activeElement?.textContent, "z");
await press(document.activeElement!, "Escape");
assert.equal(alpha().getAttribute("aria-expanded"), "false");
assert.equal(document.activeElement, alpha(), "Escape returns focus to the top item");
await click(".mgnv__top");
assert.equal(alpha().getAttribute("aria-expanded"), "true");
await act(async () => { document.body.dispatchEvent(new Event("pointerdown", { bubbles: true })); });
assert.equal(alpha().getAttribute("aria-expanded"), "false", "Outside clicks close the panel");
await clear();
// Batch one of the composer family: dial, canvas desk, receipt.
const dialMath = load("src/registry/ai/dial-composer/dial.ts", "*");
assert.deepEqual(dialMath.detents(3), [-120, 0, 120]);
assert.equal(dialMath.nearest(50, 5), 3);
assert.equal(Math.round(dialMath.angleAt(0, 0, 1, 0)), 90, "Angles run clockwise from twelve o'clock");
const fam = (dir: string) => ({ "./brief": load(`src/registry/ai/${dir}/brief.ts`, "*"), "./logos": { MakerLogo: () => null, ModeIcon: () => null } });
const Dial = load("src/registry/ai/dial-composer/DialComposer.tsx", "DialComposer", { ...fam("dial-composer"), "./dial": dialMath });
const dialSent: any[] = [];
await mount(Dial, { onSend: (b: any) => dialSent.push(b) });
const knob = () => document.querySelector('[role="slider"]')!;
assert.equal(knob().getAttribute("aria-label"), "Mode dial");
await press(knob(), "ArrowRight");
assert.equal(document.querySelector(".dlcm")!.getAttribute("data-mode"), "plan", "→ turns the mode ring");
await press(knob(), "ArrowDown"); await press(knob(), "ArrowDown");
assert.equal(knob().getAttribute("aria-label"), "Effort dial", "↓ moves to another ring");
await press(knob(), "End");
assert.equal(document.querySelector(".dlcm")!.getAttribute("data-effort"), "4");
await typeInto(document.querySelector("textarea")!, "Ship it"); await press(document.querySelector("textarea")!, "Enter");
assert.equal(dialSent.length, 1); assert.equal(dialSent[0].mode, "plan"); assert.equal(dialSent[0].effort, 4);
await clear();

const desk = load("src/registry/ai/canvas-composer/desk.ts", "*", { "./brief": fam("canvas-composer")["./brief"] });
const swap = desk.dock({ ...desk.empty, mode: "mode:plan" }, desk.byKey("mode:debug"));
assert.equal(swap.next.mode, "mode:debug"); assert.equal(swap.displaced, "mode:plan", "A slot swaps and returns the old piece");
assert.deepEqual(desk.missing(desk.empty, ""), ["a task", "a mode", "a model"]);
const Canvas = load("src/registry/ai/canvas-composer/CanvasComposer.tsx", "CanvasComposer", { ...fam("canvas-composer"), "./desk": desk });
const deskSent: any[] = [];
await mount(Canvas, { onSend: (b: any) => deskSent.push(b) });
const piece = (k: string) => document.querySelector<HTMLButtonElement>(`[data-piece="${k}"]`)!;
await typeInto(document.querySelector("textarea")!, "Add retries"); await press(document.querySelector("textarea")!, "Enter");
assert.equal(deskSent.length, 0, "No mode on the sheet, nothing sent");
await act(async () => { piece("mode:debug").click(); });
assert.equal(piece("mode:debug").getAttribute("aria-pressed"), "true");
assert(document.querySelector('[data-chip="mode:debug"]'), "Tapping a piece puts it on the sheet");
await act(async () => { piece("mode:ask").click(); });
assert.equal(piece("mode:debug").getAttribute("aria-pressed"), "false", "A second mode swaps the first back to the desk");
await press(document.querySelector("textarea")!, "Enter");
assert.equal(deskSent.length, 1); assert.equal(deskSent[0].mode, "ask"); assert.equal(deskSent[0].model, "opus");
await clear();

const inferMod = load("src/registry/ai/agent-receipt/infer.ts", "*", { "./brief": fam("agent-receipt")["./brief"] });
const g = inferMod.infer("Exports time out on Fridays. Find out why and make the exporter retry with backoff, carefully.");
assert.equal(g.mode.value, "debug"); assert.equal(g.effort.value, 3); assert(g.files.value.includes("exporter/retry.ts")); assert.match(g.mode.why, /time out/);
assert.equal(inferMod.infer("What does the CSV writer do?").mode.value, "ask");
assert.equal(inferMod.infer("Rename A\nRename B").mode.value, "multitask");
const Receipt = load("src/registry/ai/agent-receipt/AgentReceipt.tsx", "AgentReceipt", { ...fam("agent-receipt"), "./infer": inferMod });
const orders: any[] = [];
await mount(Receipt, { defaultText: "Plan the queue migration", onRun: (b: any) => orders.push(b) });
assert.match(document.querySelector(".arcp__lines")!.textContent!, /Plan/);
await click('.arcp__row:nth-child(3) .arcp__val'); // mode
await act(async () => { [...document.querySelectorAll<HTMLButtonElement>(".arcp__opts button")].find((b) => b.textContent!.includes("Agent"))!.click(); });
assert.match(document.querySelector(".arcp__lines")!.textContent!, /set by you/);
await click(".arcp__run");
assert.equal(orders.length, 1); assert.equal(orders[0].mode, "agent", "An override wins over the guess");
await clear();

// Batch two: sentence, split brief, stacked brief.
const Sentence = load("src/registry/ai/sentence-composer/SentenceComposer.tsx", "SentenceComposer", fam("sentence-composer"));
const sentSent: any[] = [];
await mount(Sentence, { onSend: (b: any) => sentSent.push(b) });
assert.match(document.querySelector(".snts__sentence")!.textContent!, /Claude Opus 5\.5 will make the change at high effort, reading 2 files\./);
await click('.snts__tok[data-t="mode"]'); await frame();
await act(async () => { [...document.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')].find((b) => b.textContent!.includes("draft a plan first"))!.click(); });
assert.match(document.querySelector(".snts__sentence")!.textContent!, /will draft a plan first/, "Choosing rewrites the sentence");
assert.equal(document.activeElement, document.querySelector('.snts__tok[data-t="mode"]'), "Focus returns to the word");
await typeInto(document.querySelector("textarea")!, "Move exports to the queue"); await press(document.querySelector("textarea")!, "Enter");
assert.equal(sentSent[0].mode, "plan");
await clear();

const Split = load("src/registry/ai/split-brief-composer/SplitBriefComposer.tsx", "SplitBriefComposer", { ...fam("split-brief-composer"), "./infer": load("src/registry/ai/split-brief-composer/infer.ts", "*", { "./brief": fam("split-brief-composer")["./brief"] }) });
const splitSent: any[] = [];
await mount(Split, { defaultText: "Exports time out on Fridays, retry them carefully", onSend: (b: any) => splitSent.push(b) });
assert(document.querySelector(".spbf__tag"), "The right side suggests from the left");
assert.equal(document.querySelector('[data-m="agent"]')!.getAttribute("aria-checked"), "true", "Suggestions never change anything by themselves");
await click(".spbf__apply");
assert.equal(document.querySelector('[data-m="debug"]')!.getAttribute("aria-checked"), "true");
assert.equal(document.querySelector(".spbf__apply"), null);
await press(document.querySelector("textarea")!, "Enter", { metaKey: true });
assert.equal(splitSent[0].mode, "debug"); assert(splitSent[0].files.includes("exporter/retry.ts"));
await clear();

const Stacked = load("src/registry/ai/stacked-brief/StackedBrief.tsx", "StackedBrief", fam("stacked-brief"));
const stackSent: any[] = [];
await mount(Stacked, { onSend: (b: any) => stackSent.push(b) });
assert.equal(document.querySelector<HTMLButtonElement>(".stbf__fold")!.disabled, true, "Can't fold until every line is set");
await typeInto(document.querySelector("textarea")!, "Refactor checkout"); await press(document.querySelector("textarea")!, "Enter");
assert.equal(document.querySelector('[data-step="mode"]')!.hasAttribute("data-open"), true, "Answering moves to the next row");
await click('.stbf__tile[data-m="ask"]'); await click('.stbf__tile[data-maker="xai"]');
await click(".stbf__ctx .stbf__next"); await click('.stbf__effort [data-e="0"]');
await click(".stbf__fold");
assert(document.querySelector(".stbf__folded"), "The ladder folds into one line");
await click(".stbf__go");
assert.deepEqual([stackSent[0].mode, stackSent[0].model, stackSent[0].effort, stackSent[0].files], ["ask", "grok", 0, []]);
assert(document.querySelector('[data-step="task"][data-open]'), "A fresh ladder asks for the next task");
await clear();

const wait = (ms: number) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const btn = (t: string, scope = document) => [...scope.querySelectorAll<HTMLButtonElement>("button")].find((b) => b.textContent!.trim().startsWith(t))!;
const tap = async (el: HTMLElement) => { assert(el); await act(async () => { el.click(); }); };

const Gate = load("src/registry/ai/plan-gate/PlanGate.tsx", "PlanGate", { "./plan": load("src/registry/ai/plan-gate/plan.ts", "*"), "./logo": { ClaudeLogo: () => null } });
const receipts: any[] = [];
window.matchMedia = (() => ({ matches: true, addEventListener() {}, removeEventListener() {} })) as any;
await mount(Gate, { onComplete: (r: any) => receipts.push(r) });
await frame();
assert.equal(document.querySelectorAll(".plgt__step").length, 6, "Reduced motion shows the whole plan at once");
assert.deepEqual([...document.querySelectorAll('.plgt__step[data-risk="irreversible"] .plgt__gates button')].map((b) => b.textContent), ["Ask", "Skip"], "Irreversible steps can't be set to Auto");
await tap(document.querySelector<HTMLElement>('.plgt__step:nth-child(4) .plgt__order button[aria-label$="up"]')!);
assert.equal(document.querySelectorAll(".plgt__title")[2].textContent, "Run the payments test suite", "Reordering moves the step");
await tap(document.querySelector<HTMLElement>('.plgt__step:nth-child(4) .plgt__order button[aria-label$="up"]')!.closest(".plgt__step")!.querySelector<HTMLElement>('[data-g="skip"]')!);
await press(document.querySelector(".plgt__run")!, "Enter", { metaKey: true });
await wait(1200);
assert.equal(document.querySelector(".plgt")!.getAttribute("data-phase"), "gate", "A gated step stops the run");
await tap(btn("Deny")); await typeInto(document.querySelector(".plgt__edit input")!, "make it someone else's job");
await tap(btn("Deny and replan"));
assert(document.querySelector('.plgt__step[data-s="removed"]') && document.querySelector(".plgt__step[data-added]"), "Denying replans: the step is struck and a replacement added");
await tap(btn("Continue")); await wait(1250); await wait(1250);
assert.equal(document.querySelector(".plgt")!.getAttribute("data-phase"), "failed", `The flaky test fails first time: ${[...document.querySelectorAll(".plgt__step")].map((s) => s.getAttribute("data-s")).join()}`);
await tap(btn("Retry")); await wait(1250);
assert.equal(document.querySelector(".plgt")!.getAttribute("data-phase"), "gate");
await tap(btn("Approve")); await wait(1250);
await tap(btn("Take over")); await tap(btn("Mark done")); await wait(50);
assert.equal(document.querySelector(".plgt")!.getAttribute("data-phase"), "done", "The run finishes");
assert.deepEqual(receipts[0].map((r: any) => r.by), ["auto", "denied", "auto", "auto", "skipped", "approved", "you"], "The receipt says how each step got through");
await clear();
window.matchMedia = (() => ({ matches: false, addEventListener() {}, removeEventListener() {} })) as any;

const Mixed = load("src/registry/data/mixed-inspector/MixedInspector.tsx", "MixedInspector", { "./mix": load("src/registry/data/mixed-inspector/mix.ts", "*") });
const saved: any[] = [];
await mount(Mixed, { onApply: (c: any) => saved.push(...c) });
assert.equal(document.querySelector(".mxin__count")!.textContent, "5 selected");
assert.deepEqual([...document.querySelectorAll('.mxin__field[data-f="status"] .mxin__chip')].map((c) => c.textContent), ["In progress×2", "Todo×2", "Done×1"], "A field shows its spread, not 'Mixed'");
await tap(btn("Todo")); await tap(btn("Select only these 2"));
assert.equal(document.querySelector(".mxin__count")!.textContent, "2 selected", "A slice selects only its records");
const list = document.querySelector(".mxin__rows")!;
await press(list, "a", { metaKey: true });
assert.equal(document.querySelector(".mxin__count")!.textContent, "10 selected", "⌘A selects everything shown");
await press(list, "Escape");
await press(list, "x"); await press(list, "ArrowDown", { shiftKey: true }); await press(list, "ArrowDown", { shiftKey: true });
assert.equal(document.querySelector(".mxin__count")!.textContent, "3 selected", "X then Shift+arrows extends a range");
const bug = () => document.querySelector<HTMLElement>('.mxin__label[data-l="bug"]')!;
assert.equal(bug().getAttribute("aria-checked"), "mixed");
await tap(bug()); assert.equal(bug().getAttribute("aria-checked"), "true");
await tap(bug()); assert.equal(bug().getAttribute("aria-checked"), "false");
await tap(bug()); assert.equal(bug().getAttribute("aria-checked"), "mixed", "The cycle returns to the original mix");
assert.equal(document.querySelector(".mxin__diff"), null, "Back to the original means nothing is staged");
await tap(btn("Set all 3")); await tap(btn("Done"));
assert.match(document.querySelector(".mxin__diff")!.textContent!, /Status → Done on 3/);
await tap(btn("Apply")); await wait(950);
assert.deepEqual(saved.map((c) => c.id), ["VT-118", "VT-121"], "Only real saves are reported");
assert.match(document.querySelector(".mxin__fail")!.textContent!, /VT-124 Mei edited this/, "Failures stay with their reason");
assert.equal(document.querySelector(".mxin__count")!.textContent, "1 selected", "Failed records stay selected");
await tap(btn("Retry")); await wait(950);
assert.equal(document.querySelector(".mxin__fail"), null, "The retry goes through");
await clear();

const drawsMod = load("src/registry/analytics/outcome-flicker/draws.ts", "*");
assert.deepEqual(drawsMod.simulate(drawsMod.OPTIONS[0], 5), drawsMod.simulate(drawsMod.OPTIONS[0], 5), "Draws are reproducible for a seed");
const Flicker = load("src/registry/analytics/outcome-flicker/OutcomeFlicker.tsx", "OutcomeFlicker", { "./draws": drawsMod });
await mount(Flicker, {});
assert.match(document.querySelector(".otfl__count")!.textContent!, /Nothing counted yet/, "It starts paused, with nothing counted");
const flick = document.querySelector(".otfl")!;
await press(document.querySelector('.otfl__btn[aria-label="Next run"]')!, "ArrowRight"); await press(document.querySelector('.otfl__btn[aria-label="Next run"]')!, "ArrowRight");
assert.equal(document.querySelectorAll(".otfl__tally i[data-s]").length, 2, "Arrow keys step one run at a time");
await tap(btn("Play")); await wait(1000);
assert(document.querySelectorAll(".otfl__tally i[data-s]").length >= 3, "Playing advances in discrete frames");
await tap(btn("Pause"));
const opts = document.querySelectorAll<HTMLElement>(".otfl__opt");
await tap(opts[2]);
assert.equal(document.querySelectorAll(".otfl__tally i[data-s]").length, 0, "Choosing another option starts its count again");
await tap(btn("All runs"));
assert.equal(flick.getAttribute("data-view"), "summary");
assert.equal(document.querySelectorAll(".otfl__strip").length, 3, "All runs shows every option");
const all = drawsMod.tally(drawsMod.simulate(drawsMod.OPTIONS[1], 7 * 31 + 101));
assert.match(document.querySelectorAll(".otfl__strip figcaption")[1].textContent!, new RegExp(`on time in ${all.yes} of 100`), "Summary counts match the draws");
await clear();

const tapeMod = load("src/registry/stats/trend-tape/tape.ts", "*");
assert.equal(Math.round(tapeMod.rate([10, 12, 14, 16, 18, 20])), 2, "Rate is the slope per second");
assert.equal(tapeMod.secondsTo(100, 5, 150), 10); assert.equal(tapeMod.secondsTo(100, -5, 150), null, "Not heading there means no time");
assert.equal(tapeMod.band(610, 450, 600), "over");
const Tape = load("src/registry/stats/trend-tape/TrendTape.tsx", "TrendTape", { "./tape": tapeMod });
await mount(Tape, { start: 400 });
const tapeBug = document.querySelector<HTMLElement>(".trtp__bug")!;
await press(tapeBug, "ArrowUp"); await press(tapeBug, "ArrowUp", { shiftKey: true });
assert.equal(tapeBug.getAttribute("aria-valuenow"), "310", "Arrows move the target bug, Shift for bigger steps");
await press(tapeBug, "End"); assert.equal(tapeBug.getAttribute("aria-valuenow"), "800");
assert(document.querySelector(".trtp__vector[data-hide]"), "One sample is steady: no trend vector");
await wait(3200);
const meter = document.querySelector(".trtp__tape")!;
assert(Number(meter.getAttribute("aria-valuenow")) > 400 && /rising/.test(meter.getAttribute("aria-valuetext")!), "The surge feed rises and says so");
assert.equal(document.querySelector(".trtp__vector[data-hide]"), null, "A moving value shows its trend vector");
await tap(btn("Live")); assert.equal(document.querySelector(".trtp__live")!.getAttribute("aria-pressed"), "false", "The feed toggle pauses"); const frozen = meter.getAttribute("aria-valuenow"); await wait(1200);
assert.equal(meter.getAttribute("aria-valuenow"), frozen, "Paused means paused");
await clear();

const dropMod = load("src/registry/ai/lumen/drop.ts", "*");
assert.deepEqual(dropMod.lookAt({ x: 0, y: 0, size: 40 }, { x: 1000, y: 0 }), { x: 1, y: 0 }, "A far target gets a full glance");
assert(Math.abs(dropMod.lookAt({ x: 0, y: 0, size: 40 }, { x: 16, y: 0 }).x - 0.25) < 1e-9, "A near target gets a small glance");
{ let x = 0, v = 0; for (let i = 0; i < 120; i++) [x, v] = dropMod.spring(x, v, 1, 1 / 60); assert(Math.abs(1 - x) < 0.01 && x <= 1.0001, "The gaze spring settles without overshoot"); }
const ra = dropMod.seeded("sorrel"), rb = dropMod.seeded("sorrel"), rc = dropMod.seeded("pilot");
assert.equal(ra(), rb(), "Seeded per name"); assert.notEqual(dropMod.seeded("sorrel")(), rc(), "Different agents get different clocks");
assert.match(dropMod.BODY_PATH, /^M[\d.,]+( C[\d., ]+)+Z$/, "One closed spline silhouette");
const Lumen = load("src/registry/ai/lumen/Lumen.tsx", "Lumen", { "./drop": dropMod });
await mount(Lumen, { name: "sorrel", hue: "blue", size: 96 });
assert.equal(document.querySelector(".lmen")!.getAttribute("role"), "img"); assert.equal(document.querySelector(".lmen")!.getAttribute("aria-label"), "sorrel");
assert.equal(new Set([...document.querySelectorAll(".lmen [id]")].map((e) => e.id)).size, 4, "Unique ids for gradients and clip");
await mount(Lumen, { name: "sorrel", size: 22, decorative: true });
assert.equal(document.querySelector(".lmen")!.getAttribute("aria-hidden"), "true", "Decorative next to a written name");
assert(document.querySelector(".lmen[data-small]"), "Small sizes get the simpler eyes");
await clear();

for (const k of ["thinking", "searching", "working"] as const) {
  const ds = dropMod.orbitDots(k, 400);
  assert.equal(ds.length, dropMod.ORBITS[k].n, `${k} has its own dot count`);
  assert.equal(dropMod.orbitDots(k, 400, true).length, 3, "Small avatars keep three dots");
  assert(ds.some((d: any) => d.front) || ds.some((d: any) => !d.front), "Dots are split into near and far");
}
assert.notDeepEqual(dropMod.ORBITS.thinking, dropMod.ORBITS.working, "Each state orbits differently");
await mount(Lumen, { name: "sorrel", size: 44, state: "searching" });
assert.equal(document.querySelectorAll('.lmen__dots[data-kind="searching"] circle').length, 18, "Searching draws its ring behind and in front");
await mount(Lumen, { name: "sorrel", size: 44, state: "working" });
assert.equal(document.querySelectorAll('.lmen__dots[data-kind="working"] rect').length, 8, "Building the file uses squares");
assert.match(document.querySelector(".lmen")!.getAttribute("aria-label")!, /working/);
await mount(Lumen, { name: "sorrel", size: 44, state: "done" });
assert(document.querySelector(".lmen__dots[data-gather]"), "On done the last dots gather in");
await clear();

const Thought = load("src/registry/ai/thought-dots/ThoughtDots.tsx", "*");
for (const d of Thought.THOUGHT_DESIGNS) {
  await mount(Thought.ThoughtDots, { design: d.id, label: "Thinking" });
  assert.equal(document.querySelector(".thdt")!.getAttribute("data-design"), d.id);
  assert(document.querySelectorAll(".thdt__glyph i").length >= 2, `${d.id} draws its dots`);
  assert.equal(document.querySelector(".thdt")!.getAttribute("aria-label"), "Thinking");
}
await clear();

const globeMod = load("src/registry/ai/globe-search/globe.ts", "*");
assert(globeMod.project(0, 0, 0).z > 0.9 && globeMod.project(0, 180, 0).z < -0.9, "Front faces the viewer, back faces away");
assert.equal(globeMod.turnTo(350, 10), 20, "Shortest turn wraps round");
const Globe = load("src/registry/ai/globe-search/GlobeSearch.tsx", "GlobeSearch", { "./globe": globeMod });
const gres = [{ title: "A", site: "a.example", place: { lat: 0, lon: 0 } }, { title: "B", site: "b.example", place: { lat: 10, lon: 20 } }];
await mount(Globe, { query: "cafés", results: gres, found: 1, state: "searching" });
assert.equal(document.querySelectorAll(".glbs__ping").length, 1, "One ping per result so far");
assert.match(document.querySelector(".glbs [role=status]")!.textContent!, /Searching the web for cafés/);
await mount(Globe, { query: "cafés", results: gres, found: 2, state: "done" });
await click(".glbs__count");
assert.equal(document.querySelectorAll(".glbs__list li").length, 2, "Done opens the results");
assert.match(document.querySelector(".glbs [role=status]")!.textContent!, /2 results/);
await clear();

const sweepSrc = load("src/registry/ai/source-sweep/sources.ts", "*");
assert.equal(sweepSrc.summary([{ status: "done", found: 3 }, { status: "done", found: 0 }]).text, "Searched 2 sources · 3 results");
assert.match(sweepSrc.summary([{ status: "done", found: 3 }, { status: "searching" }]).text, /1 of 2 done/);
const Sweep = load("src/registry/ai/source-sweep/SourceSweep.tsx", "SourceSweep", { "./sources": sweepSrc });
const sweepRuns = (n: number) => (["google", "notion", "reddit"] as const).map((id, i) => ({ id, status: i < n ? "done" : i === n ? "searching" : "waiting", found: id === "notion" ? 0 : 2, results: id === "notion" ? [] : [{ title: "T", meta: "m" }, { title: "U", meta: "m" }] }));
await mount(Sweep, { query: "limits", runs: sweepRuns(1) });
assert.equal(document.querySelectorAll(".srsw__orbit i").length, 3, "Only the active source has its orbit");
assert.equal(document.querySelector(".srsw__src[data-status=searching] .srsw__name")!.textContent, "Notion, searching");
assert.match(document.querySelector(".srsw [role=status]")!.textContent!, /Searching Notion for limits/);
await mount(Sweep, { query: "limits", runs: sweepRuns(3) });
assert(document.querySelector('.srsw__src[data-none] .srsw__sr')!.textContent!.includes("nothing found"), "Empty sources say so");
assert.equal(document.querySelectorAll(".srsw__badge").length, 2, "A count on each source that found something");
await click("button.srsw__sum");
assert.equal(document.querySelectorAll(".srsw__group").length, 3, "Results grouped by source");
assert.equal(document.querySelectorAll(".srsw__group li").length, 4);
assert.match(document.querySelector(".srsw [role=status]")!.textContent!, /Searched 3 sources · 4 results/);
await clear();

const Acts = load("src/registry/ai/activity-glyphs/ActivityGlyphs.tsx", "*");
for (const a of Acts.ACTIVITIES) {
  await mount(Acts.ActivityGlyph, { activity: a.id, label: a.name });
  assert(document.querySelector(".acgl__glyph")!.children.length >= 2, `${a.id} draws its glyph`);
  assert.match(document.querySelector(".acgl")!.getAttribute("aria-label")!, /in progress$/);
  await mount(Acts.ActivityGlyph, { activity: a.id, label: a.name, state: "done" });
  assert(document.querySelector(".acgl__tick"), `${a.id} ends in a tick`);
  await mount(Acts.ActivityGlyph, { activity: a.id, label: "Failed: no space", state: "error" });
  assert(document.querySelector(".acgl__cross"), `${a.id} can end in a cross`);
  assert.match(document.querySelector(".acgl")!.getAttribute("aria-label")!, /Failed: no space, failed/);
}
await clear();

const echoMod = load("src/registry/micro/echo-bar/echo.ts", "*");
assert.deepEqual([0, 999, 1000, 1234, 1999, 12_345, 999_999, 1_250_000].map(echoMod.compact), ["0", "999", "1K", "1.2K", "1.9K", "12K", "999K", "1.2M"], "Compact counts round down");
assert.deepEqual(echoMod.glyphs("1.2K").map((g: any) => g.key), ["d1", "s.", "d0", "sK"], "Digits keyed from the right");
assert.equal(echoMod.glyphs("1204").at(-1).key, echoMod.glyphs("1205").at(-1).key, "Same reel for the changing digit");
assert.equal(echoMod.shown(100, true, true), 100, "Server already counts you");
assert.equal(echoMod.shown(100, false, true), 101, "Optimistic +1");
assert.equal(echoMod.shown(100, true, false), 99, "Optimistic undo");
const Echo = load("src/registry/micro/echo-bar/EchoBar.tsx", "EchoBar", { "./echo": echoMod });
const echoCalls: [string, boolean][] = [];
let echoRelease: (() => void)[] = [];
let echoFail = false;
const echoCommit = (a: string, on: boolean) => { echoCalls.push([a, on]); return new Promise<void>((res, rej) => echoRelease.push(() => (echoFail ? rej(new Error("you're offline")) : res()))); };
const echoProps = { counts: { replies: 1, reposts: 2, likes: 999, views: 4210, bookmarks: 0 }, viewer: { liked: false, reposted: false, bookmarked: false }, commit: echoCommit, link: "https://murmur.example/1", label: "Post" };
const releaseAll = async () => { while (echoRelease.length) { const r = echoRelease.splice(0); await act(async () => { r.forEach((f) => f()); await new Promise((z) => setTimeout(z, 0)); }); } };
await mount(Echo, echoProps);
assert.equal(document.querySelector(".echo")!.getAttribute("role"), "toolbar");
assert.equal(document.querySelectorAll('.echo__btn[tabindex="0"]').length, 1, "One tab stop");
for (let i = 0; i < 5; i++) await click('[data-action="like"]');
assert.equal(document.querySelector('[data-action="like"]')!.getAttribute("aria-pressed"), "true", "Odd presses end liked");
assert.match(document.querySelector('[data-action="like"]')!.getAttribute("aria-label")!, /1,000 likes/);
assert.equal(document.querySelector('[data-action="like"] .echo__sym')!.textContent, "K", "999 becomes 1K");
await releaseAll();
assert.deepEqual(echoCalls, [["like", true]], "Five quick presses settle into one request");
echoCalls.length = 0;
await mount(Echo, { ...echoProps, counts: { ...echoProps.counts, likes: 1003 }, viewer: { ...echoProps.viewer, liked: true } });
assert.match(document.querySelector('[data-action="like"]')!.getAttribute("aria-label")!, /1,003 likes/, "Live count does not double-count you");
echoFail = true;
await click('[data-action="like"]');
await releaseAll();
assert.equal(document.querySelector('[data-action="like"]')!.getAttribute("aria-pressed"), "true", "Failure puts it back");
assert.match(document.querySelector(".echo [role=status]")!.textContent!, /Couldn't undo like: you're offline/);
echoFail = false;
await click('[data-action="repost"]');
assert.equal(document.querySelector('[data-action="repost"]')!.getAttribute("aria-expanded"), "true");
assert.equal(document.activeElement!.getAttribute("role"), "menuitem", "Menu focuses its first item");
await act(async () => { document.activeElement!.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
assert.equal(document.querySelector('[data-action="repost"]')!.getAttribute("aria-expanded"), "false");
assert.equal(document.activeElement!.getAttribute("data-action"), "repost", "Escape returns focus");
await act(async () => { document.activeElement!.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "b", bubbles: true })); });
assert.equal(document.querySelector('[data-action="bookmark"]')!.getAttribute("aria-pressed"), "true", "B bookmarks the focused post");
await releaseAll();
await mount(Echo, { ...echoProps, replyLimit: "Only people mentioned can reply" });
assert.equal(document.querySelector('[data-action="reply"]')!.getAttribute("aria-disabled"), "true");
assert.match(document.getElementById(document.querySelector('[data-action="reply"]')!.getAttribute("aria-describedby")!)!.textContent!, /Only people mentioned/);
await clear();

// Social proof: sponsor board, murmur rows, mention wall.
const boardMod = load("src/registry/sections/sponsor-board/board.ts", "*");
const wide = boardMod.balance(6, 6000, 400, 100), square = boardMod.balance(1, 6000, 400, 100);
assert(Math.abs(wide.width * wide.height - square.width * square.height) / 6000 < 0.04, "Logos of different shapes get the same area");
assert.deepEqual(boardMod.balance(20, 60000, 300, 100), { width: 300, height: 15 }, "A very wide mark is clamped to the slot");
assert.deepEqual(boardMod.cards(["a"], 3).map((c: any) => c.kind), ["filled", "open", "open"], "Sponsors first, then open places");
assert.equal(boardMod.cards([], undefined).length, 1, "Open-ended tiers keep one open place");
assert.equal(boardMod.progress(5000, 4000), 1, "Progress is capped at the goal");
assert.equal(boardMod.money(245000), "$2,450");
assert.deepEqual(boardMod.crowd([1, 2, 3], 10, 2), { shown: [1, 2], more: 8 });
const murMod = load("src/registry/sections/murmur-rows/murmur.ts", "*");
assert.deepEqual(murMod.split([1, 2, 3, 4, 5], 2), [[1, 3, 5], [2, 4]], "Quotes are dealt round-robin");
assert.equal(murMod.advance(90, 5, 24, 100), (90 + 0.064 * 24) % 100, "A long frame is clamped");
assert.equal(murMod.shift(10, 100, "left"), -10);
assert.equal(murMod.shift(10, 100, "right"), -90);
assert.equal(murMod.copiesFor(1440, 500), 4);
const wallMod = load("src/registry/sections/mention-wall/masonry.ts", "*");
assert.deepEqual([1300, 900, 600, 400].map(wallMod.columnsFor), [4, 3, 2, 1]);
assert.deepEqual(wallMod.place([300, 100, 100, 100, 100], 2, 0), [[0, 4], [1, 2, 3]], "Each post goes to the shortest column, ties to the left");
assert.deepEqual(wallMod.place([100, 100, 100], 3, 0), [[0], [1], [2]], "Ties fill left to right");

const Board = load("src/registry/sections/sponsor-board/SponsorBoard.tsx", "SponsorBoard", { "./board": boardMod });
await mount(Board, { primary: { label: "Sponsor", href: "#s" }, goal: { raised: 245000, target: 400000 }, tiers: [{ id: "p", name: "Platinum", size: "lg", price: "$1,000 / month", perks: ["Logo"], slots: 2, href: "#p", sponsors: [] }] });
assert.deepEqual([...document.querySelectorAll(".sboard__invite")].map((n) => n.textContent), ["Be the first Platinum sponsor", "Your logo here"]);
assert.match(document.getElementById(document.querySelector(".sboard__card--open")!.getAttribute("aria-describedby")!)!.textContent!, /\$1,000 \/ month\. Logo/, "Perks are the place's description");
assert.equal(document.querySelector('[role="progressbar"]')!.getAttribute("aria-valuetext"), "$2,450 of $4,000 a month, 61%");
await clear();

const Wall = load("src/registry/sections/mention-wall/MentionWall.tsx", "MentionWall", { "./masonry": wallMod });
(globalThis as any).CSS ??= { escape: (s: string) => s };
const wallPosts = Array.from({ length: 5 }, (_, i) => ({ id: `w${i}`, author: { name: `Person ${i}`, handle: `p${i}`, verified: i === 0 }, body: "Nice.", date: "2026-03-04", href: `#${i}`, source: "Chirp", archived: i === 4 }));
await mount(Wall, { posts: wallPosts, pageSize: 3 });
assert.equal(document.querySelectorAll(".mwall__post").length, 3);
assert.equal(document.querySelectorAll(".mwall__tick").length, 1, "Only verified authors get a tick");
await click(".mwall__btn");
assert.equal(document.querySelectorAll(".mwall__post").length, 5);
assert.equal(document.activeElement!.getAttribute("aria-labelledby"), "mwall-w3-n", "Focus moves to the first new post");
assert.equal(document.querySelector('[aria-labelledby="mwall-w4-n"] a'), null, "Archived posts don't link out");
assert.equal(document.querySelector(".mwall__btn"), null);
await mount(Wall, { posts: [] });
assert.equal(document.querySelector(".mwall"), null, "No posts, no section");
await clear();

// Cards batch, wave A: bento grid, peek words, bloom album, dither accordion, marble grid.
const bentoMod = load("src/registry/cards/bento-grid/layout.ts", "*");
assert.deepEqual([1200, 700, 400].map(bentoMod.columnsFor), [4, 2, 1]);
assert.deepEqual(bentoMod.spanFor({ lg: [2, 2], md: [2, 1] }, 4), [2, 2]);
assert.deepEqual(bentoMod.spanFor({ lg: [2, 2], md: [2, 1] }, 2), [2, 1]);
assert.deepEqual(bentoMod.spanFor({ lg: [3, 1] }, 1), [1, 1], "A span never overflows the row");
const peekMod = load("src/registry/cards/peek-words/peek.ts", "*");
const above = peekMod.place({ left: 400, top: 500, width: 60, height: 24 }, { width: 300, height: 240 }, { width: 1200, height: 800 });
assert.equal(above.side, "above"); assert.equal(above.left, 280); assert.equal(above.top, 248);
assert.equal(peekMod.place({ left: 400, top: 60, width: 60, height: 24 }, { width: 300, height: 240 }, { width: 1200, height: 800 }).side, "below", "Flips below near the top");
assert.equal(peekMod.place({ left: 4, top: 500, width: 40, height: 24 }, { width: 300, height: 240 }, { width: 1200, height: 800 }).left, 8, "Stays inside the screen");
const bloomMod = load("src/registry/cards/bloom-album/bloom.ts", "*");
const ring = bloomMod.slots(8, 300, 300);
assert.equal(ring.length, 8);
assert(ring[0].y < -200 && Math.abs(ring[0].x) < 60, "The first card goes to the top");
assert.deepEqual(bloomMod.slots(8, 300, 300), ring, "The cluster is the same every time");
assert.equal(bloomMod.rest(5).opacity, 0, "Only three cards peek at rest");
const daccMod = load("src/registry/cards/dither-accordion/accordion.ts", "*");
assert.equal(daccMod.step(4, 5, "ArrowRight"), 0); assert.equal(daccMod.step(0, 5, "ArrowLeft"), 4); assert.equal(daccMod.step(2, 5, "End"), 4);
assert.equal(daccMod.step(1, 5, "ArrowDown", true), 2, "Vertical layouts use up and down");
assert.deepEqual(daccMod.pack([{ left: 10, top: 20, width: 100, height: 200 }], { left: 0, top: 0, height: 300 }, 2, 1), [20, 160, 200, 400], "Rects are flipped to a bottom-left origin and scaled");
const mgridMod = load("src/registry/cards/marble-grid/grid.ts", "*");
assert.equal(mgridMod.move(1, 6, 3, "ArrowDown"), 4); assert.equal(mgridMod.move(4, 6, 3, "ArrowDown"), 4, "Stays put at the edge");
assert.deepEqual(mgridMod.origin({ left: 0, top: 0, width: 200, height: 100 }, { x: 50, y: 75 }), { x: 25, y: 75 });
assert.deepEqual(mgridMod.origin({ left: 0, top: 0, width: 200, height: 100 }), { x: 50, y: 50 }, "Keyboard floods from the centre");

const Bloom = load("src/registry/cards/bloom-album/BloomAlbum.tsx", "BloomAlbum", { "./bloom": bloomMod });
await mount(Bloom, { cover: "Cover", label: "Album", items: [{ id: "a", title: "One" }, { id: "b", title: "Two" }] });
assert.equal(document.querySelector(".bloom__cover")!.getAttribute("aria-label"), "Album, 2 photos");
assert.equal(document.querySelector(".bloom__items")!.getAttribute("aria-hidden"), "true");
assert.equal(document.querySelector<HTMLButtonElement>(".bloom__card")!.tabIndex, -1, "Folded pictures are out of the tab order");
await click(".bloom__cover");
assert.equal(document.querySelector(".bloom__cover")!.getAttribute("aria-expanded"), "true");
assert.equal(document.querySelector<HTMLButtonElement>(".bloom__card")!.tabIndex, 0);
await act(async () => { document.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
assert.equal(document.querySelector(".bloom__cover")!.getAttribute("aria-expanded"), "false", "Escape folds it");
await clear();

// Cards batch, wave B: marble invite, wrap caption, dither rows, reaction pill, notch menu, slipstream menu, tumbler code.
const tiltMod = load("src/registry/cards/marble-invite/tilt.ts", "*");
assert.deepEqual(tiltMod.tilt(0.5, 0.5), { rx: 0, ry: 0 }); assert.deepEqual(tiltMod.tilt(1, 0, 6), { rx: 6, ry: 6 }); assert.deepEqual(tiltMod.tilt(2, -1, 6), { rx: 6, ry: 6 }, "Tilt is capped");
const ringMod = load("src/registry/cards/wrap-caption/ring.ts", "*");
const rg = ringMod.ring("AB", () => 10, 100);
assert.equal(rg.glyphs.length % 2, 0, "The phrase repeats a whole number of times");
assert(Math.abs(rg.radius * 2 * Math.PI - rg.glyphs.length * 10) < 1e-6, "Glyphs exactly close the circle");
assert.equal(ringMod.counter(0, 4), "01 / 04");
const rowsMod = load("src/registry/cards/dither-rows/rows.ts", "*");
assert.equal(rowsMod.next(3, 4, "ArrowDown"), 0); assert.equal(rowsMod.next(0, 4, "ArrowUp"), 3); assert.equal(rowsMod.next(1, 4, "End"), 3);
const reactMod = load("src/registry/micro/reaction-pill/reactions.ts", "*");
assert.equal(reactMod.magnify(100, null), 1); assert(reactMod.magnify(100, 100) > reactMod.magnify(100, 140), "Discs swell nearest the pointer");
assert.deepEqual(reactMod.tally({ like: 3, love: 1 }, "like", "love"), { like: 2, love: 2 }, "Switching moves one count");
assert.deepEqual(reactMod.tally({ like: 3 }, "like", null), { like: 2 });
assert.deepEqual(reactMod.summary({ like: 5, love: 9, laugh: 0, cheer: 1 }), { total: 15, top: ["love", "like", "cheer"] });
assert.equal(reactMod.shortCount(12400), "12K"); assert.equal(reactMod.shortCount(1284), "1,284");
const notchMod = load("src/registry/navbars/notch-menu/notch.ts", "*");
assert.deepEqual(notchMod.notchSize(false, 1200), { width: 300, height: 44 }); assert.equal(notchMod.notchSize(true, 400).width, 376, "The panel never overflows narrow screens");
assert.equal(notchMod.cycle(3, 4, "ArrowDown"), 0);
const edgeMod = load("src/registry/navigation/slipstream-menu/edge.ts", "*");
assert.equal(edgeMod.edge(105, { top: 100, height: 100 }), "top"); assert.equal(edgeMod.edge(190, { top: 100, height: 100 }), "bottom"); assert.equal(edgeMod.offset("top"), -101);
const codeMod = load("src/registry/micro/tumbler-code/code.ts", "*");
assert.equal(codeMod.clean(" 48-29 15x7", 6), "482915", "Pastes keep only digits, up to the length");
assert.equal(codeMod.caret("482", 6), 3); assert.equal(codeMod.caret("482915", 6), 5);
assert.deepEqual(codeMod.arrivals("48", "4829"), [2, 3]);

const Pill = load("src/registry/micro/reaction-pill/ReactionPill.tsx", "ReactionPill", { "./reactions": reactMod });
let pillFail = true;
await mount(Pill, { counts: { like: 4 }, onChange: async () => { if (pillFail) throw new Error("offline"); } });
await click(".rpill__trigger");
await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
assert.equal(document.querySelector(".rpill__total")!.textContent, "4", "A failed save puts the count back");
assert.match(document.querySelector(".rpill [role=status]")!.textContent!, /Couldn't save/);
pillFail = false;
await click(".rpill__trigger");
await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
assert.equal(document.querySelector(".rpill__total")!.textContent, "5");
assert.match(document.querySelector(".rpill__trigger")!.getAttribute("aria-label")!, /^Like\. Press to remove/);
await clear();

const Tumbler = load("src/registry/micro/tumbler-code/TumblerCode.tsx", "TumblerCode", { "./code": codeMod });
let checked = "";
await mount(Tumbler, { onComplete: async (c: string) => { checked = c; return { ok: true }; } });
await input(".tumb__input", "48 29-15");
await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
assert.equal(checked, "482915", "A pasted code is cleaned and checked once complete");
assert.equal(document.querySelector(".tumb")!.getAttribute("data-state"), "ok");
assert.equal(document.querySelectorAll(".tumb__slot--set").length, 6);
await clear();

// Backgrounds batch and Tile Breaker: every shader falls back cleanly without WebGL.
(dom.window.HTMLCanvasElement.prototype as any).getContext = () => null;
for (const [slug, name] of [["ember-plumes", "EmberPlumes"], ["storm-veil", "StormVeil"], ["neon-veins", "NeonVeins"], ["pigment-shore", "PigmentShore"], ["corona-arcs", "CoronaArcs"], ["light-sash", "LightSash"], ["blue-hour", "BlueHour"], ["velvet-grain", "VelvetGrain"], ["glow-strands", "GlowStrands"]]) {
  const gl = load(`src/registry/backgrounds/${slug}/gl.ts`, "*");
  const Bg = load(`src/registry/backgrounds/${slug}/${name}.tsx`, name, { "./gl": gl });
  await mount(Bg, { fade: true });
  const host = document.querySelector("#root > div")!;
  assert.equal(host.getAttribute("data-fallback"), "", `${name} falls back without WebGL`);
  assert.match(host.className, /--fade/, `${name} takes the fade`);
  assert.equal(host.querySelector("canvas")!.getAttribute("aria-hidden"), "true");
  await clear();
}
const motifs = load("src/registry/sections/tile-breaker/motifs.ts", "*");
assert.equal(motifs.delay(0, 0), 0); assert.equal(motifs.delay(3, 1), 130, "Rows lag two columns behind, so the wave runs diagonally");
const Breaker = load("src/registry/sections/tile-breaker/TileBreaker.tsx", "TileBreaker", { "./motifs": motifs });
const breakerProps = { title: "One desk", lead: "Lead", primary: { label: "Open", href: "#open" }, secondary: { label: "Tour", href: "#tour" }, points: ["One", "Two", "Three"] };
await mount(Breaker, breakerProps);
const sec = document.querySelector("section.tbreak")!;
assert.equal(document.getElementById(sec.getAttribute("aria-labelledby")!)!.textContent, "One desk", "The section is labelled by its heading");
assert.deepEqual([...sec.querySelectorAll(".tbreak__actions a")].map((a) => a.getAttribute("href")), ["#open", "#tour"]);
assert.equal(sec.querySelectorAll(".tbreak__points li").length, 3);
assert.equal(sec.querySelectorAll(".tbreak__blur").length, 6, "Six layers make the progressive blur");
assert(sec.querySelectorAll("[aria-hidden=true] .tbreak__tile, .tbreak__band[aria-hidden=true]").length >= 2, "Both bands are hidden from assistive tech");
const leaf = sec.querySelector(".tbreak__tile path")!.getAttribute("d");
await mount(Breaker, { ...breakerProps, motif: "step", blur: false });
assert.equal(document.querySelector("section.tbreak")!.getAttribute("data-motif"), "step");
assert.notEqual(document.querySelector(".tbreak__tile path")!.getAttribute("d"), leaf, "The motif changes the tile");
assert.equal(document.querySelector(".tbreak__foot"), null, "No foot without the blur");
await clear();

// Bento batch: mono, unfold, depth, metric.
const monoMod = load("src/registry/cards/mono-bento/mono.ts", "*");
assert.equal(monoMod.countAt(0, 100), 0); assert.equal(monoMod.countAt(1400, 100), 100); assert(monoMod.countAt(700, 100) > 50, "The count eases out");
assert.equal(monoMod.compact(4210000), "4.21M"); assert.equal(monoMod.compact(18400), "18.4K"); assert.equal(monoMod.compact(940), "940"); assert.equal(monoMod.compact(1200000), "1.2M");
assert.deepEqual(monoMod.uptimeDays(5), monoMod.uptimeDays(5), "Uptime days are stable");
assert.deepEqual(monoMod.origin(150, 50, { left: 100, top: 0, width: 100, height: 100 }), { x: 50, y: 50 }); assert.deepEqual(monoMod.origin(-50, 500, { left: 0, top: 0, width: 100, height: 100 }), { x: 0, y: 100 });
const unfoldMod = load("src/registry/cards/unfold-bento/unfold.ts", "*");
let us = unfoldMod.unfold({ open: null, from: null }, { type: "open", id: "b" });
assert.deepEqual(us, { open: "b", from: "b" });
us = unfoldMod.unfold(us, { type: "step", ids: ["a", "b", "c"], by: 1 }); assert.equal(us.open, "c");
us = unfoldMod.unfold(us, { type: "step", ids: ["a", "b", "c"], by: 1 }); assert.equal(us.open, "a", "Stepping wraps around");
us = unfoldMod.unfold(us, { type: "close" }); assert.deepEqual(us, { open: null, from: "a" }, "Focus returns to the last open tile");
const depthMod = load("src/registry/cards/depth-bento/depth.ts", "*");
assert.deepEqual(depthMod.lean(0.5, 0.5), { rx: 0, ry: 0 }); assert.deepEqual(depthMod.lean(1, 0, 8), { rx: 8, ry: 8 }); assert.deepEqual(depthMod.lean(2, 2, 8), { rx: -8, ry: 8 }, "The lean is capped");
const mxMod = load("src/registry/cards/metric-bento/metrics.ts", "*");
assert.equal(mxMod.level(0, 10), 0); assert.equal(mxMod.level(1, 10), 1); assert.equal(mxMod.level(10, 10), 4);
const wk = mxMod.weeks([1, 2, 3, 4, 5, 6, 7, 8], 3);
assert.deepEqual(wk[0], [null, null, 1, 2, 3, 4, 5], "Weeks start on Monday"); assert.deepEqual(wk[1], [6, 7, 8, null, null, null, null]);
assert.equal(mxMod.delta(100, 112.4), 12.4); assert.deepEqual(mxMod.conversions([1000, 250, 100]), [25, 40]);
const sl = mxMod.slices([1, 1], 0); assert(Math.abs(sl[1].end - Math.PI * 2) < 1e-9 && Math.abs(sl[0].share - 0.5) < 1e-9);
assert.equal(mxMod.spark([1, 2, 3], 100, 20).line.startsWith("M0.0 14.0"), true);
const Unfold = load("src/registry/cards/unfold-bento/UnfoldBento.tsx", "UnfoldBento", { "./unfold": unfoldMod, "./layout": load("src/registry/cards/unfold-bento/layout.ts", "*") });
const uTiles = ["a", "b", "c"].map((id) => ({ id, title: id.toUpperCase(), kicker: "k", color: "#ffd166", teaser: null, detail: `Detail ${id}` }));
await mount(Unfold, { tiles: uTiles });
await click('[data-tile="b"]');
assert.equal(document.querySelector(".ubento__panel h3")!.textContent, "B");
assert.equal(document.activeElement, document.querySelector(".ubento__panel h3"), "Focus moves into the unfolded tile");
assert.equal(document.querySelectorAll(".ubento__chip").length, 2);
await act(async () => { document.querySelector(".ubento__stage")!.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
assert.equal(document.querySelectorAll(".ubento__tile").length, 3, "Escape folds it back");
assert.equal(document.activeElement, document.querySelector('[data-tile="b"]'), "Focus returns to its tile");
await clear();

// Auth batch: mono, provider stack, domain, handle, confirm access, sessions, recovery.
const tick = async (ms = 0) => { await act(async () => { await new Promise((r) => setTimeout(r, ms)); }); };
const AUTH = "src/registry/auth";
const msMod = load(`${AUTH}/mono-sign-in/mono.ts`, "*");
assert.equal(msMod.isEmail("a@b.co"), true); assert.equal(msMod.isEmail("a@b"), false); assert.match(msMod.providerError("GitHub", "closed"), /window was closed/);
const prov = (dir: string) => load(`${AUTH}/${dir}/providers.tsx`, "*");
const Mono = load(`${AUTH}/mono-sign-in/MonoSignIn.tsx`, "MonoSignIn", { "./mono": msMod, "./providers": prov("mono-sign-in") });
let monoFail = true;
await mount(Mono, { brand: "plainfield", onProvider: async () => { if (monoFail) throw { reason: "closed" }; }, onSignIn: async (_: string, p: string) => { if (p !== "ok") throw new Error("no"); } });
await click(".msign__provider");
await tick();
assert.match(document.querySelector(".msign__error")!.textContent!, /Google window was closed/, "A closed provider window is explained");
await input(".msign__input[type=email]", "nope"); await submit();
assert.match(document.querySelector(".msign__error")!.textContent!, /Enter an email/);
await input(".msign__input[type=email]", "mara@plainfield.co"); await submit();
assert.equal(document.querySelector(".msign__reveal--open") !== null, true, "A good email opens the password field");
await input(".msign__input[type=password]", "bad"); await submit(); await tick();
assert.match(document.querySelector(".msign__error")!.textContent!, /don't match/);
await input(".msign__input[type=password]", "ok"); await submit(); await tick();
assert.match(document.querySelector(".msign__done")!.textContent!, /Signed in/);
await clear();

const hoMod = load(`${AUTH}/provider-stack/handoff.ts`, "*");
let hs = hoMod.handoff({ phase: "pick" }, { type: "start", provider: "github" });
assert.deepEqual(hs, { phase: "waiting", provider: "github" });
assert.deepEqual(hoMod.handoff(hs, { type: "fail", text: "x" }), { phase: "pick", error: { provider: "github", text: "x" } });
assert.deepEqual(hoMod.handoff(hs, { type: "cancel" }), { phase: "pick" });
assert.deepEqual(hoMod.handoff({ phase: "pick" }, { type: "succeed" }), { phase: "pick" }, "Late answers after a cancel are ignored");
const Stack = load(`${AUTH}/provider-stack/ProviderStack.tsx`, "ProviderStack", { "./handoff": hoMod, "./providers": prov("provider-stack") });
let stackFail = true;
await mount(Stack, { app: { name: "Foldline", mark: null }, onProvider: async () => { if (stackFail) throw { reason: "closed" }; return "Mara"; } });
await click('[data-provider="github"]'); await tick();
assert.match(document.querySelector(".pstack__error")!.textContent!, /GitHub window was closed/);
assert.equal(document.activeElement, document.querySelector('[data-provider="github"]'), "Focus returns to the provider that failed");
stackFail = false;
await click('[data-provider="github"]'); await tick();
assert.match(document.querySelector(".pstack__done")!.textContent!, /You're in, Mara/);
await clear();

const rtMod = load(`${AUTH}/domain-sign-in/route.ts`, "*");
const orgs = [{ domain: "northwind.co", name: "Northwind", color: "#000", idp: "Okta" }];
assert.equal(rtMod.route("ines@northwind.co", orgs).kind, "sso"); assert.equal(rtMod.route("ines@eu.northwind.co", orgs).kind, "sso", "Subdomains belong to the org");
assert.equal(rtMod.route("a@gmail.com", orgs).kind, "google"); assert.equal(rtMod.route("a@hotmail.com", orgs).kind, "microsoft");
assert.equal(rtMod.route("a@example.org", orgs).kind, "password"); assert.equal(rtMod.route("a@b", orgs).kind, "invalid");
assert.equal(rtMod.hint("ines@north", orgs), null); assert.equal(rtMod.hint("ines@northwind.co", orgs)?.name, "Northwind");
const Domain = load(`${AUTH}/domain-sign-in/DomainSignIn.tsx`, "DomainSignIn", { "./route": rtMod, "./providers": prov("domain-sign-in") });
await mount(Domain, { app: { name: "Orbitly", mark: null }, orgs });
await input("input[type=email]", "sam@gmail.com"); await submit();
assert.match(document.querySelector(".dsign__primary--google")!.textContent!, /Continue with Google/, "gmail goes to Google");
await click(".dsign__chip");
await input("input[type=email]", "ines@northwind.co"); await submit();
assert.match(document.querySelector(".dsign__primary")!.textContent!, /Continue to Okta/, "A company domain goes to its SSO");
await clear();

const hdMod = load(`${AUTH}/handle-sign-up/handle.ts`, "*");
assert.equal(hdMod.handleProblem("ab"), "At least 3 characters."); assert.match(hdMod.handleProblem("Mara")!, /lowercase/); assert.match(hdMod.handleProblem("_mara")!, /underscore/); assert.equal(hdMod.handleProblem("mara_k"), null);
assert.equal(hdMod.tidy("@Mara Okafor"), "mara_okafor");
assert.deepEqual(hdMod.suggest("Mara Okafor", ["mara_okafor"]), ["maraokafor", "mara_o", "mara_builds"]);
assert.equal(hdMod.initials("Mara Okafor"), "MO");
const Handle = load(`${AUTH}/handle-sign-up/HandleSignUp.tsx`, "HandleSignUp", { "./handle": hdMod, "./providers": prov("handle-sign-up") });
await mount(Handle, { brand: "Murmur", onStart: async () => ({ name: "Mara Okafor", via: "github" }), checkHandle: async (h: string) => h !== "mara_okafor" && h !== "maraokafor" });
await click(".hsign__provider--github"); await tick(); await tick(400);
assert.match(document.querySelector(".hsign__status")!.textContent!, /mara_okafor is taken/);
await tick(50);
assert.deepEqual([...document.querySelectorAll(".hsign__ideas button")].map((b) => b.textContent), ["@mara_o", "@mara_builds", "@mokafor"], "Only free handles are suggested");
await click(".hsign__ideas button"); await tick(400);
assert.match(document.querySelector(".hsign__status")!.textContent!, /mara_o is yours/);
assert.equal(document.querySelector<HTMLButtonElement>(".hsign__primary")!.disabled, false);
await clear();

const acMod = load(`${AUTH}/confirm-access/access.ts`, "*");
assert.equal(acMod.digits("24 68-10x9"), "246810"); assert.equal(acMod.nextTab(["passkey", "code", "password"], "password", "ArrowRight"), "passkey");
assert.equal(acMod.triesLeft(1), "1 try left.");
const slMod = load(`${AUTH}/session-ledger/sessions.ts`, "*");
const rows = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
const rm = slMod.remove(rows, ["b", "d"]);
assert.deepEqual(rm.kept.map((r: any) => r.id), ["a", "c"]);
assert.deepEqual(slMod.restore(rm.kept, rm.removed).map((r: any) => r.id), ["a", "b", "c", "d"], "Rows go back in their old places");
assert.equal(slMod.ago(0, 60000), "Active now"); assert.equal(slMod.ago(0, 3 * 3600000), "3 hours ago"); assert.equal(slMod.ago(0, 26 * 3600000), "Yesterday");
const Ledger = load(`${AUTH}/session-ledger/SessionLedger.tsx`, "SessionLedger", { "./sessions": slMod });
const NOW = 1_800_000_000_000;
await mount(Ledger, { now: NOW, sessions: [{ id: "a", device: "laptop", name: "Mac", browser: "Safari", place: "Lisbon", lastActive: NOW, current: true }, { id: "b", device: "phone", name: "Pixel", browser: "App", place: "Porto", lastActive: NOW - 3600000 }], onRevoke: async () => { throw new Error("offline"); } });
await click('[aria-label^="Sign out Pixel"]');
await click(".sled__danger"); await tick(320); await tick();
assert.equal(document.querySelectorAll(".sled__row").length, 2, "A failed sign-out puts the row back");
assert.match(document.querySelector(".sled__err")!.textContent!, /Couldn't sign this device out/);
await clear();

const rcMod = load(`${AUTH}/recovery-kit/codes.ts`, "*");
let rs = 3; const rr = () => ((rs = (rs * 16807) % 2147483647) - 1) / 2147483646;
assert.match(rcMod.makeCode(rr), /^[a-hj-km-np-z2-9]{4}-[a-hj-km-np-z2-9]{4}$/, "Codes avoid look-alike characters");
assert.match(rcMod.asText([{ code: "aaaa-bbbb" }, { code: "cccc-dddd", used: true }], "m@x.co", "today"), / 2\. cccc-dddd {2}\(used\)/);
const Kit = load(`${AUTH}/recovery-kit/RecoveryKit.tsx`, "RecoveryKit", { "./codes": rcMod });
await mount(Kit, { codes: [{ code: "aaaa-bbbb" }], account: "m@x.co", issued: "today" });
assert.equal(document.querySelector<HTMLButtonElement>(".rkit__continue")!.disabled, true, "Continue waits for the saved tick");
await click(".rkit__check input");
assert.equal(document.querySelector<HTMLButtonElement>(".rkit__continue")!.disabled, false);
await clear();

// Special-hover buttons and field CTA.
{
const B = "src/registry/buttons";
const per = load(`${B}/paw-trail/perimeter.ts`, "*");
const Lp = per.length(100, 40, 20);
assert(Math.abs(Lp - (120 + Math.PI * 40)) < 1e-9, "Perimeter of a pill");
const p0 = per.pointAt(100, 40, 20, 0);
assert.deepEqual([p0.x, p0.y, p0.tx, p0.ty, p0.nx, p0.ny], [20, 0, 1, 0, 0, -1], "Starts on the top edge heading right, normal pointing out");
const ph = per.pointAt(100, 40, 20, Lp / 2);
assert(Math.abs(ph.x - 80) < 1e-6 && Math.abs(ph.y - 40) < 1e-6 && ph.ny === 1, "Half way round is on the bottom edge, normal pointing down");
assert.deepEqual(per.pointAt(100, 40, 20, Lp + 5), per.pointAt(100, 40, 20, 5), "Distance wraps round");
assert(Math.abs(per.nearest(100, 40, 20, 50, -10) - 30) < 1.5, "Nearest point to something above the middle is the top middle");
assert.equal(per.around(10, Lp - 10, Lp), -20, "Shortest way round goes backwards when that's closer");
const gaitMod = load(`${B}/paw-trail/gait.ts`, "*", { "./perimeter": per });
const pupGait = gaitMod.GAITS.pup;
const a0 = gaitMod.step(0, 30, 1, 100, 40, 20, pupGait), a1 = gaitMod.step(1, 30, 1, 100, 40, 20, pupGait);
assert.equal(a0.length, 1); assert.notEqual(a0[0].side, a1[0].side, "Walkers alternate feet");
assert(Math.abs(Math.hypot(a1[0].x - a0[0].x, a1[0].y - a0[0].y) - Math.hypot(pupGait.stride, pupGait.spread * 2)) < 0.5, "Steps are a stride apart");
assert.equal(Math.round(a0[0].angle), 90, "Prints point along the direction of travel");
assert.equal(gaitMod.step(0, 30, 1, 100, 40, 20, gaitMod.GAITS.bird).length, 2, "Birds land both feet at once");
const bloomMod = load(`${B}/bloom-edge/bloom.ts`, "*", { "./perimeter": load(`${B}/bloom-edge/perimeter.ts`, "*") });
const sp = bloomMod.spots(200, 52, 26, 40, 17, 5);
assert(sp.every((s: any, i: number) => i === 0 || s.dist >= sp[i - 1].dist), "Growth comes nearest-first");
assert(Math.abs(sp[0].dist - 17 * 0.6) < 1e-9);
const starsMod = load(`${B}/starfield-button/stars.ts`, "*", { "./perimeter": load(`${B}/starfield-button/perimeter.ts`, "*") });
const sky1 = starsMod.sky(200, 52, 26, 0, 18);
assert.equal(sky1.length, 18); assert.deepEqual(sky1, starsMod.sky(200, 52, 26, 0, 18), "The same seed gives the same sky");
assert(starsMod.lines(sky1).length < 18 && starsMod.lines(sky1).length > 8, "Some joins are skipped");
const fizzMod = load(`${B}/fizz-button/fizz.ts`, "*");
const rnd = fizzMod.seeded(5);
for (let i = 0; i < 50; i++) { const bb = fizzMod.bubble(200, 54, 20, rnd); assert(bb.x >= 6 && bb.x <= 194, "Bubbles stay inside the glass"); }
const small = fizzMod.bubble(200, 54, null, () => 0), big = fizzMod.bubble(200, 54, null, () => 0.99);
assert(big.ms < small.ms, "Bigger bubbles rise faster");
const notesMod = load(`${B}/margin-notes/notes.ts`, "*");
for (let n = 0; n < 30; n++) {
  const k = notesMod.pick(n);
  assert.equal(k[0], ["arrowLeft", "arrowRight", "circle"][n % 3]);
  assert(!(k.includes("arrowLeft") && k.includes("arrowRight")), "Never both arrows");
  assert(!(k.includes("circle") && k.includes("underline")), "Never a ring with an underline");
  assert.equal(new Set(k).size, k.length);
}
assert.deepEqual(notesMod.pick(4), notesMod.pick(4), "The same hover gives the same notes");
assert(notesMod.strokes("arrowLeft", 160, 50, notesMod.seeded(1)).length === 2, "Arrows are a curve and a head");
const focusMod = load("src/registry/ctas/field-cta/focus.ts", "*");
assert.deepEqual(focusMod.centreIn({ left: 150, top: 80, width: 100, height: 40 }, { left: 100, top: 0, width: 400, height: 200 }), { x: 0.25, y: 0.5 });
assert.deepEqual(focusMod.centreIn({ left: -500, top: 0, width: 10, height: 10 }, { left: 0, top: 0, width: 100, height: 100 }), { x: 0, y: 0.05 }, "The point is clamped inside the banner");
const Paw = load(`${B}/paw-trail/PawTrail.tsx`, "PawTrail", { "./gait": gaitMod, "./perimeter": per, "./prints": load(`${B}/paw-trail/prints.ts`, "*") });
await mount(Paw, { children: "Adopt" });
assert.equal(document.querySelector(".ptrail__ground")!.getAttribute("aria-hidden"), "true"); assert.equal(document.querySelector("button")!.textContent, "Adopt");
await clear();
const FieldBtn = load(`${B}/field-button/FieldButton.tsx`, "FieldButton", { "./gl": load(`${B}/field-button/gl.ts`, "*"), "./fields": load(`${B}/field-button/fields.ts`, "*") });
await mount(FieldBtn, { children: "Go", field: "veins" });
assert.equal(document.querySelector(".fbtn")!.getAttribute("data-fallback"), "", "The field button falls back without WebGL");
await clear();
const FieldCtaC = load("src/registry/ctas/field-cta/FieldCta.tsx", "FieldCta", { "./gl": load("src/registry/ctas/field-cta/gl.ts", "*"), "./fields": load("src/registry/ctas/field-cta/fields.ts", "*"), "./focus": focusMod });
await mount(FieldCtaC, { title: "Ship it", primary: { label: "Start", href: "#s" } });
const cta = document.querySelector("section.fcta")!;
assert.equal(document.getElementById(cta.getAttribute("aria-labelledby")!)!.textContent, "Ship it"); assert.equal(cta.getAttribute("data-fallback"), "");
await clear();
}

// Batch: hover buttons II, click cursors, analytics, daylight map, micro, chapter rail, till receipt, section breakers.
{
const R = "src/registry";
const key = async (el: Element, k: string, extra: Record<string, unknown> = {}) => { await act(async () => { el.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: k, bubbles: true, ...extra })); }); };
const change = async (el: HTMLInputElement) => { await act(async () => { el.click(); }); };

// Buttons: pure helpers
const kper = load(`${R}/buttons/koi-pond/perimeter.ts`, "*");
const koi = load(`${R}/buttons/koi-pond/koi.ts`, "*", { "./perimeter": kper });
const fish = koi.school(3, 232, 64, 32, 13, koi.PONDS.koi.coats);
assert.equal(fish.length, 3); assert.equal(fish[0].spine.length, koi.PROFILE.length);
const f0 = fish[0], a0k = f0.a;
koi.swim(f0, { x: f0.x - 100, y: f0.y }, 50, 5, 0.02);
assert(Math.abs(Math.atan2(Math.sin(f0.a - a0k), Math.cos(f0.a - a0k))) <= 5 * 0.02 + 1e-9, "Fish turn no faster than their turn rate");
assert(f0.spine.every((p: any, i: number) => i === 0 || Math.abs(Math.hypot(p.x - f0.spine[i - 1].x, p.y - f0.spine[i - 1].y) - koi.SEG) < 1e-6), "The body follows the head one segment apart");
const snow = load(`${R}/buttons/snow-cap/snow.ts`, "*");
assert.equal(snow.surface(200, 28, 100), 0); assert(Math.abs(snow.surface(200, 28, 0) - 28) < 1e-9, "The pill's top edge rises to its middle at the very ends");
const lim = snow.limits(200, 28, 12);
assert.equal(lim[50], 12); assert(lim[0] < 1 && lim[lim.length - 1] < 1, "Snow can't settle on the steep shoulders");
const cap = lim.map(() => 0);
for (let i = 0; i < 400; i++) snow.deposit(cap, lim, 50, 2);
assert(cap.every((c: number, i: number) => c <= lim[i] + 1e-9), "Drifts never exceed what each column can hold");
const bumpy = [0, 6, 0, 6, 0]; snow.settle(bumpy, [9, 9, 9, 9, 9], 1.2);
assert(Math.max(...bumpy.slice(0, -1).map((v, i) => Math.abs(v - bumpy[i + 1]))) < 6, "Slumping softens steps");
const arc = load(`${R}/buttons/static-edge/arc.ts`, "*", { "./perimeter": load(`${R}/buttons/static-edge/perimeter.ts`, "*") });
const bl = arc.bolt({ x: 0, y: 0 }, { x: 100, y: 0 }, 10, 4, arc.seeded(2));
assert.equal(bl.length, 17); assert.deepEqual([bl[0], bl[16]], [{ x: 0, y: 0 }, { x: 100, y: 0 }], "Bolts keep their ends");
const cr = arc.crawl(200, 56, 28, 40, 60, 3, 3, arc.seeded(3)), ce = arc.pointAt(200, 56, 28, 40);
assert(Math.hypot(cr[0].x - ce.x, cr[0].y - ce.y) < 1e-6, "Crawling arcs start on the edge");
const sticker = load(`${R}/buttons/sticker-slap/layout.ts`, "*", { "./perimeter": load(`${R}/buttons/sticker-slap/perimeter.ts`, "*") });
const set1 = sticker.layout(1, 216, 56, 28, 30), set2 = sticker.layout(2, 216, 56, 28, 30);
assert.equal(set1.length, 5); assert.equal(new Set(set1.map((p: any) => p.kind)).size, 5, "Five different stickers per hover");
assert.deepEqual(set1, sticker.layout(1, 216, 56, 28, 30)); assert.notDeepEqual(set1.map((p: any) => p.kind), set2.map((p: any) => p.kind), "A new hover brings a new set");
assert.equal(set1[0].delay, 0); assert(set1.every((p: any) => Math.abs(p.tilt) <= 22));
const flight = load(`${R}/buttons/moth-light/flight.ts`, "*", { "./perimeter": load(`${R}/buttons/moth-light/perimeter.ts`, "*") });
const blinks = Array.from({ length: 100 }, (_, i) => flight.blink(i / 100, 1, 0));
assert(blinks.every((b) => b >= 0 && b <= 1) && blinks.filter((b) => b === 0).length > 50, "Fireflies are dark most of their cycle");
const moth = { x: 0, y: 0, vx: 0, vy: 0 };
for (let i = 0; i < 400; i++) flight.flutter(moth, 50, 20, 1 / 60, () => 0.5);
assert(Math.hypot(moth.x - 50, moth.y - 20) < 0.5, "Without the jitter a moth settles on its target");
const ruler = load(`${R}/buttons/ruler-edge/ruler.ts`, "*", { "./perimeter": load(`${R}/buttons/ruler-edge/perimeter.ts`, "*") });
const tk = ruler.ticks(216, 56, 28);
assert.equal(tk.length, Math.floor(ruler.length(216, 56, 28) / 4)); assert.equal(tk[0].rank, 2); assert.equal(tk[5].rank, 1); assert.equal(tk[1].rank, 0);
assert.equal(ruler.delay(30, 10, 500), ruler.delay(-10, 10, 500), "Ticks spread both ways from the entry point");
assert.deepEqual(ruler.marks(216, 28), [40, 80, 120, 160]);

// Buttons: mounts
const B = `${R}/buttons`;
for (const [file, name, props, sel] of [
  ["koi-pond/KoiPond.tsx", "KoiPond", { children: "Swim" }, ".koip__water"],
  ["snow-cap/SnowCap.tsx", "SnowCap", { children: "Snow" }, ".scap__sky"],
  ["static-edge/StaticEdge.tsx", "StaticEdge", { children: "Zap" }, ".sedge__arcs"],
  ["sticker-slap/StickerSlap.tsx", "StickerSlap", { children: "Slap" }, ".sslap__wall"],
  ["moth-light/MothLight.tsx", "MothLight", { children: "Lamp" }, ".mlamp__air"],
  ["ruler-edge/RulerEdge.tsx", "RulerEdge", { children: "Measure" }, ".ruled__btn"],
] as const) {
  const dir = file.split("/")[0];
  const deps: Record<string, any> = dir === "snow-cap" ? { "./snow": snow } : { "./perimeter": load(`${B}/${dir}/perimeter.ts`, "*") };
  if (dir === "koi-pond") deps["./koi"] = koi;
  if (dir === "static-edge") deps["./arc"] = arc;
  if (dir === "sticker-slap") { deps["./layout"] = sticker; deps["./art"] = load(`${B}/sticker-slap/art.ts`, "*"); }
  if (dir === "moth-light") deps["./flight"] = flight;
  if (dir === "ruler-edge") deps["./ruler"] = ruler;
  await mount(load(`${B}/${file}`, name, deps), props);
  const btn = document.querySelector("button")!;
  assert.equal(btn.textContent!.trim(), props.children, `${name} keeps its label as the button's name`);
  if (sel !== ".ruled__btn") assert.equal(document.querySelector(sel)!.getAttribute("aria-hidden"), "true", `${name} decoration is hidden`);
  await clear();
}
const Rim = load(`${B}/field-rim/FieldRim.tsx`, "FieldRim", { "./gl": load(`${B}/field-rim/gl.ts`, "*"), "./fields": load(`${B}/field-rim/fields.ts`, "*") });
await mount(Rim, { children: "Go", field: "plumes" });
assert.equal(document.querySelector(".frim")!.getAttribute("data-fallback"), "", "The rim falls back without WebGL");
await clear();

// Cursors
const burst = load(`${R}/cursors/sparkle-click/burst.ts`, "*");
const vs = burst.spray(12, 0, Math.PI * 2, 100, 200, burst.seeded(4));
assert.equal(vs.length, 12); assert(vs.every((v: any) => { const s = Math.hypot(v.vx, v.vy); return s >= 100 - 1e-9 && s <= 200 + 1e-9; }), "Spray speeds stay in range");
const pt = { x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, age: 0, ttl: 1, size: 1, color: "", kind: 0, ph: 0 };
assert.equal(burst.step(pt, 0.5, 100, 0), true); assert.equal(pt.vy, 50, "Gravity pulls down"); assert.equal(burst.step(pt, 0.6, 100, 0), false, "Particles die at the end of their life");
assert.equal(burst.charge(50), 0); assert.equal(burst.charge(5000), 1);
for (const [dir, name] of [["sparkle-click", "SparkleClick"], ["confetti-click", "ConfettiClick"], ["firework-click", "FireworkClick"], ["petal-click", "PetalClick"]]) {
  const C = load(`${R}/cursors/${dir}/${name}.tsx`, name, { "./burst": load(`${R}/cursors/${dir}/burst.ts`, "*"), "./layer": load(`${R}/cursors/${dir}/layer.ts`, "*", { "./burst": load(`${R}/cursors/${dir}/burst.ts`, "*") }) });
  await mount(C, { children: createElement("button", { type: "button" }, "Inside") });
  assert.equal(document.querySelector("canvas")!.getAttribute("aria-hidden"), "true"); assert.equal(document.querySelector("button")!.textContent, "Inside", `${name} leaves its content alone`);
  await clear();
}

// Analytics
const period = load(`${R}/analytics/period-overlay/period.ts`, "*");
assert.equal(period.niceMax(2200), 2400); assert.equal(period.niceMax(950), 1000); assert.equal(period.niceMax(31), 32);
assert.deepEqual(period.resample([0, 10], 3), [0, 5, 10]); assert.equal(period.nearest(50, 100, 11), 5);
assert.equal(period.delta(110, 100), 0.1); assert.equal(period.delta(5, 0), null); assert.equal(period.pct(-0.1234), "−12.3%");
assert(period.monotone([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }]).startsWith("M0.00,0.00C"));
const PO = load(`${R}/analytics/period-overlay/PeriodOverlay.tsx`, "PeriodOverlay", { "./period": period });
const rng = (id: string, n: number) => ({ id, label: `${n}D`, versus: `previous ${n} days`, current: Array.from({ length: n }, (_, i) => 100 + i), previous: Array(n).fill(100), labels: Array.from({ length: n }, (_, i) => `d${i}`), previousLabels: Array.from({ length: n }, (_, i) => `p${i}`) });
await mount(PO, { title: "Sign-ups", ranges: [rng("7", 7), rng("30", 30)] });
assert.equal(document.querySelector('[role="radio"][aria-checked="true"]')!.textContent, "30D");
await click('[role="radio"]:not([aria-checked="true"])');
assert.equal(document.querySelector('[role="radio"][aria-checked="true"]')!.textContent, "7D");
await key(document.querySelector(".pover__plot")!, "End");
assert.match(document.querySelector(".pover__sr")!.textContent!, /^d6: 106, against 100 on p6, \+6\.0%\.$/, "Keyboard scrubbing is announced");
await clear();
const lat = load(`${R}/analytics/latency-heatmap/latency.ts`, "*");
const ed = lat.edges(1, 1000, 3);
assert.equal(ed.length, 4); assert(Math.abs(ed[1] - 10) < 1e-9 && Math.abs(ed[2] - 100) < 1e-9, "Buckets are log-spaced");
assert(Math.abs(lat.percentile([0, 10, 0], ed, 0.5) - Math.sqrt(1000)) < 1e-6, "The median sits half way through its bucket on the log scale");
assert.equal(lat.percentile([0, 0, 0], ed, 0.5), null);
assert.deepEqual(lat.region([[1, 2, 3], [4, 5, 6]], 1, 0, 2, 1), { n: 16, all: 21, share: 16 / 21 });
assert.equal(lat.ms(1500), "1.5 s"); assert.equal(lat.ms(42.4), "42 ms");
const LH = load(`${R}/analytics/latency-heatmap/LatencyHeatmap.tsx`, "LatencyHeatmap", { "./latency": lat });
await mount(LH, { title: "api", columns: [{ label: "00:00", counts: [5, 3, 1] }, { label: "00:30", counts: [2, 6, 2] }], edges: ed });
await click(".lheat__key--p99");
assert.equal(document.querySelector(".lheat__key--p99")!.getAttribute("aria-pressed"), "false", "Percentile lines can be hidden");
const plot = document.querySelector(".lheat__plot")!;
await key(plot, "ArrowLeft"); await key(plot, "ArrowDown", { shiftKey: true });
assert.match(document.querySelector(".lheat__picked")!.textContent!, /^\d+ requests? between 00:00 and 00:00/, "Shift + arrows select a region and count it");
await key(plot, "Escape");
assert.equal(document.querySelector(".lheat__picked")!.textContent, "Drag across the chart to count a region.");
await clear();
const tl = load(`${R}/analytics/annotated-timeline/timeline.ts`, "*");
assert.deepEqual(tl.lanes([0, 10, 40, 45, 50], 26), [0, 1, 0, 1, 2], "Pins too close share no lane");
assert.deepEqual(tl.impact([1, 1, 1, 3, 3, 3], 3, 3), { before: 1, after: 3, change: 2, rel: 2 });
assert.equal(tl.next(["a", "b", "c"], "c", 1), "c"); assert.equal(tl.next(["a", "b", "c"], "b", -1), "a");
const AT = load(`${R}/analytics/annotated-timeline/AnnotatedTimeline.tsx`, "AnnotatedTimeline", { "./timeline": tl, "./curve": load(`${R}/analytics/annotated-timeline/curve.ts`, "*") });
await mount(AT, { title: "Conversion", values: [1, 1, 1, 2, 2, 2, 2, 2], labels: ["a", "b", "c", "d", "e", "f", "g", "h"], events: [{ id: "x", at: 3, kind: "deploy", title: "New checkout", body: "b", by: "Ana", window: 3 }, { id: "y", at: 6, kind: "incident", title: "Outage", body: "b", by: "Bo" }] });
const pins = [...document.querySelectorAll<HTMLButtonElement>(".atl__pin")];
assert.equal(pins.length, 2); assert.deepEqual(pins.map((p) => p.tabIndex), [0, -1], "Pins share one tab stop");
await act(async () => { pins[0].focus(); });
assert.match(document.querySelector(".atl__note")!.textContent!, /New checkout.*\+1\.00 pts over the next 3 days/, "Focusing a pin opens its note with the measured change");
await key(pins[0], "ArrowRight");
assert.equal(document.activeElement, pins[1], "Arrow keys move between pins");
await click(".atl__filter--incident");
assert.equal(document.querySelectorAll(".atl__pin").length, 1, "Filters hide a kind");
await clear();

// Map
const sun = load(`${R}/maps/daylight-atlas/sun.ts`, "*");
assert(Math.abs(sun.subsolar(Date.UTC(2026, 5, 21, 12)).lat - 23.44) < 0.3, "The sun is over the Tropic of Cancer at the June solstice");
assert(Math.abs(sun.subsolar(Date.UTC(2026, 2, 20, 12)).lat) < 0.6, "And over the equator at the March equinox");
const noon = sun.subsolar(Date.UTC(2026, 9, 13, 12));
assert(Math.abs(noon.lon) < 5, "At 12:00 UTC the sun is near the Greenwich meridian");
assert(Math.abs(sun.altitude(noon.lat, noon.lon, noon) - 90) < 1e-6, "It stands straight overhead at the subsolar point");
assert(Math.abs(sun.altitude(sun.terminator(60, noon), 60, noon)) < 1e-6, "The terminator is where the sun sits on the horizon");
assert.equal(sun.clock(Date.UTC(2026, 0, 1, 23, 30), 5.5), "05:00"); assert.equal(sun.light(10), 1); assert.equal(sun.light(-20), 0);
const DA = load(`${R}/maps/daylight-atlas/DaylightAtlas.tsx`, "DaylightAtlas", { "./sun": sun, "../route-globe/land": load(`${R}/maps/route-globe/land.ts`, "*") });
await mount(DA, { start: Date.UTC(2026, 9, 13, 10), people: [{ name: "Ana B", city: "Lisbon", lon: -9, lat: 38.7, offset: 1 }, { name: "Kei T", city: "Osaka", lon: 135.5, lat: 34.7, offset: 9 }] });
assert.match(document.querySelector(".dlat__sub")!.textContent!, /^1 of 2 in working hours/, "Working hours come from each local clock");
assert.deepEqual([...document.querySelectorAll(".dlat__time")].map((n) => n.textContent), ["11:00", "19:00"]);
await clear();

// Micro
const Lock = load(`${R}/micro/shackle-lock/ShackleLock.tsx`, "ShackleLock");
await mount(Lock, { name: "Private board" });
assert.equal(document.querySelector('[role="switch"]')!.getAttribute("aria-checked"), "true");
await click('[role="switch"]');
assert.equal(document.querySelector('[role="switch"]')!.getAttribute("aria-checked"), "false"); assert.equal(document.querySelector(".slock")!.getAttribute("data-beat"), "open");
await clear();
const Pin = load(`${R}/micro/pin-drop/PinDrop.tsx`, "PinDrop");
await mount(Pin, { place: "Café Ondina", list: "Lisbon" });
await click(".pdrop__btn");
assert.equal(document.querySelector(".pdrop__btn")!.getAttribute("aria-pressed"), "true"); assert.equal(document.querySelector(".pdrop__sr")!.textContent, "Café Ondina saved to Lisbon");
await click(".pdrop__btn");
assert.equal(document.querySelector(".pdrop__sr")!.textContent, "Café Ondina removed from Lisbon");
await clear();

// Sidebar
const spy = load(`${R}/sidebars/chapter-rail/spy.ts`, "*");
assert.deepEqual(spy.spy([0, 100, 300], 200, 400), { index: 1, frac: 0.5 }); assert.deepEqual(spy.spy([50, 100], 10, 400), { index: 0, frac: 0 });
assert.deepEqual(spy.fills(4, { index: 2, frac: 0.25 }), [1, 1, 0.25, 0]); assert.equal(spy.progress([1, 0.5]), 0.75);
assert.deepEqual(spy.marks("Rate limits", "lim"), [{ text: "Rate ", hit: false }, { text: "lim", hit: true }, { text: "its", hit: false }]);
const Rail = load(`${R}/sidebars/chapter-rail/ChapterRail.tsx`, "ChapterRail", { "./spy": spy });
await mount(Rail, { name: "Docs", chapters: [{ id: "a", title: "Start", icon: null, sections: [{ id: "s1", title: "Install" }, { id: "s2", title: "Rate limits" }] }, { id: "b", title: "API", icon: null, sections: [{ id: "s3", title: "Queue" }] }] });
await input(".crail__filter input", "rate");
assert.deepEqual([...document.querySelectorAll(".crail__pages a")].map((a) => a.textContent), ["Rate limits"], "Filtering narrows the pages");
assert.equal(document.querySelector(".crail__pages mark")!.textContent, "Rate");
await input(".crail__filter input", "zzz");
assert.match(document.querySelector(".crail__none")!.textContent!, /No pages match/);
await click(".crail__fold");
assert(document.querySelector(".crail")!.classList.contains("is-collapsed")); assert.equal(document.querySelector(".crail__fold")!.getAttribute("aria-expanded"), "false");
await clear();

// Pricing
const billMod = load(`${R}/pricing/till-receipt/bill.ts`, "*");
const PL = [{ id: "s", name: "Studio", blurb: "", seat: 1900, included: 2 }], AD = [{ id: "x", name: "Storage", price: 800 }, { id: "y", name: "Support", price: 300, perSeat: true }];
const b1 = billMod.bill({ plan: "s", seats: 3, addons: ["x"], annual: true }, PL, AD);
assert.deepEqual([b1.subtotal, b1.discount, b1.total, b1.yearly], [6500, 1300, 5200, 62400]);
const b2 = billMod.bill({ plan: "s", seats: 1, addons: ["y"], annual: false }, PL, AD);
assert.equal(b2.seats, 2, "Seats never go under the plan's minimum"); assert.equal(b2.total, 4400); assert.equal(b2.yearly, null);
assert.equal(billMod.money(123456), "£1,234.56"); assert.equal(billMod.money(-1300), "−£13.00");
const Till = load(`${R}/pricing/till-receipt/TillReceipt.tsx`, "TillReceipt", { "./bill": billMod });
await mount(Till, { shop: "Proofline", plans: [{ id: "a", name: "Solo", blurb: "", seat: 900, included: 1 }, ...PL], addons: AD });
assert.match(document.querySelector(".till__total")!.textContent!, /£52\.00/, "Starts on the second plan with three seats, the first add-on and yearly billing");
await click('.till__billing [aria-checked="false"]');
assert.match(document.querySelector(".till__total")!.textContent!, /£65\.00/); assert.equal(document.querySelector(".till__save"), null, "Monthly billing drops the saving");
await click('.till__stepper button[aria-label="One seat more"]');
assert.match(document.querySelector(".till__total")!.textContent!, /£84\.00/);
await clear();

// Sections
const weave = load(`${R}/sections/loom-breaker/weave.ts`, "*");
assert.equal(weave.over("plain", 0, 0), true); assert.equal(weave.over("plain", 1, 0), false);
assert.deepEqual([0, 1, 2, 3].map((i) => weave.over("twill", i, 0)), [true, true, false, false]); assert.deepEqual([0, 1, 2, 3].map((i) => weave.over("twill", i, 1)), [false, true, true, false], "Twill steps along one each row");
const lm = weave.loom(300, 132, "plain", 30, 4);
assert.equal(lm.wefts.length, 4); assert.equal(lm.warps.length, 11); assert(lm.overs.length > 0 && lm.overs.length < lm.warps.length * 4);
const sky = load(`${R}/sections/arcade-breaker/sky.ts`, "*");
assert.deepEqual(sky.skyAt(0.5), { top: "#3d8fe0", bottom: "#cfe8fb", sun: "#fff4d6" }, "Noon is blue");
assert.equal(sky.travel(1000, 200, 1000), 0); assert.equal(sky.travel(-200, 200, 1000), 1);
const ar = sky.arches(1200, 250);
assert.equal(ar.length, 7); assert(ar[3].mid && ar[3].w > ar[0].w && ar[3].top < ar[0].top, "The middle arch is wider and taller");
assert.equal(sky.arches(400, 200).length, 3);
const seamMod = load(`${R}/sections/pixel-seam/seam.ts`, "*");
const cells = seamMod.seam(40, 6, 2);
const perRow = (r: number) => cells.filter((q: any) => q.r === r).length;
assert(perRow(5) > perRow(2) && perRow(2) > perRow(0), "Seams thicken towards the section");
assert.deepEqual(cells, seamMod.seam(40, 6, 2), "The same seed gives the same seam");
assert.equal(seamMod.countAt(100, 1), 100); assert.equal(seamMod.countAt(100, 0), 0);
const SECTIONS = [
  ["loom-breaker/LoomBreaker.tsx", "LoomBreaker", { "./weave": weave }],
  ["arcade-breaker/ArcadeBreaker.tsx", "ArcadeBreaker", { "./sky": sky }],
  ["pixel-seam/PixelSeam.tsx", "PixelSeam", { "./seam": seamMod }],
] as const;
for (const [file, name, deps] of SECTIONS) {
  await mount(load(`${R}/sections/${file}`, name, deps), { title: "Woven to order", lead: "Lead", primary: { label: "Start", href: "#s" }, secondary: { label: "More", href: "#m" }, points: ["One"], stats: [{ value: 12, label: "teams" }] });
  const sec = document.querySelector("section")!;
  assert.equal(document.getElementById(sec.getAttribute("aria-labelledby")!)!.textContent, "Woven to order", `${name} is labelled by its title`);
  assert.deepEqual([...sec.querySelectorAll("a")].map((a) => a.getAttribute("href")), ["#s", "#m"]);
  assert(sec.querySelector('[aria-hidden="true"] svg, svg[aria-hidden="true"]'), `${name} decoration is hidden`);
  await clear();
}
}


// Batch: domino/yarn/bunting/clockwork/zen buttons, torn/tape/topo/bead sections, memory drawer, thread map, deck FAQ, summit + bubble stats, story reel.
{
const R = "src/registry";
const wait = (ms: number) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const keyOn = async (el: Element, k: string) => { await act(async () => { el.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: k, bubbles: true })); }); };
const B = `${R}/buttons`;

// Buttons
const dper = load(`${B}/domino-run/perimeter.ts`, "*");
const dom2 = load(`${B}/domino-run/domino.ts`, "*", { "./perimeter": dper });
const ring = dom2.ring(200, 54, 27, 30, 1, 11);
assert.equal(ring.length, Math.floor(dper.length(200, 54, 27) / 11)); assert.equal(Math.round(ring[0].angle), 0, "Tiles on the top edge stand straight up");
assert(Math.abs(dom2.lean(11, 15) - 47.17) < 0.1, "A tile leans on the next at asin(spacing / height)");
const ch = dom2.chain(10);
assert.equal(ch[0], 0); assert(ch[2] - ch[1] < ch[1] - ch[0], "The chain speeds up as it goes");
const yper = load(`${B}/yarn-wrap/perimeter.ts`, "*");
const yarn = load(`${B}/yarn-wrap/yarn.ts`, "*", { "./perimeter": yper });
const coil = yarn.coil(200, 54, 27, 0, 1);
const lens = yarn.lengths(coil);
assert(lens[lens.length - 1] > yper.length(200, 54, 27) * 2.3, "The coil runs more than 2.3 laps, wider than the edge");
const mid = yarn.along(coil, lens, lens[lens.length - 1] / 2);
assert(Number.isFinite(mid.x) && Number.isFinite(mid.angle));
const flags = load(`${B}/bunting/flags.ts`, "*");
const hang = flags.line(0, 200, -40, 12, 20);
assert.equal(hang.length, 10);
const mids = hang.reduce((a: any, b: any) => (Math.abs(b.x - 100) < Math.abs(a.x - 100) ? b : a));
assert(mids.y > hang[0].y && Math.abs(mids.slope) < Math.abs(hang[0].slope), "The line sags lowest and flattest in the middle");
const sw = { a: 20, v: 0 };
for (let i = 0; i < 600; i++) flags.swing(sw, 1 / 60);
assert(Math.abs(sw.a) < 0.5, "Flags settle");
const gears = load(`${B}/clockwork-edge/gears.ts`, "*");
const train = gears.chain([14, 9, 12], 2, 0, (R0: number) => -R0 * 0.1);
assert(Math.abs(Math.hypot(train[1].x - train[0].x, train[1].y - train[0].y) - (train[0].R + train[1].R)) < 1e-9, "Neighbours sit pitch circle to pitch circle");
assert(Math.abs(train[1].k + 14 / 9) < 1e-9 && Math.abs(train[2].k - 14 / 12) < 1e-9, "They turn opposite ways at the ratio of their teeth");
for (const phi of [0, 0.7, 2.3]) {
  // where two gears meet, a tooth of one faces a gap of the other
  const a = Math.atan2(train[1].y - train[0].y, train[1].x - train[0].x);
  const t0 = ((a - gears.turn(train[0], phi)) / ((2 * Math.PI) / 14)) % 1, t1 = ((a + Math.PI - gears.turn(train[1], phi)) / ((2 * Math.PI) / 9)) % 1;
  const frac = (x: number) => ((x % 1) + 1) % 1;
  assert(Math.abs(frac(t0 + t1) - 0.5) < 1e-6, "Teeth mesh with gaps at every angle");
}
assert(gears.gearPath(10, 2).includes("Z M"), "Gears have a hub hole");
const zper = load(`${B}/zen-rake/perimeter.ts`, "*");
const rake = load(`${B}/zen-rake/rake.ts`, "*", { "./perimeter": zper });
const gv = rake.groove(200, 54, 27, 11, 80);
assert(gv.every((p: any) => { const s = zper.pointAt(200, 54, 27, p.s); return Math.abs(Math.hypot(p.x - s.x, p.y - s.y) - 11) < 1e-6; }), "A groove keeps its distance from the stone");
const bent = rake.bend({ x: 10, y: 0 }, { x: 0, y: 0 }, 20, 5);
assert(bent.x > 10 && bent.y === 0, "Lines part away from what's in them");
const Lz = zper.length(200, 54, 27);
assert.equal(rake.raked(Lz / 4, 0, Lz, 0.4), false); assert.equal(rake.raked(Lz / 4, 0, Lz, 0.6), true);
for (const [dir, file, name, deps] of [
  ["domino-run", "DominoRun.tsx", "DominoRun", { "./domino": dom2, "./perimeter": dper }],
  ["yarn-wrap", "YarnWrap.tsx", "YarnWrap", { "./yarn": yarn, "./perimeter": yper }],
  ["bunting", "Bunting.tsx", "Bunting", { "./flags": flags }],
  ["clockwork-edge", "ClockworkEdge.tsx", "ClockworkEdge", { "./gears": gears }],
  ["zen-rake", "ZenRake.tsx", "ZenRake", { "./rake": rake, "./perimeter": zper }],
] as const) {
  await mount(load(`${B}/${dir}/${file}`, name, deps), { children: "Go on" });
  assert.equal(document.querySelector("button")!.textContent, "Go on", `${name} keeps its label`);
  assert(document.querySelector('[aria-hidden="true"]'), `${name} decoration is hidden`);
  await clear();
}

// Sections
const S = `${R}/sections`;
const tearMod = load(`${S}/torn-paper/tear.ts`, "*");
const edge = tearMod.tear(400, 30, 40, 3);
assert.equal(edge.length, 101); assert.equal(edge[100].x, 400); assert.deepEqual(edge, tearMod.tear(400, 30, 40, 3), "The same seed tears the same way");
assert(edge.some((p: any) => p.y !== edge[0].y), "A tear is ragged");
const tape = load(`${S}/crossed-tapes/tape.ts`, "*");
assert.equal(tape.wrap(-30, 100), 70); assert.equal(tape.wrap(250, 100), 50);
assert.equal(tape.pace(46, 0), 46); assert.equal(tape.pace(46, 10000), 230, "Scrolling speeds the tapes up to five times");
assert(Math.abs(tape.settle(100, 0.25) - 50) < 1e-9);
const topo = load(`${S}/topo-contours/topo.ts`, "*");
const f = new Float32Array([0, 0, 1, 1]); // a 1 × 1 cell rising to the bottom edge
assert.deepEqual(topo.march(f, 1, 1, 10, 0.5), [[0, 5, 10, 5]], "The 0.5 contour crosses half way down");
const hillField = topo.field(10, 6, 10, 2, [{ x: 50, y: 30, r: 20, h: 1 }]), flat = topo.field(10, 6, 10, 2);
assert(hillField[3 * 11 + 5] > flat[3 * 11 + 5] + 0.9, "Hills raise the ground under them");
assert(topo.levels(flat, 0.05).every((l: number, i: number, a: number[]) => i === 0 || l > a[i - 1]));
const beads = load(`${S}/bead-curtain/beads.ts`, "*");
const st = beads.strand(50, 8, 13);
for (let i = 0; i < 200; i++) beads.step(st, 1 / 60);
assert(st.beads.every((b: any, i: number) => i === 0 || Math.abs(Math.hypot(b.x - st.beads[i - 1].x, b.y - st.beads[i - 1].y) - 13) < 0.5), "Links hold their length");
beads.step(st, 1 / 60, 900, 0.98, { x: 50, y: 60, r: 30 });
assert(st.beads.every((b: any) => Math.hypot(b.x - 50, b.y - 60) >= 29.5), "Beads are pushed out of the pointer");
assert(beads.lengthAt(500, 1000) < beads.lengthAt(0, 1000), "The curtain parts in the middle");
for (const [dir, file, name, deps] of [
  ["torn-paper", "TornPaper.tsx", "TornPaper", { "./tear": tearMod }],
  ["crossed-tapes", "CrossedTapes.tsx", "CrossedTapes", { "./tape": tape }],
  ["topo-contours", "TopoContours.tsx", "TopoContours", { "./topo": topo }],
  ["bead-curtain", "BeadCurtain.tsx", "BeadCurtain", { "./beads": beads }],
] as const) {
  await mount(load(`${S}/${dir}/${file}`, name, deps), { title: "Come in", words: ["Open"], primary: { label: "Book", href: "#b" }, action: { label: "Book", href: "#b" }, stats: [{ value: "12 km", label: "distance" }] });
  const sec = document.querySelector("section")!;
  assert.equal(document.getElementById(sec.getAttribute("aria-labelledby")!)!.textContent, "Come in", `${name} is labelled by its title`);
  assert.equal(sec.querySelector("a")!.getAttribute("href"), "#b");
  await clear();
}

// AI & Chat
const mem = load(`${R}/ai/memory-drawer/memory.ts`, "*");
const s0 = { items: [{ id: "a", topic: "w", text: "One", source: "" }, { id: "b", topic: "p", text: "Two", source: "" }, { id: "c", topic: "w", text: "Three", source: "" }], enabled: true, gone: null };
assert.equal(mem.memories(s0, { type: "edit", id: "a", text: "  " }), s0, "Empty edits are ignored");
const s1 = mem.memories(mem.memories(s0, { type: "pin", id: "c" }), { type: "forget", id: "a" });
assert.deepEqual(s1.items.map((m: any) => m.id), ["b", "c"]);
assert.deepEqual(mem.shown(s1.items, "all").map((m: any) => m.id), ["c", "b"], "Pinned memories come first");
assert.deepEqual(mem.memories(s1, { type: "undo" }).items.map((m: any) => m.id), ["a", "b", "c"], "Undo puts it back where it was");
const Drawer = load(`${R}/ai/memory-drawer/MemoryDrawer.tsx`, "MemoryDrawer", { "./memory": mem });
await mount(Drawer, { initial: s0.items, topics: [{ id: "w", label: "Work" }, { id: "p", label: "People" }] });
await click('.mdraw__card [aria-label="Forget"]');
await wait(700);
assert.match(document.querySelector(".mdraw__sub")!.textContent!, /remembers 2 things/);
assert.match(document.querySelector(".mdraw__toast")!.textContent!, /Forgotten/);
await click(".mdraw__toast button");
assert.match(document.querySelector(".mdraw__sub")!.textContent!, /remembers 3 things/, "Undo brings it back");
await click('[role="switch"]');
assert.equal(document.querySelector('[role="switch"]')!.getAttribute("aria-checked"), "false"); assert.equal(document.querySelector<HTMLButtonElement>('.mdraw__card [aria-label="Edit"]')!.disabled, true, "Paused memory can't be edited");
await clear();
const tmap = load(`${R}/ai/thread-map/map.ts`, "*");
assert.deepEqual(tmap.ticks([0, 100], [100, 300], 400, 200), [{ y: 0, h: 48 }, { y: 50, h: 148 }]);
assert.deepEqual(tmap.view(200, 100, 400, 200), { y: 100, h: 50 });
assert.equal(tmap.scrollFor(100, 200, 100, 400), 150);
assert.deepEqual(tmap.search([{ id: "1", role: "user", text: "Storms" }, { id: "2", role: "assistant", text: "x", code: "storm()" }, { id: "3", role: "user", text: "sun" }], "STORM"), [0, 1]);
assert.equal(tmap.current([0, 100, 200], 120, 90), 1);
(dom.window.HTMLElement.prototype as any).scrollTo ??= function (this: HTMLElement, o: ScrollToOptions) { this.scrollTop = o.top ?? 0; };
const Map2 = load(`${R}/ai/thread-map/ThreadMap.tsx`, "ThreadMap", { "./map": tmap });
await mount(Map2, { title: "Chat", turns: [{ id: "1", role: "user", text: "About storms" }, { id: "2", role: "assistant", text: "Storm rules", tool: "Read file" }, { id: "3", role: "user", text: "Thanks" }] });
await input(".tmap__find input", "storm");
assert.equal(document.querySelector(".tmap__count")!.textContent, "1 of 2"); assert.equal(document.querySelectorAll(".tmap mark").length, 2);
assert.equal(document.querySelectorAll('.tmap__turn[data-hit]').length, 2, "Matching turns are marked");
await clear();

// FAQ
const deck = load(`${R}/faq/deck-faq/deck.ts`, "*");
const cards = [{ id: "a", topic: "", q: "A?", a: "a" }, { id: "b", topic: "", q: "B?", a: "b" }, { id: "c", topic: "", q: "C?", a: "c" }];
let dk = deck.start(cards);
dk = deck.judge(dk, "skip"); assert.deepEqual(dk.queue, ["b", "c", "a"], "Skipped cards go to the back");
dk = deck.judge(deck.judge(dk, "helpful"), "unclear");
assert.deepEqual([dk.queue, dk.helped, dk.unclear], [["a"], ["b"], ["c"]]); assert.equal(deck.answered(dk), 2);
assert.equal(deck.judge(dk, "skip"), dk, "The last card can't be skipped");
assert.equal(deck.release(130), "helpful"); assert.equal(deck.release(-130), "unclear"); assert.equal(deck.release(40), null);
const Deck = load(`${R}/faq/deck-faq/DeckFaq.tsx`, "DeckFaq", { "./deck": deck });
await mount(Deck, { cards, support: { label: "Ask support", href: "#s" } });
const topCard = () => document.querySelector('.dfaq__card[data-depth="0"]')!;
assert.match(topCard().getAttribute("aria-label")!, /^Question 1 of 3: A\?/);
await keyOn(topCard(), " ");
assert(topCard().hasAttribute("data-flipped"), "Space turns the card over");
await keyOn(topCard(), "ArrowRight"); await wait(400);
assert.match(document.querySelector(".dfaq__progress")!.textContent!, /^1 of 3 answered/);
await keyOn(topCard(), "ArrowLeft"); await wait(400);
await click(".dfaq__btn--yes"); await wait(400);
assert.match(document.querySelector(".dfaq__end")!.textContent!, /didn.t quite help:B\?Ask support/, "The last card lists what didn't help");
await clear();

// Stats
const summit = load(`${R}/stats/summit-stats/summit.ts`, "*");
const rg = summit.ridge(40, 3);
assert.deepEqual([rg[0].x, rg[0].y, rg[40].x, rg[40].y], [0, 0, 1, 1]); assert(rg.slice(0, -1).every((p: any) => p.y <= 0.97), "Nothing outclimbs the summit");
assert(Math.abs(summit.heightAt(rg, 0.5) - (rg[20].y)) < 1e-9);
assert.equal(summit.progress(300, 200), 1); assert.equal(summit.progress(50, 200), 0.25);
assert.equal(summit.upTo(rg, 0.5).at(-1).x, 0.5);
const Summit = load(`${R}/stats/summit-stats/SummitStats.tsx`, "SummitStats", { "./summit": summit });
await mount(Summit, { title: "Raised", value: 150, goal: 200, checkpoints: [{ at: 50, label: "Pledges", date: "Feb" }, { at: 180, label: "Steel", date: "Next" }] });
assert.equal(document.querySelectorAll(".summit__flag.is-passed").length, 1, "Passed milestones are filled");
await act(async () => { document.querySelector<HTMLButtonElement>(".summit__hit")!.focus(); });
assert.match(document.querySelector('[role="tooltip"]')!.textContent!, /50Pledges/, "Focusing a flag reads it");
await clear();
const pack = load(`${R}/stats/bubble-pack/pack.ts`, "*");
const rs = pack.radii([4, 1], 100, 100, 0.5);
assert(Math.abs(rs[0] / rs[1] - 2) < 1e-9, "Radius follows the square root of the share");
const nodes = pack.seed(pack.radii([40, 25, 15, 10, 6, 4], 400, 300), 200, 150);
for (let i = 0; i < 300; i++) pack.relax(nodes, 200, 150, 400, 300);
assert(pack.overlap(nodes) < 0.5, "Settled bubbles don't overlap");
assert(nodes.every((n: any) => n.x >= n.r - 1e-6 && n.x <= 400 - n.r + 1e-6), "They stay inside the field");
const Pack = load(`${R}/stats/bubble-pack/BubblePack.tsx`, "BubblePack", { "./pack": pack });
await mount(Pack, { title: "Sources", items: [{ label: "Search", value: 60 }, { label: "Direct", value: 40 }] });
assert.equal(document.querySelectorAll(".bpack__row").length, 2); assert.equal(document.querySelector(".bpack__row")!.getAttribute("aria-label"), "Search: 60, 60%");
await act(async () => { document.querySelectorAll<HTMLButtonElement>(".bpack__row")[1].focus(); });
assert(document.querySelectorAll(".bpack__row")[1].hasAttribute("data-hot"), "Focusing a row highlights its share");
await clear();

// Media
const reel = load(`${R}/media/story-reel/reel.ts`, "*");
const counts = [2, 1];
assert.deepEqual(reel.tick({ p: 0, s: 0, t: 0.5 }, 1, counts, 5), { p: 0, s: 0, t: 0.7 });
assert.deepEqual(reel.tick({ p: 0, s: 1, t: 0.95 }, 1, counts, 5), { p: 1, s: 0, t: 0 }, "The last story hands over to the next person");
assert.deepEqual(reel.next({ p: 1, s: 0, t: 0.2 }, counts), { p: 0, s: 0, t: 0 }, "and loops round");
assert.deepEqual(reel.prev({ p: 0, s: 1, t: 0.5 }, counts), { p: 0, s: 1, t: 0 }, "Back restarts a story you're into");
assert.deepEqual(reel.prev({ p: 1, s: 0, t: 0 }, counts), { p: 0, s: 1, t: 0 });
assert.deepEqual(reel.bars({ p: 0, s: 1, t: 0.4 }, 3), [1, 0.4, 0]);
const Reel = load(`${R}/media/story-reel/StoryReel.tsx`, "StoryReel", { "./reel": reel, "./scenes": load(`${R}/media/story-reel/scenes.tsx`, "*") });
await mount(Reel, { people: [{ name: "Mira O", colors: ["#f2786a", "#7a3cc9"], stories: [{ id: "a", kind: "dawn", caption: "First", ago: "2h" }, { id: "b", kind: "type", caption: "Second", quote: "Q", ago: "1h" }] }, { name: "Theo R", colors: ["#2f6fd1", "#1b2a66"], stories: [{ id: "c", kind: "sea", caption: "Third", ago: "1h" }] }] });
const frame = () => document.querySelector(".sreel__frame")!;
assert.match(frame().getAttribute("aria-label")!, /^Mira O, story 1 of 2: First/);
await keyOn(frame(), "ArrowRight");
assert.match(frame().getAttribute("aria-label")!, /story 2 of 2: Second/);
await keyOn(frame(), "ArrowDown");
assert.match(frame().getAttribute("aria-label")!, /^Theo R, story 1 of 1: Third/, "Down moves to the next person");
assert(document.querySelector('.sreel__people button[data-seen]'), "People you've watched are marked seen");
await keyOn(frame(), " ");
assert(frame().hasAttribute("data-paused"), "Space pauses");
await clear();
}


console.log("new components: domino chain/yarn coil/bunting sag/gear mesh/rake grooves, tear/tape loop/marching squares/bead links, memory forget+undo+pause, thread map ticks/search, deck FAQ queue/flip/keys, summit ridge/milestones, bubble packing, story reel steps/people/pause, koi/snow/arc/sticker/moth/ruler buttons + rim fallback, click cursors spray/step/charge, period overlay axis/morph/keyboard, latency percentiles/regions/keyboard select, timeline lanes/impact/pins, daylight sun/terminator/clocks, shackle + pin drop toggles, chapter rail spy/filter/fold, till receipt bill/totals, loom/arcade/pixel seam layouts, edge buttons perimeter/gait/bloom order/sky/bubbles/notes, field button+cta fallback/focus, auth batch provider failure+retry/email reveal/domain routing/handle suggestions/revoke rollback/saved gate, bento batch count/compact/unfold focus+escape/lean/heat weeks/funnel, backgrounds batch fallbacks/fade, tile breaker labels/links/points/blur/motif, echo bar compact/digit keys/reconcile/coalesce/rollback/menus/shortcuts, source sweep order/counts/groups, activity glyph endings, lumen state dots, thought dots designs, globe search projection/pings/results, lumen gaze/spring/seeds/labels, outcome flicker steps/play/options/summary, trend tape rate/bug keys/feed/vector/pause, plan gate review/gates/deny-replan/retry/take over/receipt, mixed inspector spread/slices/keyboard select/label cycle/partial failure/retry, sentence rewrite/menus, split suggestions/apply, stacked ladder/fold/send, dial rings/detents/send, canvas dock/swap/send, receipt inference/override/approve, composer modes/models/effort/send/stop, model roster switches/last-on guard/search/add, terminal parsing/completion/history/clear, mega nav keyboard/escape/outside click passed");
console.log("new components: source sweep order/counts/groups, activity glyph endings, lumen state dots, thought dots designs, globe search projection/pings/results, lumen gaze/spring/seeds/labels, outcome flicker steps/play/options/summary, trend tape rate/bug keys/feed/vector/pause, plan gate review/gates/deny-replan/retry/take over/receipt, mixed inspector spread/slices/keyboard select/label cycle/partial failure/retry, sentence rewrite/menus, split suggestions/apply, stacked ladder/fold/send, dial rings/detents/send, canvas dock/swap/send, receipt inference/override/approve, composer modes/models/effort/send/stop, model roster switches/last-on guard/search/add, terminal parsing/completion/history/clear, mega nav keyboard/escape/outside click passed");

await act(async () => root.unmount()); dom.window.close();
console.log("interactions: auth delivery, cancellation/network failure, retry, success, and resend failure, prompt/theme selection, history, keyboard controls and mobile navigation passed");
