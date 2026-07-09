import type { PipelineLayout } from '@/components/diagram/types';

// Single-row left-to-right chain, 7 nodes. Edge id e6 is reserved in the demo
// data for an untaken "correct, pass through" branch — v1 only draws edges
// that actually appear in some step's activeEdgeIds, so it's omitted here.
export const correctiveLayout: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'retrieve', label: 'Retrieve', kind: 'retrieval', x: 151, y: 90, w: 116, h: 60 },
    { id: 'eval', label: 'Evaluate', kind: 'decision', x: 282, y: 90, w: 116, h: 60 },
    { id: 'route', label: 'Route', kind: 'decision', x: 413, y: 90, w: 116, h: 60 },
    { id: 'web', label: 'Web Search', kind: 'tool', x: 544, y: 90, w: 116, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 675, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 806, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'retrieve' },
    { id: 'e2', from: 'retrieve', to: 'eval' },
    { id: 'e3', from: 'eval', to: 'route' },
    { id: 'e4', from: 'route', to: 'web' },
    { id: 'e5', from: 'web', to: 'llm' },
    { id: 'e7', from: 'llm', to: 'answer' },
  ],
};
