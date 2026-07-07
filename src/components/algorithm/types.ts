/**
 * Core type definitions for RAG algorithm visualizations
 */

/** Content modality for multi-modal RAG */
export type Modality = 'text' | 'image' | 'table';

/**
 * Retrieved chunk data displayed in the retrieval panel
 */
export interface ChunkData {
  rank: number;
  content: string;
  source: string;
  score: number;
  isRejected?: boolean;
  modality?: Modality;
  tooltip?: string;
}

/**
 * Single step in the algorithm animation sequence
 */
export interface AnimationStep {
  activeNodeIds: string[];
  activeEdgeIds: string[];
  explanation: string;
  retrievalUpdate?: ChunkData[];
}

/**
 * Complete demo data for an algorithm visualization
 */
export interface AlgorithmDemoData {
  steps: AnimationStep[];
  insight: string;
}

/**
 * ReAct trace entry for Agentic RAG
 */
export interface ReActEntry {
  iteration: number;
  type: 'thought' | 'action' | 'observation';
  content: string;
}

/**
 * Knowledge graph node for GraphRAG
 */
export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

/**
 * Knowledge graph edge for GraphRAG
 */
export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  hop: 1 | 2;
}

/**
 * Embedding space point for HyDE visualization
 */
export interface EmbeddingPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'query' | 'hypothesis' | 'document';
}

/**
 * Code snippet tabs for implementation panel
 */
export interface CodeSnippet {
  fullPipeline: string;
  embeddings: string;
  vectorSearch: string;
  generation: string;
}
