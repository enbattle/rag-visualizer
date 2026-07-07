import type { CodeSnippet } from '@/components/algorithm/types';

export const ragFusionCode: CodeSnippet = {
  fullPipeline: `"""
RAG Fusion: Multi-Query Retrieval with Reciprocal Rank Fusion
"""
from config import EMBEDDING_MODEL, LLM_MODEL, TOP_K

class RAGFusion:
    """Generate query variants, retrieve for each, fuse with RRF."""

    def query(self, user_query: str, n_variants: int = 3) -> str:
        # 1. Generate query variants
        queries = self.expand_query(user_query, n=n_variants)
        all_queries = [user_query] + queries

        # 2. Retrieve independently for each query
        result_lists = [
            self.retrieve(q, k=TOP_K)
            for q in all_queries
        ]

        # 3. Fuse rankings with Reciprocal Rank Fusion
        fused = self.reciprocal_rank_fusion(result_lists)

        # 4. Generate from top-K fused results
        top_chunks = [doc for doc, _ in fused[:TOP_K]]
        return self.generate(user_query, top_chunks)
`,

  embeddings: `"""
RAG Fusion: Query expansion via LLM
"""
from config import LLM_MODEL

def expand_query(self, query: str, n: int = 3) -> list[str]:
    """
    Generate semantically diverse query reformulations.
    Each variant targets different vocabulary or framing
    to maximize document recall across the corpus.
    """
    import anthropic
    client = anthropic.Anthropic()

    response = client.messages.create(
        model=LLM_MODEL,
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": f"""Generate {n} search query variants for this question.
Each should use different vocabulary or angle to find relevant documents.
Return only the queries, one per line — no numbering or explanation.

Question: {query}"""
        }]
    )

    lines = response.content[0].text.strip().split("\\n")
    return [line.strip() for line in lines if line.strip()][:n]
`,

  vectorSearch: `"""
RAG Fusion: Per-query retrieval + Reciprocal Rank Fusion
"""
import voyageai
from config import EMBEDDING_MODEL

def retrieve(self, query: str, k: int) -> list:
    """Standard single-query vector retrieval."""
    client = voyageai.Client()
    result = client.embed(
        texts=[query],
        model=EMBEDDING_MODEL,
        input_type="query"
    )
    embedding = result.embeddings[0]
    return self.vector_index.search(embedding, top_k=k)

def reciprocal_rank_fusion(
    self,
    ranked_lists: list[list],
    k: int = 60
) -> list[tuple]:
    """
    RRF: score(doc) = sum(1 / (k + rank(doc, list)))
    across all lists that contain the document.

    k=60 is the standard constant — dampens sensitivity
    to the exact rank while still rewarding top placements.
    Documents absent from a list contribute 0 for that list.
    """
    scores: dict[str, float] = {}
    doc_map: dict[str, object] = {}

    for ranked_list in ranked_lists:
        for rank, doc in enumerate(ranked_list, start=1):
            doc_id = doc.id
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
            doc_map[doc_id] = doc

    sorted_ids = sorted(scores, key=scores.__getitem__, reverse=True)
    return [(doc_map[doc_id], scores[doc_id]) for doc_id in sorted_ids]
`,

  generation: `"""
RAG Fusion: Final generation from fused context
"""
def generate(self, original_query: str, chunks: list) -> str:
    """
    Generate from the RRF-ranked top-K chunks.
    Always answer the ORIGINAL query, not any of the variants.
    """
    import anthropic
    client = anthropic.Anthropic()

    context = "\\n\\n".join([
        f"[{i+1}] {chunk.content}"
        for i, chunk in enumerate(chunks)
    ])

    response = client.messages.create(
        model=LLM_MODEL,
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Use the provided context to answer the question.
Synthesize across multiple passages where relevant.

Context:
{context}

Question: {original_query}

Answer:"""
        }]
    )

    return response.content[0].text
`,
};
