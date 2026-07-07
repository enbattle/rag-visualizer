import type { CodeSnippet } from '@/components/algorithm/types';

export const standardRAGCode: CodeSnippet = {
  fullPipeline: `"""
Standard RAG: Single-pass retrieval and generation
"""
from typing import List, Dict
import voyageai
import anthropic
from config import EMBEDDING_MODEL, LLM_MODEL, TOP_K

class StandardRAG:
    """Production RAG pipeline with voyage-4-large embeddings and Claude generation"""

    def __init__(self, vector_store_path: str):
        self.voyage_client = voyageai.Client()
        self.anthropic_client = anthropic.Anthropic()
        self.vector_store_path = vector_store_path
        self.index = self._load_index()

    def query(self, user_query: str) -> str:
        """Execute full RAG pipeline"""
        # 1. Embed query
        query_embedding = self._embed_query(user_query)

        # 2. Retrieve top-K chunks
        chunks = self._retrieve(query_embedding, k=TOP_K)

        # 3. Build prompt with context
        prompt = self._build_prompt(user_query, chunks)

        # 4. Generate answer
        answer = self._generate(prompt)

        return answer
`,

  embeddings: `"""
Embedding module: Convert text to dense vectors
"""
from typing import List
import voyageai
from config import EMBEDDING_MODEL, CHUNK_SIZE, CHUNK_OVERLAP

def chunk_document(text: str) -> List[str]:
    """Split document into fixed-size overlapping chunks"""
    chunks = []
    start = 0

    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end]
        chunks.append(chunk)
        start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks

def embed_chunks(chunks: List[str]) -> List[List[float]]:
    """Generate embeddings for all chunks"""
    client = voyageai.Client()

    result = client.embed(
        texts=chunks,
        model=EMBEDDING_MODEL,
        input_type="document"
    )

    return result.embeddings
`,

  vectorSearch: `"""
Vector similarity search with approximate nearest neighbors
"""
from typing import List, Tuple
import numpy as np
from dataclasses import dataclass

@dataclass
class RetrievedChunk:
    content: str
    source: str
    score: float
    rank: int

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors"""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def retrieve_top_k(
    query_embedding: List[float],
    index: VectorIndex,
    k: int = 5
) -> List[RetrievedChunk]:
    """
    Retrieve top-K most similar chunks
    Note: No quality threshold - all K chunks are used regardless of score
    """
    scores = []

    for idx, doc_embedding in enumerate(index.embeddings):
        score = cosine_similarity(
            np.array(query_embedding),
            np.array(doc_embedding)
        )
        scores.append((score, idx))

    # Sort by score descending, take top K
    scores.sort(reverse=True)
    top_k = scores[:k]

    chunks = [
        RetrievedChunk(
            content=index.chunks[idx],
            source=index.sources[idx],
            score=score,
            rank=rank + 1
        )
        for rank, (score, idx) in enumerate(top_k)
    ]

    return chunks
`,

  generation: `"""
LLM generation with retrieved context
"""
import anthropic
from typing import List
from config import LLM_MODEL

def build_prompt(query: str, chunks: List[RetrievedChunk]) -> str:
    """Assemble context window from retrieved chunks"""
    context = "\\n\\n".join([
        f"[{chunk.rank}] {chunk.content}"
        for chunk in chunks
    ])

    return f"""Use the following context to answer the question.

Context:
{context}

Question: {query}

Answer:"""

def generate_answer(prompt: str) -> str:
    """Call Claude to generate final answer"""
    client = anthropic.Anthropic()

    message = client.messages.create(
        model=LLM_MODEL,
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": prompt
        }]
    )

    return message.content[0].text
`,
};
