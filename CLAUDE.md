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
- **Tailwind JIT gotcha in `src/components/diagram/`**: never build a Tailwind class name via template-string interpolation (e.g. `` `fill-${color}` ``) — Tailwind's static scanner won't see it and the style silently won't ship in the production build. `DiagramNode.tsx`/`DiagramEdge.tsx` sidestep this by either (a) keying into a `Record<NodeKind, string>` of fully-literal class strings, or (b) using raw inline `style={{ fill: hex }}` with hex values instead of Tailwind classes. Follow one of those two patterns for any new per-kind/per-state diagram styling.

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

Every algorithm is self-contained in `src/algorithms/<name>/` with four files:

- `demo-data.ts` — exports `AlgorithmDemoData`: `AnimationStep[]` (active node/edge ids, explanation text, retrieval updates) + key insight text
- `layout.ts` — exports a `PipelineLayout` (see below): the static node positions/edge connectivity the diagram draws
- `code-snippet.ts` — exports `CodeSnippet`: four Python code tabs (fullPipeline, embeddings, vectorSearch, generation)
- `<Name>.tsx` — imports demo data + layout + code snippet, passes to `AlgorithmWrapper`

Simple algorithms (no custom visualization) use `AlgorithmFactory` instead of writing a full component. Three algorithms implement `specialVisualization` directly: AgenticRAG (`ReActTrace`), GraphRAG (`KnowledgeGraph`), HyDE (`EmbeddingSpace`) — all in `src/components/visualizations/`. These render a *different* dataset (an entity graph, a trace log, an embedding scatter) than the pipeline diagram and stay unchanged alongside it.

`AlgorithmWrapper` (`src/components/algorithm/AlgorithmWrapper.tsx`) drives everything: step-through animation via `useAnimationStep`, the pipeline diagram, retrieval chunk accumulation, the optional special visualization, and the Shiki-highlighted code panel.

### Pipeline diagram (`src/components/diagram/`)

Renders the animated node/edge graph above the step explanation card. Highlighting is driven entirely by the `AnimationStep.activeNodeIds`/`activeEdgeIds` fields that already exist on every algorithm's `demo-data.ts` — the diagram layer only adds the *static* structure those ids refer to.

- `types.ts` — `NodeLayout` (id, label, kind, x/y/w/h), `EdgeLayout` (id, from, to, optional `activeWhen`/`fromSide`/`toSide`/`curve`/`bend`), `PipelineLayout` (nodes + edges).
- `geometry.ts` — pure functions (`anchor`, `edgePath`); no React, no app-specific knowledge.
- `DiagramNode.tsx` / `DiagramEdge.tsx` — presentational. Nodes: idle/active/visited states, per-`kind` color + icon (`node-*` tokens in `tailwind.config.ts`), glow + radar-ping ring when active. Edges: a permanent dim base pass (topology always faintly visible) plus an active/visited overlay with a `pathLength` draw-in and a traveling packet (native SVG `<animateMotion>`) the moment an edge activates.
- `PipelineDiagram.tsx` — composition. Takes a `PipelineLayout` + `steps` + `currentStep`, derives per-node/edge state by scanning `activeNodeIds`/`activeEdgeIds` up to the current step (accumulated = "visited", current step = "active"). Shared canvas: `CANVAS = { w: 940, h: 240 }`.
- `pipelineLayout` is an **optional** prop on `AlgorithmWrapper`/`AlgorithmFactory` — omit it and the diagram block simply doesn't render, which is how the rollout happened one algorithm at a time.

**`activeWhen` — the one non-obvious piece.** An edge id like `'e3'` in `demo-data.ts` doesn't always mean exactly one drawn line. RAG Fusion's `demo-data.ts` collapses a 3-way fan-out into a single id (`'e3'`) and a 4-way fan-in into another (`'e4'`) — see `rag-fusion/layout.ts` for the pattern: author several `EdgeLayout` entries (each its own `id`, `from`, `to`) that all set `activeWhen: ['e3']`, so one step's edge id lights up every line that should visually activate together. Everywhere else `activeWhen` defaults to `[edge.id]` (1:1).

**Reserved/skipped edge ids** (Corrective skips `e6`, Adaptive skips `e2`/`e4`/`e5` — reserved for branches the demo path never takes): only draw edges/nodes that actually appear in some step's `activeNodeIds`/`activeEdgeIds`. Don't invent nodes for untaken branches — there's no id for them in `demo-data.ts` to key off of.

**Loop-back / cyclic edges** (Agentic's ReAct loop, Self-RAG's re-retrieval branch): set `fromSide`/`toSide` to `'top'` or `'bottom'` and `curve: 'loop-back'` so the edge arcs above/below the row instead of drawing a straight line through intervening nodes. Use the optional `bend` override to separate curves that would otherwise overlap when several loop-back edges share the same side of the row — see `agentic/layout.ts` for worked examples with differing `bend` values.

### Shared config

`src/config.ts` exports `CONFIG` (model names, chunk sizes, animation timing) and `ALGORITHMS` (display metadata for all 10 algorithms; `id` doubles as the route slug). Update constants here rather than hardcoding values in algorithm files.

### Path alias

`@/` resolves to `src/` (configured in `vite.config.ts`).

## Adding a new algorithm

1. Create `src/algorithms/<name>/` directory containing:
   - `demo-data.ts` exporting an `AlgorithmDemoData`
   - `layout.ts` exporting a `PipelineLayout` (hand-author node x/y positions and edge connectivity — budget ~30–60 min depending on topology; see the "Pipeline diagram" section above for the `activeWhen`/reserved-id/loop-back conventions)
   - `code-snippet.ts` exporting a `CodeSnippet`
   - `<Name>.tsx` — the algorithm component using `AlgorithmWrapper` (or `AlgorithmFactory` for simple cases), passing `pipelineLayout`
2. Register the lazy import in `AlgorithmView.tsx`'s `ALGO_COMPONENTS` map
3. Add a metadata entry to `ALGORITHMS` in `src/config.ts`
