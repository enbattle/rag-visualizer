import type { PipelineLayout } from '@/components/diagram/types';

// Single-row left-to-right chain, 5 nodes. Edge ids e2/e4/e5 are reserved in
// the demo data for untaken parametric/multi-step branches — v1 only draws
// edges that actually appear in some step's activeEdgeIds, so they're omitted.
export const adaptiveLayout: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 150, h: 60 },
    { id: 'classifier', label: 'Complexity Classifier', kind: 'decision', x: 202, y: 90, w: 150, h: 60 },
    { id: 'single-step', label: 'Single-Step Retrieve', kind: 'retrieval', x: 384, y: 90, w: 150, h: 60 },
    { id: 'llm-single', label: 'LLM Generate', kind: 'llm', x: 566, y: 90, w: 150, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 748, y: 90, w: 150, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'classifier' },
    { id: 'e3', from: 'classifier', to: 'single-step' },
    { id: 'e6', from: 'single-step', to: 'llm-single' },
    { id: 'e7', from: 'llm-single', to: 'answer' },
  ],
};
