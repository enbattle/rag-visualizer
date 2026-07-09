import type { PipelineLayout } from '@/components/diagram/types';

// Query splits 3-way (text / image / table), rejoins at fuse, then continues
// as a single row. Edge ids are 1:1 with drawn lines (e1/e2/e3 fan-out,
// e4/e5/e6 fan-in) — no activeWhen grouping needed.
export const multimodalLayout: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'text', label: 'Text Retrieval', kind: 'retrieval', x: 190, y: 14, w: 116, h: 60 },
    { id: 'image', label: 'Image Retrieval', kind: 'retrieval', x: 190, y: 90, w: 116, h: 60 },
    { id: 'table', label: 'Table Retrieval', kind: 'retrieval', x: 190, y: 166, w: 116, h: 60 },
    { id: 'fuse', label: 'Fuse Modalities', kind: 'tool', x: 400, y: 90, w: 116, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 580, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 760, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'text' },
    { id: 'e2', from: 'query', to: 'image' },
    { id: 'e3', from: 'query', to: 'table' },
    { id: 'e4', from: 'text', to: 'fuse' },
    { id: 'e5', from: 'image', to: 'fuse' },
    { id: 'e6', from: 'table', to: 'fuse' },
    { id: 'e7', from: 'fuse', to: 'llm' },
    { id: 'e8', from: 'llm', to: 'answer' },
  ],
};
