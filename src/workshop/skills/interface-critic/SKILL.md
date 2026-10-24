---
name: interface-critic
description: Critique an interface or component idea against Vitrine's quality bar (familiar job, new physics, meaningful motion, static quality, restraint) and the anti-gimmick list, then give a keep / refine / cut verdict with reasons. Use when reviewing a design, a screenshot, a component, or a list of ideas before building them.
---

# /interface-critic

You are reviewing work, not praising it. The goal is a clear verdict and the reasons for it. Most ideas should not survive; the ones that do should get better.

## What to review

Whatever you're given: a screenshot, a running page, code, or a list of ideas. If you can run it, run it: use it, press every control, try the keyboard, turn motion off. Judge what it does, not what its description claims.

## The test

Answer each question with **yes**, **no** or **partly**, and one sentence of evidence. Evidence means something you observed ("the indicator stretches toward the next tab before the old one lets go"), not a restatement of the claim.

1. **Familiar job.** Would someone understand, immediately, what problem this solves? Tabs, a form, a list, a price, a save state.
2. **New physics.** Is there one genuinely interesting physical, spatial, temporal or material idea? Not a new colour or a new easing curve.
3. **Meaningful motion.** Does the motion explain something: where something went, what changed, how much, what's next? If you removed it, would information be lost?
4. **Single idea.** Can you describe it in one sentence without "and also"?
5. **Restraint.** Is anything there that doesn't serve the idea? Name it.
6. **Useful.** Could it ship in a real product this week, with real data, at 375px wide, for a keyboard user?
7. **Independent.** Does it have its own concept, or is it a copy of a well-known product's look ("Apple-style", "like ChatGPT")?
8. **Static quality.** Take a screenshot with motion off. Is it still beautiful and still readable?

## The anti-gimmick list

Name it if it's any of these. Any one of them, with nothing meaningful underneath, is a cut:

- cursor-following glow, spotlight or tilt on a card
- blur, glass or grain as the whole idea
- gradient backgrounds carrying the design
- magnetic buttons that pull toward the cursor for no reason
- text scrambling or typewriter reveals
- 3D for its own sake: flips, parallax stacks, rotating objects
- particles, confetti, sparkles
- animation layered on an ordinary component: the same card, now bouncing
- a style borrowed without its concept ("Apple-style", "AI-style")

A useful test: **remove the effect.** If nothing meaningful remains, it's a gimmick.

## Reviewing a whole page

The test above is for a component or an idea. For a whole page, review these, each with evidence from a screenshot at phone and desktop width:

1. **Hierarchy.** What's seen first, second, third? Is that the right order?
2. **Composition.** Do the parts relate, or are they placed side by side? Is there a deliberate balance?
3. **Density.** Too crowded anywhere? Too empty anywhere? Does density change for a reason?
4. **Alignment.** Do headings, text and images share edges? Is any misalignment deliberate?
5. **Repetition.** How many sections share one shape? Repetition is good for scanning and bad when nothing breaks it.
6. **Product prominence.** Is the thing the site exists for (the product, the work, the content) the most visible thing?
7. **Distinctiveness.** What here couldn't appear on a competitor's site? (`/template-tells` goes deeper.)
8. **Responsive composition.** Is the phone layout designed, or the desktop stacked? (`/responsive-art-direction`.)
9. **Decoration.** What could be removed with nothing lost?

## Diagnose first. Change second.

Before proposing any change, return **the top three problems, ranked by impact**, each pointing at something visible. Only then propose fixes, and only for those three. A review that opens with a redesign skips the step that tells you whether a redesign is needed. When the page is close, hand the fixes to `/refinement-pass`.

## Compare against a strong reference

Hold it next to one excellent piece in the same family: for a control, a segmented control whose indicator behaves like liquid mercury (it stretches toward the target and settles, so motion shows direction and distance). Ask: is this as clear, as restrained and as useful? Say where it falls short.

## Verdict

End with exactly one of:

- **Keep.** It passes. Note one thing that would make it better.
- **Refine.** The idea is right; the execution isn't. List the specific changes, in order of impact (for example "the lid overshoots and flares into a trapezoid; recede it instead", "labels overlap the ribbon on phones; move them above the strip").
- **Cut.** Say which test it fails and why that can't be fixed without changing the idea. If there's a better idea hiding in it, name it.

When reviewing several ideas, rank them and say which to build first. It's fine, and normal, to cut most of them.

## Tone

Direct and specific. No hedging, no compliments before the point. Every criticism points at something you can see, and every recommendation is something someone can do.

## Don't use when

- There's nothing to look at yet. An idea in one sentence can be judged; a vague direction can't. Write it down first.
- You need a defect check (overflow, focus, contrast). Use `/responsive-audit` or `/accessibility-pass`.
- The user wants it built, not judged. Say what you'd check, then build.

## Acceptance criteria

- Every test answer has observed evidence, not a restated claim.
- For a page, the top three problems are ranked by impact before any fix is proposed.
- The review ends with exactly one verdict (keep, refine or cut), or a ranked list when reviewing several ideas.

## Final self-review

- Did I run it, or only read about it?
- Is every criticism something you can point at?
- Did I rank the problems before suggesting changes?
- Would my fixes keep what already works?

