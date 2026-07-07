# Roadmap

Write-only until v1 is public. Anything not in the current build goes here
instead of into the codebase.

## Diagram layer (not built yet)

The step walkthrough currently drives text explanation + retrieval chunk
panel + code panel — there is no visual pipeline diagram. The original spec
called for replacing "React Flow" with a bespoke SVG + Framer Motion layer,
but there was never a React Flow diagram in the source app to replace; this
is net-new work, not a migration:

- `src/components/diagram/{PipelineDiagram,DiagramNode,DiagramEdge,DataPacket}.tsx`
  + `geometry.ts` (anchor/bezier math)
- A `layout` export (`NodeLayout[]` / `EdgeLayout[]`) added to each
  algorithm's `demo-data.ts`, hand-authored per algorithm (~30 min each)
- Data-packet travel animation along edges, keyed to `stepIndex`
- Reduced-motion fallback for the diagram specifically (the hook already
  exists — `useReducedMotion` — just not wired into a diagram yet)

## Landing / deploy polish

- OG tags / meta image
- Animated GIF in README
- Cloudflare Pages deploy + custom domain
- One-line pageview counter

## Content

- No new lessons, ever — that content lives in AI Cauldron.
- No search modal — 10 algorithms fit in a visible grid.
