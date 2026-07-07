import type { AlgorithmDemoData } from '@/components/algorithm/types';

export const adaptiveRAGDemo: AlgorithmDemoData = {
  steps: [
    {
      activeNodeIds: ['query'],
      activeEdgeIds: [],
      explanation: 'Query arrives. Adaptive-RAG will classify complexity before deciding retrieval strategy.',
    },
    {
      activeNodeIds: ['classifier'],
      activeEdgeIds: ['e1'],
      explanation: 'Lightweight classifier analyzes query. Features: length, question words, named entities, ambiguity signals.',
    },
    {
      activeNodeIds: ['classifier'],
      activeEdgeIds: [],
      explanation: 'Classification result: MODERATE complexity. Query requires retrieval but single-step is sufficient.',
    },
    {
      activeNodeIds: ['single-step'],
      activeEdgeIds: ['e3'],
      explanation: 'Single retrieval executes. Standard top-K vector search with reranking.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'Adaptive-RAG routes queries to no-retrieval, single-step, or multi-step...',
          source: 'adaptive-rag.pdf',
          score: 0.89,
        },
        {
          rank: 2,
          content: 'Query complexity classification uses features like length and ambiguity...',
          source: 'query-routing.md',
          score: 0.84,
        },
        {
          rank: 3,
          content: 'Cost optimization through dynamic retrieval strategy selection...',
          source: 'rag-efficiency.pdf',
          score: 0.78,
        },
      ],
    },
    {
      activeNodeIds: ['llm-single'],
      activeEdgeIds: ['e6'],
      explanation: 'LLM generates from single retrieval. Context is sufficient for this query complexity.',
    },
    {
      activeNodeIds: ['answer'],
      activeEdgeIds: ['e7'],
      explanation: 'Answer returned. Adaptive routing saved cost by avoiding unnecessary multi-step retrieval.',
    },
  ],
  insight: 'Adaptive-RAG optimizes cost and latency by matching retrieval complexity to query complexity. Simple questions skip retrieval entirely using parametric knowledge.',
};
