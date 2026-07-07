import type { AlgorithmDemoData } from '@/components/algorithm/types';

export const multimodalRAGDemo: AlgorithmDemoData = {
  steps: [
    { activeNodeIds: ['query'], activeEdgeIds: [], explanation: 'Query: "What does the performance comparison chart show for model accuracy?" — has visual and data components.' },
    { activeNodeIds: ['text', 'image', 'table'], activeEdgeIds: ['e1', 'e2', 'e3'], explanation: 'Cross-modal retrieval searches all three indexes simultaneously.' },
    { activeNodeIds: ['fuse'], activeEdgeIds: ['e4', 'e5', 'e6'], explanation: 'Results from all modalities assembled into unified context.', retrievalUpdate: [
      { rank: 1, content: 'Table 3 shows benchmark results across five models...', source: 'benchmark-paper.pdf', score: 0.81, modality: 'text' },
      { rank: 2, content: 'Figure 4 — Bar chart, MMLU benchmark comparison', source: 'benchmark-paper.pdf', score: 0.88, modality: 'image' },
      { rank: 3, content: 'Model | MMLU | HumanEval\nGPT-4 | 86.4% | 67.0%\nClaude | 85.2% | 71.2%', source: 'benchmark-paper.pdf', score: 0.85, modality: 'table' },
    ] },
    { activeNodeIds: ['llm'], activeEdgeIds: ['e7'], explanation: 'Multi-modal LLM reasons across text, chart, and table simultaneously.' },
    { activeNodeIds: ['answer'], activeEdgeIds: ['e8'], explanation: 'Complete answer using all modalities.' },
  ],
  insight: 'Enterprise documents are not flat text. Financial reports contain charts. Technical papers contain figures. Contracts contain tables. Text-only retrieval misses critical information encoded in non-text formats.',
};
