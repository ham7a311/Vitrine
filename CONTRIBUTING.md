# Contributing to Vitrine

Thanks for helping. Vitrine is a small, deliberate collection, so a good contribution is one well-made component or a real fix, not a pile of variations.

## Licence

Vitrine is MIT licensed (see [LICENSE](./LICENSE)). By opening a pull request you agree that your contribution is licensed under the same MIT licence, and you confirm that:

- you wrote it yourself, or you have the right to submit it under MIT;
- it contains no code, assets or copy copied from another library or a client project;
- any font, image or dependency it uses allows free redistribution.

Please sign off your commits (`git commit -s`) to record this.

## Before you start

Open an issue first for a new component, so we can check it fits the collection: one clear idea, a real purpose, and a point of view that isn't already covered. Bug fixes and accessibility fixes can go straight to a pull request.

## Component rules

- React + TypeScript. Tailwind only where it helps; plain CSS for real keyframes. **No animation libraries.**
- Each component defines its own colours as CSS variables or props. Nothing reads the gallery's tokens.
- Keyboard access, visible focus, `prefers-reduced-motion`, and a touch fallback for anything hover-dependent.
- WebGL/canvas components pause offscreen and in hidden tabs, cap DPR, and fall back gracefully.
- Demo content is fictional. No real people, brands or client names.

## Adding a component

1. Create `src/registry/<category>/<slug>/` with the component, an optional `.css`, a `demo.tsx` (default export, receives `{ variant }`) and a `meta.ts`.
2. In `meta.ts`, write the design `prompt` precisely enough to rebuild the component, plus `interaction`, `animation`, `a11y`, `responsive` and `touchFallback`. Set `source: "original"`.
3. Add `<category>/<slug>` to `src/registry/order.txt`.
4. Run `npm run registry` (regenerates the index and runs the prompt guard).
5. Run `npm run typecheck` and check the component by keyboard, on a phone width and with reduced motion on.

## Pull requests

Keep them focused, describe what changed and why, and include a screenshot or short recording for visual changes. Be kind in reviews; we'll do the same.

## Required checks before a release

Run `npm run release:check` before opening a pull request. This checks every component and variant prompt, workshop briefs, portable examples, CSS namespaces, auth failure/retry flows and the production build. New components must use a unique class prefix; the registry check rejects shared selectors.

The code viewer resolves local imports automatically and presents a flat copyable folder. Keep external dependencies explicit in metadata. Verify the exported usage example with `npm run check:exports`.

Declare all selectable appearances in `meta.variants`. Non-theme variants need a focused prompt for the selected option. Theme-only variants share the main brief, but the final copied prompt always states the selected theme and behavior requirements. Keep prompts synchronized with API and interaction changes. Test both rejection and retry for asynchronous callbacks; simulated services belong in `demo.tsx`.

After starting the production build on port 3147, run `npm run test:routes` and `npm run test:browser`. The browser check needs `npx playwright install chromium`. CI runs these checks for pushes and pull requests.

## Design and demo gate

Before implementation, state the familiar job and one specific design idea, compare it with the nearest existing component, and review a still desktop and mobile composition without colour or effects. Explain what the interaction communicates. Category coverage and component counts do not justify a new entry. Replacements require concept review first.

Demo links must stay inside the preview. Use buttons for local actions, or prevent link navigation and simulate the result locally. Never use internal Vitrine routes as example destinations. The live preview and exported `usage.tsx` both use the portable `DemoBoundary`; run `usage.tsx` to try a copied example safely. The underlying component may accept caller-owned URLs for real applications.
