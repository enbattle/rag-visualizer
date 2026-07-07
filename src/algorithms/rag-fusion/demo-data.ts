import type { AlgorithmDemoData } from '@/components/algorithm/types';

export const ragFusionDemo: AlgorithmDemoData = {
  steps: [
    {
      activeNodeIds: ['query'],
      activeEdgeIds: [],
      explanation:
        'Query arrives: "How do transformer attention mechanisms work?" Instead of embedding it once, RAG Fusion will generate multiple reformulations and retrieve from each independently.',
    },
    {
      activeNodeIds: ['expand'],
      activeEdgeIds: ['e1'],
      explanation:
        'LLM generates 3 query variants covering different angles: (1) "What is self-attention in neural networks?" (2) "Explain query, key, value matrices in transformers" (3) "How does multi-head attention compute relevance?" Each targets a different slice of the document space.',
    },
    {
      activeNodeIds: ['retrieve-1'],
      activeEdgeIds: ['e2'],
      explanation:
        'Retrieval 1 of 4 — original query. Top-5 by vector similarity. Strong signal on the core attention mechanism.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'Transformer architecture uses self-attention to weigh the importance of each token relative to all others in a sequence...',
          source: 'attention-paper.pdf',
          score: 0.91,
          tooltip: 'Rank 1 across 3 of 4 queries — high RRF weight expected.',
        },
        {
          rank: 2,
          content: 'Multi-head attention projects queries, keys, and values into multiple subspaces, learning different relationship patterns in parallel...',
          source: 'transformers.pdf',
          score: 0.84,
          tooltip: 'Consistently top-3 across all queries.',
        },
        {
          rank: 3,
          content: 'Scaled dot-product attention: softmax(QKᵀ / √dₖ)V. Scaling by √dₖ prevents vanishing gradients in large dimensions...',
          source: 'attention-math.md',
          score: 0.79,
        },
        {
          rank: 4,
          content: 'Positional encodings inject sequence order information since attention is permutation-invariant...',
          source: 'arch-guide.md',
          score: 0.67,
          tooltip: 'Relevant but peripheral — appears in only 1 query result.',
        },
        {
          rank: 5,
          content: 'The feed-forward sublayer in each transformer block applies two linear projections with a ReLU activation between them...',
          source: 'components.md',
          score: 0.51,
          tooltip: 'Low score and only 1 query — likely noise.',
        },
      ],
    },
    {
      activeNodeIds: ['retrieve-2', 'retrieve-3', 'retrieve-4'],
      activeEdgeIds: ['e3'],
      explanation:
        'Retrievals 2–4 execute with the three query variants. Each returns a different ranking. Variant 2 surfaces a new "QKV matrix" document; Variant 3 surfaces a new "attention heads" document. Single-query retrieval would have missed both.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'Transformer architecture uses self-attention to weigh the importance of each token relative to all others in a sequence...',
          source: 'attention-paper.pdf',
          score: 0.91,
          tooltip: 'Rank 1 in 3 of 4 queries — will receive highest RRF score.',
        },
        {
          rank: 2,
          content: 'Multi-head attention projects queries, keys, and values into multiple subspaces, learning different relationship patterns in parallel...',
          source: 'transformers.pdf',
          score: 0.84,
          tooltip: 'Appears in top-3 across all 4 queries.',
        },
        {
          rank: 3,
          content: 'Scaled dot-product attention: softmax(QKᵀ / √dₖ)V. Scaling by √dₖ prevents vanishing gradients in large dimensions...',
          source: 'attention-math.md',
          score: 0.79,
        },
        {
          rank: 4,
          content: 'The query matrix Q, key matrix K, and value matrix V are learned linear projections of the input embeddings, each with dimension dₖ...',
          source: 'qkv-matrices.md',
          score: 0.83,
          tooltip: 'New document — not retrieved by original query. Variant 2 ("QKV matrices") surfaced it.',
        },
        {
          rank: 5,
          content: 'Each attention head learns to focus on different syntactic and semantic relationships — some track coreference, others learn positional proximity...',
          source: 'attention-heads.md',
          score: 0.77,
          tooltip: 'New document — surfaced only by Variant 3. Would be missed in single-query retrieval.',
        },
      ],
    },
    {
      activeNodeIds: ['rrf'],
      activeEdgeIds: ['e4'],
      explanation:
        'Reciprocal Rank Fusion scores each document: RRF(d) = Σ 1/(k + rank). k=60 is the standard constant. A document ranked 1st in all 4 lists scores 4×(1/61) = 0.066. A document ranked 1st in one list and absent elsewhere scores just 1/61 = 0.016.',
    },
    {
      activeNodeIds: ['top-k'],
      activeEdgeIds: ['e5'],
      explanation:
        'Top-5 by RRF score. The QKV and attention-heads documents — missed by the original query — now rank 3rd and 4th because they were consistently retrieved by the query variants. Noise from a single retrieval is suppressed.',
      retrievalUpdate: [
        {
          rank: 1,
          content: 'Transformer architecture uses self-attention to weigh the importance of each token relative to all others in a sequence...',
          source: 'attention-paper.pdf',
          score: 0.066,
          tooltip: 'RRF 0.066 — ranked 1st in 3 of 4 queries.',
        },
        {
          rank: 2,
          content: 'Multi-head attention projects queries, keys, and values into multiple subspaces, learning different relationship patterns in parallel...',
          source: 'transformers.pdf',
          score: 0.061,
          tooltip: 'RRF 0.061 — top-3 in all 4 queries.',
        },
        {
          rank: 3,
          content: 'The query matrix Q, key matrix K, and value matrix V are learned linear projections of the input embeddings, each with dimension dₖ...',
          source: 'qkv-matrices.md',
          score: 0.049,
          tooltip: 'RRF 0.049 — only surfaced by variants, but high rank in two of them.',
        },
        {
          rank: 4,
          content: 'Each attention head learns to focus on different syntactic and semantic relationships — some track coreference, others learn positional proximity...',
          source: 'attention-heads.md',
          score: 0.044,
          tooltip: 'RRF 0.044 — consistently high across variant retrievals.',
        },
        {
          rank: 5,
          content: 'Scaled dot-product attention: softmax(QKᵀ / √dₖ)V. Scaling by √dₖ prevents vanishing gradients in large dimensions...',
          source: 'attention-math.md',
          score: 0.041,
          tooltip: 'RRF 0.041 — appeared in 3 of 4 retrievals at mid-rank.',
        },
      ],
    },
    {
      activeNodeIds: ['llm'],
      activeEdgeIds: ['e6'],
      explanation:
        'LLM generates from the RRF-fused top-5. The context covers attention mechanics, QKV matrices, and multi-head specialization — broader and more complete than the original query alone would have retrieved.',
    },
    {
      activeNodeIds: ['answer'],
      activeEdgeIds: ['e7'],
      explanation:
        'Answer returned. RAG Fusion used 4 retrieval calls and 1 LLM expansion call — roughly 3× the cost of single-query RAG — but recall improved from ~65% to ~79% on this class of query.',
    },
  ],

  insight:
    'Single-query retrieval is biased toward the exact phrasing used. RAG Fusion breaks this by treating retrieval as a sampling problem: generate N queries, retrieve N result sets, then let RRF reward documents that rank well across multiple phrasings. Documents that are genuinely relevant appear consistently; lucky retrievals from a single phrasing are diluted.',
};
