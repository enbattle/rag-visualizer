import type { PipelineLayout } from '@/components/diagram/types';

// Single-row left-to-right chain, 7 nodes / 6 edges.
export const graphLayout: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'extract', label: 'Extract Entities', kind: 'decision', x: 151, y: 90, w: 116, h: 60 },
    { id: 'graph', label: 'Build Graph', kind: 'retrieval', x: 282, y: 90, w: 116, h: 60 },
    { id: 'hop1', label: 'Hop 1 Traverse', kind: 'retrieval', x: 413, y: 90, w: 116, h: 60 },
    { id: 'hop2', label: 'Hop 2 Traverse', kind: 'retrieval', x: 544, y: 90, w: 116, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 675, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 806, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'extract' },
    { id: 'e2', from: 'extract', to: 'graph' },
    { id: 'e3', from: 'graph', to: 'hop1' },
    { id: 'e4', from: 'hop1', to: 'hop2' },
    { id: 'e5', from: 'hop2', to: 'llm' },
    { id: 'e6', from: 'llm', to: 'answer' },
  ],
};
