import type { CodeSnippet } from '@/components/algorithm/types';

export const correctiveRAGCode: CodeSnippet = {
  fullPipeline: `"""
Corrective RAG: Quality gate with web search fallback
"""
from typing import List, Literal
from dataclasses import dataclass
from config import RELEVANCE_THRESHOLD, LLM_MODEL

@dataclass
class EvalResult:
    score: float
    decision: Literal["CORRECT", "AMBIGUOUS", "INCORRECT"]

class CorrectiveRAG:
    """CRAG with quality evaluation and routing"""

    def query(self, user_query: str) -> str:
        # Initial retrieval
        chunks = self.retrieve(user_query)

        # Evaluate quality
        eval_results = [self.evaluate(user_query, c) for c in chunks]
        decision = self.route(eval_results)

        # Route based on quality
        if decision == "INCORRECT":
            # Discard all, use web search
            chunks = self.web_search(user_query)
        elif decision == "AMBIGUOUS":
            # Supplement with web search
            web_chunks = self.web_search(user_query)
            chunks.extend(web_chunks)
        # CORRECT: use as-is

        return self.generate(user_query, chunks)
`,

  embeddings: 'Same as Standard RAG',

  vectorSearch: `"""
Quality evaluation and routing logic
"""
from config import RELEVANCE_THRESHOLD

def evaluate(self, query: str, chunk: str) -> EvalResult:
    """Lightweight classifier scores chunk relevance"""
    score = self.classifier.score(query, chunk)

    if score >= RELEVANCE_THRESHOLD:
        decision = "CORRECT"
    elif score >= 0.5:
        decision = "AMBIGUOUS"
    else:
        decision = "INCORRECT"

    return EvalResult(score=score, decision=decision)

def route(self, eval_results: List[EvalResult]) -> str:
    """Aggregate chunk scores into routing decision"""
    if all(r.decision == "INCORRECT" for r in eval_results):
        return "INCORRECT"
    elif all(r.decision == "CORRECT" for r in eval_results):
        return "CORRECT"
    else:
        return "AMBIGUOUS"
`,

  generation: `"""
Web search fallback for low-quality retrieval
"""
def web_search(self, query: str) -> List[str]:
    """Live search API for fresh information"""
    results = search_api.query(query, num_results=5)
    return [r.content for r in results]

def generate(self, query: str, chunks: List[str]) -> str:
    """Generate from quality-filtered context"""
    context = "\\n\\n".join(f"[{i+1}] {c}" for i, c in enumerate(chunks))
    return llm.generate(f"Context:\\n{context}\\n\\nQuestion: {query}")
`,
};
