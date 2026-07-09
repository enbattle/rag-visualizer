import type { PipelineLayout } from '@/components/diagram/types';

// Single-row left-to-right chain, 7 nodes / 6 edges, 116x60 boxes, evenly spaced
// across the shared 940x240 canvas (nodes vertically centered at y=90).
export const standardLayout: PipelineLayout = {
  nodes: [
    { id: 'query-input', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'embed-query', label: 'Embed Query', kind: 'retrieval', x: 151, y: 90, w: 116, h: 60 },
    { id: 'vector-store', label: 'Vector Search', kind: 'retrieval', x: 282, y: 90, w: 116, h: 60 },
    { id: 'top-k', label: 'Top-K Select', kind: 'retrieval', x: 413, y: 90, w: 116, h: 60 },
    { id: 'build-prompt', label: 'Build Prompt', kind: 'retrieval', x: 544, y: 90, w: 116, h: 60 },
    { id: 'llm-call', label: 'LLM Generate', kind: 'llm', x: 675, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 806, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query-input', to: 'embed-query' },
    { id: 'e2', from: 'embed-query', to: 'vector-store' },
    { id: 'e3', from: 'vector-store', to: 'top-k' },
    { id: 'e4', from: 'top-k', to: 'build-prompt' },
    { id: 'e5', from: 'build-prompt', to: 'llm-call' },
    { id: 'e6', from: 'llm-call', to: 'answer' },
  ],
};
