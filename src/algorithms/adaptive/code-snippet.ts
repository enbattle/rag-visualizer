import type { CodeSnippet } from '@/components/algorithm/types';

export const adaptiveRAGCode: CodeSnippet = {
  fullPipeline: `# Adaptive-RAG Pipeline with Query Complexity Classification

from anthropic import Anthropic
from typing import List, Dict, Literal
import voyageai
import numpy as np
from sklearn.ensemble import RandomForestClassifier

QueryComplexity = Literal['simple', 'moderate', 'complex']

class AdaptiveRAG:
    """
    Adaptive-RAG trains a small classifier to route queries among:
    - Simple: No retrieval (parametric knowledge only)
    - Moderate: Single-step retrieval
    - Complex: Multi-step iterative retrieval

    This optimizes cost, latency, and quality simultaneously.
    """

    def __init__(self):
        self.anthropic = Anthropic()
        self.voyage = voyageai.Client()
        self.model = "claude-sonnet-4-6"
        self.embed_model = "voyage-4-large"

        # Lightweight classifier (trained offline)
        self.complexity_classifier = self._load_classifier()

    def query(self, question: str, index: VectorIndex) -> Dict:
        """Adaptive RAG with dynamic routing."""

        # Step 1: Classify query complexity
        complexity = self._classify_complexity(question)

        # Step 2: Route to appropriate strategy
        if complexity == 'simple':
            # No retrieval - use parametric knowledge
            answer = self._parametric_generation(question)
            return {
                'answer': answer,
                'strategy': 'parametric',
                'retrieval_count': 0
            }

        elif complexity == 'moderate':
            # Single-step retrieval
            chunks = self._retrieve(question, index, k=5)
            answer = self._generate(question, chunks)
            return {
                'answer': answer,
                'strategy': 'single-step',
                'retrieval_count': 1
            }

        else:  # complex
            # Multi-step iterative retrieval
            answer, iterations = self._multi_step_retrieval(question, index)
            return {
                'answer': answer,
                'strategy': 'multi-step',
                'retrieval_count': iterations
            }

    def _classify_complexity(self, query: str) -> QueryComplexity:
        """
        Classify query complexity using lightweight model.

        Features:
        - Query length (tokens)
        - Question word type (what/how/why/explain)
        - Named entity count
        - Syntactic complexity (clause count)
        - Ambiguity signals (multiple interpretations)
        """

        features = self._extract_features(query)

        # RandomForest classifier (~1ms inference)
        complexity_score = self.complexity_classifier.predict_proba(
            [features]
        )[0]

        # Thresholds tuned on validation set
        if complexity_score[0] > 0.7:  # Simple
            return 'simple'
        elif complexity_score[1] > 0.5:  # Moderate
            return 'moderate'
        else:  # Complex
            return 'complex'

    def _extract_features(self, query: str) -> List[float]:
        """Extract classification features from query."""
        import spacy

        nlp = spacy.load("en_core_web_sm")
        doc = nlp(query)

        features = [
            len(doc),  # Token count
            len(list(doc.sents)),  # Clause count
            len([ent for ent in doc.ents]),  # Named entity count
            1 if any(w.text.lower() in ['how', 'why', 'explain'] for w in doc) else 0,
            1 if any(w.text.lower() in ['multiple', 'various', 'different'] for w in doc) else 0,
            np.mean([w.vector_norm for w in doc if w.has_vector])  # Semantic density
        ]

        return features

    def _parametric_generation(self, query: str) -> str:
        """
        Generate using only parametric knowledge (no retrieval).

        Used for simple factual questions the model can answer
        from training data.
        """

        response = self.anthropic.messages.create(
            model=self.model,
            max_tokens=512,
            messages=[{
                "role": "user",
                "content": f"Answer concisely using your knowledge: {query}"
            }]
        )

        return response.content[0].text

    def _retrieve(
        self,
        query: str,
        index: VectorIndex,
        k: int
    ) -> List[str]:
        """Standard single-step retrieval."""
        query_embedding = self.voyage.embed(
            [query],
            model=self.embed_model
        ).embeddings[0]

        results = index.search(query_embedding, k=k)
        return [r.text for r in results]

    def _multi_step_retrieval(
        self,
        query: str,
        index: VectorIndex
    ) -> tuple[str, int]:
        """
        Multi-step iterative retrieval for complex queries.

        Similar to Agentic RAG but guided by initial complexity classification.
        """

        context = []
        iteration = 0
        max_iterations = 3

        while iteration < max_iterations:
            iteration += 1

            # Retrieve with query refinement
            refined_query = self._refine_query(query, context)
            chunks = self._retrieve(refined_query, index, k=3)
            context.extend(chunks)

            # Check sufficiency
            if self._is_sufficient(query, context):
                break

        answer = self._generate(query, context)
        return answer, iteration

    def _refine_query(self, original_query: str, context: List[str]) -> str:
        """Refine query based on what's already retrieved."""
        if not context:
            return original_query

        # Simple refinement - focus on gaps
        return f"{original_query} (focusing on details not in: {context[0][:50]}...)"

    def _is_sufficient(self, query: str, context: List[str]) -> bool:
        """Quick sufficiency check."""
        return len(context) >= 9  # 3 iterations × 3 chunks

    def _generate(self, query: str, chunks: List[str]) -> str:
        """Standard generation from retrieved context."""
        context = "\\n\\n".join(f"[{i+1}] {c}" for i, c in enumerate(chunks))

        response = self.anthropic.messages.create(
            model=self.model,
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": f"""Context:\\n{context}\\n\\nQuestion: {query}\\n\\nAnswer:"""
            }]
        )

        return response.content[0].text

    def _load_classifier(self) -> RandomForestClassifier:
        """Load pre-trained complexity classifier."""
        # In production, load from disk
        # Trained on labeled queries with gold-standard complexity labels
        return RandomForestClassifier()  # Placeholder`,

  embeddings: `# Embedding for Adaptive Retrieval

import voyageai

client = voyageai.Client()

# For single-step retrieval (moderate complexity)
query = "What is adaptive RAG?"
query_embedding = client.embed(
    [query],
    model="voyage-4-large",
    input_type="query"
).embeddings[0]

# For multi-step retrieval, embeddings are computed iteratively
# with query refinement at each step

def embed_with_refinement(
    original_query: str,
    context_so_far: List[str],
    iteration: int
) -> List[float]:
    """
    Multi-step retrieval may refine the query at each iteration
    to focus on information gaps.
    """

    if iteration == 1:
        refined_query = original_query
    else:
        # Refine based on what's been retrieved
        refined_query = f"{original_query} [focus on aspects not covered in previous {iteration-1} retrievals]"

    return client.embed(
        [refined_query],
        model="voyage-4-large",
        input_type="query"
    ).embeddings[0]`,

  vectorSearch: `# Adaptive Vector Search Strategy

import numpy as np
from typing import List, Literal

def adaptive_search(
    query_embedding: List[float],
    index: VectorIndex,
    complexity: Literal['simple', 'moderate', 'complex']
) -> List[str]:
    """
    Search strategy adapts to query complexity.

    - Simple: No search (skip entirely)
    - Moderate: Standard top-K search (k=5)
    - Complex: Multiple searches with query refinement
    """

    if complexity == 'simple':
        # No retrieval
        return []

    elif complexity == 'moderate':
        # Single-step: retrieve top-5
        results = index.search(query_embedding, k=5)
        return [r.text for r in results]

    else:  # complex
        # Multi-step: start with top-3, iterate
        results = index.search(query_embedding, k=3)
        return [r.text for r in results]

# Cost comparison (example query costs):
# Simple (parametric): $0.0001 (generation only)
# Moderate (single-step): $0.0015 (1 embedding + 1 search + generation)
# Complex (multi-step): $0.0045 (3 embeddings + 3 searches + generation)

# Adaptive-RAG routes 40% of queries to parametric,
# 45% to single-step, and only 15% to multi-step.
# Average cost: $0.0012 vs. $0.0045 if all queries used multi-step.`,

  generation: `# Adaptive Generation with Claude Sonnet 4

from anthropic import Anthropic
from typing import List, Optional

client = Anthropic()

def adaptive_generation(
    query: str,
    chunks: Optional[List[str]],
    strategy: str
) -> str:
    """
    Generation adapts to retrieval strategy.

    - Parametric: Concise answer from model knowledge
    - Single-step: Standard RAG generation
    - Multi-step: Synthesis across iterative retrievals
    """

    if strategy == 'parametric':
        # No context - use model knowledge
        prompt = f"Answer concisely: {query}"
        max_tokens = 512

    elif strategy == 'single-step':
        # Standard RAG prompt
        context = "\\n\\n".join(f"[{i+1}] {c}" for i, c in enumerate(chunks))
        prompt = f"Context:\\n{context}\\n\\nQuestion: {query}\\n\\nAnswer:"
        max_tokens = 1024

    else:  # multi-step
        # Synthesis prompt for complex queries
        context = "\\n\\n".join(f"[{i+1}] {c}" for i, c in enumerate(chunks))
        prompt = f"""You retrieved context through multiple iterations.
Synthesize a comprehensive answer addressing all aspects of the question.

Context (from {len(chunks)} chunks across multiple retrievals):
{context}

Question: {query}

Comprehensive answer:"""
        max_tokens = 2048

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}]
    )

    return response.content[0].text

# Example outputs:
# Parametric: 50-100 tokens, fast, no retrieval cost
# Single-step: 200-400 tokens, moderate latency
# Multi-step: 500-1000 tokens, comprehensive but slower`,
};
