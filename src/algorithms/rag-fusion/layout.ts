import type { PipelineLayout } from '@/components/diagram/types';

// The hardest topology: query expands into 4 reformulations, retrieved in
// parallel, fused back together. The demo data collapses the fan-out
// (expand -> retrieve-2/3/4) into a single edge id 'e3', and the fan-in
// (retrieve-1..4 -> rrf) into a single edge id 'e4' — each maps to several
// drawn lines here via `activeWhen`, the one case that actually needs it.
export const ragFusionLayout: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 105, h: 60 },
    { id: 'expand', label: 'Expand Queries', kind: 'llm', x: 143, y: 90, w: 105, h: 60 },
    { id: 'retrieve-1', label: 'Retrieve v1', kind: 'retrieval', x: 266, y: 11, w: 95, h: 44 },
    { id: 'retrieve-2', label: 'Retrieve v2', kind: 'retrieval', x: 266, y: 69, w: 95, h: 44 },
    { id: 'retrieve-3', label: 'Retrieve v3', kind: 'retrieval', x: 266, y: 127, w: 95, h: 44 },
    { id: 'retrieve-4', label: 'Retrieve v4', kind: 'retrieval', x: 266, y: 185, w: 95, h: 44 },
    { id: 'rrf', label: 'RRF Fusion', kind: 'retrieval', x: 379, y: 90, w: 105, h: 60 },
    { id: 'top-k', label: 'Top-K Select', kind: 'retrieval', x: 502, y: 90, w: 105, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 625, y: 90, w: 105, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 748, y: 90, w: 105, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'expand' },
    { id: 'e2', from: 'expand', to: 'retrieve-1' },
    { id: 'e3-2', from: 'expand', to: 'retrieve-2', activeWhen: ['e3'] },
    { id: 'e3-3', from: 'expand', to: 'retrieve-3', activeWhen: ['e3'] },
    { id: 'e3-4', from: 'expand', to: 'retrieve-4', activeWhen: ['e3'] },
    { id: 'e4-1', from: 'retrieve-1', to: 'rrf', activeWhen: ['e4'] },
    { id: 'e4-2', from: 'retrieve-2', to: 'rrf', activeWhen: ['e4'] },
    { id: 'e4-3', from: 'retrieve-3', to: 'rrf', activeWhen: ['e4'] },
    { id: 'e4-4', from: 'retrieve-4', to: 'rrf', activeWhen: ['e4'] },
    { id: 'e5', from: 'rrf', to: 'top-k' },
    { id: 'e6', from: 'top-k', to: 'llm' },
    { id: 'e7', from: 'llm', to: 'answer' },
  ],
};
