import type { AlgorithmDemoData, EmbeddingPoint } from '@/components/algorithm/types';

export const hydeEmbeddingPoints: EmbeddingPoint[] = [
  // Question space cluster (upper left)
  { id: 'q1', x: 80, y: 60, label: '', type: 'document' },
  { id: 'q2', x: 95, y: 75, label: '', type: 'document' },
  { id: 'q3', x: 70, y: 85, label: '', type: 'document' },
  { id: 'query', x: 85, y: 70, label: 'Query', type: 'query' },
  
  // Answer space cluster (lower right)
  { id: 'd1', x: 280, y: 200, label: '', type: 'document' },
  { id: 'd2', x: 295, y: 215, label: '', type: 'document' },
  { id: 'd3', x: 270, y: 225, label: '', type: 'document' },
  { id: 'd4', x: 305, y: 205, label: '', type: 'document' },
  { id: 'd5', x: 285, y: 235, label: '', type: 'document' },
  { id: 'hypothesis', x: 290, y: 215, label: 'Hypothesis', type: 'hypothesis' },
];

export const hydeRAGDemo: AlgorithmDemoData = {
  steps: [
    { activeNodeIds: ['query'], activeEdgeIds: [], explanation: 'Query arrives. Instead of embedding it directly, we generate a hypothesis first.' },
    { activeNodeIds: ['gen-hyp'], activeEdgeIds: ['e1'], explanation: 'LLM generates hypothetical answer using parametric knowledge. This will never be shown to the user.' },
    { activeNodeIds: ['embed-hyp'], activeEdgeIds: ['e2'], explanation: 'Hypothesis embedded. The vector lands in answer-space, not question-space.' },
    { activeNodeIds: ['search'], activeEdgeIds: ['e3'], explanation: 'Search from answer-space retrieves more targeted documents than query embedding would.' },
    { activeNodeIds: ['llm'], activeEdgeIds: ['e4'], explanation: 'Final generation with high-quality real documents (not the hypothesis).' },
    { activeNodeIds: ['answer'], activeEdgeIds: ['e5'], explanation: 'Answer returned. The hypothesis served its purpose and is discarded.' },
  ],
  insight: 'Questions and answers occupy different regions of embedding space. A question vector searches from the wrong neighborhood. HyDE bridges the gap by using the LLM\'s knowledge to produce a vector that searches from where the answers actually live.',
};
