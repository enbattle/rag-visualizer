import type { PipelineLayout } from '@/components/diagram/types';

// Single-row left-to-right chain, 6 nodes / 5 edges.
export const hydeLayout: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 130, h: 60 },
    { id: 'gen-hyp', label: 'Generate Hypothesis', kind: 'llm', x: 176, y: 90, w: 130, h: 60 },
    { id: 'embed-hyp', label: 'Embed Hypothesis', kind: 'retrieval', x: 332, y: 90, w: 130, h: 60 },
    { id: 'search', label: 'Vector Search', kind: 'retrieval', x: 488, y: 90, w: 130, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 644, y: 90, w: 130, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 800, y: 90, w: 130, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'gen-hyp' },
    { id: 'e2', from: 'gen-hyp', to: 'embed-hyp' },
    { id: 'e3', from: 'embed-hyp', to: 'search' },
    { id: 'e4', from: 'search', to: 'llm' },
    { id: 'e5', from: 'llm', to: 'answer' },
  ],
};
