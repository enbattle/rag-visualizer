import type { CodeSnippet } from '@/components/algorithm/types';

export const agenticRAGCode: CodeSnippet = {
  fullPipeline: `"""
Agentic RAG: ReAct loop with multi-tool access
"""
from typing import List, Dict, Any
from config import LLM_MODEL

class AgenticRAG:
    """Autonomous agent with dynamic retrieval"""

    def __init__(self):
        self.tools = {
            "vector_search": self.vector_search,
            "web_search": self.web_search,
        }
        self.max_iterations = 5

    def query(self, user_query: str) -> str:
        context = []
        for iteration in range(self.max_iterations):
            # Agent reasons and acts
            thought, action = self.reason(user_query, context)
            observation = self.act(action)

            # Check sufficiency
            is_sufficient = self.evaluate_sufficiency(observation, context)
            context.append(observation)

            if is_sufficient:
                break

        return self.generate(user_query, context)
`,

  embeddings: 'Same as Standard RAG',

  vectorSearch: `"""
ReAct: Reason + Act loop
"""
def reason(self, query: str, context: List[str]) -> tuple[str, Dict]:
    """Agent reasons about next action"""
    prompt = f"""Question: {query}

Context so far: {context}

What should I do next? Respond with:
Thought: [your reasoning]
Action: [tool_name](args)"""

    response = llm.generate(prompt)
    # Parse thought and action from response
    return parse_react_response(response)

def act(self, action: Dict) -> str:
    """Execute tool and return observation"""
    tool_name = action["tool"]
    args = action["args"]
    result = self.tools[tool_name](**args)
    return f"Observation: {result}"

def evaluate_sufficiency(self, obs: str, context: List) -> bool:
    """Agent decides if context is sufficient"""
    prompt = f"Given context: {context}\nIs this sufficient? Yes/No"
    return "yes" in llm.generate(prompt).lower()
`,

  generation: `"""
Final generation with multi-iteration context
"""
def generate(self, query: str, context: List[str]) -> str:
    """Synthesize answer from agent observations"""
    all_context = "\n\n".join(context)
    prompt = f"""Use all gathered information to answer.

Observations:
{all_context}

Question: {query}

Answer:"""

    return llm.generate(prompt)
`,
};
