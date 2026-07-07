import type { CodeSnippet } from '@/components/algorithm/types';

export const multimodalRAGCode: CodeSnippet = {
  fullPipeline: `"""
Multi-modal RAG: Retrieval across text, images, and tables
"""
from typing import List, Dict, Any
from config import LLM_MODEL, TOP_K

class MultimodalRAG:
    """Cross-modal retrieval and generation"""

    def __init__(self):
        self.text_encoder = voyageai.Client()
        self.vision_encoder = self._init_vision_encoder()
        self.multimodal_index = self._load_multimodal_index()

    def query(self, user_query: str, query_image: bytes = None) -> str:
        # 1. Encode query (text and/or image)
        query_embedding = self.encode_query(user_query, query_image)

        # 2. Retrieve across modalities
        results = self.multimodal_retrieve(query_embedding, k=TOP_K)

        # 3. Generate with multimodal context
        return self.generate_multimodal(user_query, results)
`,

  embeddings: `"""
Multimodal encoding: text, images, tables
"""
import voyageai
from config import EMBEDDING_MODEL

def encode_text(self, text: str) -> List[float]:
    """Encode text using voyage-4-large"""
    result = self.text_encoder.embed(
        texts=[text],
        model=EMBEDDING_MODEL,
        input_type="query"
    )
    return result.embeddings[0]

def encode_image(self, image: bytes) -> List[float]:
    """Encode image using CLIP or SigLIP vision encoder"""
    # Use vision-language model for image embeddings
    embedding = self.vision_encoder.encode_image(image)
    return embedding

def encode_table(self, table_html: str) -> List[float]:
    """
    Convert table to linearized text, then embed.
    Alternative: Use specialized table encoders.
    """
    linearized = self._table_to_markdown(table_html)
    return self.encode_text(linearized)

def _table_to_markdown(self, html: str) -> str:
    """Convert HTML table to markdown format for LLM"""
    # Parse HTML and convert to markdown table
    return parsed_table
`,

  vectorSearch: `"""
Cross-modal retrieval with unified embedding space
"""
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class MultimodalChunk:
    content: Any  # text, image bytes, or table
    modality: str  # 'text', 'image', 'table'
    embedding: List[float]
    source: str
    score: float

def multimodal_retrieve(
    self,
    query_embedding: List[float],
    k: int = 5
) -> List[MultimodalChunk]:
    """
    Retrieve across all modalities in unified vector space.
    Returns mix of text, images, and tables.
    """
    all_results = []

    # Search each modality index
    for modality in ['text', 'image', 'table']:
        results = self.multimodal_index[modality].search(
            query_embedding,
            top_k=k
        )
        all_results.extend(results)

    # Re-rank across modalities
    all_results.sort(key=lambda x: x.score, reverse=True)

    return all_results[:k]
`,

  generation: `"""
Vision-language model generation with multimodal context
"""
from anthropic import Anthropic

def generate_multimodal(
    self,
    query: str,
    chunks: List[MultimodalChunk]
) -> str:
    """
    Generate answer using Claude with vision capabilities.
    Handles text, images, and tables in context.
    """
    client = Anthropic()

    # Build multimodal content
    content = [{"type": "text", "text": f"Question: {query}\n\nContext:"}]

    for chunk in chunks:
        if chunk.modality == 'text':
            content.append({
                "type": "text",
                "text": f"\n\n{chunk.content}"
            })
        elif chunk.modality == 'image':
            content.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": chunk.content
                }
            })
        elif chunk.modality == 'table':
            content.append({
                "type": "text",
                "text": f"\n\nTable:\n{chunk.content}"
            })

    content.append({"type": "text", "text": "\n\nAnswer:"})

    response = client.messages.create(
        model=LLM_MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": content}]
    )

    return response.content[0].text
`,
};
