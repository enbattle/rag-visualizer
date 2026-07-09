import type { PipelineLayout } from '@/components/diagram/types';

// Single-row left-to-right chain, 7 nodes. The "decide" step activates two
// edges at once (e5, e6): e5 continues the forward chain to "decide"; e6 is
// authored as a loop-back to "retrieve", visualizing Self-RAG's defining
// feature — the model can trigger re-retrieval when it isn't confident.
export const selfRagLayout: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'retrieve', label: 'Retrieve', kind: 'retrieval', x: 151, y: 90, w: 116, h: 60 },
    { id: 'generate', label: 'Generate', kind: 'llm', x: 282, y: 90, w: 116, h: 60 },
    { id: 'reflect-rel', label: 'Reflect: Relevant?', kind: 'decision', x: 413, y: 90, w: 116, h: 60 },
    { id: 'reflect-support', label: 'Reflect: Supported?', kind: 'decision', x: 544, y: 90, w: 116, h: 60 },
    { id: 'decide', label: 'Decide', kind: 'decision', x: 675, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 806, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'retrieve' },
    { id: 'e2', from: 'retrieve', to: 'generate' },
    { id: 'e3', from: 'generate', to: 'reflect-rel' },
    { id: 'e4', from: 'reflect-rel', to: 'reflect-support' },
    { id: 'e5', from: 'reflect-support', to: 'decide' },
    { id: 'e6', from: 'decide', to: 'retrieve', fromSide: 'bottom', toSide: 'bottom', curve: 'loop-back', bend: 70 },
    { id: 'e7', from: 'decide', to: 'answer' },
  ],
};
