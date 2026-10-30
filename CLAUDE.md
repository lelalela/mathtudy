# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

The imported AGENTS.md holds the project rules (DB-less philosophy, generator return shape, registration steps, React 19 / LaTeX pitfalls). This file adds what you need beyond that.

## Commands

```bash
pnpm dev     # http://localhost:3000 (Turbopack)
pnpm lint    # ESLint 9 — must pass with 0 errors
pnpm build   # production build (output: 'standalone'); run before declaring work done
```

There is no test framework. Verification = `pnpm lint` + `pnpm build` + checking the page in the browser. After stale Turbopack/hydration weirdness, `rm -rf .next`.

Deployment (home server, Docker, port 8980):
```bash
ssh home-server "cd /home/lelalela/mathtudy && git pull origin main && docker compose up -d --build"
```

## Architecture

Single-page client app. `src/app/page.tsx` is a `'use client'` shell whose whole navigation state lives in URL query params — `?tab=roadmap|lesson|drill|stats`, `&id=<generator or topic id>`, `&modal=...` — so browser Back/Forward works. There are no other routes and no API routes.

**One ID ties three layers together.** A subtopic ID such as `fractions` or `systems-equations` is simultaneously:
1. `GENERATORS[].id` in `src/lib/generators/index.ts` (what DrillView resolves via `getGenerator(id)`),
2. `CURRICULUM_TOPICS[].generatorId` in `src/lib/curriculum-data.ts` (lesson text → "start drill" button; RoadmapView reads mastery by it),
3. the key of `progress.topicMastery` in localStorage (written by `recordProblemResult(generatorId, ...)`).

Renaming an ID silently orphans users' stored mastery, so treat IDs as stable. `topicId` on generators is only the coarse grouping (`arithmetic`, `algebra`, …).

**Generators** (`src/lib/generators/*.ts`) are pure functions returning a `Problem` (`types.ts`). `ProblemStep` also supports optional `why` (intuition) and `pitfall` (common mistake) fields, which `StepSolution` renders — newer generators use them. Shared helpers in `math-utils.ts`: `getUniqueId`, `getRandomInt`, `getRandomNonZeroInt`, `gcd`/`lcm`, `simplifyFraction`, `shuffleArray`, `formatTerm` (signed coefficient/term LaTeX formatting). `correctAnswer` and `choices` are plain comparison strings; `answerDisplayLatex` is what gets rendered.

**Storage** (`src/lib/storage.ts`): an external store over the `mathtudy_user_progress_v1` localStorage key consumed through `useSyncExternalStore` (`useUserProgress()`, with a server snapshot for SSR). Mutations go through `recordProblemResult`, `saveProgress`, `importProgressFromJson`, `exportProgressAsJson` — these notify subscribers. Other localStorage use: the Gemini API key (`src/lib/gemini.ts`) and per-problem scratchpad strokes (`ScratchpadOverlay`).

**Gemini AI tutor** (`src/lib/gemini.ts`, `components/drill/AiTutorPanel.tsx`): called directly from the browser with the user's own key stored in localStorage; model fallback chain `gemini-3.5-flash-lite` → `gemini-3.8-flash`. By design it only appears *after* the answer is submitted (below `StepSolution`); before submission only hints are shown.

**SSR/hydration**: pages are prerendered (`cacheComponents: true` in `next.config.ts`) but problems are random, so KaTeX output and problem cards use `suppressHydrationWarning` (`MathRenderer`, `DrillView`, `MultipleChoice`). Keep that in mind when adding components that render generated content.

## Notes

- Visual style is **Material Design 3 (Material You), dark-first**. For UI work, invoke the `material-3` skill (`.claude/skills/material-3`) and follow MD3 tokens, components and elevation.- `docs/ARCHITECTURE.md` has the full curriculum table (unit → subtopic ID → level); `docs/handoff.md` has recent context and open follow-ups.
- Next.js here is 16.x with breaking changes — check `node_modules/next/dist/docs/` before using Next APIs.
