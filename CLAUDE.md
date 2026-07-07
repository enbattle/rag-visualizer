# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type-check + production build → dist/
npm run preview    # Preview the production build locally
npm run lint       # ESLint on src/ (ts,tsx)
npm run format     # Prettier write on src/
```

Always run `npm run build` and `npm run lint` before finalizing any task.

## Coding Standards

### General Principles

- **Search before writing**: Grep the codebase for existing utilities before implementing anything new. Extend or adapt existing functions rather than duplicating them.
- **Minimal surface area**: Every new function, type, and export is a future maintenance burden. Add only what the task requires; delete what it makes obsolete.
- **Honest naming**: Names should describe what a thing *is* or *does*, not how it came to exist or who calls it. No `handle`, `helper`, `util`, `new`, or `v2` suffixes.
- **No dead code**: Remove commented-out blocks and unused imports immediately — they rot and mislead. Git history preserves anything worth keeping.

### TypeScript

- Strict mode is enabled. Do not suppress type errors with `any`, `// @ts-ignore`, or unsafe casts — fix the type.
- Prefer discriminated unions over boolean flag combinations for variant state.
- Use `as const` on static lookup objects and config (see `src/config.ts`). Derive types from values with `typeof` and `keyof` rather than duplicating them.
- Colocate types with the code they describe (`src/components/algorithm/types.ts` holds the shared demo-data/code-snippet types). Only promote to a shared file when multiple unrelated modules need them.

### React & Components

- **Colocation**: Keep state as close to where it is used as possible. Lift it only when two sibling components genuinely share it.
- **Single responsibility**: Each component does one thing. If a component fetches, transforms, *and* renders, split it.
- **Hooks for logic**: Extract stateful or side-effectful logic into custom hooks (`src/hooks/`). Components should be mostly JSX.
- **Stable references**: Wrap callbacks passed as props in `useCallback` and expensive derived values in `useMemo`.
- **Lazy-load algorithms**: Every algorithm component is `React.lazy`-loaded in `AlgorithmView.tsx`. Follow this pattern when adding a new one.

### Styling

- All colors and surfaces must use the design token variables defined in `src/styles/globals.css` (`--color-bg-primary`, `--color-text-secondary`, etc.) — never hardcode hex values in component styles.
- Dark mode is toggled via the `dark` class on `<html>` (managed by `ThemeContext`). Every new visual element must be tested in both themes.
- Use Tailwind utility classes for layout, spacing, and typography. Reserve inline `style={{}}` for dynamic values not expressible as utilities (e.g., per-algorithm accent colors computed at runtime).

### Error Handling

- Never swallow exceptions silently. Surface them to the nearest `ErrorBoundary` or log them explicitly.
- Only validate at real boundaries (user input, external data). Trust internal module contracts and TypeScript's guarantees elsewhere.

## Testing

There are no automated tests yet. Manually verify changes in the browser with `npm run dev`, covering the golden path and theme toggle for any affected component.

## Architecture

**RAG Visualizer** is a single-page React + TypeScript application (Vite) that teaches 10 RAG architectures through step-by-step walkthroughs with real Python code. It was extracted from [AI Cauldron](https://github.com/enbattle/ai-cauldron), where these components originated.

### Routes

- `/` — `Landing`: hero + `AlgorithmPicker` grid of all 10 algorithms.
- `/:algorithmSlug` — `AlgorithmPage`: reads the slug, renders `AlgorithmView`, which lazy-loads the matching algorithm component.

Both routes render inside `Layout` (`src/components/Layout.tsx`), which provides the header (app name, GitHub link, `ThemeToggle`).

### Algorithm pattern

Every algorithm is self-contained in `src/algorithms/<name>/` with three files:

- `demo-data.ts` — exports `AlgorithmDemoData`: `AnimationStep[]` (active node/edge ids, explanation text, retrieval updates) + key insight text
- `code-snippet.ts` — exports `CodeSnippet`: four Python code tabs (fullPipeline, embeddings, vectorSearch, generation)
- `<Name>.tsx` — imports demo data + code snippet, passes to `AlgorithmWrapper`

Simple algorithms (no custom visualization) use `AlgorithmFactory` instead of writing a full component. Three algorithms implement `specialVisualization` directly: AgenticRAG (`ReActTrace`), GraphRAG (`KnowledgeGraph`), HyDE (`EmbeddingSpace`) — all in `src/components/visualizations/`.

`AlgorithmWrapper` (`src/components/algorithm/AlgorithmWrapper.tsx`) drives everything: step-through animation via `useAnimationStep`, retrieval chunk accumulation, the optional special visualization, and the Shiki-highlighted code panel.

> **No pipeline diagram yet.** `activeNodeIds`/`activeEdgeIds` exist in each step's demo data but nothing currently renders a visual pipeline from them — the walkthrough today is text explanation + retrieval panel + code panel only. A bespoke SVG diagram layer is planned but not built; see `ROADMAP.md` before assuming one exists.

### Shared config

`src/config.ts` exports `CONFIG` (model names, chunk sizes, animation timing) and `ALGORITHMS` (display metadata for all 10 algorithms; `id` doubles as the route slug). Update constants here rather than hardcoding values in algorithm files.

### Path alias

`@/` resolves to `src/` (configured in `vite.config.ts`).

## Adding a new algorithm

1. Create `src/algorithms/<name>/` directory containing:
   - `demo-data.ts` exporting an `AlgorithmDemoData`
   - `code-snippet.ts` exporting a `CodeSnippet`
   - `<Name>.tsx` — the algorithm component using `AlgorithmWrapper` (or `AlgorithmFactory` for simple cases)
2. Register the lazy import in `AlgorithmView.tsx`'s `ALGO_COMPONENTS` map
3. Add a metadata entry to `ALGORITHMS` in `src/config.ts`
