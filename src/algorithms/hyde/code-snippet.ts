import type { CodeSnippet } from '@/components/algorithm/types';

export const hydeRAGCode: CodeSnippet = {
  fullPipeline: `"""
HyDE: Hypothetical Document Embeddings
"""
from typing import List
from config import EMBEDDING_MODEL, LLM_MODEL, TOP_K

class HyDERAG:
    """Generate hypothetical answer, embed it, then retrieve"""

    def query(self, user_query: str) -> str:
        # 1. Generate hypothetical answer (without retrieval)
        hypothetical_doc = self.generate_hypothetical(user_query)

        # 2. Embed the hypothetical document
        hyp_embedding = self.embed(hypothetical_doc)

        # 3. Retrieve using hypothetical embedding
        chunks = self.retrieve(hyp_embedding, k=TOP_K)

        # 4. Generate final answer with retrieved context
        return self.generate(user_query, chunks)
`,

  embeddings: `"""
HyDE: Zero-shot hypothetical document generation
"""
from config import LLM_MODEL

def generate_hypothetical(self, query: str) -> str:
    """
    Generate a hypothetical answer without any retrieval.
    This creates a document that's semantically similar to expected results.
    """
    prompt = f"""Write a detailed, factual passage that would perfectly answer this question.
Do not say "I don't know" - write as if you have the answer.

Question: {query}

Passage:"""

    client = anthropic.Anthropic()
    message = client.messages.create(
        model=LLM_MODEL,
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": prompt
        }]
    )

    return message.content[0].text
`,

  vectorSearch: `"""
Embed hypothetical document and retrieve similar real documents
"""
import voyageai
from config import EMBEDDING_MODEL

def embed(self, text: str) -> List[float]:
    """Embed the hypothetical document"""
    client = voyageai.Client()
    result = client.embed(
        texts=[text],
        model=EMBEDDING_MODEL,
        input_type="query"
    )
    return result.embeddings[0]

def retrieve(self, hyp_embedding: List[float], k: int) -> List:
    """
    Retrieve real documents similar to hypothetical document.
    Key insight: Documents answering the question will be semantically
    similar to our hypothetical answer, not just to the query keywords.
    """
    return self.vector_index.search(hyp_embedding, top_k=k)
`,

  generation: `"""
Generate final answer grounded in retrieved real documents
"""
def generate(self, original_query: str, chunks: List) -> str:
    """
    Use retrieved REAL documents to answer the ORIGINAL query.
    The hypothetical document was only used for retrieval.
    """
    context = "\n\n".join([
        f"[{chunk.rank}] {chunk.content}"
        for chunk in chunks
    ])

    prompt = f"""Use only the provided context to answer the question.

Context:
{context}

Question: {original_query}

Answer:"""

    return llm.generate(prompt)
`,
};
