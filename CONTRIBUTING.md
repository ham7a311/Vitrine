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
