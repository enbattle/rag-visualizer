import type { AlgorithmDemoData } from '@/components/algorithm/types';

export const correctiveRAGDemo: AlgorithmDemoData = {
  steps: [
    {
      activeNodeIds: ['query'],
      activeEdgeIds: [],
      explanation: 'Query arrives. CRAG will evaluate retrieval quality before using it.',
    },
    {
      activeNodeIds: ['retrieve'],
      activeEdgeIds: ['e1'],
      explanation: 'Initial vector retrieval executes. Results will be evaluated for quality.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'General machine learning overview covering basic concepts...',
          source: 'ml-intro.pdf',
          score: 0.41,
          tooltip: 'Score 0.41 — well below threshold 0.75. Discusses ML broadly without addressing the specific query.',
        },
        {
          rank: 2,
          content: 'Introduction to neural networks and their applications...',
          source: 'neural-nets.md',
          score: 0.38,
          tooltip: 'Score 0.38 — insufficient relevance.',
        },
        {
          rank: 3,
          content: 'Data preprocessing basics for machine learning pipelines...',
          source: 'preprocessing.md',
          score: 0.31,
          tooltip: 'Score 0.31 — off-topic content.',
        },
      ],
    },
    {
      activeNodeIds: ['eval'],
      activeEdgeIds: ['e2'],
      explanation: 'Evaluator scores each chunk against the query. Scores: 0.41, 0.38, 0.31 — all below the 0.75 threshold.',
    },
    {
      activeNodeIds: ['route'],
      activeEdgeIds: ['e3'],
      explanation: 'Decision: INCORRECT. All chunks failed quality threshold. The red branch activates.',
    },
    {
      activeNodeIds: ['web'],
      activeEdgeIds: ['e4'],
      explanation: 'All 3 original chunks are rejected. Web search executes as fallback.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'General machine learning overview covering basic concepts...',
          source: 'ml-intro.pdf',
          score: 0.41,
          isRejected: true,
          tooltip: 'Rejected — score below threshold.',
        },
        {
          rank: 2,
          content: 'Introduction to neural networks and their applications...',
          source: 'neural-nets.md',
          score: 0.38,
          isRejected: true,
          tooltip: 'Rejected — score below threshold.',
        },
        {
          rank: 3,
          content: 'Data preprocessing basics for machine learning pipelines...',
          source: 'preprocessing.md',
          score: 0.31,
          isRejected: true,
          tooltip: 'Rejected — score below threshold.',
        },
      ],
    },
    {
      activeNodeIds: ['llm'],
      activeEdgeIds: ['e5'],
      explanation: 'Web search returns fresh, high-quality results. LLM generates from these instead of the rejected chunks.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'CRAG: Corrective Retrieval-Augmented Generation with quality evaluation...',
          source: 'arxiv.org/crag-paper',
          score: 0.89,
        },
        {
          rank: 2,
          content: 'Retrieval quality evaluation in RAG systems using lightweight classifiers...',
          source: 'research.ai/eval-rag',
          score: 0.85,
        },
        {
          rank: 3,
          content: 'Self-correcting language model pipelines with dynamic retrieval routing...',
          source: 'blog.ml/corrective-rag',
          score: 0.82,
        },
      ],
    },
    {
      activeNodeIds: ['answer'],
      activeEdgeIds: ['e7'],
      explanation: 'Answer returned. Quality gate prevented a low-quality response that Standard RAG would have produced.',
    },
  ],
  insight: "Standard RAG uses whatever it retrieves. CRAG's evaluator acts as a quality gate, cheap enough to run on every query.",
};
