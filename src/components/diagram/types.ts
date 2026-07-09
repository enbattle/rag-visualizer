import type { Side } from './geometry';

export type NodeKind = 'input' | 'retrieval' | 'llm' | 'decision' | 'tool' | 'agent' | 'output';

export interface NodeLayout {
  /** Matches an AnimationStep.activeNodeIds value */
  id: string;
  label: string;
  kind?: NodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface EdgeLayout {
  /** Unique per drawn line */
  id: string;
  from: string;
  to: string;
  /** AnimationStep.activeEdgeIds values that light this line; defaults to [id] */
  activeWhen?: string[];
  fromSide?: Side;
  toSide?: Side;
  curve?: 'straight' | 'loop-back' | 'fan';
  /** Overrides the default bend distance (60 straight / 50 loop-back) for this edge specifically. */
  bend?: number;
}

export interface PipelineLayout {
  nodes: NodeLayout[];
  edges: EdgeLayout[];
}
