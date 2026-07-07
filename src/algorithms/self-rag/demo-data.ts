import type { AlgorithmDemoData } from '@/components/algorithm/types';

export const selfRAGDemo: AlgorithmDemoData = {
  steps: [
    {
      activeNodeIds: ['query'],
      activeEdgeIds: [],
      explanation: 'Query arrives. Self-RAG will generate with built-in self-reflection.',
    },
    {
      activeNodeIds: ['retrieve'],
      activeEdgeIds: ['e1'],
      explanation: 'Initial retrieval executes. Standard vector search returns top-K chunks.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'Self-RAG trains language models to reflect on their own generation...',
          source: 'self-rag-paper.pdf',
          score: 0.88,
        },
        {
          rank: 2,
          content: 'Reflection tokens enable models to critique intermediate outputs...',
          source: 'llm-reflection.md',
          score: 0.81,
        },
        {
          rank: 3,
          content: 'Retrieval can be triggered dynamically based on confidence scores...',
          source: 'adaptive-retrieval.pdf',
          score: 0.74,
        },
      ],
    },
    {
      activeNodeIds: ['generate'],
      activeEdgeIds: ['e2'],
      explanation: 'Generator produces output AND emits special reflection tokens that critique its own work.',
    },
    {
      activeNodeIds: ['reflect-rel'],
      activeEdgeIds: ['e3'],
      explanation: 'Reflection token 1: [IsRelevant] → "RELEVANT". The model confirms retrieved chunks address the query.',
    },
    {
      activeNodeIds: ['reflect-support'],
      activeEdgeIds: ['e4'],
      explanation: 'Reflection token 2: [IsSupported] → "FULLY_SUPPORTED". The generated output is grounded in retrieved context.',
    },
    {
      activeNodeIds: ['decide'],
      activeEdgeIds: ['e5', 'e6'],
      explanation: 'Reflection token 3: [Confidence] → "HIGH". Both relevance and support passed. No re-retrieval needed.',
    },
    {
      activeNodeIds: ['answer'],
      activeEdgeIds: ['e7'],
      explanation: 'Answer returned with reflection metadata. Self-evaluation provides explainability and prevents hallucination.',
    },
  ],
  insight: 'Self-RAG embeds self-critique into the generator itself via reflection tokens. The model decides when it needs more context, reducing cost vs. Agentic RAG.',
};
