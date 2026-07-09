import type { PipelineLayout } from '@/components/diagram/types';

// Single row, but genuinely cyclic (ReAct loop): agent and observe are each
// visited twice via different edges, so several edges skip over neighbors or
// curve backward. Forward skips arc above the row, backward/loop edges arc
// below, to keep the two curve families visually separate.
export const agenticLayout: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'agent', label: 'Agent Reason', kind: 'agent', x: 151, y: 90, w: 116, h: 60 },
    { id: 'vector', label: 'Vector Search', kind: 'tool', x: 282, y: 90, w: 116, h: 60 },
    { id: 'observe', label: 'Observe', kind: 'decision', x: 413, y: 90, w: 116, h: 60 },
    { id: 'web', label: 'Web Search', kind: 'tool', x: 544, y: 90, w: 116, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 675, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 806, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'agent' },
    { id: 'e2', from: 'agent', to: 'vector' },
    { id: 'e3', from: 'vector', to: 'observe' },
    { id: 'e4', from: 'observe', to: 'agent', fromSide: 'bottom', toSide: 'bottom', curve: 'loop-back', bend: 55 },
    { id: 'e5', from: 'agent', to: 'web', fromSide: 'top', toSide: 'top', curve: 'loop-back', bend: 95 },
    { id: 'e6', from: 'web', to: 'observe', fromSide: 'bottom', toSide: 'bottom', curve: 'loop-back', bend: 55 },
    { id: 'e7', from: 'observe', to: 'llm', fromSide: 'top', toSide: 'top', curve: 'loop-back', bend: 50 },
    { id: 'e8', from: 'llm', to: 'answer' },
  ],
};
