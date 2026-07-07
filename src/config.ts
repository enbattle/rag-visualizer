/**
 * Shared configuration constants for all RAG algorithms
 */

export const CONFIG = {
  /** Embedding model for dense vector retrieval */
  EMBEDDING_MODEL: 'voyage-4-large',

  /** Reranker model for cross-encoder scoring */
  RERANKER_MODEL: 'rerank-2.5',

  /** Language model for generation */
  LLM_MODEL: 'claude-sonnet-4-6',

  /** Document chunk size in tokens */
  CHUNK_SIZE: 512,

  /** Token overlap between adjacent chunks */
  CHUNK_OVERLAP: 64,

  /** Number of chunks to retrieve */
  TOP_K: 5,

  /** Minimum relevance score threshold */
  RELEVANCE_THRESHOLD: 0.75,

  /** Animation step duration in milliseconds */
  STEP_DURATION_MS: 1800,
} as const;

/**
 * Algorithm metadata for navigation and display.
 * overviewText is the prose description shown at the top of each algorithm view.
 */
export const ALGORITHMS = [
  {
    id: 'standard',
    name: 'Standard RAG',
    subtitle: 'Learning foundation — single-pass retrieval',
    latency: 'low',
    implementation: 'low',
    quality: 'baseline',
    description: 'Top-K vector similarity search with direct LLM generation',
    overviewText: 'Standard RAG is the foundational approach to retrieval-augmented generation. It follows a straightforward pipeline: embed the query, retrieve relevant context, and generate an answer. While simple, it provides a solid baseline for understanding more advanced RAG techniques.',
  },
  {
    id: 'hybrid',
    name: 'Hybrid RAG',
    subtitle: 'Production baseline (2026) — sparse + dense + reranking',
    latency: 'medium',
    implementation: 'medium',
    quality: 'high',
    description: 'BM25 + vector search with reranker fusion',
    overviewText: 'Hybrid RAG combines sparse lexical search (BM25) with dense semantic search, then uses Reciprocal Rank Fusion (RRF) to merge results. A cross-encoder reranker then re-scores candidates to produce the final top-K, balancing precision across different query types.',
  },
  {
    id: 'agentic',
    name: 'Agentic RAG',
    subtitle: 'ReAct loop — reason, retrieve, repeat until sufficient',
    latency: 'high',
    implementation: 'high',
    quality: 'highest',
    description: 'Autonomous agent with multi-iteration retrieval',
    overviewText: 'Agentic RAG uses a ReAct (Reasoning and Acting) loop where the LLM autonomously decides when to retrieve more information. The agent reasons about what it knows, takes actions (like retrieval), observes results, and repeats until it has sufficient context to answer confidently.',
  },
  {
    id: 'graph',
    name: 'GraphRAG',
    subtitle: 'Knowledge graph traversal for multi-hop reasoning',
    latency: 'high',
    implementation: 'high',
    quality: 'high',
    description: 'Graph-based retrieval for relational queries',
    overviewText: 'GraphRAG builds a knowledge graph from your documents and performs multi-hop traversal to gather relational context. It excels at answering questions that require connecting multiple entities or reasoning across relationships.',
  },
  {
    id: 'corrective',
    name: 'Corrective RAG',
    subtitle: 'Retrieval quality gate with automatic fallback',
    latency: 'medium',
    implementation: 'medium',
    quality: 'high',
    description: 'Evaluation-based routing with web search fallback',
    overviewText: 'Corrective RAG (CRAG) adds a quality evaluator that scores retrieved chunks against a relevance threshold. If chunks are deemed insufficient, the system automatically falls back to web search, ensuring high-quality context reaches the LLM.',
  },
  {
    id: 'hyde',
    name: 'HyDE',
    subtitle: 'Embed a hypothetical answer, not the question',
    latency: 'medium',
    implementation: 'low',
    quality: 'high',
    description: 'Hypothetical document embeddings for improved retrieval',
    overviewText: 'HyDE (Hypothetical Document Embeddings) generates a hypothetical answer to the user\'s question, then embeds and searches with that answer instead of the original query. This leverages the semantic similarity between answers and relevant documents.',
  },
  {
    id: 'multimodal',
    name: 'Multi-modal RAG',
    subtitle: 'Retrieval across text, images, and tables',
    latency: 'high',
    implementation: 'high',
    quality: 'medium',
    description: 'Cross-modal retrieval and generation',
    overviewText: 'Multi-modal RAG extends retrieval beyond text to include images, tables, and diagrams. It uses vision-language models to embed visual content alongside text, enabling retrieval across multiple modalities to answer richer, more complex queries.',
  },
  {
    id: 'self-rag',
    name: 'Self-RAG',
    subtitle: 'Self-reflective generation with confidence assessment',
    latency: 'medium',
    implementation: 'medium',
    quality: 'high',
    description: 'Reflection tokens enable self-evaluation and dynamic re-retrieval',
    overviewText: 'Self-RAG trains the generator to emit reflection tokens that enable self-evaluation of retrieval relevance, output support, and confidence. Unlike Agentic RAG which uses separate tool calls, Self-RAG embeds self-critique directly into the generation process. The model decides when it needs more context based on its own confidence assessment, optimizing both cost and quality through dynamic re-retrieval only when necessary.',
  },
  {
    id: 'adaptive',
    name: 'Adaptive-RAG',
    subtitle: 'Query complexity routing for cost optimization',
    latency: 'low',
    implementation: 'medium',
    quality: 'high',
    description: 'Routes to parametric, single-step, or multi-step based on query',
    overviewText: 'Adaptive-RAG optimizes cost, latency, and quality by routing queries to different retrieval strategies based on complexity. A lightweight classifier analyzes each query and routes it to: (1) Parametric generation with no retrieval for simple questions, (2) Single-step retrieval for moderate complexity, or (3) Multi-step iterative retrieval for complex queries. This dynamic routing reduces average cost by ~70% compared to always using multi-step retrieval, while maintaining quality across query types.',
  },
  {
    id: 'rag-fusion',
    name: 'RAG Fusion',
    subtitle: 'Multi-query retrieval with Reciprocal Rank Fusion',
    latency: 'medium',
    implementation: 'low',
    quality: 'high',
    description: 'N query variants → N retrieval passes → RRF-fused ranking',
    overviewText: 'RAG Fusion breaks single-query retrieval\'s bias toward one phrasing. An LLM generates N reformulations of the original query, each retrieves independently, and Reciprocal Rank Fusion (RRF) merges the result lists. Documents that rank well across multiple query variants receive high fusion scores; documents that only appear in one retrieval — likely noise — are diluted. The result is broader recall and more robust context than any single query can achieve.',
  },
] as const;
