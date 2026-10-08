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

console.log("new components: source sweep order/counts/groups, activity glyph endings, lumen state dots, thought dots designs, globe search projection/pings/results, lumen gaze/spring/seeds/labels, outcome flicker steps/play/options/summary, trend tape rate/bug keys/feed/vector/pause, plan gate review/gates/deny-replan/retry/take over/receipt, mixed inspector spread/slices/keyboard select/label cycle/partial failure/retry, sentence rewrite/menus, split suggestions/apply, stacked ladder/fold/send, dial rings/detents/send, canvas dock/swap/send, receipt inference/override/approve, composer modes/models/effort/send/stop, model roster switches/last-on guard/search/add, terminal parsing/completion/history/clear, mega nav keyboard/escape/outside click passed");

await act(async () => root.unmount()); dom.window.close();
console.log("interactions: auth delivery, cancellation/network failure, retry, success, and resend failure, prompt/theme selection, history, keyboard controls and mobile navigation passed");
