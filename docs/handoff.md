# Mathtudy - Project Handoff Document

> **Date**: 2026-10-29  
> **Repository**: [mathtudy](https://github.com/lelalela/mathtudy) (`main` branch)  
> **Latest Commit**: [`346ea7e`](https://github.com/lelalela/mathtudy/commit/346ea7e) (`feat(drill): move AI tutor to post-submission and enhance systems of equations hints`)  
> **Server Status**: `home-server:8980` (Docker container `mathtudy` running, HTTP 200 OK)

---

## 1. Project Overview & Core Philosophy

**Mathtudy** is a 100% DB-less, Local-First, PWA-enabled math drill and learning web application built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS**, and **KaTeX**.

- **100% DB-less & Local-First**: No external database or server state. User progress, streaks, mastery, scratchpad status, and API keys are stored in browser `localStorage`.
- **Algorithmic Generators**: Problems are dynamically generated on the client in sub-milliseconds using deterministic seed/unique ID algorithms (`src/lib/generators/*`).
- **LaTeX Math Rendering**: Rendered via KaTeX (`MathRenderer.tsx`) with hydration suppression for SSR safety.
- **Design System**: Material Design 3 (MD3) Dark Mode aesthetic.

---

## 2. Recent Key Accomplishments & Context

### A. Transparent Scratchpad Overlay (`src/components/ui/ScratchpadOverlay.tsx`)
- Canvas drawing tool with Pen, Eraser, Clear, Undo, Close, and **Pointer Mode** (draw off / pass-through clicks to underlying cards).
- **Dimmed Backdrop Customization**:
  - Located at [ScratchpadOverlay.tsx line 124](file:///home/yjnoh/orca/projects/mathtudy/src/components/ui/ScratchpadOverlay.tsx#L124):
    `className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2.5px] ..."`
  - User may adjust the `bg-black/65` opacity or `backdrop-blur-[2.5px]` blur level for visibility tuning.
- Multi-touch handling, window resize stroke scaling, and localStorage cleanup per problem.

### B. Gemini AI Tutor (`src/components/drill/AiTutorPanel.tsx`, `src/lib/gemini.ts`)
- **API Key Storage**: Client-side only (`localStorage.getItem('gemini_api_key')`).
- **Model Fallback Chain**: Calls `gemini-3.5-flash-lite` first; automatically falls back to `gemini-3.8-flash` if rate-limited or unavailable.
- **Placement & Flow (Moved Post-Submission)**:
  - **Before submission**: Only the `[💡 힌트 보기]` button is displayed, ensuring students attempt to solve on their own.
  - **After submission**: The `[✨ Gemini AI 과외 선생님 추가 해설 듣기]` toggle button is displayed below `StepSolution`.
  - Default mode opens directly into `'full'` (정답 & 완벽 풀이) mode.

### C. Enhanced Systems of Linear Equations Hints (`src/lib/generators/systems-and-roots.ts`)
- Replaced generic hints with a dynamic 4-step actionable guide:
  1. Elimination strategy (eliminate $y$ first).
  2. Coefficient matching (exact multiplier values $mult1, mult2$ dynamically calculated).
  3. Sign checking (whether to add or subtract equations based on coefficients).
  4. Substitution of solved $x$ into original equation to find $y$.

### D. SSR KaTeX Hydration Error Resolution
- Added `suppressHydrationWarning` to:
  - `src/components/ui/MathRenderer.tsx`
  - `src/components/drill/DrillView.tsx`
  - `src/components/drill/MultipleChoice.tsx`
- Cleared stale Turbopack dev caches (`rm -rf .next`).

---

## 3. Important Architecture & Code Conventions

Refer to [AGENTS.md](file:///home/yjnoh/orca/projects/mathtudy/AGENTS.md) and [docs/ARCHITECTURE.md](file:///home/yjnoh/orca/projects/mathtudy/docs/ARCHITECTURE.md) for full guidelines.

1. **Deterministic Unique IDs**:
   - Always use `getUniqueId('prefix')` instead of `Date.now()` or `Math.random()` inside generators to prevent SSR hydration mismatches.
2. **Template Literals vs LaTeX**:
   - Do NOT use LaTeX commands directly inside JS expressions `${...}` (e.g. `` `${u1 \times v1}` `` ❌ -> `` `(${u1} \\times ${v1})` `` ⭕).
3. **React 19 Rule Compliance**:
   - Avoid calling `setState` synchronously within `useEffect` (use async promise chaining or action handlers).
   - Do not mutate refs during render.

---

## 4. Environment & Deployment Workflow

### Local Commands
```bash
pnpm dev       # Run local development server (http://localhost:3000)
pnpm lint      # ESLint 9 verification (0 errors required)
pnpm build     # Next.js 16 production build check
```

### Production Deployment (Home Server)
- **Host**: `home-server`
- **Path**: `/home/lelalela/mathtudy`
- **Port**: `8980` (mapped to container port 3000)
- **Deployment Command**:
  ```bash
  ssh home-server "cd /home/lelalela/mathtudy && git pull origin main && docker compose up -d --build"
  ```
- **Health Check**:
  ```bash
  ssh home-server "curl -I http://localhost:8980"
  ```

---

## 5. Next Session Candidates / Ongoing Tasks

1. **Scratchpad Dimming & Gesture Polish**:
   - Allow user to fine-tune `bg-black/65` and `backdrop-blur-[2.5px]` in `ScratchpadOverlay.tsx` if desired.
   - Test touch drawing on mobile/tablet devices.
2. **Additional Math Topic Hints & Explanations**:
   - Apply the multi-tier hint structure ($strategy \to coefficients \to operation \to substitution$) to other complex generators (e.g., quadratic equations, complex numbers, geometric proofs).
3. **PWA Offline Asset Caching**:
   - Verify Service Worker / Manifest caching for offline font & KaTeX math rendering.

---

## 6. Suggested Skills

The next agent should consider invoking the following skills depending on the task:
- **`frontend-design`**: Use when modifying UI aesthetics, layout refinements, color tokens (MD3), or scratchpad control toolbar styling.
- **`web-design-guidelines`**: Use when reviewing accessibility, touch ergonomics on mobile devices, or contrast ratios in dark mode.
