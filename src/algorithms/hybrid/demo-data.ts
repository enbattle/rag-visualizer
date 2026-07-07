import type { AlgorithmDemoData } from '@/components/algorithm/types';

export const hybridRAGDemo: AlgorithmDemoData = {
  steps: [
    {
      activeNodeIds: ['query'],
      activeEdgeIds: [],
      explanation: 'Query arrives. Hybrid RAG searches using two strategies simultaneously.',
    },
    {
      activeNodeIds: ['bm25', 'dense'],
      activeEdgeIds: ['e1', 'e2'],
      explanation: 'BM25 sparse retrieval and dense vector search execute in parallel.',
    },
    {
      activeNodeIds: ['rrf'],
      activeEdgeIds: ['e3', 'e4'],
      explanation: 'RRF fusion merges both ranked lists into a single unified ranking.',
    },
    {
      activeNodeIds: ['reranker'],
      activeEdgeIds: ['e5'],
      explanation:
        'Cross-encoder reranker re-scores the fused candidates. Watch rank order change.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'Vector similarity at scale requires approximate nearest neighbor...',
          source: 'search-optimization.pdf',
          score: 0.96,
        },
        {
          rank: 2,
          content: 'Embedding models map text to high-dimensional vectors...',
          source: 'embeddings-guide.md',
          score: 0.91,
        },
      ],
    },
    {
      activeNodeIds: ['llm'],
      activeEdgeIds: ['e6'],
      explanation: 'LLM called with reranked top-K chunks.',
    },
    {
      activeNodeIds: ['answer'],
      activeEdgeIds: ['e7'],
      explanation: 'Answer returned with higher precision than either retrieval method alone.',
    },
  ],
  insight:
    'BM25 and dense retrieval fail in complementary ways. The reranker applies expensive joint scoring only to the merged candidate set, not the full corpus.',
};
