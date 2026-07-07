# RAG Visualizer

Interactive, step-by-step visualizations of 10 retrieval-augmented generation
architectures — from baseline vector search to agentic multi-hop retrieval —
with the real Python behind each one.

Extracted from [AI Cauldron](https://github.com/enbattle/ai-cauldron), where
these components originated as part of a broader AI-engineering learning app.

## Commands

```bash
npm install
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type-check + production build → dist/
npm run preview    # Preview the production build locally
npm run lint        # ESLint on src/ (ts,tsx)
npm run format      # Prettier write on src/
```

## Architecture

- Vite + React 18 + TypeScript (strict), same conventions as AI Cauldron.
- Routes: `/` (landing page, algorithm grid) and `/:algorithmSlug` (step-through
  walkthrough for one algorithm).
- `src/algorithms/<name>/` — one directory per algorithm: `demo-data.ts`
  (pipeline steps + retrieval data), `code-snippet.ts` (four Python tabs), and
  `<Name>.tsx` (wires demo data + code into `AlgorithmWrapper`, or uses
  `AlgorithmFactory` for algorithms with no special visualization).
- `src/components/algorithm/` — the shared walkthrough machinery:
  `AlgorithmWrapper` (step animation, retrieval panel, code panel),
  `AlgorithmPicker` (landing grid), `AlgorithmView` (lazy-loads the active
  algorithm by slug).
- `src/components/visualizations/` — special-case visualizations used by three
  algorithms: `ReActTrace` (Agentic RAG), `KnowledgeGraph` (GraphRAG),
  `EmbeddingSpace` (HyDE).
- `src/config.ts` — `CONFIG` (model names, chunk sizes) and `ALGORITHMS`
  (display metadata; `id` doubles as the route slug).
- `@/` resolves to `src/` (see `vite.config.ts`).

See `ROADMAP.md` for what's intentionally not built yet.

## Adding a new algorithm

1. Create `src/algorithms/<name>/` with `demo-data.ts`, `code-snippet.ts`, and
   `<Name>.tsx` (using `AlgorithmWrapper` or `AlgorithmFactory`).
2. Register the lazy import in `AlgorithmView.tsx`'s `ALGO_COMPONENTS` map.
3. Add a metadata entry to `ALGORITHMS` in `src/config.ts`.
