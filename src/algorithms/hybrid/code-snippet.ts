import type { CodeSnippet } from '@/components/algorithm/types';

export const hybridRAGCode: CodeSnippet = {
  fullPipeline: `"""
Hybrid RAG: BM25 + Dense retrieval with reranking
"""
from typing import List
from config import EMBEDDING_MODEL, RERANKER_MODEL, LLM_MODEL, TOP_K

class HybridRAG:
    """Combines sparse and dense retrieval with cross-encoder reranking"""

    def query(self, user_query: str) -> str:
        # Parallel retrieval
        bm25_results = self.bm25_search(user_query)
        dense_results = self.dense_search(user_query)

        # Fusion
        fused = self.rrf_fusion(bm25_results, dense_results)

        # Reranking
        reranked = self.rerank(user_query, fused)

        # Generation
        return self.generate(user_query, reranked[:TOP_K])
`,
  embeddings: 'Same as Standard RAG',
  vectorSearch: `"""
RRF Fusion: Reciprocal Rank Fusion
"""
def rrf_fusion(results_a: List, results_b: List, k: int = 60) -> List:
    """Merge two ranked lists without score normalization"""
    scores = {}
    for rank, doc in enumerate(results_a):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    for rank, doc in enumerate(results_b):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
`,
  generation: `"""
Cross-encoder reranking
"""
from config import RERANKER_MODEL

def rerank(query: str, chunks: List) -> List:
    """Re-score chunks using cross-encoder"""
    client = voyageai.Client()
    result = client.rerank(
        query=query,
        documents=[c.content for c in chunks],
        model=RERANKER_MODEL
    )
    return [chunks[r.index] for r in result.results]
`,
};
