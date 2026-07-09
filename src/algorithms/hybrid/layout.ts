import type { PipelineLayout } from '@/components/diagram/types';

// Query splits 2-way (BM25 / dense), rejoins at RRF, then continues as a
// single row. Edge ids are 1:1 with drawn lines here (e1/e2 fan-out, e3/e4
// fan-in) — no activeWhen grouping needed.
export const hybridLayout: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'bm25', label: 'BM25 Search', kind: 'retrieval', x: 170, y: 20, w: 116, h: 60 },
    { id: 'dense', label: 'Dense Search', kind: 'retrieval', x: 170, y: 160, w: 116, h: 60 },
    { id: 'rrf', label: 'RRF Fusion', kind: 'retrieval', x: 320, y: 90, w: 116, h: 60 },
    { id: 'reranker', label: 'Reranker', kind: 'tool', x: 470, y: 90, w: 116, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 620, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 770, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'bm25' },
    { id: 'e2', from: 'query', to: 'dense' },
    { id: 'e3', from: 'bm25', to: 'rrf' },
    { id: 'e4', from: 'dense', to: 'rrf' },
    { id: 'e5', from: 'rrf', to: 'reranker' },
    { id: 'e6', from: 'reranker', to: 'llm' },
    { id: 'e7', from: 'llm', to: 'answer' },
  ],
};
