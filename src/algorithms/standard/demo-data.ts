import type { AlgorithmDemoData } from '@/components/algorithm/types';

export const standardRAGDemo: AlgorithmDemoData = {

  steps: [
    {
      activeNodeIds: ['query-input'],
      activeEdgeIds: [],
      explanation:
        'A user query arrives. It will be embedded and used to search the document store for relevant context.',
    },
    {
      activeNodeIds: ['embed-query'],
      activeEdgeIds: ['e1'],
      explanation:
        'The query is converted into a dense vector using an embedding model. This vector captures the semantic meaning of the question.',
    },
    {
      activeNodeIds: ['vector-store'],
      activeEdgeIds: ['e2'],
      explanation:
        'The query vector is compared against all stored document vectors using cosine similarity.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'Transformer architecture uses self-attention mechanisms...',
          source: 'attention-paper.pdf',
          score: 0.91,
        },
        {
          rank: 2,
          content: 'Multi-head attention allows the model to attend to different...',
          source: 'transformers.pdf',
          score: 0.84,
        },
        {
          rank: 3,
          content: 'Positional encodings are added to embeddings...',
          source: 'arch-guide.md',
          score: 0.76,
        },
      ],
    },
    {
      activeNodeIds: ['top-k'],
      activeEdgeIds: ['e3'],
      explanation:
        'The top 5 chunks by similarity score are selected. Notice chunks 4 and 5 have low scores.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'Transformer architecture uses self-attention mechanisms...',
          source: 'attention-paper.pdf',
          score: 0.91,
        },
        {
          rank: 2,
          content: 'Multi-head attention allows the model to attend to different...',
          source: 'transformers.pdf',
          score: 0.84,
        },
        {
          rank: 3,
          content: 'Positional encodings are added to embeddings...',
          source: 'arch-guide.md',
          score: 0.76,
        },
        {
          rank: 4,
          content: 'The feed-forward layers in each block process...',
          source: 'components.md',
          score: 0.61,
          tooltip: 'Borderline relevance. Discusses a related but potentially off-topic component.',
        },
        {
          rank: 5,
          content: 'Training data preprocessing involves tokenization...',
          source: 'training.md',
          score: 0.43,
          tooltip: 'Low relevance. This chunk is likely noise.',
        },
      ],
    },
    {
      activeNodeIds: ['build-prompt'],
      activeEdgeIds: ['e4'],
      explanation: 'Retrieved chunks are assembled into a prompt alongside the original query.',
    },
    {
      activeNodeIds: ['llm-call'],
      activeEdgeIds: ['e5'],
      explanation:
        'The LLM generates a response using only the retrieved context. Low-quality chunks can cause hallucination.',
    },
    {
      activeNodeIds: ['answer'],
      activeEdgeIds: ['e6'],
      explanation: 'Answer returned. The pipeline is complete.',
    },
  ],

  insight:
    'Top-K selection has no quality gate. Chunks 4 and 5 are borderline or irrelevant, but Standard RAG passes them to the LLM regardless. This is the core failure mode that Hybrid RAG, CRAG, and HyDE each address from different angles.',
};
