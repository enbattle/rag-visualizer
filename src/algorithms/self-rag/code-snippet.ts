import type { CodeSnippet } from '@/components/algorithm/types';

export const selfRAGCode: CodeSnippet = {
  fullPipeline: `# Self-RAG Pipeline with Reflection Tokens

from anthropic import Anthropic
from typing import List, Dict, Tuple
import voyageai

class SelfRAG:
    """
    Self-RAG trains the generator to emit reflection tokens that enable
    self-evaluation of retrieval relevance, output support, and confidence.

    The model decides when to retrieve again based on its own critique.
    """

    def __init__(self):
        self.anthropic = Anthropic()
        self.voyage = voyageai.Client()
        self.model = "claude-sonnet-4-6"
        self.embed_model = "voyage-4-large"

    def query(self, question: str, index: VectorIndex) -> Dict:
        """Self-reflective RAG with dynamic re-retrieval."""

        # Step 1: Initial retrieval
        chunks = self._retrieve(question, index, k=5)

        # Step 2: Generate with reflection tokens
        response, reflections = self._generate_with_reflection(
            question, chunks
        )

        # Step 3: Self-evaluate
        if reflections['confidence'] == 'LOW':
            # Model requested more context
            chunks = self._retrieve(question, index, k=10)
            response, reflections = self._generate_with_reflection(
                question, chunks
            )

        return {
            'answer': response,
            'reflections': reflections,
            'retrieval_triggered': reflections['confidence'] == 'LOW'
        }

    def _generate_with_reflection(
        self,
        query: str,
        chunks: List[str]
    ) -> Tuple[str, Dict]:
        """
        Generate with special reflection token prompting.

        Reflection tokens:
        - [IsRelevant]: RELEVANT | PARTIALLY_RELEVANT | IRRELEVANT
        - [IsSupported]: FULLY_SUPPORTED | PARTIALLY_SUPPORTED | UNSUPPORTED
        - [Confidence]: HIGH | MEDIUM | LOW
        """

        prompt = f"""You are a self-reflective QA system. Answer the question using the context below.

After your answer, emit reflection tokens to critique your work:

[IsRelevant]: Are the retrieved chunks relevant to the question?
- RELEVANT (all chunks address the query)
- PARTIALLY_RELEVANT (some chunks are off-topic)
- IRRELEVANT (chunks don't help)

[IsSupported]: Is your answer grounded in the retrieved context?
- FULLY_SUPPORTED (every claim has supporting evidence)
- PARTIALLY_SUPPORTED (some claims lack support)
- UNSUPPORTED (answer is not grounded)

[Confidence]: How confident are you in this answer?
- HIGH (strong evidence, clear answer)
- MEDIUM (some uncertainty or gaps)
- LOW (insufficient information, need more retrieval)

Context:
{chr(10).join(f"[{i+1}] {c}" for i, c in enumerate(chunks))}

Question: {query}

Answer with reflection tokens:"""

        response = self.anthropic.messages.create(
            model=self.model,
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        text = response.content[0].text

        # Parse reflection tokens
        reflections = self._parse_reflections(text)

        return text, reflections

    def _parse_reflections(self, text: str) -> Dict:
        """Extract reflection tokens from response."""
        import re

        reflections = {
            'is_relevant': 'UNKNOWN',
            'is_supported': 'UNKNOWN',
            'confidence': 'UNKNOWN'
        }

        if match := re.search(r'\\[IsRelevant\\]:\\s*(\\w+)', text):
            reflections['is_relevant'] = match.group(1)

        if match := re.search(r'\\[IsSupported\\]:\\s*(\\w+)', text):
            reflections['is_supported'] = match.group(1)

        if match := re.search(r'\\[Confidence\\]:\\s*(\\w+)', text):
            reflections['confidence'] = match.group(1)

        return reflections

    def _retrieve(
        self,
        query: str,
        index: VectorIndex,
        k: int
    ) -> List[str]:
        """Standard vector retrieval."""
        query_embedding = self.voyage.embed(
            [query],
            model=self.embed_model
        ).embeddings[0]

        results = index.search(query_embedding, k=k)
        return [r.text for r in results]`,

  embeddings: `# Embedding with voyage-4-large (Jan 2026 release)

import voyageai

client = voyageai.Client()

# Embed query for semantic search
query = "What is self-reflective RAG?"
query_embedding = client.embed(
    [query],
    model="voyage-4-large",  # 1024 dimensions
    input_type="query"
).embeddings[0]

# Embed documents for indexing
documents = [
    "Self-RAG trains generators to emit reflection tokens...",
    "Reflection enables self-evaluation of relevance and support..."
]

doc_embeddings = client.embed(
    documents,
    model="voyage-4-large",
    input_type="document"
).embeddings`,

  vectorSearch: `# Vector Search with Reflection-Aware Ranking

import numpy as np
from typing import List, Tuple

def search_with_metadata(
    query_embedding: List[float],
    index: VectorIndex,
    k: int = 5
) -> List[Tuple[str, float, Dict]]:
    """
    Search and return results with metadata for reflection.

    Self-RAG benefits from retrieving metadata like:
    - Source document quality scores
    - Content freshness timestamps
    - Domain tags

    This helps the model emit better reflection tokens.
    """

    results = index.search(
        query_embedding,
        k=k,
        return_metadata=True  # Include source, score, timestamp
    )

    ranked_results = []
    for result in results:
        # Calculate confidence signal for reflection
        confidence_signal = {
            'score': result.score,
            'recency': result.metadata.get('days_old', 999),
            'source_quality': result.metadata.get('quality', 0.5)
        }

        ranked_results.append((
            result.text,
            result.score,
            confidence_signal
        ))

    return ranked_results`,

  generation: `# Self-Reflective Generation with Claude Sonnet 4

from anthropic import Anthropic

client = Anthropic()

def generate_with_reflection(
    query: str,
    chunks: List[str],
    previous_reflections: Optional[Dict] = None
) -> Tuple[str, Dict]:
    """
    Generate answer with built-in reflection tokens.

    If previous_reflections indicate LOW confidence,
    this is a re-retrieval iteration with expanded context.
    """

    system_prompt = """You are a self-reflective QA system.

After answering, critique your own work using reflection tokens:
- [IsRelevant]: Evaluate retrieval quality
- [IsSupported]: Check if claims are grounded
- [Confidence]: Assess overall certainty

If confidence is LOW, you'll trigger re-retrieval."""

    context = "\\n\\n".join(f"Chunk {i+1}: {c}" for i, c in enumerate(chunks))

    iteration_note = ""
    if previous_reflections:
        iteration_note = f"""
Previous iteration had {previous_reflections['confidence']} confidence.
This is re-retrieval with expanded context (k={len(chunks)}).
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system_prompt,
        messages=[{
            "role": "user",
            "content": f"""{iteration_note}

Context:
{context}

Question: {query}

Provide your answer followed by reflection tokens."""
        }]
    )

    text = response.content[0].text
    reflections = parse_reflection_tokens(text)

    return text, reflections

# Example reflection output:
# [IsRelevant]: RELEVANT
# [IsSupported]: FULLY_SUPPORTED
# [Confidence]: HIGH`,
};
