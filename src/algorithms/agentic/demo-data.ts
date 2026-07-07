import type { AlgorithmDemoData, ReActEntry } from '@/components/algorithm/types';

export const agenticReActTrace: ReActEntry[] = [
  {
    iteration: 1,
    type: 'thought',
    content: 'The question asks about recent model performance benchmarks. I will start with the vector store.',
  },
  {
    iteration: 1,
    type: 'action',
    content: 'vector_search("transformer benchmark performance 2024")',
  },
  {
    iteration: 1,
    type: 'observation',
    content: '3 results. Scores: 0.71, 0.68, 0.61. Coverage seems incomplete — these chunks are from 2023 papers.',
  },
  {
    iteration: 2,
    type: 'thought',
    content: 'Results are stale. The corpus does not have 2024 benchmarks. I will try web search.',
  },
  {
    iteration: 2,
    type: 'action',
    content: 'web_search("transformer architecture benchmark 2024 paper")',
  },
  {
    iteration: 2,
    type: 'observation',
    content: '4 results. Higher relevance scores. Recent papers found. Context now sufficient.',
  },
  {
    iteration: 3,
    type: 'thought',
    content: 'I have sufficient context from both sources. Synthesizing final answer.',
  },
  {
    iteration: 3,
    type: 'action',
    content: 'synthesize(vector_results + web_results)',
  },
];

export const agenticRAGDemo: AlgorithmDemoData = {
  steps: [
    { activeNodeIds: ['query'], activeEdgeIds: [], explanation: 'Complex query arrives. Agent reasons about retrieval strategy.' },
    { activeNodeIds: ['agent'], activeEdgeIds: ['e1'], explanation: 'Agent decides to start with vector search.' },
    { activeNodeIds: ['vector'], activeEdgeIds: ['e2'], explanation: 'Vector search executes. Results scored.' },
    { activeNodeIds: ['observe'], activeEdgeIds: ['e3'], explanation: 'Agent evaluates results as stale and insufficient.' },
    { activeNodeIds: ['agent'], activeEdgeIds: ['e4'], explanation: 'Agent switches to web search for current information.' },
    { activeNodeIds: ['web'], activeEdgeIds: ['e5'], explanation: 'Web search returns recent, high-quality results.' },
    { activeNodeIds: ['observe'], activeEdgeIds: ['e6'], explanation: 'Agent determines context is now sufficient.' },
    { activeNodeIds: ['llm'], activeEdgeIds: ['e7'], explanation: 'LLM generates from multi-iteration context.' },
    { activeNodeIds: ['answer'], activeEdgeIds: ['e8'], explanation: 'Answer from agent-driven retrieval loop.' },
  ],
  insight: 'The agent decides when retrieval is sufficient — no fixed K, no fixed iteration count.',
};
